import { z } from "zod";
export const schema = {
    input: z.object({}),
    output: z.object({
        status: z.string(),
        accounts: z.array(z.object({
            alias: z.string(),
            workspace: z.string()
        }))
    })
};

export const main = async (input: any, { state }: any) => {
    if (input) {}
    const accounts = state.accounts || {};
    const list = Object.keys(accounts).map(alias => ({
        alias,
        workspace: accounts[alias].workspace
    }));
    return { status: "success", accounts: list };
};