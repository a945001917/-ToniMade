# Project Constitution (claude.md)

## Data Schemas
- *To be defined once the Blueprint is approved.*

## Behavioral Rules
1. **Deterministic Logic**: LLMs are probabilistic; business logic must be deterministic. Use Layer 3 tools for logic.
2. **Data-First**: Define schema in `gemini.md` before any coding.
3. **Self-Annealing**: Always analyze stack traces and update SOPs on failure.
4. **Environment Hygeine**: Use `.env` for secrets; `.tmp/` for intermediates.

## Architectural Invariants
- **A.N.T. 3-Layer Architecture**:
    - Layer 1: Architecture (Docs)
    - Layer 2: Navigation (Decision)
    - Layer 3: Tools (Python Scripts)
- **Protocol 0 Compliance**: Memory files must be updated after every meaningful task.
