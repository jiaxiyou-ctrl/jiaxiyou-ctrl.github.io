// Source-language messages and their English counterparts. Geometry and saved
// work remain language-independent; only text nodes and accessible labels change.
export const english = {
 '立方体搭建':'Cube Builder','立方体搭建 - 三视图练习':'Cube Builder — Three-view practice','三视图练习':'Three-view practice',
 '返回搭建练习':'Back to practice','示例讲解 · 不记录练习进度':'Examples · practice progress unchanged','示例讲解':'Examples','返回练习':'Back to practice','进度已保存':'Progress saved','示例修改不保存':'Examples are not saved','本次进度暂未保存':'Progress not saved',
 '使用帮助':'Help','关于':'About','分级练习题':'Exercises by level','练习题':'Exercises','练习完成进度':'Exercise progress','按难度选择练习':'Choose an exercise',
 '入门':'Introductory','基础':'Intermediate','进阶':'Advanced','位置与高度':'Position and height','多个方向对照':'Compare views','遮挡与多解':'Hidden heights',
 '唯一解':'Unique solution','多解题':'Multiple solutions','未开始':'Not started','练习中':'In progress','已完成':'Completed','示例':'Example',
 '单排方块':'One row','高低台阶':'Steps','转向观察':'Depth','跨行定位':'Diagonal stacks','组合还原':'Combine the views','三层综合':'Three levels','寻找两种搭法':'Find two solutions',
 '认清三个观察方向':'Identify the three viewing directions','读出每一列的高度':'Read the height of each column','用右视图判断前后高度':'Read depth from the right view','把位置与高度对应起来':'Connect position and height','同时检查三幅图':'Check all three views','发现不能唯一确定的高度':'Identify heights that are not uniquely determined','处理不同层数和遮挡':'Reason about height and occlusion','保持三视图不变，改变结构':'Change the structure while preserving its views',
 '先确定哪些格子有方块，再比较从三个方向看到的形状。':'Locate the occupied cells, then compare the shape from each direction.',
 '方块只在同一排。根据正视图，确定每一堆有几层。':'The cubes form one row. Use the front view to find each stack’s height.',
 '方块沿前后方向排列。结合俯视图和右视图，判断每个位置的层数。':'The stacks run from front to back. Use the top and right views to find their heights.',
 '几堆方块分布在不同位置。把俯视图中的位置与另两个视图中的高度对应起来。':'Match positions in the top view to heights in the front and right views.',
 '同一方向上出现多堆方块。搭建时同时核对三幅图，不能只看一个方向。':'Several stacks overlap when viewed from one direction. Check all three views as you build.',
 '有些高度会被遮挡。搭出一种符合三视图的结构，观察哪些位置仍有变化的可能。':'Some heights are hidden. Find a matching build, then explore which heights can change.',
 '综合判断三层以内的多个方块堆，提交一种与题目相符的搭法。':'Combine the clues from all three views to build stacks up to three cubes high.',
 '搭出并提交两种不同的结构，使它们都符合右侧的三视图。':'Build and submit two different structures that match the same three views.',
 '横排的三个方块，从右侧为什么只看到一个方格？':'Why does a row of three cubes appear as one square from the right?',
 '三堆高度不同，为什么俯视图里的方格一样大？':'Why are the squares in the top view the same size when the stacks have different heights?',
 '哪一个视图最直接显示三堆从前到后的高度？':'Which view shows the heights of the three stacks from front to back?',
 '怎样把俯视图中的位置与另两个视图中的高度对应起来？':'How do positions in the top view connect to heights in the other two views?',
 '如果只核对俯视图，为什么还不能确定搭建正确？':'Why is a matching top view not enough to confirm the whole build?',
 '哪个位置的高度可能改变，而三视图保持不变？':'Which stack could change height without changing any of the three views?',
 '三视图中哪些高度来自最高的一堆，哪些低堆被遮住？':'Which heights come from the tallest stacks? Which shorter stacks are hidden?',
 '试着比较两种搭法：哪些层数不同，为什么三个视图仍相同？':'Compare two builds: which heights differ, and why do all three views still match?',
 '完整搭法':'Complete build','一种正确搭法':'One solution','另一种正确搭法':'Another solution','搭法一':'Build A','搭法二':'Build B','待完成的搭法':'Incomplete build','示例一':'Example A','示例二':'Example B',
 '搭建工作区':'Building workspace','搭建工具':'Building tools','添加':'Add','移除':'Remove','旋转':'Rotate','撤销':'Undo','重做':'Redo','清空底板':'Clear board','清空底板，可撤销':'Clear board (can be undone)',
 '添加方块（快捷键 1）':'Add cube (1)','移除最上层方块（快捷键 2）':'Remove top cube (2)','旋转视角（快捷键 3）':'Rotate view (3)','撤销（Ctrl / ⌘ Z）':'Undo (Ctrl / ⌘ Z)','重做（Ctrl / ⌘ Shift Z）':'Redo (Ctrl / ⌘ Shift Z)',
 '立体视角':'3D view','自由视角':'Free view','俯视 · 从上方看':'Top view','正视 · 从前方看':'Front view','右视 · 从右侧看':'Right view','点击方格，添加第一个方块':'Click a cell to start building','点击添加，按住拖动可旋转':'Click to add · drag to rotate',
 '立方体搭建区域':'Cube building area','前方':'Front','右侧':'Right','观察方向':'View','视角与缩放':'View and zoom','恢复默认视角':'Reset view','缩小':'Zoom out','放大':'Zoom in','视角':'View','立体':'3D','俯视':'Top','正视':'Front','右视':'Right',
 '透视编辑':'X-ray edit','透视编辑被遮挡的位置':'Edit hidden stacks through the board','按格编辑':'Grid editor','选择方格':'Select a cell','后排':'Back','前排':'Front','位置':'Cell','层':'high','选中方格减少一层':'Remove one cube from the selected cell','选中方格增加一层':'Add one cube to the selected cell',
 '载入示例':'Load example','选择示例':'Choose an example','载入':'Load','载入后可撤销，恢复原来的搭建。':'Undo restores your previous build.',
 '题目与当前三视图对照':'Target and current views','三视图对照':'Compare views','题目':'Target','当前搭建':'Your build','找出两种不同搭法':'Find two different solutions','提交一种与题目相符的搭法。':'Submit a matching build.','为什么有多解？':'Why more than one solution?',
 '俯视图':'Top view','正视图':'Front view','右视图':'Right view','从上方看':'From above','从前方看':'From the front','从右侧看':'From the right','相符':'Match','待调整':'Not yet','三个视图均相符':'All three views match','请开始搭建':'Start building','再找一种不同搭法':'Find another solution',
 '提示':'Hint','收起提示':'Hide hint','提交答案':'Submit','缺少':'Missing','多出':'Extra','缺少的投影方格':'Missing projection cell','多出的投影方格':'Extra projection cell','提交后想一想':'Reflect on your build','想一想':'Think about it','下一题 →':'Next →','提交记录':'Submissions','暂无记录。提交答案后可以重新载入。':'No submissions yet.',
 '左键添加 · 右键移除 · 拖动旋转':'Click to add · right-click to remove · drag to rotate','点击移除 · 拖动旋转':'Click to remove · drag to rotate','拖动旋转 · 右键移除':'Drag to rotate · right-click to remove','点选底板格子 · 右键移除':'Click a board cell · right-click to remove','Shift + 点击移除 · Ctrl / ⌘ Z 撤销':'Shift + click: remove · Ctrl / ⌘ Z: undo','底板 3 × 3 · 每格最多 3 层':'3 × 3 board · up to 3 cubes per stack',
 '已撤销上一次修改。':'Last edit undone.','已重做。':'Edit redone.','底板已清空，可点击撤销恢复。':'Board cleared. Undo to restore it.','这个搭法已提交，不会重复计数。':'This build has already been submitted.','还有视图未相符，已保留本次搭建。':'Some views do not match. This attempt has been saved.','回答正确，本题已完成。':'Correct. Exercise completed.','已载入保存的方案。':'Saved build loaded.','示例已载入，可继续修改。':'Example loaded.',
 '此位置尚无有效观测。':'This position has no valid observation.','这一格已经有 3 层，不能继续添加。':'This stack is already 3 cubes high.','这一格没有方块。':'This cell is empty.',
 '关闭帮助':'Close help','添加与移除':'Add and remove','旋转与观察':'Rotate and inspect','提交与进度':'Submit and save','按需获取提示':'Hints',
 '观察题目的俯视图、正视图和右视图，在底板上搭出相符的立体图形。':'Build a structure that matches the target top, front and right views.',
 '根据右侧的三视图，在底板上搭出相符的立体图形。':'Build a structure that matches the three target views.',
 '将鼠标移到方格或方块上，半透明方块表示下一次放置的位置。左键点击添加一块，右键点击移除顶层。也可按住 Shift 点击，或使用“移除”工具；键盘聚焦方块后按 Delete 移除。所有修改均可撤销。':'Hover over a cell or stack to preview a placement. Click to add; right-click or Shift-click to remove the top cube. You can also use Remove, or press Delete on a focused stack. Every edit can be undone.',
 '按住鼠标拖动即可旋转，滚轮控制缩放。画布下方可切换立体、俯视、正视和右视。被遮住时打开“透视编辑”，模型淡化，点选底板上对应的格子即可增减那一堆。也可使用“按格编辑”。':'Drag to rotate and scroll to zoom. Use the buttons below the scene for fixed views. X-ray edit makes every board cell accessible through the model. The grid editor is another way to change a hidden stack.',
 '完成搭建后点击“提交答案”。普通题提交一种正确搭法即可完成；“寻找两种搭法”需要提交两种不同的正确结构。提交记录可以重新载入，各题分别保存进度。清空底板不会清除完成记录。':'Select Submit when your build is ready. Most exercises need one correct build; the final exercise needs two different solutions. You can reload submissions. Each exercise saves its own progress, and clearing the board does not erase completion.',
 '点击“提示”，当前三视图用黄色标出差异：加号表示缺少，减号表示多出。修改后标记同步更新；答对并提交后，用“想一想”解释自己的判断。':'Hint highlights differences in yellow: + marks a missing projection cell and − marks an extra one. The markers update as you edit. After a correct submission, explain your reasoning with the reflection question.',
 '从右上角进入示例，可以载入并修改参考搭法。示例不计入练习进度，返回练习后继续原来的搭建。':'Examples lets you load and edit reference builds. It does not affect practice progress. Return to practice to resume your own build.',
 '进度保存在当前浏览器中，刷新后可继续。更换设备或清除浏览器数据后不会保留。':'Progress is saved in this browser. Refresh to resume; it does not transfer to another device or survive clearing browser data.',
 '关于本工具':'About Cube Builder','关闭关于窗口':'Close about','立方体搭建 · 三视图练习':'Cube Builder · Three-view practice','适用于方块组合体的观察与搭建练习。当前支持在 3 × 3 底板上连续堆叠，每格最多 3 层。':'Practise spatial reasoning on a 3 × 3 board with stacks up to 3 cubes high.','根据目标三视图搭建、比较与调整，练习空间推理。':'Build, compare and revise using three target views.','项目资料':'Project notes',
 '为什么相同三视图会有不同搭法？':'Why can different builds share the same views?','关闭多解说明':'Close explanation','这里的三视图记录的是从三个方向看到的方格轮廓，不能显示所有被挡住的高度。下面两种搭法各用 8 个方块，四个位置的层数不同，三视图却完全相同。':'These views show occupied squares from three directions. They do not reveal every hidden height. Each build below uses 8 cubes. Four stack heights differ, but all three views are identical.','数字为层数':'Numbers show height','两种搭法共有的三视图':'Views shared by both builds','有些题的三个方向约束足够强，只有一种正确搭法；有些题仍留下多种可能。本工具会标明“唯一解”或“多解题”，只有专门的多解练习要求提交两种搭法。':'Some sets of views determine one structure; others allow several. Each exercise indicates which case applies. Only the final exercise requires two different solutions.',
};

