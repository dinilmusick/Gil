---
name: gil-github-helper
description: >
  Operational guide for AI agents using the Gil app — a GitHub account manager
  running as a KrnlTS HTTP service. Use this skill when you need to manage GitHub
  accounts, clone/repair repositories, list repos, or interact with the GitHub API
  inside a cloud machine environment such as Google AI Studio App Builder.
---

# Gil — GitHub Helper: AI Agent Operational Guide

Gil is a self-hosted HTTP service that gives an AI agent full GitHub account management
capabilities inside a cloud environment. It stores credentials securely via its sub-app
**Krng** (a vault), talks to the GitHub API, and handles the notorious problem of
**incomplete repo downloads** in restricted cloud machines by verifying and atomically
repairing any missing files after a clone.

---

## 1. How Gil Runs

Gil is a **KrnlTS system entity** that boots an HTTP server.

### Starting the server

```bash
# From the Gil project root:
node dist/Gil.js

# Or with a custom port:
KRNL_PORT=10091 node dist/Gil.js
```

> **Default port:** `10091`. All endpoints are at `http://localhost:10091/<EndpointName>`.

On boot, Gil automatically discovers the `Krng` sub-app from `subapps/Krng/`
and brings it online at port `10092`. You do **not** start Krng manually.

### Making calls

Every endpoint accepts a **POST** request with a JSON body.
The server also supports a unified `call` RPC handler:

```bash
curl -X POST http://localhost:10091/<EndpointName> \
  -H "Content-Type: application/json" \
  -d '{ ...payload }'
```

All responses follow the shape:
```json
{ "status": "success" | "error", ...fields }
```
On success, the response may also include a `preemptiveDocumentation` field with
suggested next steps — use it as a guide for what to call next.

---

## 2. Mandatory First Step — Register an Account

Before doing anything with GitHub, you must register a PAT (Personal Access Token)
for an account alias. This stores the token securely in the Krng vault.

```bash
curl -X POST http://localhost:10091/AddAccount \
  -H "Content-Type: application/json" \
  -d '{
    "alias": "my-account",
    "pat":   "ghp_xxxxxxxxxxxxxxxxxxxx",
    "workspace": "/home/user/github-workspaces/my-account"
  }'
```

| Field | Description |
|---|---|
| `alias` | Short name you'll use to reference this account in all other calls |
| `pat` | GitHub Personal Access Token (needs `repo` scope at minimum) |
| `workspace` | Absolute path on disk where repos for this account will be stored |

Response:
```json
{ "status": "success", "alias": "my-account" }
```

---

## 3. All Endpoints — Reference

### Account Management

#### `ListAccounts`
Returns all registered accounts.
```json
{}
```
```json
{ "status": "success", "accounts": [{ "alias": "my-account", "workspace": "/home/..." }] }
```

#### `GetAccountInfo`
Fetches the GitHub user profile for a registered account.
```json
{ "alias": "my-account" }
```
```json
{ "status": "success", "user": { "login": "dinilmusick", "name": "...", ... } }
```

#### `RemoveAccount`
Removes an account from the vault. Optionally deletes the workspace folder.
```json
{ "alias": "my-account", "deleteFolder": false }
```

---

### Repository Discovery

#### `ListRepos`
Lists all repositories accessible by the account's PAT.
```json
{ "alias": "my-account" }
```
```json
{ "status": "success", "repos": [{ "name": "MyRepo", "full_name": "dinilmusick/MyRepo", ... }] }
```

#### `GetRepoInfo`
Gets metadata for a specific repository.
```json
{ "alias": "my-account", "owner": "dinilmusick", "repo": "MyRepo" }
```

---

### Repository Cloning — The Safe Way

> **IMPORTANT for cloud environments (Google AI Studio, cloud VMs, etc.):**
> Standard `git clone` in these environments often downloads repos incompletely —
> files silently go missing. **Always use `CloneRepo`** instead of running `git clone`
> directly. It clones and then automatically verifies + repairs any missing files.

#### `CloneRepo`
Clones a repo into the account's workspace. If the repo directory already exists,
it skips the clone and goes straight to integrity verification and repair.

```json
{
  "alias": "my-account",
  "owner": "dinilmusick",
  "repo":  "MyRepo",
  "url":   "https://github.com/dinilmusick/MyRepo.git"
}
```

**What it does internally:**
1. Checks if the destination folder exists and has files
2. Runs `git clone` with PAT-injected URL if not present
3. Calls `VerifyRepoIntegrity` to compare local files against GitHub's remote tree
4. Calls `RepairRepo` to atomically download any missing or size-mismatched files

Response:
```json
{ "status": "success", "dest": "/home/user/github-workspaces/my-account/MyRepo" }
```

---

