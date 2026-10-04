import {languageFrom,languageURL,getLanguage,setLanguage,localize} from './i18n.mjs';
setLanguage(languageFrom(location.search));
import {TASKS,STAGES,project,compare,emptyMap,adjustStack} from './core.mjs';
import {projection,iso,DEFAULT_CAMERA} from './draw.mjs';
import {shouldReflect} from './feedback.mjs';
import {BuildingScene,closeOutsideMenus} from './scene.mjs';
import {hydrateIcons,icon} from './icons.mjs';
import {commitBuild,undoBuild,redoBuild,taskProgress} from './workspace.mjs';
import {getSessionMode,restoreSession,submitInSession,persistSession,AMBIGUITY_EXAMPLES} from './session-mode.mjs';
const $=s=>document.querySelector(s);
const storageKey='tangible-views.workspace.v1';
const mode=getSessionMode(location.search),isDemo=mode==='demo';
let raw=null;try{if(!isDemo)raw=localStorage.getItem(storageKey);}catch{/* The session remains usable when storage is blocked. */}
const restored=restoreSession(mode,raw);
const sessions=restored.entries;
let task=TASKS.find(t=>t.id===restored.taskId),selected=[0,0],tool='add',showDifferences=false,xray=false,toastTimer;
const entry=()=>sessions.get(task.id),viewNames={top:'俯视图',front:'正视图',right:'右视图'};
const stackName=(r,c)=>String.fromCharCode(65+c)+(r+1);
const cubeCount=h=>h.flat().reduce((a,b)=>a+b,0);
const viewsMatched=result=>3-new Set(result.mismatches.map(m=>m.view)).size;
const presets={iso:DEFAULT_CAMERA,top:{yaw:-90,pitch:90},front:{yaw:-90,pitch:0},right:{yaw:0,pitch:0}};
hydrateIcons();
const scene=new BuildingScene($('#model'),{
  getState:()=>({heightMap:entry().state.heightMap,selected,tool,xray}),
  onAction:({r,c,action})=>adjust(r,c,action==='remove'||tool==='remove'?-1:1),
  onCamera:camera=>{
    $('#zoom-label').textContent=`${Math.round(camera.zoom*100)}%`;
    $('#zoom-in').disabled=camera.zoom>=1.499;$('#zoom-out').disabled=camera.zoom<=.651;
    let cameraName='自由视角';
    for(const b of document.querySelectorAll('[data-view]')){
      const p=presets[b.dataset.view],angle=((camera.yaw-p.yaw)%360+540)%360-180;
      const active=Math.abs(angle)<.5&&Math.abs(camera.pitch-p.pitch)<.5;
      b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);
      if(active)cameraName={iso:'立体视角',top:'俯视 · 从上方看',front:'正视 · 从前方看',right:'右视 · 从右侧看'}[b.dataset.view];
    }
    $('#camera-label').textContent=cameraName;localize($('#camera-label'));
  }
});
function persist(){
  let status;try{status=persistSession(mode,isDemo?null:localStorage,sessions,task.id);}catch{status='unavailable';}
  $('#save-status').textContent={saved:'进度已保存',demo:'示例修改不保存',unavailable:'本次进度暂未保存'}[status];localize($('#save-status'));
}
function toast(text){clearTimeout(toastTimer);$('#build-notice').textContent=text;$('#build-notice').hidden=!text;localize($('#build-notice'));if(text)toastTimer=setTimeout(()=>{$('#build-notice').hidden=true;},2400);}
function closeMenus(){document.querySelectorAll('details.menu[open]').forEach(d=>d.open=false);}
function setPage(page){scene.cancel();document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==page);closeMenus();window.scrollTo({top:0});}
function createExerciseList(){
  $('#exercise-list').innerHTML=STAGES.map(stage=>`<section class="exercise-group"><h3>${stage.title}</h3>${TASKS.map((t,i)=>({t,i})).filter(({t})=>t.stage===stage.id).map(({t,i})=>`<button type="button" class="exercise-item" data-task-id="${t.id}" aria-current="false"><span class="exercise-number">${String(i+1).padStart(2,'0')}</span><span class="exercise-text"><strong>${t.title}</strong></span><span class="exercise-check" aria-hidden="true"></span></button>`).join('')}</section>`).join('');
}
function renderCourse(){
  let completed=0;
  for(const t of TASKS){
    const p=taskProgress(sessions.get(t.id),t),button=$(`[data-task-id="${t.id}"]`),active=t.id===task.id;
    if(p.completed)completed++;
    button.classList.toggle('active',active);button.setAttribute('aria-current',active?'step':'false');
    button.classList.toggle('completed',p.completed);
    const status=isDemo?'示例':p.completed?'已完成':p.started?'练习中':'未开始';
    button.querySelector('.exercise-check').textContent=p.completed?'✓':'';
    button.setAttribute('aria-label',`第 ${TASKS.indexOf(t)+1} 题，${t.title}，${t.solutionCount===1?'唯一解':'多解题'}，${status}`);
  }
  $('#course-progress').textContent=`已完成 ${completed} / ${TASKS.length}`;
  $('#course-progress-bar').max=TASKS.length;$('#course-progress-bar').value=completed;
}
function showAmbiguityExample(){
  const examples=AMBIGUITY_EXAMPLES;
  $('#ambiguity-examples').innerHTML=examples.map(sample=>`<figure><figcaption>${sample.name} · ${cubeCount(sample.heightMap)} 个方块</figcaption><div class="example-model">${iso(sample.heightMap,{tool:'orbit',selected:[-1,-1],previewLayer:false})}</div><div class="example-heights"><span>从上方看<br>数字为层数</span><table aria-label="${sample.name}的每格层数"><tbody>${[1,0].map(r=>`<tr><th scope="row">${r===1?'后排':'前排'}</th>${[0,1].map(c=>`<td>${sample.heightMap[r][c]}</td>`).join('')}</tr>`).join('')}</tbody></table></div></figure>`).join('');
  const target=project(examples[0].heightMap);
  $('#ambiguity-views').innerHTML=['top','front','right'].map(v=>`<figure>${projection(v,target[v])}<figcaption>${viewNames[v]}</figcaption></figure>`).join('');
  scene.cancel();closeMenus();localize($('#ambiguity-dialog'));$('#ambiguity-dialog').showModal();
}
function render(placed=null){
  const e=entry(),s=e.state,target=project(task.reference),result=compare(s.heightMap,target),count=cubeCount(s.heightMap),matches=viewsMatched(result),progress=taskProgress(e,task);
  $('#activity-index').textContent=`${TASKS.indexOf(task)+1} / ${TASKS.length}`;
  $('#task-title').textContent=task.title;
  $('#task-description').textContent=task.description;
  $('#task-kind').textContent=task.solutionCount===1?'唯一解':'多解题';
  $('#task-rule').textContent=!isDemo&&task.requiredSolutions>1?'找出两种不同搭法':'';
  $('#task-rule').hidden=!$('#task-rule').textContent;
  $('#why-multiple').hidden=task.solutionCount===1;
  $('#task-progress').textContent=progress.completed?'✓ 已完成':task.requiredSolutions>1?`已找到 ${progress.correctCount} / ${progress.required} 种`:'';
  $('#exercise-result').hidden=isDemo||(!progress.completed&&task.requiredSolutions===1);
  $('#xray-toggle').setAttribute('aria-pressed',xray);
  $('#xray-toggle').classList.toggle('active',xray);
  $('#next-task').hidden=!progress.completed||TASKS.indexOf(task)===TASKS.length-1;
  scene.render(placed);
  $('#cube-count').textContent=`共 ${count} 个方块`;
  $('#empty-message').hidden=count>0;
  $('#height-grid').innerHTML=[2,1,0].map(r=>[0,1,2].map(c=>`<button data-r="${r}" data-c="${c}" aria-label="选择 ${stackName(r,c)} 方格，当前 ${s.heightMap[r][c]} 层" aria-pressed="${selected[0]===r&&selected[1]===c}" class="${s.heightMap[r][c]>0?'occupied ':''}${selected[0]===r&&selected[1]===c?'selected':''}">${s.heightMap[r][c]}</button>`).join('')).join('');
  $('#selected-label').textContent=stackName(...selected);const value=s.heightMap[selected[0]][selected[1]];
  $('#selected-height').textContent=value;$('#minus').disabled=value===0;$('#plus').disabled=value===3;
  $('#undo').disabled=!e.undo.length;$('#redo').disabled=!e.redo.length;$('#clear-board').disabled=count===0;
  $('#attempts').textContent=e.saved.length;
  $('#view-score').textContent=`相符 ${matches} / 3`;$('#view-score').classList.toggle('complete',matches===3);
  $('#comparison-rows').innerHTML=['top','front','right'].map(v=>{
    const match=!result.mismatches.some(m=>m.view===v);
    return `<div class="comparison-row ${showDifferences&&!match?'hinted-row':''}"><div class="view-name">${viewNames[v]}<span class="view-status ${match?'match':''}">${match?'相符':'待调整'}</span></div><div class="projection" aria-label="题目${viewNames[v]}">${projection(v,target[v])}</div><div class="projection" aria-label="当前${viewNames[v]}">${projection(v,result.projections[v],showDifferences?target[v]:null,{current:true})}</div></div>`;
  }).join('');
  const currentSubmitted=e.saved.some(h=>JSON.stringify(h)===JSON.stringify(s.heightMap));
  const title=matches===3?'三个视图均相符':count===0?'请开始搭建':`还有 ${3-matches} 个视图需要调整`;
  let description=matches===3&&task.requiredSolutions>1&&currentSubmitted&&!progress.completed?'再找一种不同搭法':'';
  $('#feedback').innerHTML=`<strong>${title}</strong>${description?`<p>${description}</p>`:''}`;
  $('#feedback-panel').className='feedback-panel'+(matches===3?' success':'');$('#feedback-icon').textContent=matches===3?'✓':'';
  $('#check').disabled=count===0;$('#hint').disabled=matches===3&&!showDifferences;
  $('#hint-label').textContent=showDifferences?'收起提示':'提示';
  $('#hint').setAttribute('aria-pressed',showDifferences);
  $('#hint-legend').hidden=!showDifferences||matches===3;
  $('#reflection').hidden=isDemo||!shouldReflect(e,target);
  $('#reflection-question').textContent=task.reflection;
  document.querySelectorAll('[data-tool]').forEach(b=>{const active=b.dataset.tool===tool;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
  $('#scene-instruction').textContent=tool==='orbit'?'拖动旋转 · 右键移除':xray?'点选底板格子 · 右键移除':tool==='remove'?'点击移除 · 拖动旋转':'左键添加 · 右键移除 · 拖动旋转';
  $('#attempt-history').innerHTML=e.saved.length?e.saved.map((h,i)=>{const passed=compare(h,target).status==='match';return `<button class="attempt-chip ${passed?'passed':''}" data-attempt="${i}" title="载入方案 ${i+1}" aria-label="载入方案 ${i+1}，${cubeCount(h)} 个方块${passed?'，三个视图均相符':''}">${passed?'✓':icon('cube')} 方案 ${i+1}<small>${cubeCount(h)} 个</small></button>`;}).join(''):'暂无记录。提交答案后可以重新载入。';
  renderCourse();localize(document);
}
function edit(h,placed=null){if(!commitBuild(entry(),h))return false;persist();render(placed);return true;}
function adjust(row,col,delta){
  selected=[row,col];const result=adjustStack(entry().state.heightMap,row,col,delta);
  if(result.changed){edit(result.heightMap,delta>0?{r:row,c:col,z:result.heightMap[row][col]-1}:null);}else{toast(result.notice);render();}
}
function setTask(index){scene.cancel();task=TASKS[index];selected=[0,0];showDifferences=false;xray=false;$('#sample').innerHTML='<option value="initial">待完成的搭法</option>'+task.samples.map((v,i)=>`<option value="${i}">${v.name}</option>`).join('');setPage('workspace');render();scene.reset();persist();}
function setTool(next){scene.cancel();tool=next;render();}
function undo(){if(undoBuild(entry())){persist();render();toast('已撤销上一次修改。');}}
function redo(){if(redoBuild(entry())){persist();render();toast('已重做。');}}
$('#height-grid').addEventListener('click',e=>{const t=e.target.closest('[data-r]');if(!t)return;selected=[Number(t.dataset.r),Number(t.dataset.c)];render();$('#height-grid').querySelector(`[data-r="${selected[0]}"][data-c="${selected[1]}"]`).focus();});
for(const[id,delta]of[['plus',1],['minus',-1]])$('#'+id).onclick=()=>adjust(...selected,delta);
for(const b of document.querySelectorAll('[data-tool]'))b.onclick=()=>setTool(b.dataset.tool);
$('#undo').onclick=undo;$('#redo').onclick=redo;
$('#clear-board').onclick=()=>{if(edit(emptyMap()))toast('底板已清空，可点击撤销恢复。');};
$('#check').onclick=()=>{
  if(isDemo)return;
  const correct=compare(entry().state.heightMap,project(task.reference)).status==='match',saved=submitInSession(mode,entry(),task);
  persist();render();document.querySelector('.saved-builds').open=true;
  const progress=taskProgress(entry(),task);
  toast(!saved?'这个搭法已提交，不会重复计数。':!correct?'还有视图未相符，已保留本次搭建。':progress.completed?'回答正确，本题已完成。':`已提交 ${progress.correctCount} 种正确搭法，请再找一种不同搭法。`);
};
$('#attempt-history').onclick=e=>{const b=e.target.closest('[data-attempt]');if(!b)return;const h=entry().saved[Number(b.dataset.attempt)];if(edit(h))toast('已载入保存的方案。');};
$('#hint').onclick=()=>{showDifferences=!showDifferences;render();};
$('#xray-toggle').onclick=()=>{scene.cancel();xray=!xray;render();if(xray)scene.setView({pitch:55});};
$('#load-sample').onclick=()=>{if(!isDemo)return;const v=$('#sample').value;edit(v==='initial'?task.initial:task.samples[Number(v)].heightMap);closeMenus();toast('示例已载入，可继续修改。');};
$('#home-view').onclick=()=>scene.reset();$('#zoom-in').onclick=()=>scene.zoomBy(.1);$('#zoom-out').onclick=()=>scene.zoomBy(-.1);
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{xray=false;render();scene.setView(presets[b.dataset.view]);};
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>setPage(b.dataset.tab);
$('#exercise-list').onclick=e=>{const b=e.target.closest('[data-task-id]');if(b)setTask(TASKS.findIndex(t=>t.id===b.dataset.taskId));};
$('#next-task').onclick=()=>{const next=TASKS.indexOf(task)+1;if(next<TASKS.length)setTask(next);};
$('#why-multiple').onclick=showAmbiguityExample;$('#close-ambiguity').onclick=()=>$('#ambiguity-dialog').close();
$('#help-button').onclick=()=>{scene.cancel();closeMenus();$('#help-dialog').showModal();};$('#close-help').onclick=()=>$('#help-dialog').close();
$('#about-button').onclick=()=>{scene.cancel();closeMenus();$('#about-dialog').showModal();};$('#close-about').onclick=()=>$('#about-dialog').close();
for(const dialog of document.querySelectorAll('dialog'))dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}};
document.addEventListener('click',e=>closeOutsideMenus(e,document.querySelectorAll('details.menu[open]')));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){scene.cancel();closeMenus();}
  if($('#workspace').hidden||document.querySelector('dialog[open]')||e.target.closest('input,select,textarea,[contenteditable="true"]')||e.altKey)return;
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();return;}
  if(!e.metaKey&&!e.ctrlKey&&['1','2','3'].includes(e.key)){e.preventDefault();setTool({'1':'add','2':'remove','3':'orbit'}[e.key]);}
});
document.body.dataset.mode=mode;
$('#mode-switch').href=languageURL(isDemo?'?':'?mode=demo',getLanguage());
$('#mode-switch').textContent=isDemo?'返回练习':'示例讲解';
$('#mode-label').hidden=!isDemo;
$('#save-status').hidden=isDemo;
$('#course-progress').hidden=isDemo;
$('#course-progress-bar').hidden=isDemo;
$('.example-menu').hidden=!isDemo;
$('#check').hidden=isDemo;
$('#exercise-result').hidden=isDemo;
$('.saved-builds').hidden=isDemo;
function updateLanguage(){
 document.documentElement.lang=getLanguage();
 $('#language-switch').textContent=getLanguage()==='en'?'中文':'English';
 $('#language-switch').setAttribute('aria-label',getLanguage()==='en'?'Switch to Chinese':'Switch to English');
 $('#mode-switch').href=languageURL(isDemo?'?':'?mode=demo',getLanguage());
 document.querySelector('a[href^="project-notes.html"]').href=languageURL('project-notes.html',getLanguage());
 localize(document);
}
$('#language-switch').onclick=()=>{
 scene.cancel();setLanguage(getLanguage()==='en'?'zh-CN':'en');
 history.replaceState(null,'',languageURL(location.pathname+location.search+location.hash,getLanguage()));
 render();updateLanguage();
};
createExerciseList();setTask(TASKS.indexOf(task));updateLanguage();
