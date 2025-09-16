---
title: "Defending Against npm Supply‑Chain Attacks (September 2025)"
date: 2025-09-16T10:00:00+02:00
description: "Introduction to my blog and what you can expect to find here"
tags: ["npm", "supply-chain", "attacks"]
keywords: ["blog", "software engineering", "technical writing", "npm", "supply-chain", "attacks"]
author: "Haroon Dilshad"
---

# Defending Against npm Supply‑Chain Attacks (September 2025)

<img src="/images/npm-security-blog-hero.png"/>
Developers can significantly reduce risk from npm supply‑chain attacks by default‑denying install scripts, using reproducible installs with lockfiles, preferring signed provenance, applying the Node.js Permission Model, and gating dependency changes in CI, which together contain execution pathways used in recent compromises like the September 2025 chalk/debug and “Shai‑Hulud” waves. In environments touching crypto or other secrets, keep keys off workstations and treat any machine that executed tainted versions as potentially compromised until tokens are rotated and CI/workflows are audited.[^8][^10][^11][^12][^13][^14][^15][^16][^17]

## What happened in Sep 2025

On September 8, 2025, attackers compromised multiple npm maintainer accounts and pushed malicious versions of high‑traffic packages including chalk, debug, and at least 16 others, triggering rapid ecosystem responses from vendors and platforms. Subsequent analysis showed browser‑focused payloads hooking window.ethereum and network APIs to hijack cryptocurrency transactions at scale with multi‑chain support and obfuscation.[^1][^4][^6][^8]

Between September 14–16, researchers documented a second wave impacting 40+ packages tied to maintainers such as @ctrl/tinycolor, with injected payloads that downloaded tools like TruffleHog to harvest secrets and pivot via developer and CI tokens. Wiz labeled a self‑propagating strain “Shai‑Hulud,” describing a worm‑like campaign that created exfiltration repos, pushed malicious GitHub Actions, and republished trojanized packages using stolen credentials.[^15][^17][^18][^19]

## Why this is hard

Maintainer account takeovers poison trusted packages upstream, so a single malicious publish can cascade through transitive dependencies into countless apps, CI pipelines, and developer machines in hours. Traditional SCA and CVE‑based workflows lag behind fast‑moving malicious versions and obfuscated payloads that may never receive CVE identifiers, demanding behavioral and provenance‑based defenses too.[^1][^8]

## TL;DR safeguards

- Default‑deny install scripts via **ignore‑scripts** and run reproducible installs with npm ci to prevent surprise code execution and drift.[^10][^11]
- Prefer packages published with **provenance** and validate signatures/attestations during install or CI to ensure chain‑of‑custody.[^12][^20]
- Contain untrusted tools with the Node **Permission Model** so file, network, and process access are explicitly granted, not assumed.[^13]


## Immediate actions for teams

- Identify exposure: search lockfiles for listed malicious versions; audit private registries and caches to ensure poisoned artifacts are not mirrored internally.[^2]
- Purge and rebuild: clear caches on developer machines, CI, and artifact stores; rebuild from known‑good commits with locked versions.[^2]
- Rotate credentials: revoke npm tokens, GitHub tokens, SSH keys, and cloud credentials used on systems that executed tainted installs or builds.[^17]
- Hunt indicators: look for unexpected “Shai‑Hulud” repos, new workflows in .github/workflows, obfuscated bundle.js, or unusual outbound connections in runner logs.[^15][^17]


## Lock down installs

Deterministic installs with npm ci enforce the existing package‑lock.json and fail on mismatches, avoiding silent upgrades that pull malicious versions mid‑incident. Default‑deny lifecycle scripts to block preinstall/postinstall payloads, temporarily lifting the restriction only when rebuilding known‑trusted packages that require native steps.[^11][^10]

```bash
# Deterministic, read-only install from the lockfile
npm ci
```

```bash
# Enforce no install scripts by default
echo "ignore-scripts=true" >> .npmrc
```


## Prefer signed provenance

npm package provenance links a published tarball to the source repo and CI workflow that built it, enabling verification that the artifact truly came from the expected pipeline rather than a compromised workstation. Incorporate attestation verification in install or CI steps and keep npm updated so signatures and provenance statements are recognized and enforced.[^20][^12]

```bash
# After install, verify signatures/attestations where available
npm audit signatures
```


## Contain execution with Node permissions

Run untrusted scripts with the Node.js Permission Model so they cannot read secrets, write files, spawn processes, or talk to the network unless explicitly allowed via granular flags. Start from --permission deny‑all and add the smallest needed allowances like --allow-fs-read for a specific directory to keep blast radius tight.[^13]

```bash
# Deny-by-default; allow read-only access to the project directory
node --permission --allow-fs-read=$(pwd) scripts/tool.js
```


## CI/CD guardrails

Require dependency review in pull requests so manifest and lockfile diffs are human‑gated, with clear visualization of new packages and transitive trees before merging. Pair with policy checks that block builds on missing lockfiles, unexpected registry switches, or introduction of unverified publishers, and add SBOM generation to accelerate impact analysis during incidents.[^3][^14][^1]

## Registry and publisher hygiene

Pin the registry to a known source and avoid implicit registry switching that attackers can abuse during social engineering or ownership changes. Monitor for maintainer account transfers, sudden new owners, or brand‑adjacent phishing domains (e.g., the September campaign’s “npmjs.help”) as triggers for deeper review.[^6][^3]

