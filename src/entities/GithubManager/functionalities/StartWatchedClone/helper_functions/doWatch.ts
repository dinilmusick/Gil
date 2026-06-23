import { FUNCTIONS as RateLimiterFuncs } from "../../../../../libraries/RateLimiterConcepts/RateLimiterConcepts.js";

const runWatchLoop = async (jobKey: string, system: any, state: any) => {
    const job = state.watchJobs?.[jobKey];
    if (!job || !job.active) return;
    try {
        await system.call("CloneRepo", { alias: job.alias, owner: job.owner, repo: job.repo, url: job.url });
        const rateLimitKey = `throttle:${jobKey}`;
        const allowed = RateLimiterFuncs.throttle(rateLimitKey, job.intervalMs || 30000, state);
        if (allowed) {
            setTimeout(() => runWatchLoop(jobKey, system, state), job.intervalMs || 30000);
        }
    } catch (e) {
        setTimeout(() => runWatchLoop(jobKey, system, state), job.intervalMs || 30000);
    }
};

export const doWatch = async (input: any, state: any, system: any) => {
    const jobKey = `${input.alias}/${input.repo}`;
    state.watchJobs = state.watchJobs || {};
    const existing = state.watchJobs[jobKey];
    if (existing && existing.active) return { status: "already_running", jobKey };
    state.watchJobs[jobKey] = { active: true, alias: input.alias, owner: input.owner, repo: input.repo, url: input.url, intervalMs: input.intervalMs || 30000 };
    runWatchLoop(jobKey, system, state).catch(() => {});
    return { status: "success", jobKey };
};