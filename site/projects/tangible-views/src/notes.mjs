import {TASKS,project,solutions} from './core.mjs';
import {languageFrom,languageURL} from './i18n.mjs';
const lang=languageFrom(location.search),en=lang==='en';
const t=(zh,english)=>en?english:zh;
const count=solutions(project(TASKS.find(task=>task.id==='ambiguity').reference)).length;
document.documentElement.lang=lang;
document.title=t('项目资料 - 立方体搭建','Project notes — Cube Builder');
document.querySelector('#notes-header').innerHTML=`<strong>${t('立方体搭建 · 项目资料','Cube Builder · Project notes')}</strong><div class="header-actions"><a class="header-button language-switch" href="${languageURL('project-notes.html',en?'zh-CN':'en')}">${en?'中文':'English'}</a><a href="${languageURL('index.html',lang)}">${t('返回练习','Back to practice')}</a></div>`;
document.querySelector('#notes-content').innerHTML=`
<nav class="notes-nav"><a href="#principles">${t('实现原理','Implementation')}</a><a href="#validation">${t('软件验证','Verification')}</a><a href="#learning">${t('任务与学习','Learning tasks')}</a></nav>
<section id="principles" class="info-page">
 <div class="page-heading"><div><h1>${t('实现原理','Implementation')}</h1><p>${t('同一份高度表，用于绘制立体图形、计算三视图和检查题目。','One height map drives the 3D drawing, projections and answer checks.')}</p></div></div>
 <div class="pipeline">
  <div><h3>${t('修改搭建','Edit the build')}</h3><p>${t('点击添加或移除方块。','Click to add or remove a cube.')}</p></div><b>→</b>
  <div><h3>${t('更新高度表','Update heights')}</h3><p>${t('记录每格的层数。','Store each stack’s height.')}</p></div><b>→</b>
  <div><h3>${t('计算三视图','Project the views')}</h3><p>${t('计算占格情况与可见高度。','Calculate occupied cells and visible heights.')}</p></div><b>→</b>
  <div><h3>${t('对照题目','Compare')}</h3><p>${t('比较目标，标出差异。','Check the target and highlight differences.')}</p></div>
 </div>
 <div class="info-grid"><article class="info-card"><h2>${t('例子：7 个方块','Example: 7 cubes')}</h2><div class="worked-example"><pre>${t('后排','Back')}     0  0  1
         0  1  2
${t('前排','Front')}    2  1  0</pre><div>
 <h3>${t('俯视图','Top view')}</h3><p>${t('每个方格是否有方块。','Whether each board cell is occupied.')}</p>
 <h3>${t('正视图：2、1、2','Front view: 2, 1, 2')}</h3><p>${t('每列沿前后方向取最高层数。','The maximum height in each column.')}</p>
 <h3>${t('右视图：2、2、1','Right view: 2, 2, 1')}</h3><p>${t('每排沿左右方向取最高层数，按从前到后排列。','The maximum height in each row, ordered front to back.')}</p></div></div></article>
 <article class="info-card"><h2>${t('允许不同的正确搭法','Accepting different solutions')}</h2><p>${t(`第 8 题在当前规则下共有 ${count} 个解。检查的是三个视图是否满足题目，不要求与某个参考结构逐格相同。`,`Exercise 8 has ${count} solutions under the current rules. A build is checked against the three target views, rather than a single reference structure.`)}</p><div class="note">${t('3 × 3 底板，每格连续堆叠 0–3 层。不支持悬空或内部空洞。','A 3 × 3 board, with continuous stacks of 0–3 cubes. No floating cubes or internal gaps.')}</div><h2 style="margin-top:22px">${t('观察方向与模型分开','Camera and model are separate')}</h2><p>${t('拖动只改变观察角度，正面和右侧仍以底板为准。半透明方块是预览，点击后才修改高度表。','Dragging changes the camera. Front and right remain fixed to the board. The translucent cube previews an edit; only a click changes the height map.')}</p></article></div>
</section>
<section id="validation" class="info-page"><div class="page-heading"><div><h1>${t('软件验证','Software verification')}</h1><p>${t('运行 npm test 可重新生成验证记录。','Run npm test to regenerate the report.')}</p></div></div><div id="test-summary"></div><div class="info-card"><p>${t('检查覆盖投影、多解、撤销重做、进度保存、操作手势和中英文内容。全部允许结构与独立体素投影算法逐项对照。','Checks cover projections, multiple solutions, undo/redo, saved progress, gestures and language strings. Every allowed structure is compared against an independent voxel-projection algorithm.')}</p><p><a href="validation-report.json">${t('完整测试报告','Full test report')}</a> · <a href="docs/UI-CHECKS.md">${t('浏览器检查记录','Browser check record')}</a></p></div></section>
<section id="learning" class="info-page"><div class="page-heading"><div><h1>${t('任务与学习','Learning tasks')}</h1><p>${t('观察目标 → 搭建 → 比较 → 修改 → 提交并解释','Observe → build → compare → revise → submit and explain')}</p></div></div><div class="info-grid"><article class="info-card"><h2>${t('八道练习的梯度','Eight graded exercises')}</h2><p>${t('先判断位置与高度，再结合多个方向推理，最后观察遮挡带来的多种正确搭法。三视图相同不一定代表结构相同。','Start with position and height, combine clues from several views, then explore the solutions allowed by hidden heights. Identical views do not always imply identical structures.')}</p></article><article class="info-card"><h2>${t('学习效果如何评价','Evaluating learning')}</h2><p>${t('软件检查不能证明学习提升。能否在新题中独立判断并解释，需要后续实际试用评价，目前尚无学习效果数据。','Software checks do not establish learning gains. A later study should assess whether learners can solve unfamiliar tasks independently and explain their reasoning. No learning-outcome data have been collected.')}</p></article></div><p><a href="${en?'docs/ARCHITECTURE.md':'docs/PRINCIPLES.zh-CN.md'}">${t('阅读完整原理','Read the architecture notes')}</a></p></section>`;
async function loadReport(){
 try{
  const response=await fetch('validation-report.json');if(!response.ok)throw new Error();const r=await response.json();
  const metrics=[[`${r.tests.filter(item=>item.passed).length} / ${r.tests.length}`,t('自动检查通过','Checks passed')],[r.statesChecked.toLocaleString(en?'en':'zh-CN'),t('逐项对照的结构数量','Structures compared')],[`${(r.durationMs/1000).toFixed(2)} s`,t('测试耗时，不代表交互延迟','Test duration, not interaction latency')]];
  document.querySelector('#test-summary').innerHTML='<div class="metrics">'+metrics.map(([value,label])=>`<div class="metric"><strong>${value}</strong><span>${label}</span></div>`).join('')+'</div>';
 }catch{
  document.querySelector('#test-summary').textContent=t('无法读取报告。请运行 npm test，并通过本地服务打开此页。','Report unavailable. Run npm test and open this page through the local server.');
 }
}
loadReport();
