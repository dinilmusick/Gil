import { doWatch } from "../helper_functions/doWatch.js";
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
    return await doWatch(input, state, system);
};