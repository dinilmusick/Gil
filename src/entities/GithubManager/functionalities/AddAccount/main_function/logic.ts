import { DATA as RateLimiterData, FUNCTIONS as RateLimiterFuncs } from "../../../../../libraries/RateLimiterConcepts/RateLimiterConcepts.js";
import { DATA as GitOpsData, FUNCTIONS as GitOpsFuncs } from "../../../../../libraries/GitOpsConcepts/GitOpsConcepts.js";
import { DATA as GitHubData, FUNCTIONS as GitHubFuncs } from "../../../../../libraries/GitHubConcepts/GitHubConcepts.js";
import { z } from "zod";
export const main = async (input: any, { state, entity: system }: any) => {
    const accountDir = `${input.workspace}/${input.alias}`;
    const fs = await import("fs/promises");
    await fs.mkdir(accountDir, { recursive: true });
    const krng = system._ingressNetwork?.members?.get("krng")?.entity;
    if (krng) await krng.call("StoreKey", { id: `github:pat:${input.alias}`, value: input.pat });
    const accounts = state.accounts || {};
    accounts[input.alias] = { workspace: accountDir };
    state.accounts = accounts;
    return { status: "success", alias: input.alias };
};

export const schema = {
    input: z.object({
        alias: z.string(),
        pat: z.string(),
        workspace: z.string()
    }),
    output: z.object({
        status: z.string(),
        alias: z.string()
    })
};