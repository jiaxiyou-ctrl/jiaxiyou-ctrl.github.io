import {localize} from './i18n.mjs';
import {iso,preview,DEFAULT_CAMERA,clamp} from './draw.mjs';

// Rendering may replace the original clicked node before document bubbling.
// The dispatch path still identifies the menu where the click started.
export function closeOutsideMenus(event, menus) {
  const path=event.composedPath();
  for(const menu of menus)if(!path.includes(menu))menu.open=false;
}

// The stable host captures the pointer while its SVG is redrawn. A gesture can
// rotate OR edit, never both. Only actual edits notify the application state.
export class BuildingScene {
  constructor(host,{getState,onAction,onCamera}){
    this.host=host;this.getState=getState;this.onAction=onAction;this.onCamera=onCamera;
    this.camera={...DEFAULT_CAMERA};this.hover=null;this.gesture=null;this.frame=0;this.animation=0;
    this.tip=document.querySelector('#placement-tip');
    host.addEventListener('pointerdown',e=>this.down(e));
    host.addEventListener('pointermove',e=>this.move(e));
    host.addEventListener('pointerup',e=>this.up(e));
    host.addEventListener('pointercancel',()=>this.cancel());
    host.addEventListener('lostpointercapture',()=>{if(this.gesture)this.cancel();});
    host.addEventListener('pointerleave',()=>{if(!this.gesture)this.setHover(null);});
    host.addEventListener('contextmenu',e=>e.preventDefault());
    host.addEventListener('wheel',e=>{e.preventDefault();this.stopAnimation();this.camera.zoom=clamp(this.camera.zoom*Math.exp(-e.deltaY*.0015),.65,1.5);this.setHover(null);this.schedule();},{passive:false});
    host.addEventListener('keydown',e=>{
      if(!['Enter',' ','Delete','Backspace'].includes(e.key)||e.repeat)return;
      const cell=this.cell(e.target);if(!cell)return;e.preventDefault();
      if(['Delete','Backspace'].includes(e.key))this.onAction({...cell,action:'remove'});
      else if(this.getState().tool!=='orbit')this.onAction(e.shiftKey?{...cell,action:'remove'}:cell);
      this.host.querySelector(`[role="button"][data-r="${cell.r}"][data-c="${cell.c}"]`)?.focus();
    });
  }
  cell(node){const el=node?.closest?.('[data-r]');return el&&this.host.contains(el)?{r:Number(el.dataset.r),c:Number(el.dataset.c)}:null;}
  pick(x,y){return this.cell(document.elementFromPoint(x,y));}
  render(placed=null){
    const state=this.getState();
    this.host.innerHTML=iso(state.heightMap,{selected:state.selected,tool:state.tool,xray:state.xray,...this.camera,placed});
    this.host.dataset.tool=state.tool;
    this.host.dataset.yaw=this.camera.yaw.toFixed(2);this.host.dataset.pitch=this.camera.pitch.toFixed(2);this.host.dataset.zoom=this.camera.zoom.toFixed(2);
    localize(this.host);this.drawPreview();this.onCamera?.(this.camera);
  }
  drawPreview(){
    const s=this.getState(),layer=this.host.querySelector('#scene-preview');
    if(layer)layer.innerHTML=preview(s.heightMap,this.hover,s.tool,this.camera);
    if(!this.hover||s.tool==='orbit'||this.gesture?.dragging){this.tip.hidden=true;return;}
    const {r,c}=this.hover,value=s.heightMap[r][c],label=String.fromCharCode(65+c)+(r+1);
    const blocked=value===null||(s.tool==='add'?value>=3:value===0);
    this.tip.textContent=value===null?`${label} · 位置未知`:blocked?`${label} · ${s.tool==='add'?'最多只能搭 3 层':'此处没有方块'}`:`${label} · ${value} 层 → ${value+(s.tool==='add'?1:-1)} 层`;
    this.tip.classList.toggle('blocked',blocked);localize(this.tip);this.tip.hidden=false;
  }
  setHover(cell,x,y){
    this.hover=cell;
    if(x!==undefined){const b=this.host.getBoundingClientRect();this.tip.style.left=`${clamp(x-b.left+18,8,b.width-172)}px`;this.tip.style.top=`${clamp(y-b.top+20,8,b.height-38)}px`;}
    this.drawPreview();
  }
  down(e){
    if(e.isPrimary===false||![0,1,2].includes(e.button)||this.gesture)return;
    e.preventDefault();this.stopAnimation();
    this.gesture={id:e.pointerId,x:e.clientX,y:e.clientY,camera:{...this.camera},cell:this.pick(e.clientX,e.clientY),dragging:false,orbit:e.button===1||(this.getState().tool==='orbit'&&e.button===0),remove:e.button===2||e.shiftKey};
    this.host.setPointerCapture(e.pointerId);
  }
  move(e){
    const g=this.gesture;
    if(!g){this.setHover(this.pick(e.clientX,e.clientY),e.clientX,e.clientY);return;}
    if(e.pointerId!==g.id)return;
    const dx=e.clientX-g.x,dy=e.clientY-g.y;
    if(Math.hypot(dx,dy)>5)g.dragging=true;
    if(g.dragging){
      this.camera.yaw=g.camera.yaw-dx*.42;this.camera.pitch=clamp(g.camera.pitch+dy*.30,this.getState().xray?25:0,90);
      this.host.classList.add('is-dragging');this.setHover(null);this.schedule();
    }
  }
  up(e){
    const g=this.gesture;if(!g||g.id!==e.pointerId)return;
    this.gesture=null;this.host.classList.remove('is-dragging');
    if(this.host.hasPointerCapture(e.pointerId))this.host.releasePointerCapture(e.pointerId);
    if(g.dragging){this.setHover(null);this.render();return;}
    if(!g.orbit&&g.cell)this.onAction(g.remove?{...g.cell,action:'remove'}:g.cell);
    if(e.pointerType!=='touch')this.setHover(this.pick(e.clientX,e.clientY),e.clientX,e.clientY);
  }
  cancel(){
    const g=this.gesture;this.gesture=null;this.host.classList.remove('is-dragging');this.setHover(null);
    if(g&&this.host.hasPointerCapture(g.id))this.host.releasePointerCapture(g.id);
  }
  schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>{this.frame=0;this.render();});}
  stopAnimation(){if(this.animation)cancelAnimationFrame(this.animation);this.animation=0;}
  setView(next){
    this.cancel();this.stopAnimation();this.setHover(null);
    const from={...this.camera},to={...from,...next};
    to.yaw=from.yaw+(((to.yaw-from.yaw)%360+540)%360-180);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.camera=to;this.render();return;}
    const start=performance.now();
    const frame=now=>{const t=Math.min(1,(now-start)/240),ease=1-(1-t)**3;for(const k of ['yaw','pitch','zoom'])this.camera[k]=from[k]+(to[k]-from[k])*ease;this.render();if(t<1)this.animation=requestAnimationFrame(frame);else this.animation=0;};
    this.animation=requestAnimationFrame(frame);
  }
  zoomBy(delta){this.setView({zoom:clamp(this.camera.zoom+delta,.65,1.5)});}
  reset(){this.setView(DEFAULT_CAMERA);}
}
