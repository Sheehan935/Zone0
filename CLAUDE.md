# Project Control Loop

This is a required workflow for substantial changes in this repository — decisions with real business, product, or technical consequence, not trivial edits. Substantial Claude tasks in this repo should invoke this Project Control Loop before being declared complete.

## 1. DECIDE

Identify the material business/product/technical decision involved in the task. Flag any conflict with a locked decision in `PROJECT-TRUTH.md` before implementation begins — do not implement past a conflict silently.

## 2. IMPLEMENT

Make the change. Do not modify project-control documents (`PROJECT-TRUTH.md`, `TODO.md`) merely to make the work appear complete.

## 3. VERIFY

Verify actual user-visible behavior, including live/external systems where applicable. Static inspection alone (reading source, confirming an element exists in markup) is insufficient for a functional claim — confirm the thing actually works the way a real user would experience it.

## 4. SYNCHRONIZE PROJECT TRUTH

After verification, determine whether the change is material. If it is, update only the authoritative document(s) it actually affects — do not blindly update both documents for every change.

- `PROJECT-TRUTH.md` — locked decisions and authoritative constraints (Section 1), plus the detailed implementation/verification/production-state log behind them (Section 3). Merged from a separate `PROJECT-TRUTH.md` + `docs/PROJECT-STATE.md` on 2026-08-25 specifically because keeping the same fact in sync across two files was causing drift — don't reintroduce that split.
- `TODO.md` — only the active, git-relevant next action(s) (≤3 items). The task source is the **Zone Zero Control Center** (https://claude.ai/code/artifact/4680b1a7-6fc8-483a-9099-a8677789ec92), where exactly one item is marked `Now` and the rest are `Next` or `Done`. As of 2026-09-03 it replaced the Google Drive Tasks spreadsheet, which is now an archive — don't add to that sheet, don't recreate a backlog section here, and don't let a task exist in two places. Retire or rescope stale items that conflict with current decisions.

## 5. FINAL STATE CHECK

Before declaring the task complete, report:

- Decision/change
- Implementation
- Verification
- External systems verified
- Project truth changed
- Documents updated
- Remaining blockers
- Actual next action
- Git status
- HEAD
- origin/main
- Deployment status, when applicable

## 6. COMMIT

Do not commit until implementation, verification, and required project-state synchronization are complete.

## Explicit rules

- An audit is not complete merely because findings were discovered.
- Every material finding must either be fixed and verified, or explicitly recorded as unresolved/blocking.
- Never silently leave a material finding outside project state.
- Never claim functionality works based only on source-code inspection when the actual user-visible behavior can be tested.
- Do not invent or pad "Next" items.
