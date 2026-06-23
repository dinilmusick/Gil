import fs from "fs/promises";
import path from "path";

export const verifyTree = async (localRepoDir: string, tree: any[]) => {
    const missing: any[] = [];
    const check = async (n: any) => {
        if (n.type !== "blob") return;
        const p = path.join(localRepoDir, n.path);
        const sz = await fs.stat(p).then(s => s.size).catch(() => -1);
        if (sz !== n.size) missing.push({ path: n.path, size: n.size, reason: sz === -1 ? "missing" : "mismatched" });
    };
    await Promise.all(tree.map(check));
    return missing;
};