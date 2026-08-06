# Hero/OG Image Verification — zone0landscaping.com

*Generated 2026-08-05. Read-only verification — no files, branches, or worktrees were modified, committed, pushed, or deployed.*

## Verification Results

| Check | Path referenced | Exists in git tree? | Live HTTP status |
|---|---|---|---|
| **origin/main `3cbbe0e`** — `og:image` | `assets/images/berkeley-house-hero.jpg` | Yes (blob `a0e3bd9`, 694,030 bytes) | **200 OK** |
| **origin/main `3cbbe0e`** — hero `<img>` | `assets/images/Screenshot 2026-08-03 at 10.33.46 PM.jpg` | Yes (blob `7c75cca`, 2,907,056 bytes) | **200 OK** |
| **local main `3a32651`** — `og:image` | `assets/images/Houses/Berkeley House.jpg` (same blob `a0e3bd9`, just renamed) | Yes, in local commit | **404** (not pushed yet) |
| **local main `3a32651`** — hero `<img>` | `assets/images/Houses/Hill House.jpg` (same blob `7c75cca`, just renamed) | Yes, in local commit | **404** (not pushed yet) |
| **Live page fetch** | Confirms production HTML currently serves the `3cbbe0e` paths, not the `3a32651` paths | — | matches origin/main |

## Correction to prior report

The earlier [CHANGE-CONTROL-REPORT.md](CHANGE-CONTROL-REPORT.md) was **wrong** on this point. It stated "the live site currently has broken hero/OG image links," trusting `3a32651`'s commit message narrative without checking the actual `origin/main` git tree. Verification shows `3cbbe0e`'s tree is internally consistent — the referenced files exist with matching blob hashes — and both resolve live with `200 OK`. The 404s described in the commit message applied to some local/working-directory state before the rename+fix were committed together, not to any state that was ever pushed to `origin/main`.

## Conclusion

**LIVE WORKING**

Production currently serves correctly. `3a32651` remains safe to push (it's an atomic rename+reference-update, so it won't break anything), but there is no active outage — the prior report's "currently broken live" claim should be disregarded.
