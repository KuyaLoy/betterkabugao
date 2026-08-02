# BetterKabugao Cloudflare Pages Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the completed BetterKabugao coming-soon build to Cloudflare Pages through the personal GitHub repository, attach `betterkabugao.org`, and verify the public production launch.

**Architecture:** Treat GitHub `main` as the single production source. Cloudflare Pages installs and builds the repository with npm, serves `dist` on a generated `pages.dev` hostname, then associates the Cloudflare-managed apex domain through the project’s Custom domains workflow. Every external mutation is preceded by a duplicate/current-state check and followed by independent HTTP, DNS, metadata, and GitHub verification.

**Tech Stack:** GitHub, Cloudflare Pages Git integration, Cloudflare DNS and Universal SSL, npm/Vite static output, GitHub CLI, PowerShell DNS and HTTP checks, in-app browser

## Global Constraints

- Do not begin until the coming-soon page plan is complete, visually approved, merged to `main`, and pushed to `KuyaLoy/betterkabugao`.
- GitHub repository is exactly `KuyaLoy/betterkabugao`; production branch is exactly `main`.
- Cloudflare project name is `betterkabugao`. If that name is unavailable or an unrelated project already uses it, stop and report the conflict instead of inventing a different production hostname.
- Build command is exactly `npm run build`; output directory is exactly `dist`; root directory is the repository root.
- Set `NODE_VERSION` to `22.14.0` in the Pages build environment as a second guard alongside `.node-version`.
- Grant the Cloudflare Workers and Pages GitHub App access only to `KuyaLoy/betterkabugao`.
- Verify the generated `betterkabugao.pages.dev` deployment before attaching the apex domain.
- Add `betterkabugao.org` through Pages > Custom domains. Do not manually create a CNAME before the Pages association.
- Never expose Cloudflare tokens, GitHub tokens, account identifiers, or browser session details in the repository, reports, screenshots, or chat.
- Keep the BetterLGU directory entry at Work in Progress. Do not request Active status while only the coming-soon page exists.
- Keep `needs-verification` until the public domain responds correctly and the maintainer can verify it.

---

### Task 1: Prove the production branch is deployable

**Files:**
- Verify only: repository source and `dist`

**Interfaces:**
- Consumes: the merged and pushed result of `2026-08-02-betterkabugao-coming-soon.md`.
- Produces: a verified remote SHA and a fresh local `dist` that Task 2 can compare with the Pages deployment.

- [ ] **Step 1: Verify GitHub ownership and the default branch**

Run:

```powershell
gh repo view KuyaLoy/betterkabugao --json nameWithOwner,isPrivate,defaultBranchRef,url
git fetch origin main
$localHead = git rev-parse main
$remoteHead = git rev-parse origin/main
Write-Output "LOCAL_HEAD=$localHead"
Write-Output "REMOTE_HEAD=$remoteHead"
```

Expected:

- `nameWithOwner` is `KuyaLoy/betterkabugao`;
- `isPrivate` is `false`;
- `defaultBranchRef.name` is `main`; and
- `LOCAL_HEAD` equals `REMOTE_HEAD`.

- [ ] **Step 2: Rebuild from the lockfile**

Run:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Expected: every command exits 0; the test report contains zero failures; `dist/index.html` exists.

- [ ] **Step 3: Verify the deployment payload**

Run:

```powershell
$required = @(
  'dist\index.html',
  'dist\favicon.svg',
  'dist\brand\betterkabugao-mark.svg',
  'dist\brand\betterkabugao-social.png',
  'dist\robots.txt',
  'dist\sitemap.xml',
  'dist\_headers'
)
foreach ($file in $required) {
  if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "Missing deployment file: $file" }
  Write-Output "DIST_OK $file"
}
```

Expected: seven `DIST_OK` lines and exit code 0.

- [ ] **Step 4: Record the preflight evidence**

No Git commit is created. Report the verified remote SHA, exact test counts, build exit code, and seven deployment files. Stop instead of opening Cloudflare if any preflight check fails.

---

### Task 2: Connect GitHub and create the Pages project

