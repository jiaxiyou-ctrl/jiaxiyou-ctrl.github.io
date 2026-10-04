export const SIZE = 3;
export const MAX_HEIGHT = 3;
export const copy = h => h.map(row => [...row]);
export const emptyMap = () => Array.from({length:SIZE}, () => Array(SIZE).fill(0));

// Direct virtual edits obey the same stack limits as any future physical input.
// Unknown observations cannot silently become a cube or an empty cell.
export function adjustStack(h, row, col, delta) {
  const validity=validateMap(h);
  if (!validity.valid) throw new Error(validity.reason);
  if (![row,col].every(v=>Number.isInteger(v)&&v>=0&&v<SIZE) || ![-1,1].includes(delta))
    throw new Error('Expected a board position and an add/remove action.');
  const value=h[row][col], heightMap=copy(h);
  if (value===null) return {heightMap,changed:false,notice:'此位置尚无有效观测。'};
  if (value+delta>MAX_HEIGHT) return {heightMap,changed:false,notice:'这一格已经有 3 层，不能继续添加。'};
  if (value+delta<0) return {heightMap,changed:false,notice:'这一格没有方块。'};
  heightMap[row][col]+=delta;
  return {heightMap,changed:true,notice:''};
}
export const STAGES = [
  {id:'intro',title:'入门',description:'位置与高度'},
  {id:'basic',title:'基础',description:'多个方向对照'},
  {id:'advanced',title:'进阶',description:'遮挡与多解'},
];
export const TASKS = [
  {
    id:'row',reflection:'横排的三个方块，从右侧为什么只看到一个方格？',stage:'intro',title:'单排方块',focus:'认清三个观察方向',solutionCount:1,requiredSolutions:1,
    description:'先确定哪些格子有方块，再比较从三个方向看到的形状。',
    reference:[[1,1,1],[0,0,0],[0,0,0]],initial:[[1,0,0],[0,0,0],[0,0,0]],
    samples:[{name:'完整搭法',heightMap:[[1,1,1],[0,0,0],[0,0,0]]}],
  },
  {
    id:'stairs',reflection:'三堆高度不同，为什么俯视图里的方格一样大？',stage:'intro',title:'高低台阶',focus:'读出每一列的高度',solutionCount:1,requiredSolutions:1,
    description:'方块只在同一排。根据正视图，确定每一堆有几层。',
    reference:[[1,2,3],[0,0,0],[0,0,0]],initial:[[1,1,1],[0,0,0],[0,0,0]],
    samples:[{name:'完整搭法',heightMap:[[1,2,3],[0,0,0],[0,0,0]]}],
  },
  {
    id:'depth',reflection:'哪一个视图最直接显示三堆从前到后的高度？',stage:'basic',title:'转向观察',focus:'用右视图判断前后高度',solutionCount:1,requiredSolutions:1,
    description:'方块沿前后方向排列。结合俯视图和右视图，判断每个位置的层数。',
    reference:[[1,0,0],[2,0,0],[3,0,0]],initial:[[1,0,0],[1,0,0],[1,0,0]],
    samples:[{name:'完整搭法',heightMap:[[1,0,0],[2,0,0],[3,0,0]]}],
  },
  {
    id:'diagonal',reflection:'怎样把俯视图中的位置与另两个视图中的高度对应起来？',stage:'basic',title:'跨行定位',focus:'把位置与高度对应起来',solutionCount:1,requiredSolutions:1,
    description:'几堆方块分布在不同位置。把俯视图中的位置与另两个视图中的高度对应起来。',
    reference:[[1,0,0],[0,2,0],[0,0,3]],initial:[[1,0,0],[0,1,0],[0,0,1]],
    samples:[{name:'完整搭法',heightMap:[[1,0,0],[0,2,0],[0,0,3]]}],
  },
  {
    id:'corner',reflection:'如果只核对俯视图，为什么还不能确定搭建正确？',stage:'basic',title:'组合还原',focus:'同时检查三幅图',solutionCount:1,requiredSolutions:1,
    description:'同一方向上出现多堆方块。搭建时同时核对三幅图，不能只看一个方向。',
    reference:[[2,1,0],[0,1,2],[0,0,1]],initial:[[1,1,0],[0,1,2],[0,0,1]],
    samples:[{name:'完整搭法',heightMap:[[2,1,0],[0,1,2],[0,0,1]]}],
  },
  {
    id:'occlusion',reflection:'哪个位置的高度可能改变，而三视图保持不变？',stage:'advanced',title:'遮挡与多解',focus:'发现不能唯一确定的高度',solutionCount:2,requiredSolutions:1,
    description:'有些高度会被遮挡。搭出一种符合三视图的结构，观察哪些位置仍有变化的可能。',
    reference:[[2,2,0],[2,0,0],[0,0,0]],initial:[[1,1,0],[1,0,0],[0,0,0]],
    samples:[{name:'一种正确搭法',heightMap:[[2,2,0],[2,0,0],[0,0,0]]},{name:'另一种正确搭法',heightMap:[[1,2,0],[2,0,0],[0,0,0]]}],
  },
  {
    id:'layered',reflection:'三视图中哪些高度来自最高的一堆，哪些低堆被遮住？',stage:'advanced',title:'三层综合',focus:'处理不同层数和遮挡',solutionCount:5,requiredSolutions:1,
    description:'综合判断三层以内的多个方块堆，提交一种与题目相符的搭法。',
    reference:[[3,2,1],[2,1,0],[1,0,0]],initial:[[1,1,1],[1,1,0],[1,0,0]],
    samples:[{name:'一种正确搭法',heightMap:[[3,2,1],[2,1,0],[1,0,0]]}],
  },
  {
    id:'ambiguity',reflection:'试着比较两种搭法：哪些层数不同，为什么三个视图仍相同？',stage:'advanced',title:'寻找两种搭法',focus:'保持三视图不变，改变结构',solutionCount:7,requiredSolutions:2,
    description:'搭出并提交两种不同的结构，使它们都符合右侧的三视图。',
    reference:[[2,1,0],[1,2,0],[0,0,0]],initial:[[1,1,0],[1,1,0],[0,0,0]],
    samples:[{name:'搭法一',heightMap:[[2,1,0],[1,2,0],[0,0,0]]},{name:'搭法二',heightMap:[[1,2,0],[2,1,0],[0,0,0]]}],
  },
];

