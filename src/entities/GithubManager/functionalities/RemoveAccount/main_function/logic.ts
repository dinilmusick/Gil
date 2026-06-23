import { z } from "zod";
import { z } from "zod";
export const schema = {
    input: z.object({
        alias: z.string(),
        deleteFolder: z.boolean().default(false)
    }),
    output: z.object({
        status: z.string(),
        alias: z.string()
    })
};

export const main = async (input: any, { state, entity: system }: any) => {
    const krng = system._ingressNetwork?.members?.get("krng")?.entity;
    if (krng) await krng.call("DeleteKey", { id: `github:pat:${input.alias}` });
    const accounts = state.accounts || {};
    const account = accounts[input.alias];
    if (account && input.deleteFolder) {
        const fs = await import("fs/promises");
        await fs.rm(account.workspace, { recursive: true, force: true }).catch(() => {});
    }
    delete accounts[input.alias];
    state.accounts = accounts;
    return { status: "success", alias: input.alias };
};