## Frontend‑specific defenses

Because September’s payloads focused on browser execution, add tests and scanners that flag runtime hooks on window.ethereum, fetch, and XMLHttpRequest, plus mass address‑rewriting patterns. Use immutable asset naming, SBOMs for client bundles, and automated CDN purge on security rollbacks to shorten exposure windows.[^3][^6]

## Developer workstation hygiene

Treat any workstation that installed tainted packages as suspect; rotate tokens stored in env vars or config files and re‑enroll SSH/GPG where applicable. Keep high‑value credentials off workstations when possible; for crypto, prefer hardware wallets so private keys never reside on disk or in browser extensions that malicious code can hook.[^16][^2]

## Incident response checklist

- Scope: Map affected repos, pipelines, and artifacts by querying lockfiles/SBOMs and CI build histories for malicious versions and time windows.[^1][^2]
- Contain: Blocklist compromised versions, purge caches, and rebuild clean images from known‑good states with pinned versions and provenance checks.[^2][^12]
- Eradicate: Rotate secrets used by affected developers/agents and remove unauthorized workflows, tokens, and repos created by the malware.[^17][^15]
- Recover: Release patched builds, purge CDN caches, and communicate remediation steps to stakeholders and downstream consumers.[^6][^1]


## Example policy snippets

.npmrc (project‑local)

```
ignore-scripts=true
audit-level=high
fund=false
```

GitHub Actions (dependency review gate)

```yaml
name: dependency-review
on:
  pull_request:
    paths:
      - "package.json"
      - "package-lock.json"
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: critical
```

Node permission wrapper for scripts

```bash
alias safe-node='node --permission'
safe-node --allow-fs-read=$(pwd) scripts/build.js
```


## What to monitor next

Track evolving impacted‑package lists and IoCs from incident write‑ups on the September 2025 wave, including “Shai‑Hulud” behaviors and any newly identified malicious versions. Watch for post‑mortems from package maintainers and registries that may introduce new verification or provenance requirements developers can opt into quickly.[^8][^20][^15][^17]

## References

- npm chalk/debug compromise and ecosystem response, September 2025.[^4][^8][^1]
- “Shai‑Hulud” self‑propagating campaign analysis and IoCs.[^15]
- 40+ packages impacted including @ctrl/tinycolor and related projects.[^18][^19][^17]
- Practical response and containment guidance for caches, lockfiles, and rebuilds.[^2]
- Registry, publisher, and frontend runtime‑hooking indicators and mitigations.[^3][^6]
- Reproducible installs, script blocking, and provenance verification docs.[^20][^11][^12][^10]
- Node.js Permission Model for process, file, and network isolation.[^13]


## One‑page setup

- Turn on ignore‑scripts in .npmrc and use npm ci everywhere for deterministic builds.[^11][^10]
- Gate all dependency changes with dependency review and SBOM generation in CI.[^14][^1]
- Prefer provenance‑signed packages and verify signatures/attestations on install.[^12][^20]
- Run untrusted tools under the Node Permission Model with smallest‑necessary allowances.[^13]
- For crypto‑exposed workflows, keep keys in hardware wallets and never in local browser storage.[^16]
<span style="display:none">[^21][^22][^23][^5][^7][^9]</span>

<div style="text-align: center">⁂</div>

[^1]: https://www.paloaltonetworks.com/blog/cloud-security/npm-supply-chain-attack/

[^2]: https://blog.qualys.com/vulnerabilities-threat-research/2025/09/10/when-dependencies-turn-dangerous-responding-to-the-npm-supply-chain-attack

[^3]: https://cycode.com/blog/npm-debug-chalk-supply-chain-attack-the-complete-guide/

[^4]: https://vercel.com/blog/critical-npm-supply-chain-attack-response-september-8-2025

[^5]: https://www.propelcode.ai/blog/npm-supply-chain-attack-analysis-2025

[^6]: https://www.armorcode.com/blog/inside-the-september-2025-npm-supply-chain-attack

[^7]: https://www.oligo.security/academy/ultimate-guide-to-software-supply-chain-security-in-2025

[^8]: https://www.sonatype.com/blog/npm-chalk-and-debug-packages-hit-in-software-supply-chain-attack

[^9]: https://stellar.org/blog/developers/npm-supply-chain-attack-response

[^10]: https://docs.npmjs.com/cli/v9/commands/npm-ci/

[^11]: https://docs.npmjs.com/cli/v8/commands/npm-install/

[^12]: https://docs.npmjs.com/generating-provenance-statements/

[^13]: https://nodejs.org/api/permissions.html

[^14]: https://docs.github.com/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review

[^15]: https://www.wiz.io/blog/shai-hulud-npm-supply-chain-attack

[^16]: https://support.metamask.io/more-web3/wallets/hardware-wallet-hub/

[^17]: https://thehackernews.com/2025/09/40-npm-packages-compromised-in-supply.html

[^18]: https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised

[^19]: https://socket.dev/blog/tinycolor-supply-chain-attack-affects-40-packages

[^20]: https://github.blog/security/supply-chain-security/introducing-npm-package-provenance/

[^21]: https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/configuring-the-dependency-review-action

[^22]: https://github.com/marketplace/actions/dependency-review

[^23]: https://docs.github.com/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-dependency-changes-in-a-pull-request

