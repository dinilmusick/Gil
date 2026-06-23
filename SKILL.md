---
name: dea_guide
description: Detailed reference for the DeaTS Protocol, Engineering Constraints, structural checklists, and integration testing frameworks.
---

# DeaTS Project Protocol & Engineering Constraints

This document defines the strict architectural and quality requirements for this project. Adherence to these rules is mandatory for system integrity, automated orchestration, and long-term maintainability.

## 1. Project Organization (Atomic Entity Model)
Projects MUST follow a nested, component-based hierarchy. This structure ensures that every piece of logic is isolated, discoverable, and easily swappable.

- **Root Directory**: Must contain `dea.json`, `package.json`, and `tsconfig.json`.
- **`src/entities/`**: Primary domain components. Each entity is a folder containing:
    - `EntityName.ts`: The class definition extending `krnlEntityBase`.
    - `functionalities/`: Logic atoms belonging to this entity.
- **`src/libraries/`**: Reusable logic concepts. Folder naming convention: `NameConcepts/`.
    - Contains `NameConcepts.ts` (Exporting `DATA` and `FUNCTIONS` objects).
- **`exhibits/`**: Self-contained demonstration and test scripts (naming: `NameExhibit.ts`).

## 2. Functionality (Atom) Structure & Type Safety
A Functionality (e.g., `StockUpdate`) must occupy its own directory with a fixed sub-structure to ensure protocol parity and **Strict Validation**:

- `src/entities/X/functionalities/StockUpdate/`
    - `StockUpdateAtom.ts`: Descriptor linking logic, state, and **Zod Schema**.
    - `main_function/`:
        - `logic.ts`: The core implementation (`export const main = ...`) AND the contract (`export const schema = ...`).
    - `state_data/`:
        - `state.ts`: Initial state definition.
    - `helpers/`: (Optional) Supplemental private logic files.
    - `events/`: (Optional) Event handler definitions.

## 3. Logic Implementation Rules
The following rules apply to all code injected via `EditLogic`:

- **Import Management**:
    - **NO MANUAL IMPORTS**: Developers are forbidden from writing `import` statements directly in logic files.
    - **Declarative Dependencies**: All external or library dependencies MUST be managed via the DeaTS `AddImportToAsset` or `AddLocalImportToAsset` endpoints.
- **Function Signature**:
    - All main logic MUST follow: `export const main = async (input: any, { state, emitters, functionality, caller }: any) => { ... }`.
- **State Modification**:
    - State is shared and mutable. Logic should directly modify the `state` object.
- **Symbol Validation**:
    - All library calls MUST be prefixed: `DATA.Name` or `FUNCTIONS.Name`.

## 4. Quality & Security Guards (Crucial)
To maintain a high-quality codebase, DeaTS enforces several rolling constraints:

- **Line Count Rule (The "5-Line" Rule)**: 
    - Functions should ideally not exceed **5-10 lines of complex logic**. 
    - If a logic block becomes too long, it MUST be refactored into **Helper Functions** (within the functionality folder) or **Libraries** (for cross-entity reuse).
    - This keeps the "Bricks" of the system atomic and readable.
- **Testing Threshold**: 
    - In the `Implementation Stage` stage, every logic edit MUST be accompanied by at least **5 unit tests**.
    - Tests are defined as an array of objects: `{ input: {}, expected: {} }`.
    - **Subset Matching**: Unit tests only require the `expected` value to match a portion of the actual result/state.

## 5. Progress Tracking (dea.json)
The `dea.json` file is the **Source of Truth** for the project's health and stage. It tracks:
- **Current Stage**: (e.g., `Drafting Stage` vs `Implementation Stage`).
- **Asset Inventory**: Which assets are "Bones" (skeletons) and which are "Implemented" (bricks).
- **Test Coverage**: Tracks untested endpoints to ensure 100% system-wide coverage.
- **NEVER MANUALLY DELETE THIS FILE**.

## 6. State & Data Handling
- **Map Object Support**: `Map` objects are fully supported but must be serialized/hydrated correctly for RPC using the `{ "_type": "Map", "data": { ... } }` marker.
- **Build Target**: Always build for ESM/CJS compatibility using `tsup`.