// null means unobserved. It must never silently become an empty cell (0).
export function validateMap(h) {
  if (!Array.isArray(h) || h.length !== SIZE || h.some(row => !Array.isArray(row) || row.length !== SIZE))
    return {valid:false, complete:false, reason:'Expected a 3 × 3 height map.'};
  if (h.flat().some(v => v !== null && (!Number.isInteger(v) || v < 0 || v > MAX_HEIGHT)))
    return {valid:false, complete:false, reason:'Heights must be integers from 0 to 3, or null for unknown.'};
  return {valid:true, complete:!h.flat().includes(null), reason:h.flat().includes(null) ? 'At least one cell is unknown.' : ''};
}

// Rows run front to back; columns run left to right. Output is a silhouette.
export function project(h) {
  const status = validateMap(h);
  if (!status.valid || !status.complete) throw new Error(status.reason);
  return {
    top: h.map(row => row.map(v => Number(v > 0))),
    front: Array.from({length:SIZE}, (_,c) => Math.max(...h.map(row => row[c]))),
    right: h.map(row => Math.max(...row)),
  };
}

export function compare(h, target) {
  const status = validateMap(h);
  if (!status.valid || !status.complete) return {status:'unavailable', reason:status.reason, mismatches:[], projections:null};
  const actual = project(h);
  const mismatches = [];
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) {
    if (actual.top[r][c] !== target.top[r][c]) mismatches.push({view:'top', row:r, col:c, actual:actual.top[r][c], expected:target.top[r][c]});
  }
  for (const view of ['front','right']) for (let i=0;i<SIZE;i++) {
    if (actual[view][i] !== target[view][i]) mismatches.push({view,index:i,actual:actual[view][i],expected:target[view][i]});
  }
  return {status:mismatches.length ? 'mismatch' : 'match', mismatches, projections:actual};
}

// Enumerate only states compatible with top occupancy and view height bounds.
// Checking all generated candidates still uses the exact projection rule.
export function solutions(target) {
  const h = Array.from({length:SIZE}, () => Array(SIZE).fill(0));
  const found=[];
  function visit(k) {
    if (k===SIZE*SIZE) { if (compare(h,target).status==='match') found.push(copy(h)); return; }
    const r=Math.floor(k/SIZE),c=k%SIZE;
    const low=target.top[r][c] ? 1 : 0;
    const high=target.top[r][c] ? Math.min(MAX_HEIGHT,target.front[c],target.right[r]) : 0;
    for (let v=low;v<=high;v++) { h[r][c]=v; visit(k+1); }
  }
  visit(0); return found;
}

export function createSession(task) {
  return {heightMap:copy(task.initial), checked:null, hintLevel:0, attempts:new Set()};
}
export function changeMap(session, h) {
  const v=validateMap(h); if (!v.valid) throw new Error(v.reason);
  return {...session,heightMap:copy(h),checked:null,hintLevel:0};
}
export function checkSession(session,target) {
  const checked=compare(session.heightMap,target);
  const attempts=new Set(session.attempts);
  if (checked.status!=='unavailable') attempts.add(JSON.stringify(session.heightMap));
  return {...session,checked,attempts};
}

// Input adapter contract for future sensors; geometry never consumes raw pixels.
export function readFrame(frame) {
  if (!frame || frame.schemaVersion!==1 || !['simulated','camera'].includes(frame.source)) throw new Error('Unsupported input frame.');
  const status=validateMap(frame.heightMap);
  if (!status.valid) throw new Error(status.reason);
  return {heightMap:copy(frame.heightMap), source:frame.source, complete:status.complete};
}
