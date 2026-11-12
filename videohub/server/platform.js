// Platform layer (macOS / Linux / Windows). Everything that used a Windows API in the original VideoHub goes
// through here, so the rest of the server is platform-neutral. Added for the cross-platform fork (see NOTICE.md).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';

export const IS_WIN = process.platform === 'win32';
export const IS_MAC = process.platform === 'darwin';
export const IS_LINUX = process.platform === 'linux';
const HOME = os.homedir();

// per-user app data folder (the guard's state lived in %APPDATA%\RenderGuard on Windows)
export const APP_DATA = IS_WIN ? (process.env.APPDATA || path.join(HOME, 'AppData', 'Roaming'))
  : IS_MAC ? path.join(HOME, 'Library', 'Application Support') : (process.env.XDG_CONFIG_HOME || path.join(HOME, '.config'));

const exists = f => { try { return !!f && fs.existsSync(f); } catch { return false; } };
function which(name) {
  for (const d of (process.env.PATH || '').split(path.delimiter)) { const f = path.join(d, name); if (d && exists(f)) return f; }
  return null;
}

// a Chromium-family browser for renders and the app window
export function findBrowser() {
  if (process.env.VIDEOHUB_BROWSER && exists(process.env.VIDEOHUB_BROWSER)) return process.env.VIDEOHUB_BROWSER;
  const c = IS_WIN ? ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', path.join(HOME, 'AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe']
    : IS_MAC ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', path.join(HOME, 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
      '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
      : ['/opt/pw-browsers/chromium', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium'];
  for (const f of c) if (exists(f)) return f;
  // Playwright's own Chromium (installed by `npx playwright install chromium`)
  const pw = IS_MAC ? path.join(HOME, 'Library/Caches/ms-playwright') : path.join(HOME, '.cache/ms-playwright');
  try {
    for (const d of fs.readdirSync(pw).filter(n => n.startsWith('chromium')).sort().reverse()) {
      for (const sub of ['chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium', 'chrome-linux/chrome', 'chrome-linux64/chrome']) {
        const f = path.join(pw, d, sub); if (exists(f)) return f;
      }
    }
  } catch { }
  return null;
}

// ffmpeg / ffprobe (Homebrew paths on macOS are not always on a GUI app's PATH)
export function findTool(name) {
  const exe = IS_WIN ? name + '.exe' : name;
  return which(exe) || [IS_WIN ? 'C:\\ffmpeg\\bin\\' + exe : null, '/opt/homebrew/bin/' + name, '/usr/local/bin/' + name, '/usr/bin/' + name].find(exists) || name;
}

function detached(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    let c; try { c = spawn(cmd, args, { detached: true, stdio: 'ignore', windowsHide: true, ...opts }); } catch (e) { return reject(e); }
    c.once('error', reject); c.once('spawn', () => { c.unref(); resolve(); });
  });
}

// open a file/folder with the system's default app, or reveal it (select it) in Finder / the file manager
export function openPath(target, { select = false } = {}) {
  if (IS_WIN) return detached('explorer.exe', [select ? `/select,"${target}"` : `"${target}"`], { windowsVerbatimArguments: true });
  if (IS_MAC) return detached('open', select ? ['-R', target] : [target]);
  return detached('xdg-open', [select ? path.dirname(target) : target]);
}
export function openPlanFor(target, select) {
  if (IS_WIN) return { command: 'explorer.exe', args: [select ? '/select,"' + target + '"' : '"' + target + '"'] };
  if (IS_MAC) return { command: 'open', args: select ? ['-R', target] : [target] };
  return { command: 'xdg-open', args: [select ? path.dirname(target) : target] };
}

// open the VideoHub UI as an app window (Chrome --app), else in the default browser
export function openAppWindow(url) {
  const b = findBrowser();
  if (b && !/pw-browsers|ms-playwright/.test(b)) return detached(b, ['--app=' + url]);
  if (IS_WIN) return detached('cmd', ['/c', 'start', '', url]);
  if (IS_MAC) return detached('open', [url]);
  return detached('xdg-open', [url]);
}

