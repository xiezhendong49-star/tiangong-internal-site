/* 2026-10-10 independent prototype: preconfigured rooms and views. */
const V7_VERSION='20261010';
// Example delivery data: each preset view occupies one of the original eight positions.
const V7_ROOM_CAMERA_POSITIONS={living:['w','s','ne'],dining:['n','se'],child:['ne','sw'],elder:['w','ne'],master:['nw','e'],kitchen:['nw','e'],bath:['sw'],second:['n','se'],third:['ne','sw'],study:['nw','s'],multi:['ne','w']};
function v7Room(id,name,points,viewNames=['从门口看向窗边','从窗边看向室内']){
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
 return {id,name,points,box:{x,y,w,h,preset:true,polygon:points.map(p=>[(p[0]-x)/w*100,(p[1]-y)/h*100])},views:viewNames.map((name,i)=>({id:id+'-view-'+(i+1),name,whiteModelId:id+'-white-'+(i+1),cameraPosition:V7_ROOM_CAMERA_POSITIONS[id][i]}))};
}
const v7Rect=(id,name,x,y,w,h,views)=>v7Room(id,name,[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],views);
function v7SeedRooms(image){
 if(image.includes('floor-chunhe'))return [
 v7Room('living','客厅',[[21.5,51.5],[56.6,51.5],[56.6,68.7],[53,68.7],[53,70.2],[21.5,70.2]],['从阳台看向客厅','从客厅看向阳台','从餐厅看向客厅']),
 v7Rect('dining','餐厅',37.5,41.7,18.8,12.3,['从客厅看向餐厅','从玄关看向餐厅']),
 v7Rect('child','子女房',26.2,30.5,17.4,8.1),v7Rect('elder','长辈房',55.5,30.5,16.5,10.9),
 v7Room('master','主卧室',[[57.7,57],[72.3,57],[72.3,56.8],[79.6,56.8],[79.6,65.1],[57.7,65.1]]),
 v7Rect('kitchen','厨房',21.5,39.4,15,11.3,['从餐厅看向操作台','从操作台看向餐厅']),
 v7Rect('bath','主卫',57.5,47.8,14.7,6.5,['从门口看向洗手台'])];
 if(image.includes('floorplan-98'))return [v7Rect('living','客餐厅',7.3,17.5,43.3,39.5),v7Rect('master','主卧',7.3,59.8,27.9,28.3),v7Rect('second','次卧',37,59.8,20.3,28.3),v7Rect('study','书房',59.1,59.8,17.1,28.3),v7Rect('kitchen','厨房',52.4,17.5,21.7,18.3),v7Rect('bath','卫生间',75.6,17.5,17,18.3,['从门口看向洗手台'])];
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
openGeneratePicker=function(kind){if(kind!=='floor')return v7OpenPicker(kind);S.flowModal='floor';S.v7Draft=S.v7Selection?structuredClone(S.v7Selection):null;const f=v7Floor(true);if(!f){if(V3_FLOORS.length){v7SelectFloor(0);return;}S.floorDraftImage='';S.floorDraftName='';S.floorDraftIndex=-2;}else{S.floorDraftImage=f.image;S.floorDraftName=f.name;S.floorDraftIndex=V3_FLOORS.indexOf(f);}S.floorDraftZoom=1;S.floorFocus=null;S.v7PanX=0;S.v7PanY=0;render();};
pickV3Floor=v7SelectFloor;
function v7PickRoom(id){const room=v7Floor(true)?.rooms.find(r=>r.id===id);if(!room)return;const views=v7AvailableViews(room);if(S.v7Draft.roomId!==id||!views.some(view=>view.id===S.v7Draft.viewId)){S.v7Draft.roomId=id;S.v7Draft.viewId=views[0]?.id||null;}render();}
function v7PickView(id){if(!v7AvailableViews(v7RoomSelected(true)).some(v=>v.id===id))return;S.v7Draft.viewId=id;render();}
function v7PolygonCss(points){return 'polygon('+points.map(p=>p[0]+'% '+p[1]+'%').join(',')+')';}
const v7OldBox=v3FloorBox;
v3FloorBox=function(box,mode){if(!box?.preset)return v7OldBox(box,mode);return `<div class="v3-crop-box v7-preset-highlight" data-floor-x="${box.x}" data-floor-y="${box.y}" data-floor-w="${box.w}" data-floor-h="${box.h}" style="clip-path:${v7PolygonCss(box.polygon)}"></div>${box.view?`<div class="v3-crop-box v7-static-view" data-floor-x="${box.x}" data-floor-y="${box.y}" data-floor-w="${box.w}" data-floor-h="${box.h}">${v3CameraOverlay(box,false)}</div>`:''}`;};
const v7OldPicker=generatePickerDialog;
generatePickerDialog=function(){
 if(S.flowModal!=='floor')return v7OldPicker();const f=v7Floor(true),room=v7RoomSelected(true),view=v7ViewSelected(true);
 return `<div class="v3-mask"><section class="v3-dialog v7-picker" role="dialog" aria-modal="true" aria-labelledby="v7-picker-title"><header class="v3-dialog-head"><h2 id="v7-picker-title">选择户型与空间</h2><button class="v3-icon-btn" aria-label="关闭户型选择" onclick="closeGeneratePicker()">×</button></header><div class="v3-dialog-body v7-picker-body"><aside class="v3-picker-list"><div class="v3-picker-list-head"><b>户型图</b><span>${V3_FLOORS.length} 张</span></div><div class="v3-mini-grid">${V3_FLOORS.map((item,i)=>`<button class="v3-mini-card ${f===item?'on':''}" aria-pressed="${f===item}" onclick="v7SelectFloor(${i})"><img src="${v3Esc(item.image)}" alt="${v3Esc(item.name)}"><span>${v3Esc(item.name)}</span></button>`).join('')||'<div class="v7-empty">暂无可用户型</div>'}</div></aside><div class="v7-selection-side"><div class="v3-crop-title"><span>${v3Esc(f?.name||'户型图')}</span><div class="v7-zoom"><button class="v3-btn" aria-label="缩小户型图" onclick="v7Zoom(-.25)">−</button><span>${Math.round((S.floorDraftZoom||1)*100)}%</span><button class="v3-btn" aria-label="放大户型图" onclick="v7Zoom(.25)">＋</button></div></div><div class="v7-room-canvas" onpointerdown="v7Pointer(event)" onwheel="v7Wheel(event)">${f?`<div class="v7-floor-sheet" style="aspect-ratio:${f.image.includes('chunhe')?'3444.72 / 4089.4':'1400 / 900'};transform:translate(${S.v7PanX||0}px,${S.v7PanY||0}px) scale(${S.floorDraftZoom||1})"><div class="v7-original-plan ${f.image.includes('chunhe')?'cropped':''}"><img src="${v3Esc(f.image)}" alt="${v3Esc(f.name)}" draggable="false">${f.rooms.map(r=>`<button class="v7-room-hit ${room===r?'selected':''}" style="clip-path:${v7PolygonCss(r.points)}" aria-label="选择${v3Esc(r.name)}" aria-pressed="${room===r}" data-room="${r.id}" onclick="v7RoomClick(event,'${r.id}')"></button>`).join('')}</div></div>${v7InlineViews(room,view)}`:'<div class="v7-empty">暂无可用户型</div>'}</div><div class="v7-current-room"><span>${room?'已选空间':'选择空间'}</span><b>${room?v3Esc(room.name):'点击户型图中的空间'}</b>${view?`<span class="v7-inline-view-name">${v3Esc(view.name)}</span>`:''}</div></div></div><footer class="v3-dialog-foot"><button class="v3-btn" onclick="closeGeneratePicker()">取消</button><button class="v3-btn primary" ${v7Valid(true)?'':'disabled'} onclick="confirmGeneratePicker()">确定</button></footer></section></div>`;
};
const v7Confirm=confirmGeneratePicker;
confirmGeneratePicker=function(){if(S.flowModal!=='floor')return v7Confirm();if(!v7Valid(true)){toast('请选择空间和视角');return;}S.v7Selection=structuredClone(S.v7Draft);const f=v7Floor(),r=v7RoomSelected();S.floorImage=f.image;S.floorName=f.name;S.floorBox={...structuredClone(r.box),view:v7ViewSelected().cameraPosition};S.flowModal='';render();};
const v7Close=closeGeneratePicker;
closeGeneratePicker=function(){S.v7Draft=null;S.v7PanX=0;S.v7PanY=0;v7Close();};
function v7Zoom(delta){S.floorDraftZoom=Math.max(1,Math.min(3,(S.floorDraftZoom||1)+delta));if(S.floorDraftZoom===1){S.v7PanX=0;S.v7PanY=0;}render();}
function v7Wheel(e){e.preventDefault();v7Zoom(e.deltaY>0?-.15:.15);}
let v7Pointers=new Map(),v7Moved=false;
function v7Pointer(e){if(e.button!==0&&e.pointerType==='mouse')return;const canvas=e.currentTarget;v7Pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});v7Moved=false;const start={x:e.clientX,y:e.clientY,panX:S.v7PanX||0,panY:S.v7PanY||0,zoom:S.floorDraftZoom||1};let pinch=null;
 const move=ev=>{if(!v7Pointers.has(ev.pointerId))return;v7Pointers.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});const points=[...v7Pointers.values()],sheet=canvas.querySelector('.v7-floor-sheet');if(points.length===2){const distance=Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y);if(!pinch)pinch={distance,zoom:S.floorDraftZoom||1};S.floorDraftZoom=Math.max(1,Math.min(3,pinch.zoom*distance/pinch.distance));v7Moved=true;}else if((S.floorDraftZoom||1)>1&&Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>6){v7Moved=true;const scale=document.getElementById('ipad').getBoundingClientRect().width/1194;const limitX=canvas.clientWidth*(S.floorDraftZoom-1)/2,limitY=canvas.clientHeight*(S.floorDraftZoom-1)/2;S.v7PanX=Math.max(-limitX,Math.min(limitX,start.panX+(ev.clientX-start.x)/scale));S.v7PanY=Math.max(-limitY,Math.min(limitY,start.panY+(ev.clientY-start.y)/scale));}if(sheet)sheet.style.transform=`translate(${S.v7PanX||0}px,${S.v7PanY||0}px) scale(${S.floorDraftZoom||1})`;v7LayoutInlineViews();};
 const end=ev=>{if(ev.pointerId!==e.pointerId)return;v7Pointers.delete(ev.pointerId);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end);if(v7Moved){setTimeout(()=>{v7Moved=false;render();},0);}};window.addEventListener('pointermove',move);window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
}
function v7RoomClick(e,id){if(v7Moved)return;e.stopPropagation();v7PickRoom(id);}
const v7Setup=generateSetupScreen;
generateSetupScreen=function(){const t=document.createElement('template');t.innerHTML=v7Setup();const r=v7RoomSelected(),v=v7ViewSelected();if(r&&v){const p=t.content.querySelector('.v3-choice-panel');p.insertAdjacentHTML('beforeend',`<div class="v7-selection-summary"><b>${v3Esc(r.name)}</b><span>${v3Esc(v.name)}</span></div>`);}t.content.querySelector('[onclick="generateBase()"]')?.toggleAttribute('disabled',!v7Valid()||!S.styleImage);return t.innerHTML;};
const v7Start=startRoute;
startRoute=function(route){S.v7Selection=null;S.v7Draft=null;v7Start(route);};
generateBase=function(){if(!S.styleImage){toast('请选择风格参考图');return;}if(!v7Valid()){toast('请选择户型、空间和视角');return;}const f=v7Floor(),r=v7RoomSelected(),v=v7ViewSelected();S.v7TaskInput={floorId:f.modelId,floorName:f.name,roomId:r.id,roomName:r.name,viewId:v.id,viewName:v.name,whiteModelId:f.modelId+'-'+v.whiteModelId,version:f.modelVersion};S.generationStartedAt=v3Now();S.page='loadingBase';render();clearTimeout(S.loadingTimer);S.loadingTimer=setTimeout(finishBaseGeneration,1100);};
const v7Finish=finishBaseGeneration;
finishBaseGeneration=function(){v7Finish();const log=V3_CALL_LOGS[0];if(log?.type==='生成效果图'){log.modelSelection=structuredClone(S.v7TaskInput);log.floorBox=structuredClone(S.floorBox);const input=log.inputs.find(x=>x.floorBox);if(input){input.floorBox=structuredClone(S.floorBox);input.label='户型图与预设空间';}log.mainLabel=S.floorName+' · '+S.v7TaskInput.roomName;log.modelInput={whiteModelId:S.v7TaskInput.whiteModelId,viewId:S.v7TaskInput.viewId,styleImage:S.styleImage};}render();};
const v7Preview=generatePreviewScreen;
generatePreviewScreen=function(){return v7Preview().replace('框选范围','所选空间').replace('生成时使用的户型区域',v3Esc(S.v7TaskInput?.roomName||'')).replace('<div class="v3-preview-meta">',`<div class="v7-result-view">${v3Esc(S.v7TaskInput?.viewName||'')}</div><div class="v3-preview-meta">`);};
const v7Detail=v3CallDetailDialog;
v3CallDetailDialog=function(){let html=v7Detail();const m=S.v3CallDetail?.modelSelection;if(m)html=html.replace('<h3>输入内容</h3>',`<h3>输入内容</h3><div class="v7-record-selection"><b>${v3Esc(m.roomName)}</b><span>${v3Esc(m.viewName)}</span></div>`);return html;};
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
v6FloorThumbnail=async function(src,box,width,height){if(!box?.preset)return v7Thumbnail(src,box,width,height);const original=new Image();original.src=src;await original.decode();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d'),scale=Math.min(width/original.naturalWidth,height/original.naturalHeight),w=original.naturalWidth*scale,h=original.naturalHeight*scale,ox=(width-w)/2,oy=(height-h)/2;ctx.drawImage(original,ox,oy,w,h);ctx.beginPath();box.polygon.forEach((p,i)=>{const x=ox+w*(box.x+box.w*p[0]/100)/100,y=oy+h*(box.y+box.h*p[1]/100)/100;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.globalCompositeOperation='multiply';ctx.fillStyle='#b9e9ee';ctx.fill();return canvas.toDataURL('image/png');};
render();


// View controls are anchored to the selected room inside the floor-plan canvas.
function v7InlineViews(room,view){
 if(!room)return '';
 const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="11" height="10" rx="2"/><path d="m14 10 6-4v12l-6-4z"/></svg>';
 return '<div class="v7-inline-views" role="group" aria-label="预设视角">'+(view?v3CameraFieldMarkup(V3_CAMERAS.find(c=>c.id===view.cameraPosition)):'')+v7AvailableViews(room).map(v=>`<button class="v3-camera v7-view ${view===v?'selected':''}" data-view-id="${v.id}" data-position="${v.cameraPosition}" aria-label="${v3Esc(v.name)}" title="${v3Esc(v.name)}" aria-pressed="${view===v}" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation();v7PickView('${v.id}')">${icon}</button>`).join('')+'</div>';
}
function v7LayoutInlineViews(){
 const canvas=document.querySelector('.v7-room-canvas'),plan=canvas?.querySelector('.v7-original-plan'),room=v7RoomSelected(true);
 if(!canvas||!plan||!room)return;
 const c=canvas.getBoundingClientRect(),p=plan.getBoundingClientRect(),scale=c.width/canvas.offsetWidth;
 const left=(p.left-c.left+p.width*room.box.x/100)/scale,top=(p.top-c.top+p.height*room.box.y/100)/scale;
 const width=p.width*room.box.w/100/scale,height=p.height*room.box.h/100/scale;
 canvas.querySelectorAll('.v7-view').forEach(button=>{
  const camera=V3_CAMERAS.find(c=>c.id===button.dataset.position);if(!camera)return;
  const x=Math.max(28,Math.min(canvas.clientWidth-28,left+width*camera.x/100+camera.dx*36));
  const y=Math.max(28,Math.min(canvas.clientHeight-28,top+height*camera.y/100+camera.dy*36));
  button.style.left=x+'px';button.style.top=y+'px';button.querySelector('svg').style.transform=`rotate(${camera.angle}deg)`;
  if(button.classList.contains('selected')){const field=canvas.querySelector('.v3-camera-field');if(field){v3LayoutCameraField(field,width,height,{...camera,x:(x-left)/width*100,y:(y-top)/height*100,dx:0,dy:0});field.style.left=(left-200)+'px';field.style.top=(top-200)+'px';}}
 });
}
const v7RenderInline=render;
render=function(){v7RenderInline();v7LayoutInlineViews();requestAnimationFrame(v7LayoutInlineViews);const img=document.querySelector('.v7-original-plan img');if(img&&!img.complete)img.addEventListener('load',v7LayoutInlineViews,{once:true});};
window.addEventListener('resize',()=>requestAnimationFrame(v7LayoutInlineViews));
render();
