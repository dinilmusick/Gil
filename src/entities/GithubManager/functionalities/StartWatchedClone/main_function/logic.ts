import { DATA as RateLimiterData, FUNCTIONS as RateLimiterFuncs } from "../../../../../libraries/RateLimiterConcepts/RateLimiterConcepts.js";
import { z } from "zod";
import { z } from "zod";
export const schema = {
    input: z.object({
        alias: z.string(),
        owner: z.string(),
        repo: z.string(),
        url: z.string(),
        intervalMs: z.number().optional()
    }),
    output: z.object({
        status: z.string(),
        jobKey: z.string().optional()
    })
};

export const main = async (input: any, { state, entity: system }: any) => {
    // @ts-ignore
    return await doWatch(input, state, system);
};