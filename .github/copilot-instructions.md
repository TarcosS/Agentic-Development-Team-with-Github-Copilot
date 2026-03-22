# Copilot Instructions for Agent Skills

## Project Overview

Agent Skills is a repository of skills, prompts, and MCP configurations for AI coding agents working in a Node.js backend environment.

Primary backend stack:

- Node.js v24
- Express.js
- TypeScript
- Sequelize ORM
- PostgreSQL via Sequelize
- JWT authentication
- pnpm package manager
- Cloudflare CDN for public asset delivery and caching

## Fresh Information First

**Node and package APIs change. Avoid stale patterns.**

Before implementing backend changes:

1. Check the current official documentation for the exact package and version you are using.
2. Verify installed package versions with `pnpm list --depth 0`.
3. Do not assume legacy Express/Sequelize/JWT usage is still correct.

If implementation details are uncertain, stop and verify first.

---

## Core Principles

Apply these principles to every task.

### 1. Think Before Coding

- State assumptions explicitly.
- Surface alternatives when requirements are ambiguous.
- Ask concise clarification questions when required.

### 2. Simplicity First

- Build the minimum solution that satisfies the request.
- Avoid speculative abstractions.
- Prefer readable, direct code over clever code.

### 3. Surgical Changes

- Touch only files relevant to the request.
- Do not refactor unrelated code.
- Keep naming and style consistent with the existing codebase.

### 4. Goal-Driven Execution (TDD)

- Define success criteria before implementation.
- Add or update tests for behavior changes.
- Validate with lint, typecheck, and tests before finishing.

---

## Repository Structure

```text
AGENTS.md                # Agent configuration template

.github/
├── skills/              # Backward-compat symlinks to plugin skills
│   └── */SKILL.md       # Each skill has YAML frontmatter + markdown body
├── plugins/             # Language-based plugin bundles
├── prompts/             # Reusable prompt templates
├── agents/              # Agent persona definitions (backend, frontend, planner, presenter)
├── scripts/             # Automation scripts
├── workflows/           # GitHub Actions workflows
└── copilot-instructions.md

.vscode/
└── mcp.json             # MCP server configurations
```

Note: Infrastructure-specific guidance is intentionally omitted.

---

## Skills

Skills are domain-specific knowledge packages in `.github/skills/`. Each skill has a `SKILL.md` with:

- YAML frontmatter (`name`, `description`) for discovery
- Markdown body loaded when the skill activates

### Skill Naming Convention

| Language | Suffix | Example |
|----------|--------|---------|
| Core | none | `mcp-builder` |
| TypeScript | `-ts` | `zustand-store-ts` |
| Node.js backend | `-ts` | `express-router-ts` |
| Python | `-py` | `github-issue-creator` |

### Featured Skills

| Skill | Purpose |
|-------|---------|
| `copilot-sdk` | Build Copilot-powered applications using the SDK (TypeScript-first in this repo) |
| `frontend-ui-dark-ts` | Build dark-themed React UIs with Tailwind CSS and motion patterns |
| `react-flow-node-ts` | Create custom React Flow nodes with strong TypeScript typing |
| `zustand-store-ts` | Implement typed Zustand stores with `subscribeWithSelector` |
| `github-issue-creator` | Convert raw notes/logs into structured GitHub issue markdown |
| `continual-learning` | Add persistent learning workflows and memory patterns for agents |

Only load skills relevant to the active task.

---

## MCP Servers

Pre-configured MCP servers in `.vscode/mcp.json` provide additional capabilities.

### Documentation and Search

| MCP | Purpose |
|-----|---------|
| `context7` | Indexed documentation with semantic search |
| `deepwiki` | Repository-level research and Q&A |

### Development Tools

| MCP | Purpose |
|-----|---------|
| `github` | GitHub API operations |
| `playwright` | Browser automation and testing |
| `eslint` | JavaScript/TypeScript linting |

### Utilities

