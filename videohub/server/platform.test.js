import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { openPlanFor, findTool, APP_DATA, IS_WIN, IS_MAC } from './platform.js';
import { openPlan } from './open-file.js';
import { checkWorkspacePosix } from '../scripts/init-config.mjs';
const posix = { skip: IS_WIN && 'macOS/Linux only' };

test('open/reveal uses open -R on macOS and xdg-open on Linux, never a shell', posix, () => {
  const f = path.join(os.tmpdir(), 'vh plat test.mp4'); fs.writeFileSync(f, '');
  const p = openPlan(f, 'folder');
  if (IS_MAC) assert.deepEqual([p.command, p.args], ['open', ['-R', f]]); else assert.deepEqual([p.command, p.args], ['xdg-open', [path.dirname(f)]]);
  const q = openPlanFor(f, false); assert.equal(q.args.at(-1), f);
  fs.unlinkSync(f);
});
test('workspace check on macOS/Linux: absolute or ~ paths, not / or home, not inside the install', posix, () => {
  assert.equal(checkWorkspacePosix('~/VideoHub-test-x'), null);
  assert.match(checkWorkspacePosix('relative/dir'), /full path/);
  assert.match(checkWorkspacePosix('/'), /not the whole disk/);
  assert.match(checkWorkspacePosix(os.homedir()), /home folder/);
  assert.match(checkWorkspacePosix(path.join(process.cwd(), 'films'), process.cwd()), /outside the VideoHub/);
});
test('tools and app data resolve to real places', posix, () => {
  assert.ok(findTool('ffmpeg')); assert.ok(path.isAbsolute(APP_DATA));
});
