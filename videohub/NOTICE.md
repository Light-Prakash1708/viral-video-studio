# About this copy
Fork of VideoHub by TensaikunYT (https://github.com/TensaikunYT/Videohub, MIT licence, see LICENSE), commit 64e8ee7.

Changes in this fork (work in progress, NOT installed):
- `server/platform.js`: a macOS/Linux layer replacing the Windows-only parts. It covers Chrome discovery, Finder/xdg-open, the Trash instead of the Recycle Bin, notifications, the folder picker, GPU names, the process list, process-group kill, pause/resume by signals and low-priority renders.
- VideoToolbox encoder for Macs (`encoders.js`, film templates).
- The call sites in hub, jobs, janitor, guard, pickfolder, ramhogs, outputs, ciktilar and open-file now go through platform.js.
- `package.json` allows darwin and linux. Windows-only tests are skipped elsewhere; there are posix tests in `server/platform.test.js`.

Status: Linux test run 169 pass / 2 fail (one janitor test that also fails on the original under Linux, and one new posix workspace test still to fix). It is untested on a real Mac. There is no setup.sh or uninstall.sh yet.
