import { doRepair } from "../helper_functions/doRepair.js";
import { z } from "zod";
export const schema = {
    input: z.object({
        alias: z.string(),
        owner: z.string(),
        repo: z.string(),
        missingFiles: z.array(z.any())
    }),
    output: z.object({
        status: z.string(),
        repairedCount: z.number().optional(),
        error: z.string().optional()
    })
};

export const main = async (input: any, { state, entity: system }: any) => {
    return await doRepair(input, state, system);
};