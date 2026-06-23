# GitHub

## Description
A utility library.

## DATA
- (No data structures defined)

## FUNCTIONS
### getRemoteRepoInfo
- **Description**: Gets metadata for a specific remote repo
- **Signature**: `owner, repo, pat -> any`

### listPullRequests
- **Description**: Lists pull requests
- **Signature**: `owner, repo, pat -> any`

### createPullRequest
- **Description**: Creates a pull request
- **Signature**: `owner, repo, title, head, base, body, pat -> any`

### listIssues
- **Description**: Lists issues for a repo
- **Signature**: `owner, repo, pat -> any`

### createIssue
- **Description**: Creates a GitHub issue
- **Signature**: `owner, repo, title, body, pat -> any`

### forkRemoteRepo
- **Description**: Forks a GitHub repo
- **Signature**: `owner, repo, pat -> any`

### deleteRemoteRepo
- **Description**: Deletes a GitHub repo
- **Signature**: `owner, repo, pat -> any`

### createRemoteRepo
- **Description**: Creates a new GitHub repo
- **Signature**: `name, desc, isPrivate, pat -> any`

### listAccountRepos
- **Description**: Lists repositories for GitHub PAT
- **Signature**: `pat -> any`

### getAccountUser
- **Description**: Gets GitHub authenticated user info
- **Signature**: `pat -> any`

### downloadFileContent
- **Description**: Downloads single file raw content from GitHub
- **Signature**: `owner, repo, filePath, pat -> any`

### getRepoTree
- **Description**: Gets remote file tree recursively
- **Signature**: `owner, repo, sha, pat -> any`

### callApi
- **Description**: Makes fetch request to GitHub API
- **Signature**: `url, pat, options = {} -> any`