#### `VerifyRepoIntegrity`
Compares local repo files against the remote tree (via GitHub API).
Returns a list of files that are missing or have a size mismatch.

```json
{
  "alias": "my-account",
  "owner": "dinilmusick",
  "repo":  "MyRepo",
  "sha":   "main"
}
```

`sha` is optional — if omitted, it resolves to the default branch automatically.

Response:
```json
{
  "status": "success",
  "totalFiles": 142,
  "missingFiles": [
    { "path": "src/utils/helper.ts", "size": 3820, "reason": "missing" },
    { "path": "src/index.ts",        "size": 1200, "reason": "mismatched" }
  ]
}
```

---

#### `RepairRepo`
Downloads only the missing/corrupted files from GitHub via the Contents API.
Does **not** re-download the whole repo.

```json
{
  "alias":        "my-account",
  "owner":        "dinilmusick",
  "repo":         "MyRepo",
  "missingFiles": [
    { "path": "src/utils/helper.ts" },
    { "path": "src/index.ts" }
  ]
}
```

Response:
```json
{ "status": "success", "repairedCount": 2 }
```

---

#### `StartWatchedClone`
Starts a **background watched clone loop** that repeatedly clones, verifies,
and repairs a repo on a configurable interval. Useful for staying in sync with
a repo that changes frequently, or for ensuring eventual completeness when
network conditions are unstable.

```json
{
  "alias":      "my-account",
  "owner":      "dinilmusick",
  "repo":       "MyRepo",
  "url":        "https://github.com/dinilmusick/MyRepo.git",
  "intervalMs": 30000
}
```

| Field | Default | Description |
|---|---|---|
| `intervalMs` | `30000` | Milliseconds between each check cycle (rate limit) |

Response:
```json
{ "status": "success", "jobKey": "my-account/MyRepo" }
```

Calling again with the same `alias`/`repo` while a job is running returns:
```json
{ "status": "already_running", "jobKey": "my-account/MyRepo" }
```

---

## 4. Recommended Workflow for a Cloud AI Agent

Follow this sequence when you land in a fresh cloud environment:

```
1. Start Gil server
   └─ node dist/Gil.js

2. Register accounts
   └─ POST /AddAccount  (repeat for each GitHub account)

3. Discover available repos
   └─ POST /ListRepos

4. Clone repos safely
   └─ POST /CloneRepo   ← always use this, never raw git clone

5. (Optional) Keep a repo in sync
   └─ POST /StartWatchedClone

6. (Optional) Manually check integrity at any time
   └─ POST /VerifyRepoIntegrity → then POST /RepairRepo if missingFiles > 0
```

---

## 5. Environment Notes for Google AI Studio / Cloud VMs

- **Never use raw `git clone`** — the download process can be silently interrupted.
  Always go through `CloneRepo` which has the verify + repair cycle built in.
- **Workspace paths must be absolute** local paths on the machine where Gil runs.
  In AI Studio environments, use paths under `/home/user/` or `/tmp/` as appropriate.
- **PATs are stored in the Krng vault** (`subapps/Krng/vault.db` SQLite file).
  This file persists across restarts. Do not delete it.
- **Port conflicts:** If port `10091` is taken, pass `KRNL_PORT=<port>` when starting.
  Krng sub-app always takes Gil's port + 1 (e.g., `10092`).
- **Git must be installed** on the machine — Gil calls `git clone` via shell.
  Verify with `git --version`.

---

## 6. Error Responses

All errors follow the shape:
```json
{
  "status": "error",
  "error": "Krng service not available",
  "errorDocumentation": { ... }
}
```

| Error message | Cause | Fix |
|---|---|---|
| `Krng service not available` | Krng sub-app didn't boot | Check that `subapps/Krng/assembler.js` exists; restart Gil |
| `Token not found in keyring` | Alias not registered | Call `AddAccount` first |
| `No token` | Same — alias exists but PAT missing | Re-register with `AddAccount` |
| `GitHub API error: 401` | PAT is invalid or expired | Generate a new PAT and re-register |
| `GitHub API error: 403` | PAT lacks required scopes | PAT needs `repo` scope |

---

## 7. Pulling Latest Code (Before Using in a New Environment)

Gil is always deployed by pulling from git — **never symlink or copy local**.

```bash
# In the environment where you'll run Gil:
git clone https://github.com/dinilmusick/Gil.git
cd Gil
npm install
# Gil is pre-built; dist/Gil.js is committed. Run directly:
node dist/Gil.js

# Or rebuild if you need to:
npm run build
node dist/Gil.js
```

Same applies to Krng — it is embedded as a git repo inside `subapps/Krng/`.
If `subapps/Krng/` is missing or empty, pull it:
```bash
cd subapps/Krng
git pull origin main
npm install
npm run build
```
