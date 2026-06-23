import fs from "fs/promises";
import path from "path";
import { DATA as GitHubData, FUNCTIONS as GitHubFuncs } from "../../../../../libraries/GitHubConcepts/GitHubConcepts.js";

export const doRepair = async (input: any, state: any, system: any) => {
    const krng = system._ingressNetwork?.members?.get("krng")?.entity;
    if (!krng) return { status: "error", error: "Krng service not available" };
    const keyRes = await krng.call("RetrieveKey", { id: `github:pat:${input.alias}` });
    if (keyRes.status !== "success" || !keyRes.value) return { status: "error", error: "No token" };
    const account = state.accounts[input.alias];
    const localRepoDir = `${account.workspace}/${input.repo}`;
    const repairFile = async (file: any) => {
        const data = await FUNCTIONS.GitHub.downloadFileContent(input.owner, input.repo, file.path, keyRes.value);
        const fullPath = path.join(localRepoDir, file.path);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, data);
    };
    await Promise.all((input.missingFiles || []).map(repairFile));
    return { status: "success", repairedCount: (input.missingFiles || []).length };
};