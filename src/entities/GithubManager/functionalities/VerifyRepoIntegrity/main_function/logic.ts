import { DATA as GitHubData, FUNCTIONS as GitHubFuncs } from "../../../../../libraries/GitHubConcepts/GitHubConcepts.js";
import { z } from "zod";
import { z } from "zod";
export const schema = {
    input: z.object({
        alias: z.string(),
        owner: z.string(),
        repo: z.string(),
        sha: z.string().optional()
    }),
    output: z.object({
        status: z.string(),
        missingFiles: z.array(z.any()).optional(),
        totalFiles: z.number().optional(),
        error: z.string().optional()
    })
};

export const main = async (input: any, { state, entity: system }: any) => {
    // @ts-ignore
    return await doVerify(input, state, system);
};