**Files:**
- None; this task changes Cloudflare/GitHub App configuration only.

**Interfaces:**
- Consumes: the verified `origin/main` SHA from Task 1.
- Produces: a successful `betterkabugao.pages.dev` production deployment built from that exact SHA.

- [ ] **Step 1: Check for an existing project before creating one**

Open the Cloudflare dashboard in the authenticated in-app browser and go to **Workers & Pages**.

Expected: either no project named `betterkabugao`, or an existing project that is already connected to `KuyaLoy/betterkabugao` with the exact settings below.

If an unrelated project already owns the name, stop and report the project/account conflict. Do not delete or rename anything.

- [ ] **Step 2: Authorize only the personal repository**

When no correct project exists:

1. Select **Create application**.
2. Select **Pages**.
3. Select **Connect to Git**.
4. Choose GitHub and install/configure the **Cloudflare Workers and Pages** GitHub App under `KuyaLoy`.
5. Choose **Only select repositories**.
6. Select only `KuyaLoy/betterkabugao`.
7. Complete authorization and return to Cloudflare.

Expected: the repository selector lists `KuyaLoy/betterkabugao`; no company organization or unrelated personal repository is granted access.

- [ ] **Step 3: Configure the production build exactly**

Select `KuyaLoy/betterkabugao` and use:

- Project name: `betterkabugao`
- Production branch: `main`
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: empty/repository root
- Environment variable: `NODE_VERSION` = `22.14.0`

Leave production deployments enabled. Keep preview deployments enabled for non-production branches.

- [ ] **Step 4: Start and monitor the first deployment**

Select **Save and Deploy**. Monitor the deployment until Cloudflare reports **Success**.

Verify in the deployment details:

- branch is `main`;
- commit SHA equals the Task 1 remote SHA;
- install command uses the repository lockfile;
- build command is `npm run build`;
- output directory is `dist`; and
- production hostname is `https://betterkabugao.pages.dev`.

If the build fails, capture the first actionable error, stop, and use systematic debugging. Do not change multiple settings at once.

- [ ] **Step 5: Verify the generated Pages hostname**

Run:

```powershell
curl.exe --fail --silent --show-error --head https://betterkabugao.pages.dev/
curl.exe --fail --silent --show-error https://betterkabugao.pages.dev/robots.txt
curl.exe --fail --silent --show-error https://betterkabugao.pages.dev/sitemap.xml
curl.exe --fail --silent --show-error --head https://betterkabugao.pages.dev/brand/betterkabugao-social.png
```

Expected:

- the page and social card return HTTP 200;
- `robots.txt` contains `Sitemap: https://betterkabugao.org/sitemap.xml`; and
- `sitemap.xml` contains `<loc>https://betterkabugao.org/</loc>`.

Open `https://betterkabugao.pages.dev` in the browser and confirm the page matches the owner-approved local preview before proceeding.

---

### Task 3: Attach the Cloudflare-managed apex domain

**Files:**
- None; this task changes the Pages custom-domain and DNS association only.

**Interfaces:**
- Consumes: the healthy `betterkabugao.pages.dev` deployment from Task 2 and the Cloudflare zone for `betterkabugao.org`.
- Produces: active HTTPS service at `https://betterkabugao.org/`.

- [ ] **Step 1: Inspect current DNS before mutation**

In the Cloudflare dashboard, open the `betterkabugao.org` zone and inspect **DNS > Records**.

Record any existing apex `@` A, AAAA, or CNAME records. If an apex record points to an active service, stop and ask the owner before replacing it. Do not delete unrelated MX, TXT, CAA, or subdomain records.

- [ ] **Step 2: Associate the domain through Pages**

Return to **Workers & Pages > betterkabugao > Custom domains**:

1. Select **Set up a domain**.
2. Enter `betterkabugao.org`.
3. Select **Continue**.
4. Review the DNS record Cloudflare proposes.
5. Confirm only the Pages apex association.

Do not manually add a DNS record outside this flow.

- [ ] **Step 3: Wait for domain and certificate activation**

