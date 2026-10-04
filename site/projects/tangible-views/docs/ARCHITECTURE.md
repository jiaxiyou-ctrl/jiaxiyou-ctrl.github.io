# Architecture

## Model

The board is a 3 × 3 height map. Each cell stores an integer from 0 to 3; stacks are continuous, with no floating cubes or internal gaps. One model supplies the 3D drawing, orthographic views, feedback and saved work.

- **Top:** whether each board cell is occupied.
- **Front:** the maximum height in each column, looking from front to back.
- **Right:** the maximum height in each row, ordered from front to back.

Views are occupancy silhouettes with unit-cell boundaries. Rotating the scene changes the camera, not the board axes or answer.

## Interaction

A pointer hit selects a stack. Hover previews the next height; a click changes the model. A drag rotates the camera. Right-click or Shift-click removes the top cube. X-ray editing places all nine board targets above the faded drawing, so surrounding stacks cannot block a cell.

An edit updates the views and visual hints together. Undo and redo restore snapshots. Submitted builds are deduplicated by their height maps; completion depends on matching the target views, not matching a single reference build.

## Modules

| File | Responsibility |
|---|---|
| `src/core.mjs` | Geometry, projections, exercises and solution enumeration |
| `src/draw.mjs` | SVG geometry and orthographic drawings |
| `src/scene.mjs` | Pointer gestures, previews and camera |
| `src/workspace.mjs` | Undo/redo, submissions and saved state |
| `src/session-mode.mjs` | Practice and example-mode isolation |
| `src/feedback.mjs` | Reflection eligibility |
| `src/i18n.mjs` | English copy, language URLs and reversible text updates |
| `src/app.mjs` | Interface and coordinated updates |

## Language and storage

`?lang=en` opens English; `?lang=zh-CN` opens Chinese. Both use the same exercises and workspace. Switching language changes text without reloading or clearing the undo history. `?mode=demo` runs examples in memory and never reads or writes practice progress.

Practice uses browser local storage. It does not sync between devices or server origins. The app has no backend service, account system or camera connection.

## Verification

`npm test` checks projections against hand-worked fixtures and an independent voxel algorithm over all 4⁹ allowed states. Further checks cover multi-solution tasks, persistence, gesture handling and language strings. Browser checks cover rendered controls and workflows; see [the verification record](UI-CHECKS.md).

These are software checks. Classroom usability and learning outcomes require a separate study.