export const languageFrom=search=>new URLSearchParams(search).get('lang')==='en'?'en':'zh-CN';
export function languageURL(href,lang){
 const [pathAndQuery,hash]=href.split('#'),[path,query]=pathAndQuery.split('?');
 const params=new URLSearchParams(query);params.set('lang',lang==='en'?'en':'zh-CN');
 return `${path}?${params}${hash===undefined?'':'#'+hash}`;
}
let language='zh-CN';
export const getLanguage=()=>language;
export const setLanguage=value=>{language=value==='en'?'en':'zh-CN';};
export function translate(text,lang=language){
 if(lang!=='en'||!text)return text;
 const trimmed=text.trim(),paddingStart=text.slice(0,text.indexOf(trimmed)),paddingEnd=text.slice(text.indexOf(trimmed)+trimmed.length);
 if(english[trimmed])return paddingStart+english[trimmed]+paddingEnd;
 const plural=n=>Number(n)===1?'cube':'cubes';
 const patterns=[
  [/^共 (\d+) 个方块$/,(_,n)=>`${n} ${plural(n)}`],
  [/^(\d+) 个$/,(_,n)=>`${n} ${plural(n)}`],
  [/^已完成 (\d+) \/ (\d+)$/,(_,n,total)=>`${n} / ${total} completed`],
  [/^已找到 (\d+) \/ (\d+) 种$/,(_,n,total)=>`Found ${n} / ${total}`],
  [/^相符 (\d+) \/ (\d+)$/,(_,n,total)=>`${n} / ${total} match`],
  [/^还有 (\d+) 个视图需要调整$/,(_,n)=>`${n} ${Number(n)===1?'view needs':'views need'} adjustment`],
  [/^第 (\d+) 题，(.+)，(唯一解|多解题)，(.+)$/,(_,n,title,kind,state)=>`Exercise ${n}, ${translate(title,'en')}, ${translate(kind,'en')}, ${translate(state,'en')}`],
  [/^(添加方块至|移除顶层方块：|方格|选择) ([A-C][1-3])(?: 方格)?，当前 (\d+|未知) 层$/,(_,action,cell,n)=>`${{'添加方块至':'Add to','移除顶层方块：':'Remove from','方格':'Cell','选择':'Select'}[action]} ${cell}, height ${n==='未知'?'unknown':n}`],
  [/^([A-C][1-3]) · (\d+) 层 → (\d+) 层$/,(_,cell,a,b)=>`${cell} · ${a} → ${b} cubes high`],
  [/^([A-C][1-3]) · (位置未知|最多只能搭 3 层|此处没有方块)$/,(_,cell,s)=>`${cell} · ${{'位置未知':'Unknown height','最多只能搭 3 层':'Maximum height: 3','此处没有方块':'Empty cell'}[s]}`],
  [/^(\d+) 层$/,(_,n)=>`${n} high`],
  [/^(题目|当前)(俯视图|正视图|右视图)$/,(_,kind,v)=>`${kind==='题目'?'Target':'Current'} ${translate(v,'en').toLowerCase()}`],
  [/^版本 ([\d.]+)$/,(_,v)=>`Version ${v}`],
  [/^载入方案 (\d+)(?:，(\d+) 个方块(，三个视图均相符)?)?$/,(_,n,count,pass)=>`Load build ${n}${count?`, ${count} ${plural(count)}`:''}${pass?', all views match':''}`],
  [/^方案 (\d+)$/,(_,n)=>`Build ${n}`],
  [/^(示例一|示例二)的每格层数$/,(_,name)=>`${translate(name,'en')}: stack heights`],
  [/^已提交 (\d+) 种正确搭法，请再找一种不同搭法。$/,(_,n)=>`${n} correct build saved. Find another solution.`],
  [/^✓ (.+)$/,(_,s)=>`✓ ${translate(s,'en')}`],
  [/^(.+) · (\d+) 个方块$/,(_,s,n)=>`${translate(s,'en')} · ${n} ${plural(n)}`],
 ];
 for(const [pattern,replace]of patterns)if(pattern.test(trimmed))return paddingStart+trimmed.replace(pattern,replace)+paddingEnd;
 if(trimmed.includes(' ·'))return paddingStart+trimmed.split(' ·').map(s=>translate(s,'en')).join(' ·')+paddingEnd;
 return text;
}

