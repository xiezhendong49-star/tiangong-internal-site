/* 2026-10-10 independent prototype: preconfigured rooms and views. */
const V7_VERSION='20261010';
// Example delivery data: each preset view occupies one of the original eight positions.
const V7_ROOM_CAMERA_POSITIONS={living:['w','s','ne'],dining:['n','se'],child:['ne','sw'],elder:['w','ne'],master:['nw','e'],kitchen:['nw','e'],bath:['sw'],second:['n','se'],third:['ne','sw'],study:['nw','s'],multi:['ne','w']};
function v7Room(id,name,points){
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
 return {id,name,points,box:{x,y,w,h,preset:true,polygon:points.map(p=>[(p[0]-x)/w*100,(p[1]-y)/h*100])},views:(V7_ROOM_CAMERA_POSITIONS[id]||[]).map((cameraPosition,i)=>({id:id+'-view-'+(i+1),whiteModelId:id+'-white-'+(i+1),cameraPosition}))};
}
const v7Rect=(id,name,x,y,w,h)=>v7Room(id,name,[[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
function v7SeedRooms(image){
 if(image.includes('floor-chunhe'))return [
 v7Room('living','客厅',[[21.5,51.5],[56.6,51.5],[56.6,68.7],[53,68.7],[53,70.2],[21.5,70.2]]),
 v7Rect('dining','餐厅',37.5,41.7,18.8,12.3),
 v7Rect('child','子女房',26.2,30.5,17.4,8.1),v7Rect('elder','长辈房',55.5,30.5,16.5,10.9),
 v7Room('master','主卧室',[[57.7,57],[72.3,57],[72.3,56.8],[79.6,56.8],[79.6,65.1],[57.7,65.1]]),
 v7Rect('kitchen','厨房',21.5,39.4,15,11.3),
 v7Rect('bath','主卫',57.5,47.8,14.7,6.5)];
 if(image.includes('floorplan-98'))return [v7Rect('living','客餐厅',7.3,17.5,43.3,39.5),v7Rect('master','主卧',7.3,59.8,27.9,28.3),v7Rect('second','次卧',37,59.8,20.3,28.3),v7Rect('study','书房',59.1,59.8,17.1,28.3),v7Rect('kitchen','厨房',52.4,17.5,21.7,18.3),v7Rect('bath','卫生间',75.6,17.5,17,18.3)];
 if(image.includes('floorplan-135'))return [v7Rect('living','横厅与餐厅',7.3,17.5,52.5,34),v7Rect('master','主卧套房',7.3,54.3,22.3,33.8),v7Rect('second','次卧 A',31.3,54.3,17.7,33.8),v7Rect('third','次卧 B',50.8,54.3,17.5,33.8),v7Rect('multi','多功能房',70.2,54.3,22.4,33.8),v7Rect('kitchen','厨房',61.7,17.5,16.1,21.5)];
 if(image.includes('floorplan-162'))return [v7Rect('living','客厅',7.3,17.5,45,35.5),v7Room('dining','餐厨一体',[[54,17.5],[75.5,17.5],[75.5,39.8],[73.8,39.8],[73.8,53],[54,53]]),v7Rect('master','主卧套房',7.3,56,26.5,32.2),v7Rect('elder','长辈房',35.5,56,17.9,32.2),v7Rect('child','儿童房',55.2,56,17.9,32.2),v7Rect('study','书房与客房',75.5,41.7,17.1,46.5)];
 return [];
}
V3_ADMIN_ITEMS.floor.forEach((item,i)=>{item.modelId='floor-model-'+i;item.modelVersion=1;item.rooms=v7SeedRooms(item.image);item.modelingStatus=item.rooms.length?'建模完成':(i===7?'建模失败':'建模中');});
const v7Sync=v4SyncLibrary;
v4SyncLibrary=function(kind){v7Sync(kind);if(kind==='floor'){const available=V3_FLOORS.filter(x=>x.modelingStatus==='建模完成'&&x.rooms?.some(r=>v7AvailableViews(r).length));V3_FLOORS.splice(0,V3_FLOORS.length,...available);}};
v4SyncLibrary('floor');
S.v7Selection=null;S.v7Draft=null;
function v7Floor(draft=false){const selected=draft?S.v7Draft:S.v7Selection;return V3_FLOORS.find(f=>f.modelId===selected?.floorId);}
function v7RoomSelected(draft=false){const selected=draft?S.v7Draft:S.v7Selection;return v7Floor(draft)?.rooms.find(r=>r.id===selected?.roomId);}
function v7AvailableViews(room){return (room?.views||[]).filter(view=>view.id&&view.whiteModelId&&V3_CAMERAS.some(camera=>camera.id===view.cameraPosition));}
function v7ViewSelected(draft=false){const selected=draft?S.v7Draft:S.v7Selection;return v7AvailableViews(v7RoomSelected(draft)).find(view=>view.id===selected?.viewId);}
function v7Valid(draft=false){const selected=draft?S.v7Draft:S.v7Selection,f=v7Floor(draft);return !!(f&&f.modelingStatus==='建模完成'&&f.modelVersion===selected?.version&&v7ViewSelected(draft));}
function v7SelectFloor(index){const f=V3_FLOORS[index];if(!f)return;S.v7Draft={floorId:f.modelId,roomId:null,viewId:null,version:f.modelVersion};S.floorDraftIndex=index;S.floorDraftImage=f.image;S.floorDraftName=f.name;S.floorDraftBox=null;S.floorDraftZoom=1;S.floorFocus=null;S.v7PanX=0;S.v7PanY=0;render();}
const v7OpenPicker=openGeneratePicker;
openGeneratePicker=function(kind){if(S.v7Closing)return;if(kind!=='floor')return v7OpenPicker(kind);S.flowModal='floor';S.v7Draft=S.v7Selection?structuredClone(S.v7Selection):null;const f=v7Floor(true);if(!f){if(V3_FLOORS.length){v7SelectFloor(0);v7AnimatePickerEnter();return;}S.floorDraftImage='';S.floorDraftName='';S.floorDraftIndex=-2;}else{S.floorDraftImage=f.image;S.floorDraftName=f.name;S.floorDraftIndex=V3_FLOORS.indexOf(f);}S.floorDraftZoom=1;S.floorFocus=null;S.v7PanX=0;S.v7PanY=0;render();v7AnimatePickerEnter();};
pickV3Floor=v7SelectFloor;
function v7PickRoom(id){const room=v7Floor(true)?.rooms.find(r=>r.id===id);if(!room)return;const views=v7AvailableViews(room);if(S.v7Draft.roomId!==id||!views.some(view=>view.id===S.v7Draft.viewId)){S.v7Draft.roomId=id;S.v7Draft.viewId=views[0]?.id||null;}render();v7FocusRoom();}
function v7PickView(id){if(!v7AvailableViews(v7RoomSelected(true)).some(v=>v.id===id))return;S.v7Draft.viewId=id;render();}
function v7PolygonCss(points){return 'polygon('+points.map(p=>p[0]+'% '+p[1]+'%').join(',')+')';}
const v7OldBox=v3FloorBox;
v3FloorBox=function(box,mode){if(!box?.preset)return v7OldBox(box,mode);return `<div class="v3-crop-box v7-preset-highlight" data-floor-x="${box.x}" data-floor-y="${box.y}" data-floor-w="${box.w}" data-floor-h="${box.h}" style="clip-path:${v7PolygonCss(box.polygon)}"></div>${box.view?`<div class="v3-crop-box v7-static-view" data-floor-x="${box.x}" data-floor-y="${box.y}" data-floor-w="${box.w}" data-floor-h="${box.h}">${v3CameraOverlay(box,false)}</div>`:''}`;};
const v7OldPicker=generatePickerDialog;
generatePickerDialog=function(){
 if(S.flowModal!=='floor')return v7OldPicker();const f=v7Floor(true),room=v7RoomSelected(true),view=v7ViewSelected(true);
 return `<div class="v3-mask v7-picker-mask"><section class="v3-dialog v7-picker" role="dialog" aria-modal="true" aria-labelledby="v7-picker-title"><header class="v3-dialog-head"><h2 id="v7-picker-title">选择户型与空间</h2><button class="v3-icon-btn" aria-label="关闭户型选择" onclick="closeGeneratePicker()">×</button></header><div class="v3-dialog-body v7-picker-body"><aside class="v3-picker-list"><div class="v3-picker-list-head"><b>户型图</b><span>${V3_FLOORS.length} 张</span></div><div class="v3-mini-grid">${V3_FLOORS.map((item,i)=>`<button class="v3-mini-card ${f===item?'on':''}" aria-pressed="${f===item}" onclick="v7SelectFloor(${i})"><img src="${v3Esc(item.image)}" alt="${v3Esc(item.name)}"><span>${v3Esc(item.name)}</span></button>`).join('')||'<div class="v7-empty">暂无可用户型</div>'}</div></aside><div class="v7-selection-side"><div class="v3-crop-title"><span>${v3Esc(f?.name||'户型图')}</span><div class="v7-zoom"><button class="v3-btn" aria-label="缩小户型图" onclick="v7Zoom(-.25)">−</button><span>${Math.round((S.floorDraftZoom||1)*100)}%</span><button class="v3-btn" aria-label="放大户型图" onclick="v7Zoom(.25)">＋</button></div></div><div class="v7-room-canvas" onpointerdown="v7Pointer(event)" onwheel="v7Wheel(event)">${f?`<div class="v7-floor-sheet" style="aspect-ratio:${f.image.includes('chunhe')?'3444.72 / 4089.4':'1400 / 900'};transform:translate(${S.v7PanX||0}px,${S.v7PanY||0}px) scale(${S.floorDraftZoom||1})"><div class="v7-original-plan ${f.image.includes('chunhe')?'cropped':''}"><img src="${v3Esc(f.image)}" alt="${v3Esc(f.name)}" draggable="false">${f.rooms.map(r=>`<button class="v7-room-hit ${room===r?'selected':''}" style="clip-path:${v7PolygonCss(r.points)}" aria-label="选择${v3Esc(r.name)}" aria-pressed="${room===r}" data-room="${r.id}" onclick="v7RoomClick(event,'${r.id}')"></button>`).join('')}</div></div>${v7InlineViews(room,view)}`:'<div class="v7-empty">暂无可用户型</div>'}</div><div class="v7-current-room"><span>${room?'已选空间':'选择空间'}</span><b>${room?v3Esc(room.name):'点击户型图中的空间'}</b><button class="v3-btn ghost v7-reselect" ${room||(S.floorDraftZoom||1)!==1||S.v7PanX||S.v7PanY?'':'disabled'} onclick="v7Reselect()">重选</button></div></div></div><footer class="v3-dialog-foot"><button class="v3-btn" onclick="closeGeneratePicker()">取消</button><button class="v3-btn primary" ${v7Valid(true)?'':'disabled'} onclick="confirmGeneratePicker()">确定</button></footer></section></div>`;
};
const v7Confirm=confirmGeneratePicker;
confirmGeneratePicker=function(){if(S.flowModal!=='floor')return v7Confirm();if(S.v7Closing)return;if(!v7Valid(true)){toast('请选择空间和视角');return;}v7DismissPicker(()=>{S.v7Selection=structuredClone(S.v7Draft);const f=v7Floor(),r=v7RoomSelected();S.floorImage=f.image;S.floorName=f.name;S.floorBox={...structuredClone(r.box),view:v7ViewSelected().cameraPosition};S.flowModal='';render();});};
const v7Close=closeGeneratePicker;
closeGeneratePicker=function(){const close=()=>{S.v7Draft=null;S.v7PanX=0;S.v7PanY=0;v7Close();};if(S.flowModal==='floor')return v7DismissPicker(close);close();};
function v7PickerMotion(enter){
 const mask=document.querySelector('.v7-picker-mask'),dialog=mask?.querySelector('.v7-picker');if(!dialog)return [];
 [mask,dialog].forEach(node=>node.getAnimations().forEach(animation=>animation.cancel()));
 const options={duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:200,easing:enter?'cubic-bezier(.2,.7,.3,1)':'cubic-bezier(.4,0,.6,1)',fill:'both'};
 const frames=[{opacity:0,transform:'translateY(10px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}];
 return [mask.animate(enter?[{opacity:0},{opacity:1}]:[{opacity:1},{opacity:0}],options),dialog.animate(enter?frames:[...frames].reverse(),options)];
}
function v7AnimatePickerEnter(){v7PickerMotion(true);}
function v7DismissPicker(done){
 if(S.v7Closing)return;
 cancelAnimationFrame(v7FocusFrame);S.v7Closing=true;
 const mask=document.querySelector('.v7-picker-mask');mask?.classList.add('v7-closing');mask?.setAttribute('aria-busy','true');
 const animations=v7PickerMotion(false);
 if(!animations.length){S.v7Closing=false;done();return;}
 return Promise.allSettled(animations.map(animation=>animation.finished)).then(()=>{S.v7Closing=false;if(S.flowModal==='floor')done();});
}
// A shared gesture session prevents duplicate pinch handlers and one-finger jumps.
let v7Pointers=new Map(),v7Gesture=null,v7SuppressClickUntil=0,v7FocusFrame=0;
function v7CanvasScale(canvas){return canvas.getBoundingClientRect().width/canvas.offsetWidth||1;}
function v7ApplyViewport(){
 const canvas=document.querySelector('.v7-room-canvas');if(!canvas)return;
 const sheet=canvas.querySelector('.v7-floor-sheet');if(!sheet)return;
 const zoom=S.floorDraftZoom||1;
 const lx=(sheet.offsetWidth*zoom+canvas.clientWidth)/2-60,ly=(sheet.offsetHeight*zoom+canvas.clientHeight)/2-60;
 S.v7PanX=Math.max(-lx,Math.min(lx,S.v7PanX||0));S.v7PanY=Math.max(-ly,Math.min(ly,S.v7PanY||0));
 sheet.style.transform=`translate(${S.v7PanX}px,${S.v7PanY}px) scale(${zoom})`;
 const label=canvas.closest('.v7-selection-side').querySelector('.v7-zoom span');if(label)label.textContent=Math.round(zoom*100)+'%';
 const reset=canvas.closest('.v7-selection-side').querySelector('.v7-reselect');if(reset)reset.disabled=!v7RoomSelected(true)&&Math.abs(zoom-1)<.001&&Math.abs(S.v7PanX)<.001&&Math.abs(S.v7PanY)<.001;
 v7LayoutInlineViews();
}
function v7FocusRoom(){
 const canvas=document.querySelector('.v7-room-canvas'),plan=canvas?.querySelector('.v7-original-plan'),room=v7RoomSelected(true);if(!plan||!room)return;
 cancelAnimationFrame(v7FocusFrame);
 const c=canvas.getBoundingClientRect(),p=plan.getBoundingClientRect(),scale=v7CanvasScale(canvas),zoom=S.floorDraftZoom||1;
 const w=p.width/scale/zoom,h=p.height/scale/zoom;
 const cx=(p.left-c.left+p.width*(room.box.x+room.box.w/2)/100)/scale;
 const cy=(p.top-c.top+p.height*(room.box.y+room.box.h/2)/100)/scale;
 const ox=(cx-canvas.clientWidth/2-(S.v7PanX||0))/zoom,oy=(cy-canvas.clientHeight/2-(S.v7PanY||0))/zoom;
 const targetZoom=Math.max(.8,Math.min(3,(canvas.clientWidth-144)/(w*room.box.w/100),(canvas.clientHeight-144)/(h*room.box.h/100)));
 v7AnimateViewport({zoom:targetZoom,x:-ox*targetZoom,y:-oy*targetZoom});
}
function v7AnimateViewport(to){
 cancelAnimationFrame(v7FocusFrame);const canvas=document.querySelector('.v7-room-canvas');if(!canvas)return;
 const from={zoom:S.floorDraftZoom||1,x:S.v7PanX||0,y:S.v7PanY||0};
 let started=null;const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:420;
 function frame(now){if(!canvas.isConnected)return;if(started===null)started=now;const t=duration?Math.min(1,Math.max(0,(now-started)/duration)):1,k=1-Math.pow(1-t,3);S.floorDraftZoom=from.zoom+(to.zoom-from.zoom)*k;S.v7PanX=from.x+(to.x-from.x)*k;S.v7PanY=from.y+(to.y-from.y)*k;v7ApplyViewport();if(t<1)v7FocusFrame=requestAnimationFrame(frame);}
 v7FocusFrame=requestAnimationFrame(frame);
}
function v7ZoomAt(zoom,x,y){
 const canvas=document.querySelector('.v7-room-canvas');if(!canvas)return;
 cancelAnimationFrame(v7FocusFrame);const old=S.floorDraftZoom||1,next=Math.max(.8,Math.min(3,zoom));
 const ox=(x??canvas.clientWidth/2)-canvas.clientWidth/2,oy=(y??canvas.clientHeight/2)-canvas.clientHeight/2;
 S.v7PanX=ox-(ox-(S.v7PanX||0))*next/old;S.v7PanY=oy-(oy-(S.v7PanY||0))*next/old;S.floorDraftZoom=next;v7ApplyViewport();
}
function v7Zoom(delta){v7ZoomAt((S.floorDraftZoom||1)+delta);}
function v7Reselect(){cancelAnimationFrame(v7FocusFrame);if(S.v7Draft){S.v7Draft.roomId=null;S.v7Draft.viewId=null;}v7SuppressClickUntil=0;render();v7AnimateViewport({zoom:1,x:0,y:0});}
function v7Wheel(e){e.preventDefault();const canvas=e.currentTarget,c=canvas.getBoundingClientRect(),scale=v7CanvasScale(canvas),x=(e.clientX-c.left)/scale,y=(e.clientY-c.top)/scale;v7ZoomAt((S.floorDraftZoom||1)*Math.exp(-e.deltaY*.002),x,y);}
function v7RebaseGesture(){
 const points=[...v7Pointers.values()];if(!points.length)return;
 v7Gesture={points,zoom:S.floorDraftZoom||1,x:S.v7PanX||0,y:S.v7PanY||0,distance:points.length>1?Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y):0};
}
function v7Pointer(e){
 if(e.pointerType==='mouse'&&e.button!==0)return;
 cancelAnimationFrame(v7FocusFrame);const canvas=e.currentTarget;
 if(!v7Pointers.size){window.addEventListener('pointermove',v7PointerMove);window.addEventListener('pointerup',v7PointerEnd);window.addEventListener('pointercancel',v7PointerEnd);canvas.classList.add('dragging');}
 v7Pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,canvas});v7RebaseGesture();
 if(v7Pointers.size>1)v7SuppressClickUntil=performance.now()+400;
}
function v7PointerMove(e){
 const previous=v7Pointers.get(e.pointerId);if(!previous||!v7Gesture)return;
 const canvas=previous.canvas;if(!canvas.isConnected){v7PointerEnd(e);return;}
 v7Pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,canvas});const points=[...v7Pointers.values()],scale=v7CanvasScale(canvas),c=canvas.getBoundingClientRect();
 const start=v7Gesture.points,center=ps=>({x:ps.reduce((sum,p)=>sum+p.x,0)/ps.length,y:ps.reduce((sum,p)=>sum+p.y,0)/ps.length}),a=center(start),b=center(points);
 if(points.length>1){
  const distance=Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y),zoom=Math.max(.8,Math.min(3,v7Gesture.zoom*distance/Math.max(1,v7Gesture.distance))),ratio=zoom/v7Gesture.zoom;
  const ox=(a.x-c.left)/scale-canvas.clientWidth/2,oy=(a.y-c.top)/scale-canvas.clientHeight/2;
  S.floorDraftZoom=zoom;S.v7PanX=ox-(ox-v7Gesture.x)*ratio+(b.x-a.x)/scale;S.v7PanY=oy-(oy-v7Gesture.y)*ratio+(b.y-a.y)/scale;
 }else{if(Math.hypot(b.x-a.x,b.y-a.y)<6)return;S.v7PanX=v7Gesture.x+(b.x-a.x)/scale;S.v7PanY=v7Gesture.y+(b.y-a.y)/scale;}
 v7SuppressClickUntil=performance.now()+400;e.preventDefault();v7ApplyViewport();
}
function v7PointerEnd(e){
 const point=v7Pointers.get(e.pointerId);if(!point)return;v7Pointers.delete(e.pointerId);
 if(v7Pointers.size){v7SuppressClickUntil=performance.now()+400;v7RebaseGesture();return;}
 point.canvas.classList.remove('dragging');v7Gesture=null;window.removeEventListener('pointermove',v7PointerMove);window.removeEventListener('pointerup',v7PointerEnd);window.removeEventListener('pointercancel',v7PointerEnd);
}
function v7RoomClick(e,id){e.stopPropagation();if(performance.now()<v7SuppressClickUntil)return;v7PickRoom(id);}
const v7Setup=generateSetupScreen;
generateSetupScreen=function(){const t=document.createElement('template');t.innerHTML=v7Setup();const r=v7RoomSelected(),v=v7ViewSelected();if(r&&v){const p=t.content.querySelector('.v3-choice-panel');p.insertAdjacentHTML('beforeend',`<div class="v7-selection-summary"><b>${v3Esc(r.name)}</b></div>`);}t.content.querySelector('[onclick="generateBase()"]')?.toggleAttribute('disabled',!v7Valid()||!S.styleImage);return t.innerHTML;};
const v7Start=startRoute;
startRoute=function(route){S.v7Selection=null;S.v7Draft=null;v7Start(route);};
generateBase=function(){if(!S.styleImage){toast('请选择风格参考图');return;}if(!v7Valid()){toast('请选择户型、空间和视角');return;}const f=v7Floor(),r=v7RoomSelected(),v=v7ViewSelected();S.v7TaskInput={floorId:f.modelId,floorName:f.name,roomId:r.id,roomName:r.name,viewId:v.id,cameraPosition:v.cameraPosition,whiteModelId:f.modelId+'-'+v.whiteModelId,version:f.modelVersion};S.generationStartedAt=v3Now();S.page='loadingBase';render();clearTimeout(S.loadingTimer);S.loadingTimer=setTimeout(finishBaseGeneration,1100);};
const v7Finish=finishBaseGeneration;
finishBaseGeneration=function(){v7Finish();const log=V3_CALL_LOGS[0];if(log?.type==='生成效果图'){log.modelSelection=structuredClone(S.v7TaskInput);log.floorBox=structuredClone(S.floorBox);const input=log.inputs.find(x=>x.floorBox);if(input){input.floorBox=structuredClone(S.floorBox);input.label='户型图与预设空间';}log.mainLabel=S.floorName+' · '+S.v7TaskInput.roomName;log.modelInput={whiteModelId:S.v7TaskInput.whiteModelId,viewId:S.v7TaskInput.viewId,styleImage:S.styleImage};}render();};
const v7Preview=generatePreviewScreen;
generatePreviewScreen=function(){return v7Preview().replace('框选范围','所选空间').replace('生成时使用的户型区域',v3Esc(S.v7TaskInput?.roomName||''));};
const v7Detail=v3CallDetailDialog;
v3CallDetailDialog=function(){let html=v7Detail();const m=S.v3CallDetail?.modelSelection;if(m)html=html.replace('<h3>输入内容</h3>',`<h3>输入内容</h3><div class="v7-record-selection"><b>${v3Esc(m.roomName)}</b></div>`);return html;};
const v7ResourceScreen=v6SpaceScreen;
function v7ModelStatusBadge(status){const label=status||'建模中',cls=label==='建模完成'?'complete':label==='建模失败'?'failed':'pending';return `<span class="v7-model-status ${cls}">${v3Esc(label)}</span>`;}
function v7ChangeModelFilter(value){S.v7ModelFilter=['','建模中','建模完成','建模失败'].includes(value)?value:'';render();}
v6SpaceScreen=function(){
 if(S.v6TypeFilter&&S.v6TypeFilter!=='floor')S.v7ModelFilter='';
 const t=document.createElement('template');t.innerHTML=v7ResourceScreen();
 t.content.querySelector('table')?.classList.add('v7-resource-table');
 const reset=[...t.content.querySelectorAll('.v3-admin-filters button')].find(button=>button.textContent.trim()==='重置');if(reset)reset.setAttribute('onclick',reset.getAttribute('onclick').replace('render()',"S.v7ModelFilter='';render()"));
 if(!S.v6TypeFilter||S.v6TypeFilter==='floor'){
  const filters=t.content.querySelector('.v3-admin-filters'),type=filters.querySelector('[aria-label="筛选类型"]').closest('label');
  type.insertAdjacentHTML('afterend',`<label class="v6-filter-label v7-model-filter-label">建模状态<select aria-label="筛选建模状态" onchange="v7ChangeModelFilter(this.value)"><option value="">全部建模状态</option>${['建模中','建模完成','建模失败'].map(status=>`<option value="${status}" ${S.v7ModelFilter===status?'selected':''}>${status}</option>`).join('')}</select></label>`);
 }
 const rows=['floor','render','style'].flatMap(kind=>V3_ADMIN_ITEMS[kind].map((item,index)=>({item,index,kind}))).filter(({item,kind})=>(!S.v6TypeFilter||kind===S.v6TypeFilter)&&(!S.adminQuery||item.name.includes(S.adminQuery))&&(S.adminStatus==='all'||S.adminStatus===item.status)).sort((a,b)=>a.item.sort-b.item.sort);
 let visible=0;
 t.content.querySelectorAll('tbody tr').forEach((row,i)=>{const entry=rows[i];if(!entry){row.remove();return;}const status=entry.item.modelingStatus||'建模中';if(S.v7ModelFilter&&(entry.kind!=='floor'||status!==S.v7ModelFilter)){row.remove();return;}if(entry.kind==='floor')row.children[5].insertAdjacentHTML('beforeend',`<div class="v7-model-caption">${v7ModelStatusBadge(status)}</div>`);row.children[0].textContent=++visible;});
 if(!visible)t.content.querySelector('tbody').innerHTML='<tr><td colspan="9">暂无符合条件的图片</td></tr>';
 return t.innerHTML;
};
const v7AdminDialog=v3AdminItemDialog;
v3AdminItemDialog=function(){const t=document.createElement('template');t.innerHTML=v7AdminDialog();const f=S.v3AdminForm;if(['floor','render','style'].includes(S.adminSection)&&(f.resourceType||S.adminSection)==='floor'){const editing=Number.isInteger(f.editIndex),item=editing&&S.adminSection==='floor'?V3_ADMIN_ITEMS.floor[f.editIndex]:null;t.content.querySelector('.v3-dialog-body').insertAdjacentHTML('beforeend',`<div class="v7-admin-model"><span>建模状态</span><b>${item?.modelingStatus||'建模中'}</b></div>`);}return t.innerHTML;};
const v7SaveAdmin=saveV3AdminItem;
saveV3AdminItem=function(){const f=S.v3AdminForm;if(!['floor','render','style'].includes(S.adminSection))return v7SaveAdmin();const source=S.adminSection,target=f.resourceType||source,index=f.editIndex,old=Number.isInteger(index)?V3_ADMIN_ITEMS[source][index]:null;if(target==='floor'){const preserve=source==='floor'&&old&&old.image===f.image;f.modelId=preserve?old.modelId:'floor-model-'+Date.now();f.modelVersion=preserve?old.modelVersion:(old?.modelVersion||0)+1;f.modelingStatus=preserve?old.modelingStatus:'建模中';f.rooms=preserve?old.rooms:[];}else{delete f.modelingStatus;delete f.rooms;delete f.modelId;delete f.modelVersion;}v7SaveAdmin();};
/* Developer-only DB stand-in. No product control for publishing modeling. */
window.v7MockDatabase={complete(floorId,rooms){const f=V3_ADMIN_ITEMS.floor.find(x=>x.modelId===floorId);if(!f||!Array.isArray(rooms)||!rooms.length||rooms.some(r=>!r.points?.length||!r.views?.length))return false;f.rooms=structuredClone(rooms);f.modelingStatus='建模完成';f.modelVersion++;v4SyncLibrary('floor');render();return true;}};
const v7Thumbnail=v6FloorThumbnail;
v6FloorThumbnail=async function(src,box,width,height){if(!box?.preset)return v7Thumbnail(src,box,width,height);const original=new Image();original.src=src;await original.decode();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d'),scale=Math.min(width/original.naturalWidth,height/original.naturalHeight),w=original.naturalWidth*scale,h=original.naturalHeight*scale,ox=(width-w)/2,oy=(height-h)/2;ctx.drawImage(original,ox,oy,w,h);ctx.beginPath();box.polygon.forEach((p,i)=>{const x=ox+w*(box.x+box.w*p[0]/100)/100,y=oy+h*(box.y+box.h*p[1]/100)/100;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.globalCompositeOperation='multiply';ctx.fillStyle='#b9e9ee';ctx.fill();ctx.globalCompositeOperation='source-over';
 const camera=V3_CAMERAS.find(c=>c.id===box.view);
 if(camera){
  const roomX=ox+w*box.x/100,roomY=oy+h*box.y/100,roomW=w*box.w/100,roomH=h*box.h/100;
  const cx=roomX+roomW*camera.x/100+camera.dx*12,cy=roomY+roomH*camera.y/100+camera.dy*12,angle=camera.angle*Math.PI/180,radius=Math.max(30,Math.min(90,Math.max(roomW,roomH)*.9));
  ctx.save();ctx.beginPath();ctx.rect(0,0,width,height);box.polygon.forEach((p,i)=>{const x=roomX+roomW*p[0]/100,y=roomY+roomH*p[1]/100;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.clip('evenodd');
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,radius,angle-Math.PI/5,angle+Math.PI/5);ctx.closePath();ctx.fillStyle='rgba(0,162,211,.2)';ctx.fill();ctx.strokeStyle='#00a2d3';ctx.lineWidth=1;ctx.stroke();ctx.restore();
  ctx.save();ctx.translate(cx,cy);ctx.fillStyle='#009dce';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.rotate(angle);ctx.strokeStyle='#fff';ctx.lineWidth=1.3;ctx.strokeRect(-5,-3.5,6,7);ctx.beginPath();ctx.moveTo(1,-2);ctx.lineTo(5,-4);ctx.lineTo(5,4);ctx.lineTo(1,2);ctx.closePath();ctx.stroke();ctx.restore();
 }
 return canvas.toDataURL('image/png');};
render();


// View controls are anchored to the selected room inside the floor-plan canvas.
function v7InlineViews(room,view){
 if(!room)return '';
 const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="11" height="10" rx="2"/><path d="m14 10 6-4v12l-6-4z"/></svg>';
 return '<div class="v7-inline-views" role="group" aria-label="预设视角">'+(view?v3CameraFieldMarkup(V3_CAMERAS.find(c=>c.id===view.cameraPosition)):'')+v7AvailableViews(room).map(v=>`<button class="v3-camera v7-view ${view===v?'selected':''}" data-view-id="${v.id}" data-position="${v.cameraPosition}" aria-label="${v3Esc(({nw:'左上角',n:'上方',ne:'右上角',e:'右侧',se:'右下角',s:'下方',sw:'左下角',w:'左侧'})[v.cameraPosition])}预设摄像头" aria-pressed="${view===v}" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation();v7PickView('${v.id}')">${icon}</button>`).join('')+'</div>';
}
function v7LayoutInlineViews(){
 const canvas=document.querySelector('.v7-room-canvas'),plan=canvas?.querySelector('.v7-original-plan'),room=v7RoomSelected(true);
 if(!canvas||!plan||!room)return;
 const c=canvas.getBoundingClientRect(),p=plan.getBoundingClientRect(),scale=c.width/canvas.offsetWidth;
 const left=(p.left-c.left+p.width*room.box.x/100)/scale,top=(p.top-c.top+p.height*room.box.y/100)/scale;
 const width=p.width*room.box.w/100/scale,height=p.height*room.box.h/100/scale;
 canvas.querySelectorAll('.v7-view').forEach(button=>{
  const camera=V3_CAMERAS.find(c=>c.id===button.dataset.position);if(!camera)return;
  const x=Math.max(38,Math.min(canvas.clientWidth-38,left+width*camera.x/100+camera.dx*36));
  const y=Math.max(38,Math.min(canvas.clientHeight-38,top+height*camera.y/100+camera.dy*36));
  button.style.left=x+'px';button.style.top=y+'px';button.querySelector('svg').style.transform=`rotate(${camera.angle}deg)`;
  if(button.classList.contains('selected')){const field=canvas.querySelector('.v3-camera-field');if(field){v3LayoutCameraField(field,width,height,{...camera,x:camera.x,y:camera.y});field.style.left=(left-200)+'px';field.style.top=(top-200)+'px';}}
 });
}
const v7RenderInline=render;
render=function(){v7RenderInline();v7LayoutInlineViews();requestAnimationFrame(v7LayoutInlineViews);const img=document.querySelector('.v7-original-plan img');if(img&&!img.complete)img.addEventListener('load',v7LayoutInlineViews,{once:true});};
window.addEventListener('resize',()=>requestAnimationFrame(v7LayoutInlineViews));
render();