import {TASKS,copy,emptyMap,validateMap,createSession,changeMap,checkSession,project,compare} from './core.mjs';
const limit=50;
const valid=h=>{const v=validateMap(h);return v.valid&&v.complete;};
export const newWorkspace=task=>({state:changeMap(createSession(task),emptyMap()),undo:[],redo:[],saved:[]});
export function commitBuild(entry,map){
  if(!valid(map))throw new Error('Virtual construction needs a complete valid board.');
  if(JSON.stringify(map)===JSON.stringify(entry.state.heightMap))return false;
  entry.undo.push(copy(entry.state.heightMap));entry.undo=entry.undo.slice(-limit);entry.redo=[];
  entry.state=changeMap(entry.state,map);return true;
}
export function undoBuild(entry){
  const map=entry.undo.pop();if(!map)return false;
  entry.redo.push(copy(entry.state.heightMap));entry.state=changeMap(entry.state,map);return true;
}
export function redoBuild(entry){
  const map=entry.redo.pop();if(!map)return false;
  entry.undo.push(copy(entry.state.heightMap));entry.state=changeMap(entry.state,map);return true;
}
export function saveAttempt(entry,task){
  const key=JSON.stringify(entry.state.heightMap);
  if(entry.saved.some(s=>JSON.stringify(s)===key))return false;
  entry.state=checkSession(entry.state,project(task.reference));entry.saved.push(copy(entry.state.heightMap));return true;
}
export function encodeWorkspaces(entries,taskId){
  return JSON.stringify({version:1,taskId,tasks:Object.fromEntries([...entries].map(([id,e])=>[id,{map:e.state.heightMap,undo:e.undo,redo:e.redo,saved:e.saved}]))});
}
export function decodeWorkspaces(raw){
  const entries=new Map(TASKS.map(t=>[t.id,newWorkspace(t)]));let taskId=TASKS[0].id,restored=false;
  try{
    const data=JSON.parse(raw);if(data?.version!==1)return {entries,taskId,restored};
    for(const task of TASKS){
      const value=data.tasks?.[task.id];if(!value||!valid(value.map))continue;
      const e=newWorkspace(task);e.state=changeMap(e.state,value.map);
      for(const key of ['undo','redo','saved']){
        if(Array.isArray(value[key]))e[key]=value[key].filter(valid).slice(key==='saved'?0:-limit).map(copy);
      }
      e.saved=[...new Map(e.saved.map(h=>[JSON.stringify(h),h])).values()];
      e.state.attempts=new Set(e.saved.map(h=>JSON.stringify(h)));entries.set(task.id,e);restored=true;
    }
    if(TASKS.some(t=>t.id===data.taskId))taskId=data.taskId;
  }catch{/* An absent, blocked or malformed local save starts a usable fresh workspace. */}
  return {entries,taskId,restored};
}

// Progress comes from distinct, submitted correct boards. Reopening, changing
// or clearing the current board does not erase an earlier completed exercise.
export function taskProgress(entry,task){
  const target=project(task.reference),required=task.requiredSolutions??1;
  const correct=new Set(entry.saved.filter(h=>compare(h,target).status==='match').map(h=>JSON.stringify(h)));
  return {correctCount:correct.size,required,completed:correct.size>=required,started:entry.saved.length>0||entry.state.heightMap.flat().some(v=>v>0)};
}
