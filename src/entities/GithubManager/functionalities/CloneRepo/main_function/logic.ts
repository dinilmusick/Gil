import { DATA as GitHubData, FUNCTIONS as GitHubFuncs } from "../../../../../libraries/GitHubConcepts/GitHubConcepts.js";
import { DATA as GitOpsData, FUNCTIONS as GitOpsFuncs } from "../../../../../libraries/GitOpsConcepts/GitOpsConcepts.js";
import { z } from "zod";
import { z } from "zod";
export const schema = {
    input: z.object({
        alias: z.string(),
        owner: z.string(),
        repo: z.string(),
        url: z.string()
    }),
    output: z.object({
        status: z.string(),
        dest: z.string().optional(),
        error: z.string().optional()
    })
};

export const main = async (input: any, { state, entity: system }: any) => {
    // @ts-ignore
    return await doClone(input, state, system);
};