import fs from "fs/promises";
import { FUNCTIONS as GitOpsFuncs } from "../../../../../libraries/GitOpsConcepts/GitOpsConcepts.js";

export const doClone = async (input: any, state: any, system: any) => {
    const krng = system._ingressNetwork?.members?.get("krng")?.entity;
    if (!krng) return { status: "error", error: "Krng service not available" };
    const keyRes = await krng.call("RetrieveKey", { id: `github:pat:${input.alias}` });
    if (keyRes.status !== "success" || !keyRes.value) return { status: "error", error: "No token" };
    const account = state.accounts[input.alias];
    const dest = `${account.workspace}/${input.repo}`;
    let exists = false;
    try {
        const files = await fs.readdir(dest);
        exists = files.length > 0;
    } catch (e) {}
    if (!exists) {
        await GitOpsFuncs.cloneRepository(input.url, dest, keyRes.value);
    }
    const verifyRes = await system.call("VerifyRepoIntegrity", {
        alias: input.alias,
        owner: input.owner,
        repo: input.repo
    });
    if (verifyRes.status === "success" && verifyRes.missingFiles?.length > 0) {
        await system.call("RepairRepo", {
            alias: input.alias,
            owner: input.owner,
            repo: input.repo,
            missingFiles: verifyRes.missingFiles
        });
    }
    return { status: "success", dest };
};