Monitor the custom-domain row until it reports **Active** and no certificate warning remains. Use condition-based polling in intervals shorter than 60 seconds; do not use one long blocking sleep.

If activation reports a CAA problem, inspect current CAA records and compare them with Cloudflare’s documented permitted issuers before requesting any DNS change.

- [ ] **Step 4: Verify DNS and HTTPS independently**

Run:

```powershell
Resolve-DnsName betterkabugao.org
curl.exe --fail --silent --show-error --head https://betterkabugao.org/
curl.exe --fail --silent --show-error https://betterkabugao.org/robots.txt
curl.exe --fail --silent --show-error https://betterkabugao.org/sitemap.xml
curl.exe --fail --silent --show-error --head https://betterkabugao.org/brand/betterkabugao-social.png
```

Expected:

- DNS resolves through Cloudflare;
- the page and social image return HTTP 200 over HTTPS;
- there is no certificate error;
- robots and sitemap use the production domain; and
- Cloudflare Pages still shows the custom domain as Active.

---

### Task 4: Run production acceptance and notify BetterLGU

**Files:**
- None; this task verifies production and optionally posts one approved GitHub comment.

**Interfaces:**
- Consumes: active production HTTPS from Task 3.
- Produces: final launch evidence and a maintainer-visible verification update without changing the Work in Progress directory status.

- [ ] **Step 1: Verify production metadata and security headers**

Run:

```powershell
$html = curl.exe --fail --silent --show-error https://betterkabugao.org/
$headers = curl.exe --fail --silent --show-error --head https://betterkabugao.org/
$html | Select-String -Pattern '<title>BetterKabugao — Kabugao information, made clearer</title>'
$html | Select-String -Pattern 'rel="canonical" href="https://betterkabugao.org/"'
$html | Select-String -Pattern 'property="og:image" content="https://betterkabugao.org/brand/betterkabugao-social.png"'
$headers | Select-String -Pattern 'x-content-type-options: nosniff'
$headers | Select-String -Pattern 'referrer-policy: strict-origin-when-cross-origin'
$headers | Select-String -Pattern 'permissions-policy: geolocation=\(\), camera=\(\), microphone=\(\)'
```

Expected: all six patterns are present.

- [ ] **Step 2: Repeat the browser acceptance on production**

Inspect `https://betterkabugao.org/` in the in-app browser at desktop and mobile sizes. Repeat keyboard navigation and reduced-motion checks from the page implementation plan.

Expected: production matches the owner-approved preview, all assets load without console/network errors, and no horizontal overflow appears.

- [ ] **Step 3: Check for an existing live-domain update**

Run:

```powershell
gh pr view 147 --repo jmacj/better-lgu-directory --json comments --jq '.comments[] | select(.author.login == "KuyaLoy") | .body'
```

Search for this exact planned update:

```text
Update: the BetterKabugao coming-soon page is now live at https://betterkabugao.org and the domain is ready for verification. The project remains a work in progress while the full portal is being built.
```

If the exact update already exists, do not post a duplicate.

- [ ] **Step 4: Obtain approval and post the verification update**

Present the exact sentence above to the project owner and obtain approval immediately before posting.

After approval, run:

```powershell
gh pr comment 147 --repo jmacj/better-lgu-directory --body "Update: the BetterKabugao coming-soon page is now live at https://betterkabugao.org and the domain is ready for verification. The project remains a work in progress while the full portal is being built."
```

Do not remove `needs-verification` and do not request Active status. The maintainer owns verification and the directory entry remains Work in Progress.

- [ ] **Step 5: Verify the final external state**

Run:

```powershell
gh pr view 147 --repo jmacj/better-lgu-directory --json comments,labels --jq '{latest: .comments[-1] | {author: .author.login, body: .body, url: .url}, labels: [.labels[].name]}'
```

Expected:

- latest author is `KuyaLoy`;
- latest body is the approved live-domain update;
- the result contains a public GitHub comment URL; and
- `needs-verification` remains until the maintainer completes verification.

Report the production URL, Pages URL, deployed commit SHA, DNS/HTTPS evidence, browser acceptance result, and GitHub comment URL to the owner.
