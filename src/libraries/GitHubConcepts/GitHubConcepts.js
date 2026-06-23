export const getRemoteRepoInfo = async (owner, repo, pat) => {
    if (pat === "mock-token")
        return { name: repo };
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    return await callApi(url, pat);
};
export const listPullRequests = async (owner, repo, pat) => {
    if (pat === "mock-token")
        return [{ number: 1 }];
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all`;
    return await callApi(url, pat);
};
export const createPullRequest = async (owner, repo, title, head, base, body, pat) => {
    if (pat === "mock-token")
        return { title };
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;
    return await callApi(url, pat, {
        method: "POST",
        body: JSON.stringify({ title, head, base, body })
    });
};
export const listIssues = async (owner, repo, pat) => {
    if (pat === "mock-token")
        return [{ number: 1 }];
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all`;
    return await callApi(url, pat);
};
export const createIssue = async (owner, repo, title, body, pat) => {
    if (pat === "mock-token")
        return { title };
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    return await callApi(url, pat, {
        method: "POST",
        body: JSON.stringify({ title, body })
    });
};
export const forkRemoteRepo = async (owner, repo, pat) => {
    if (pat === "mock-token")
        return { status: "success" };
    const url = `https://api.github.com/repos/${owner}/${repo}/forks`;
    return await callApi(url, pat, { method: "POST" });
};
export const deleteRemoteRepo = async (owner, repo, pat) => {
    if (pat === "mock-token")
        return { status: "success" };
    const url = `https://api.github.com/repos/${owner}/${repo}`;
    return await callApi(url, pat, { method: "DELETE" });
};
export const createRemoteRepo = async (name, desc, isPrivate, pat) => {
    if (pat === "mock-token")
        return { name };
    const url = "https://api.github.com/user/repos";
    return await callApi(url, pat, {
        method: "POST",
        body: JSON.stringify({ name, description: desc, private: isPrivate })
    });
};
export const listAccountRepos = async (pat) => {
    if (pat === "mock-token")
        return [{ name: "repo1" }];
    return await callApi("https://api.github.com/user/repos?per_page=100", pat);
};
export const getAccountUser = async (pat) => {
    if (pat === "mock-token")
        return { login: "test-user" };
    return await callApi("https://api.github.com/user", pat);
};
export const downloadFileContent = async (owner, repo, filePath, pat) => {
    if (pat === "mock-token")
        return "content";
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`;
    const info = await callApi(url, pat);
    if (info && info.content) {
        return Buffer.from(info.content, "base64");
    }
    throw new Error("File content is missing");
};
export const getRepoTree = async (owner, repo, sha, pat) => {
    if (pat === "mock-token")
        return { tree: [] };
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`;
    return await callApi(url, pat);
};
export const callApi = async (url, pat, options = {}) => {
    if (pat === "mock-token")
        return { mock: true };
    const headers = {
        "Authorization": `Bearer ${pat}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Gil-Github-Helper-App"
    };
    const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
    if (res.status === 204)
        return { status: "success" };
    if (!res.ok)
        throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    return await res.json();
};
export const FUNCTIONS = {
    getRemoteRepoInfo,
    listPullRequests,
    createPullRequest,
    listIssues,
    createIssue,
    forkRemoteRepo,
    deleteRemoteRepo,
    createRemoteRepo,
    listAccountRepos,
    getAccountUser,
    downloadFileContent,
    getRepoTree,
    callApi
};
