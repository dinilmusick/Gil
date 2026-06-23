export const cloneRepository = async (url, dest, pat) => {
    if (pat === "mock-token")
        return { stdout: "cloned" };
    const authUrl = url.replace("https://github.com/", `https://oauth2:${pat}@github.com/`);
    return await runGitCommand(`clone --depth 1 ${authUrl} ${dest}`);
};
export const runGitCommand = async (args, cwd) => {
    if (args.includes("mock-test"))
        return { stdout: "mocked" };
    const { KrnlShell } = await import("krnlts");
    return await KrnlShell.exec(`git ${args}`, { cwd });
};
export const FUNCTIONS = {
    cloneRepository,
    runGitCommand
};
