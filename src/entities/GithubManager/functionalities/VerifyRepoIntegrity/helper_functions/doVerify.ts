import { verifyTree } from "./verifyTree.js";
import { DATA as GitHubData, FUNCTIONS as GitHubFuncs } from "../../../../../libraries/GitHubConcepts/GitHubConcepts.js";

export const doVerify = async (input: any, state: any, system: any) => {
    const krng = system._ingressNetwork?.members?.get("krng")?.entity;
    if (!krng) return { status: "error", error: "Krng service not available" };
    const keyRes = await krng.call("RetrieveKey", { id: `github:pat:${input.alias}` });
    if (keyRes.status !== "success" || !keyRes.value) return { status: "error", error: "No token" };
    try {
        let sha = input.sha;
        if (!sha) {
            const info = await FUNCTIONS.GitHub.getRemoteRepoInfo(input.owner, input.repo, keyRes.value);
            sha = info.default_branch || "main";
        }
        const treeRes = await FUNCTIONS.GitHub.getRepoTree(input.owner, input.repo, sha, keyRes.value);
        const account = state.accounts[input.alias];
        const localRepoDir = `${account.workspace}/${input.repo}`;
        const missingFiles = await verifyTree(localRepoDir, treeRes.tree || []);
        return { status: "success", missingFiles, totalFiles: (treeRes.tree || []).length };
    } catch (e: any) {
        return { status: "error", error: e.message };
    }
};