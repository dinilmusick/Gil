import { FUNCTIONS as GitHubFuncs } from "../../../../../libraries/GitHubConcepts/GitHubConcepts.js";
import { z } from "zod";
export const schema = {
    input: z.object({
        alias: z.string(),
        owner: z.string(),
        repo: z.string()
    }),
    output: z.object({
        status: z.string(),
        info: z.any().optional(),
        error: z.string().optional()
    })
};

export const main = async (input: any, { state, entity: system }: any) => {
    const krng = system._ingressNetwork?.members?.get("krng")?.entity;
    if (!krng) return { status: "error", error: "Krng service not available" };
    const keyRes = await krng.call("RetrieveKey", { id: `github:pat:${input.alias}` });
    if (keyRes.status !== "success" || !keyRes.value) {
        return { status: "error", error: "Token not found in keyring" };
    }
    try {
        const info = await GitHubFuncs.getRemoteRepoInfo(input.owner, input.repo, keyRes.value);
        return { status: "success", info };
    } catch (e: any) {
        return { status: "error", error: e.message };
    }
};