const robotDemo=document.getElementById('robot-demo');
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
if(robotDemo) {
 robotDemo.muted=true;
 if(!motionPreference.matches) robotDemo.play().catch(()=>{});
 motionPreference.addEventListener('change',event=>{
  if(event.matches) robotDemo.pause();
 });
}