| MCP | Purpose |
|-----|---------|
| `sequentialthinking` | Step-by-step reasoning for complex tasks |
| `memory` | Persistent memory across sessions |
| `markitdown` | Convert docs into markdown |

---

## Backend Stack Quick Reference

| Package | Purpose | Install |
|---------|---------|---------|
| `express` | HTTP API framework | `pnpm add express` |
| `typescript` | Static typing | `pnpm add -D typescript @types/node` |
| `sequelize` | ORM | `pnpm add sequelize` |
| `pg` | PostgreSQL driver | `pnpm add pg pg-hstore` |
| `jsonwebtoken` | JWT auth | `pnpm add jsonwebtoken` |
| `zod` | Runtime validation | `pnpm add zod` |

### Authentication Pattern

Always validate JWT at middleware boundaries and keep token parsing centralized.

```ts
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export function getCurrentUserRequired(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as Request & { user?: unknown }).user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
```

### Environment Variables

```bash
NODE_ENV=development
PORT=8000
DATABASE_URL=postgres://user:pass@localhost:5432/appdb
JWT_SECRET=replace-with-strong-secret
CLOUDFLARE_ACCOUNT_ID=<account-id>
CLOUDFLARE_API_TOKEN=<token>
CLOUDFLARE_CDN_BASE_URL=https://cdn.example.com
```

Never commit secrets.

---

## Conventions

### Code Style

- Use TypeScript for backend source files.
- Use `async/await` for I/O operations.
- Keep route handlers thin; move business logic to services.
- Keep DB access in Sequelize models/repositories/services.
- Validate incoming payloads with Zod (or equivalent) before service logic.

### Database Patterns (Sequelize + PostgreSQL)

- Use migrations for schema evolution.
- Keep model fields aligned with migration files.
- Prefer explicit transaction boundaries for multi-step writes.
- Avoid raw SQL unless ORM query capabilities are insufficient.

### Cloudflare CDN Patterns

- Return canonical CDN URLs from API responses for public assets.
- Keep origin/private storage details out of public responses.
- Treat CDN URL generation as a dedicated helper/service concern.

### Git and GitHub

- Use `gh` CLI for PRs and issues.
- Keep commits focused and minimal.

### Clean Code Checklist

Before completing any code change:

- [ ] Function and method names are intention-revealing
- [ ] No unused imports, params, or variables introduced
- [ ] Error handling is explicit
- [ ] Lint, typecheck, and test commands pass for changed scope
- [ ] No secrets in code, config, or logs

### Testing Pattern (TypeScript)

```ts
// Arrange
const service = new ProjectService();
const input = { name: "demo" };

// Act
const result = await service.createProject(input, "user-1");

// Assert
expect(result.name).toBe("demo");
```

---

## Creating New Skills

1. Create a new directory under `.github/skills/<skill-name>/`.
2. Add `SKILL.md` with valid YAML frontmatter:

```yaml
---
name: skill-name-ts
description: Brief description of what the skill does and when to use it
---
```

3. Add practical, implementation-focused guidance.
4. Keep each skill scoped to one domain.

---

## Do and Do Not

### Do

- Use Node.js v24-compatible APIs.
- Use Express middleware for cross-cutting concerns.
- Use Sequelize + PostgreSQL patterns consistently.
- Use JWT middleware for protected endpoints.
- Use pnpm for dependency and script management.
- Keep Cloudflare CDN integration explicit and testable.

### Do Not

- Do not introduce Python/FastAPI/Pydantic patterns in backend instructions.
- Do not bypass TypeScript typing with `any` without strong justification.
- Do not hardcode secrets, tokens, or database credentials.
- Do not refactor unrelated code while fixing a targeted issue.
- Do not add dependencies without clear need.

---

## Success Indicators

These instructions are working if:

- Backend changes consistently use TypeScript + Express + Sequelize conventions.
- PostgreSQL access is done through Sequelize models/services.
- Auth changes go through JWT middleware patterns.
- CDN-facing URLs are consistently Cloudflare-based.
- Diffs stay focused, with tests/type checks updated when behavior changes.
