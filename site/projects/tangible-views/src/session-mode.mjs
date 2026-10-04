import {decodeWorkspaces, encodeWorkspaces, saveAttempt} from './workspace.mjs';

// Demonstrations never read, write or submit into the learner's workspace.
export const getSessionMode = search =>
  new URLSearchParams(search).get('mode') === 'demo' ? 'demo' : 'practice';
export const restoreSession = (mode, raw) => decodeWorkspaces(mode === 'demo' ? null : raw);
export const submitInSession = (mode, entry, task) =>
  mode === 'practice' ? saveAttempt(entry, task) : false;
export function persistSession(mode, storage, entries, taskId) {
  if (mode !== 'practice') return 'demo';
  try {
    storage.setItem('tangible-views.workspace.v1', encodeWorkspaces(entries, taskId));
    return 'saved';
  } catch { return 'unavailable'; }
}

// A separate target illustrates ambiguity without revealing task 8's answers.
export const AMBIGUITY_EXAMPLES = [
  {name: '示例一', heightMap: [[3,1,0],[1,3,0],[0,0,0]]},
  {name: '示例二', heightMap: [[1,3,0],[3,1,0],[0,0,0]]},
];
