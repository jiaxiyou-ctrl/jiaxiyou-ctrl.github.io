const pts=p=>p.map(v=>v.map(n=>n.toFixed(2)).join(',')).join(' ');
const poly=(vertices,fill,extra='')=>`<polygon points="${pts(vertices)}" fill="${fill}" ${extra}/>`;
const tag=(s,label,box,role='img')=>`<svg viewBox="${box}" role="${role}" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
export const DEFAULT_CAMERA={yaw:-45,pitch:34,zoom:1};
export const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
export function cameraGeometry({yaw=-45,pitch=34,zoom=1}={}){
  const a=yaw*Math.PI/180,p=clamp(pitch,0,90)*Math.PI/180,scale=98*clamp(zoom,.65,1.5);
  const eye=[Math.cos(p)*Math.cos(a),Math.cos(p)*Math.sin(a),Math.sin(p)];
  return {
    eye,
    project:([x,y,z])=>[380+scale*(-Math.sin(a)*(x-1.5)+Math.cos(a)*(y-1.5)),315+scale*(Math.sin(p)*(Math.cos(a)*(x-1.5)+Math.sin(a)*(y-1.5))-Math.cos(p)*(z-.8))],
    depth:v=>v.reduce((sum,n,i)=>sum+n*eye[i],0)
  };
}
const faceDefs=[
  {n:[0,0,1],d:[0,0],fill:'#d6e6f7',verts:(x,y,z)=>[[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],top:true},
  {n:[0,-1,0],d:[-1,0],fill:'#9dbde0',verts:(x,y,z)=>[[x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1]]},
  {n:[1,0,0],d:[0,1],fill:'#7fa4cf',verts:(x,y,z)=>[[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]]},
  {n:[0,1,0],d:[1,0],fill:'#95b5d9',verts:(x,y,z)=>[[x+1,y+1,z],[x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1]]},
  {n:[-1,0,0],d:[0,-1],fill:'#b4cdeb',verts:(x,y,z)=>[[x,y+1,z],[x,y,z],[x,y,z+1],[x,y+1,z+1]]},
];
const visible=(f,eye)=>f.n.reduce((sum,n,i)=>sum+n*eye[i],0)>.001;
export function cubeFaces(h,camera={}){
  const {eye,depth}=cameraGeometry(camera),faces=[];
  for(let r=0;r<3;r++)for(let c=0;c<3;c++)for(let z=0;z<(h[r][c]||0);z++)for(const f of faceDefs){
    if(!visible(f,eye)||(f.top&&z!==h[r][c]-1)||(!f.top&&(h[r+f.d[0]]?.[c+f.d[1]]||0)>z))continue;
    const vertices=f.verts(c,r,z),center=[0,1,2].map(k=>vertices.reduce((sum,v)=>sum+v[k],0)/4);
    faces.push({...f,vertices,depth:depth(center),r,c,z});
  }
  return faces.sort((a,b)=>a.depth-b.depth);
}
export function iso(h,{selected=[0,0],tool='add',placed=null,previewLayer=true,xray=false,...camera}={}){
  const {project,eye}=cameraGeometry(camera);
  const action=tool==='add'?'添加方块至':tool==='remove'?'移除顶层方块：':'方格';
  const attrs=(r,c)=>`role="${tool==='orbit'?'img':'button'}" ${tool==='orbit'?'':'tabindex="0"'} aria-label="${action} ${String.fromCharCode(65+c)}${r+1}，当前 ${h[r][c]??'未知'} 层"`;
  const plane=[[0,0,0],[3,0,0],[3,3,0],[0,3,0]];
  let s=xray?'<g opacity=".16" pointer-events="none" aria-hidden="true">':'';
  for(const f of faceDefs.filter(f=>!f.top&&visible(f,eye))){
    const v=f.verts(0,0,-1).map(([x,y,z])=>[x*3,y*3,z*.12]);
    s+=poly(v.map(project),'#e4e7eb','stroke="#8b949e" stroke-width="1" vector-effect="non-scaling-stroke"');
  }
  s+=poly(plane.map(project),'#fff','stroke="#8b949e" stroke-width="1" vector-effect="non-scaling-stroke"');
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
    const active=selected[0]===r&&selected[1]===c;
    s+=`<g data-r="${r}" data-c="${c}" ${!xray&&!h[r][c]?attrs(r,c):''}>`;
    s+=poly([[c,r,0],[c+1,r,0],[c+1,r+1,0],[c,r+1,0]].map(project),active?'#edf3fb':'#fff','stroke="#a8b0bb" stroke-width="1" vector-effect="non-scaling-stroke"');
    if(!h[r][c]&&(camera.pitch??34)>15){
      const q=project([c+.5,r+.5,.015]);
      s+=`<text x="${q[0]}" y="${q[1]+3}" class="cell-label" text-anchor="middle">${h[r][c]===null?'?':String.fromCharCode(65+c)+(r+1)}</text>`;
    }
    s+='</g>';
  }
  const faces=cubeFaces(h,camera);
  const accessibleStacks=new Set();
  for(const f of faces){
    const key=`${f.r},${f.c}`,firstFace=!accessibleStacks.has(key);accessibleStacks.add(key);
    const active=selected[0]===f.r&&selected[1]===f.c;
    const isNew=placed&&placed.r===f.r&&placed.c===f.c&&placed.z===f.z;
    s+=`<g data-r="${f.r}" data-c="${f.c}" ${!xray&&firstFace?attrs(f.r,f.c):''} class="${isNew?'placed-face':''}">`;
    s+=poly(f.vertices.map(project),f.fill,`class="cube-face" stroke="${active?'#234d78':'#3d5774'}" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"`);
    s+='</g>';
  }
  // Plane labels become coincident at an edge-on angle. Show those directions
  // in the fixed camera indicator instead; retain only the near-side board label.
  if((camera.pitch??34)>15)for(const [label,pos,near]of[['前方',[1.5,-.38,0],eye[1]<-.15],['右侧',[3.38,1.5,0],eye[0]>.15]]){
    if(!near)continue;
    const q=project(pos);s+=`<text x="${q[0]}" y="${q[1]+9}" text-anchor="middle" class="axis-label">${label}</text>`;
  }
  if(xray){
    s+='</g><g id="xray-board">';
    for(let r=0;r<3;r++)for(let c=0;c<3;c++){
      const q=project([c+.5,r+.5,0]),active=selected[0]===r&&selected[1]===c;
      s+=`<g data-r="${r}" data-c="${c}" ${attrs(r,c)} class="xray-cell">`;
      s+=poly([[c,r,0],[c+1,r,0],[c+1,r+1,0],[c,r+1,0]].map(project),active?'#dceaf8':'#ffffffcc','stroke="#63788d" stroke-width="1.2" vector-effect="non-scaling-stroke"');
      s+=`<text x="${q[0]}" y="${q[1]-2}" text-anchor="middle" class="xray-coordinate">${String.fromCharCode(65+c)}${r+1}</text><text x="${q[0]}" y="${q[1]+14}" text-anchor="middle" class="xray-height">${h[r][c]} 层</text></g>`;
    }
    s+='</g>';
  }
  if(previewLayer)s+='<g id="scene-preview" pointer-events="none" aria-hidden="true"></g>';
  return tag(s,'立方体搭建区域','0 0 760 580','group');
}
export function preview(h,cell,tool,camera={}){
  if(!cell||tool==='orbit')return '';
  const {r,c}=cell,height=h[r]?.[c];
  if(height===null||height===undefined)return '';
  const blocked=tool==='add'?height>=3:height===0;
  if(blocked){
    const {project}=cameraGeometry(camera);
    return poly([[c,r,height],[c+1,r,height],[c+1,r+1,height],[c,r+1,height]].map(project),'#bd796326','stroke="#ba7965" stroke-width="2" stroke-dasharray="5 3"');
  }
  const {project,eye,depth}=cameraGeometry(camera),z=tool==='add'?height:height-1;
  const color=tool==='add'?'#346cba':'#b64e3d';
  return faceDefs.filter(f=>visible(f,eye)).map(f=>{
    const vertices=f.verts(c,r,z);return {vertices,depth:depth(vertices[0])};
  }).sort((a,b)=>a.depth-b.depth).map(f=>poly(f.vertices.map(project),color,`fill-opacity=".18" stroke="${color}" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-dasharray="${tool==='add'?'5 3':'none'}" stroke-linejoin="round"`)).join('');
}
export function projection(view,data,target=null,{current=false}={}){
  let s='';
  for(let y=0;y<3;y++)for(let x=0;x<3;x++){
    const occupied=view==='top'?data[2-y][x]>0:data[x]>=3-y;
    const expected=target===null?occupied:view==='top'?target[2-y][x]>0:target[x]>=3-y;
    const mismatch=occupied!==expected;
    s+=`<rect x="${6+x*25}" y="${5+y*25}" width="25" height="25" fill="${occupied?(current?'#98b8dc':'#d5dbe4'):'#fff'}" stroke="#65768b" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    if(mismatch){
      const kind=occupied?'extra':'missing',cx=18.5+x*25,cy=17.5+y*25;
      s+=`<g data-hint="${kind}" data-x="${x}" data-y="${y}"><title>${occupied?'多出':'缺少'}的投影方格</title><rect x="${7.5+x*25}" y="${6.5+y*25}" width="22" height="22" rx="2" fill="#ffe69a" stroke="#ad7900" stroke-width="1.5" ${occupied?'':'stroke-dasharray="3 2"'}/><path d="M${cx-5} ${cy}h10${occupied?'':`M${cx} ${cy-5}v10`}" fill="none" stroke="#805b00" stroke-width="1.8" stroke-linecap="round"/></g>`;
    }
  }
  return tag(s,({top:'俯视图',front:'正视图',right:'右视图'})[view],'0 0 87 87');
}
