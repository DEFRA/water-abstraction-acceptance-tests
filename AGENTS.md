# AGENTS.md

## Project overview

Acceptance tests for the water abstraction service, delivered and maintained by DEFRA. Tests are written in Playwright (with a legacy Cypress suite).

## Technology

- **Runtime**: Node.js v22 (ES modules)
- **Test framework**: Playwright
- **Legacy test framework**: Cypress

## Agentic configuration

### Agents

Our agents are defined in `.agents`. They are model-agnostic and intended to work well with any LLM. When updating these files:

- Use plain language, not prompt patterns specific to one provider
- Do not rely on system-prompt features that only some models support
- Assume the consumer pastes the content directly into any chat interface

### Personas

- Our personas define _how_ an agent should behave (tone, role, personality)
- They are intended to be used in conjunction with agents and skills, for example, "review as Alan"

### Skills

- Our skills give agents defined capabilities and expertise
- They are defined using the [Agent Skills open standard](https://agentskills.io/specification)

## Instruction precedence

- `AGENTS.md` defines global project rules
- Files in `.agents/` define task-specific behaviour for agents, personas, and skills
- If guidance overlaps, follow both where possible; if there is conflict, prefer `AGENTS.md`

## Invocation examples

- Use the reviewer agent: "Use `.agents/code-reviewer.agent.md` to review my current changes"
- Run an Alan review: "Read `.agents/personas/alan.md` and review as Alan"
- Apply alanisms guidance: "Read `.agents/skills/standards/alanisms.md` before editing"
