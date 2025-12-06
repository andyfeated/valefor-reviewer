# Review Workflow

// outdated
1. Client calls `getPullRequest`
2. Pull Request Service creates GitHost from Factory
  - Gitlab (Strategy)
  - Github (Strategy)
  - Each implements
    - `isPublicPr`
    - `buildOauthUrl`
3. Pull Request Service gets Repo visibility via `GitHost.checkVisibility`
  - If public - Step 5
  - If private and has no token - Go to Step 4
  - If private and has valid token - Go to Step 5
4. If private or PR does not exist 
  - Generate OAuthUrl via `GitHost.buildOauthUrl`
  - Return OAuthUrl to client
  - Client redirects to OAuthUrl
  - User approves
  - Re-request `getPullRequest` but this time, with `token`
5. Return Pull Request Data (or Error if PR doesn't actually exist)
6. Display Pull Request Data to client
7. Get Pull Request Diffs
8. Display Pull Request Diffs to Client
9. Send Pull Request Diffs to AI (Per file)

# Problems and Limitations
- Since we don't store results in db, same PR will have different AI reviews
- We NEED to have a DB to have persisting reviews
- Registration process
  - Linking both Gitlab and Github accounts

# Solutions
- We can save ONLY reviews, no need auth

# To Add
- Nest Server (Done)
- Vue Client (Done)
- OAuth with PKCE
- Docker + Docker Compose
- Unit tests

# Tips
- Docker
  - When installing new dependencies, need to run
    `docker compose build --no-cache && docker compose up`
    - Can try without no cache