// Retain each node's source text so switching back needs no reload and does not
// rebuild controls, clear focus, or touch the workspace. Newly rendered nodes
// are translated on the next explicit render call (no mutation observer).
const sources=new WeakMap();
function translatedValue(node,key,current){
 let record=sources.get(node);if(!record){record=new Map();sources.set(node,record);}
 const previous=record.get(key),source=previous&&current===previous.output?previous.source:current;
 const output=translate(source);record.set(key,{source,output});return output;
}
export function localize(root){
 if(!root)return;
 const doc=root.ownerDocument??root;
 const walker=doc.createTreeWalker(root,4);
 for(let node=walker.nextNode();node;node=walker.nextNode()){
  if(node.parentElement?.closest('script,style,[data-no-translate]'))continue;
  const value=translatedValue(node,'text',node.nodeValue);if(value!==node.nodeValue)node.nodeValue=value;
 }
 const elements=[...(root.nodeType===1?[root]:[]),...root.querySelectorAll('[aria-label],[title],[alt]')];
 for(const node of elements)for(const attr of ['aria-label','title','alt'])if(node.hasAttribute(attr)){
  const value=translatedValue(node,attr,node.getAttribute(attr));if(value!==node.getAttribute(attr))node.setAttribute(attr,value);
 }
}