// desktop notification (render finished / failed)
export function notify(title, body) {
  if (process.env.VIDEOHUB_NO_WINDOW) return;
  const clip = s => String(s || '').slice(0, 200);
  try {
    if (IS_MAC) {
      const q = s => '"' + clip(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      spawn('osascript', ['-e', `display notification ${q(body)} with title ${q(title)}`], { stdio: 'ignore', detached: true }).unref();
    } else if (IS_LINUX) {
      if (which('notify-send')) spawn('notify-send', [clip(title), clip(body)], { stdio: 'ignore', detached: true }).unref();
    }
  } catch { }
}

// move files/folders to the Trash (never delete outright). Resolves to [{path, ok, code}] — code mirrors the Windows
// Recycle Bin codes the janitor understands: 0 ok, -1 failed, -3 no trash available.
export async function trash(paths) {
  const out = [];
  for (const p of paths) {
    let ok = false, code = -1;
    try {
      if (IS_MAC) {
        // Finder keeps "Put Back" working; fall back to a plain move into ~/.Trash
        const r = await new Promise(res => execFile('osascript', ['-e', `tell application "Finder" to delete POSIX file ${JSON.stringify(path.resolve(p))}`], { timeout: 60000 }, e => res(!e)));
        if (r) ok = true;
        else { const dst = uniq(path.join(HOME, '.Trash', path.basename(p))); fs.renameSync(p, dst); ok = true; }
      } else if (IS_LINUX) {
        const r = which('gio') ? await new Promise(res => execFile('gio', ['trash', p], { timeout: 60000 }, e => res(!e))) : false;
        if (r) ok = true;
        else {   // freedesktop Trash spec by hand (same filesystem as $HOME only)
          const base = path.join(process.env.XDG_DATA_HOME || path.join(HOME, '.local/share'), 'Trash');
          fs.mkdirSync(path.join(base, 'files'), { recursive: true }); fs.mkdirSync(path.join(base, 'info'), { recursive: true });
          const dst = uniq(path.join(base, 'files', path.basename(p)));
          fs.renameSync(p, dst);
          fs.writeFileSync(path.join(base, 'info', path.basename(dst) + '.trashinfo'), `[Trash Info]\nPath=${encodeURI(path.resolve(p))}\nDeletionDate=${new Date().toISOString().slice(0, 19)}\n`);
          ok = true;
        }
      } else code = -3;
    } catch { ok = false; }
    out.push({ path: p, ok, code: ok ? 0 : code });
  }
  return out;
}
function uniq(f) { if (!exists(f)) return f; const e = path.extname(f), b = f.slice(0, f.length - e.length); for (let i = 2; ; i++) if (!exists(`${b} ${i}${e}`)) return `${b} ${i}${e}`; }

// a folder chooser dialog → absolute path or null
export function pickFolder(prompt = 'Choose a folder') {
  return new Promise(resolve => {
    if (IS_MAC) execFile('osascript', ['-e', `POSIX path of (choose folder with prompt ${JSON.stringify(prompt)})`], { timeout: 600000 }, (e, o) => resolve(e ? null : String(o).trim().replace(/\/$/, '') || null));
    else if (which('zenity')) execFile('zenity', ['--file-selection', '--directory', '--title=' + prompt], { timeout: 600000 }, (e, o) => resolve(e ? null : String(o).trim() || null));
    else if (which('kdialog')) execFile('kdialog', ['--getexistingdirectory', HOME], { timeout: 600000 }, (e, o) => resolve(e ? null : String(o).trim() || null));
    else resolve(null);
  });
}

// graphics card names (for the Settings page)
export function gpuNames() {
  return new Promise(resolve => {
    const done = list => resolve(list.map(s => s.trim()).filter(s => s && !/virtual|basic display|remote|mirror|parsec|idd/i.test(s)));
    if (IS_MAC) execFile('system_profiler', ['SPDisplaysDataType'], { timeout: 15000 }, (e, o) => done(e ? [] : [...String(o).matchAll(/Chipset Model:\s*(.+)/g)].map(m => m[1])));
    else if (IS_LINUX) execFile('sh', ['-c', 'lspci 2>/dev/null | grep -Ei "vga|3d|display" | sed "s/.*: //"'], { timeout: 15000 }, (e, o) => done(e ? [] : String(o).split('\n')));
    else execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', '(Get-CimInstance Win32_VideoController).Name'], { windowsHide: true, timeout: 15000 }, (e, o) => done(e ? [] : String(o).split(/\r?\n/)));
  });
}

// processes with their memory: [{n: name, p: pid, pp: parent pid, m: bytes, h: headless/app-window browser}]
export function processList() {
  return new Promise(resolve => {
    if (IS_WIN) return resolve(null);
    execFile('ps', ['-axo', 'pid=,ppid=,rss=,comm=,args='], { maxBuffer: 32 << 20, timeout: 20000 }, (e, o) => {
      if (e) return resolve(null);
      const rows = [];
      for (const line of String(o).split('\n')) {
        const m = line.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s*(.*)$/); if (!m) continue;
        const comm = path.basename(m[4]);
        rows.push({ p: +m[1], pp: +m[2], m: +m[3] * 1024, n: comm, h: /--headless|--app=http:\/\/127\.0\.0\.1/.test(m[5] || '') });
      }
      resolve(rows);
    });
  });
}

// stop a process and its children (render workers spawn browsers and ffmpeg)
export function killTree(child) {
  if (!child?.pid) return;
  if (IS_WIN) { spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }).on('error', () => { try { child.kill(); } catch { } }); return; }
  try { process.kill(-child.pid, 'SIGTERM'); } catch { try { child.kill('SIGTERM'); } catch { } }
  setTimeout(() => { try { process.kill(-child.pid, 'SIGKILL'); } catch { } }, 4000).unref();
}
// render protection on macOS/Linux: pause / resume a whole render process group, and run it at low priority
export function pauseTree(pid) { try { process.kill(-pid, 'SIGSTOP'); return true; } catch { return false; } }
export function resumeTree(pid) { try { process.kill(-pid, 'SIGCONT'); return true; } catch { return false; } }
export function lowPriority(pid, level = 10) {
  if (IS_WIN || !pid) return;
  try { os.setPriority(pid, level); } catch { }
  // macOS: also move it to the background QoS band so the UI stays smooth (taskpolicy ships with macOS)
  if (IS_MAC) try { spawn('taskpolicy', ['-b', '-p', String(pid)], { stdio: 'ignore' }).on('error', () => { }); } catch { }
}
// spawn options for render children: their own process group on posix so killTree/pauseTree reach every worker
export const GROUP_SPAWN = IS_WIN ? {} : { detached: true };
