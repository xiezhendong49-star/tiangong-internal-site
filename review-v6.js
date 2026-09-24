/* September 23 review. Session-only interactive prototype; no backend writes. */
const V6_USER={id:'user-gao',name:'高志远'};
S.v6Mode='ipad';
// Existing category IDs are retained so historical associations remain readable.
for(const kind of ['floor','effect']) {
 V4_CATEGORIES[kind].splice(2);
 V4_CATEGORIES[kind][0].name='好房子';
 V4_CATEGORIES[kind][1].name='超高层';
}
V5_PROJECTS.find(p=>p.id==='project-two').business='hotel';
V3_ADMIN_ITEMS.floor=V3_ADMIN_ITEMS.floor.filter(x=>!x.demo);
V3_ADMIN_ITEMS.effect=V3_ADMIN_ITEMS.effect.filter(x=>x.primary==='e-home');
for(const item of V3_ADMIN_ITEMS.effect){item.projectId||='project-one';v5ApplyProject('effect',item);}
V3_ADMIN_ITEMS.render=V3_EFFECT_PRESETS.map((x,i)=>({name:x.name,image:x.image,sort:i+1,status:'启用',operator:'高志远',updatedAt:v3Now()}));
S.v6TypeFilter='';
v4SyncLibrary=function(kind){
 const target=kind==='floor'?V3_FLOORS:kind==='effect'?V6_CASE_PRESETS:kind==='render'?V3_EFFECT_PRESETS:null;
 if(!target)return;
 target.splice(0,target.length,...V3_ADMIN_ITEMS[kind].filter(x=>x.status==='启用'&&(kind!=='effect'||v5ActiveProject(x.projectId))).slice().sort((a,b)=>a.sort-b.sort));
};
['floor','effect','render'].forEach(v4SyncLibrary);
// No category or project filters on ordinary creation resources.
generatePickerDialog=v4OriginalPicker;
openGeneratePicker=v4OriginalOpenPicker;
effectSelectScreen=function(){
 const t=document.createElement('template');t.innerHTML=v4OriginalEffectScreen();
 const history=t.content.querySelector('.history');let count=0;
 history?.querySelectorAll('[onclick^="selectV3Effect"]').forEach(button=>{
  const index=Number(button.getAttribute('onclick').match(/,(\d+)/)[1]);
  if(!v6CanRead(V3_EFFECT_HISTORY[index]))button.remove();else count++;
 });
 if(history){history.querySelector('.v3-section-title>span').textContent=count+' 张';if(!count)history.querySelector('.v3-effect-grid').innerHTML=v4Empty();}
 return t.innerHTML;
};
const v6SelectEffect=selectV3Effect;
selectV3Effect=function(group,index){if(group==='history'&&!v6CanRead(V3_EFFECT_HISTORY[index]))return;v6SelectEffect(group,index);};
v3AdminNav=function(){return `<aside class="v3-admin-nav"><img src="${IMG.logo}" alt="天工云仓"><h4>AI空间选材</h4>${[['projects','项目配置'],['floor','空间选材配置'],['style','风格参考图配置'],['effect','案例库配置'],['calls','创作记录']].map(([key,label])=>`<button class="${S.adminSection===key||(key==='floor'&&S.adminSection==='render')?'on':''}" onclick="switchAdmin('${key}')">${label}</button>`).join('')}</aside>`;};
const v6SwitchAdmin=switchAdmin;
switchAdmin=function(section){S.v6ChooseType=false;if(section==='floor'||section==='render')S.v6TypeFilter='';v6SwitchAdmin(section);};
function v6ResourceAction(kind,index,action){S.adminSection=kind;({edit:openAdminEdit,toggle:toggleAdminStatus,delete:deleteV3AdminItem})[action](index);}
const v6OldAdmin=admin;
admin=function(){if(['floor','render'].includes(S.adminSection))return v6SpaceScreen();const html=v6OldAdmin();if(S.adminSection!=='effect')return html;const t=document.createElement('template');t.innerHTML=html;const filters=t.content.querySelector('.v5-admin-image-filters'),product=filters?.querySelector('[aria-label="筛选产品线"]')?.closest('label');if(product)filters.prepend(product);t.content.querySelectorAll('.v3-table tr').forEach(row=>{const cells=row.children;if(cells.length===10)row.insertBefore(cells[4],cells[3]);});return t.innerHTML;};
function v6SpaceScreen(){
 const rows=['floor','render'].flatMap(kind=>V3_ADMIN_ITEMS[kind].map((item,index)=>({item,index,kind}))).filter(({item,kind})=>(!S.v6TypeFilter||kind===S.v6TypeFilter)&&(!S.adminQuery||item.name.includes(S.adminQuery))&&(S.adminStatus==='all'||S.adminStatus===item.status)).sort((a,b)=>a.item.sort-b.item.sort);
 const content=`<section class="v3-admin-card"><div class="v3-admin-title"><div><h1>空间选材配置</h1><p>管理户型图与效果图</p></div><button class="v3-btn primary" onclick="openAdminModal()">＋ 新增</button></div><div class="v3-admin-filters"><label class="v6-filter-label">类型<select aria-label="筛选类型" onchange="S.v6TypeFilter=this.value;render()"><option value="">全部类型</option><option value="floor" ${S.v6TypeFilter==='floor'?'selected':''}>户型图</option><option value="render" ${S.v6TypeFilter==='render'?'selected':''}>效果图</option></select></label><input aria-label="搜索图片名称" placeholder="搜索名称" value="${v3Esc(S.adminQuery||'')}" oninput="S.adminQuery=this.value" onkeydown="if(event.key==='Enter')render()"><select aria-label="图片状态" onchange="S.adminStatus=this.value;render()"><option value="all">全部状态</option>${['启用','停用'].map(s=>`<option ${S.adminStatus===s?'selected':''}>${s}</option>`).join('')}</select><button class="v3-btn" onclick="render()">查询</button><button class="v3-btn" onclick="S.adminQuery='';S.adminStatus='all';S.v6TypeFilter='';render()">重置</button></div><div class="v3-table-wrap"><table class="v3-table"><thead><tr><th>序号</th><th>图片</th><th>名称</th><th>类型</th><th>排序</th><th>状态</th><th>操作人</th><th>操作时间</th><th>操作</th></tr></thead><tbody>${rows.map(({item,index,kind},i)=>`<tr><td>${i+1}</td><td><img class="v3-table-thumb" src="${v3Esc(item.image)}" alt="${v3Esc(item.name)}"></td><td><b>${v3Esc(item.name)}</b></td><td>${kind==='floor'?'户型图':'效果图'}</td><td>${item.sort}</td><td><span class="v3-status ${item.status==='停用'?'fail':''}">${item.status}</span></td><td>${v3Esc(item.operator)}</td><td>${v3Esc(item.updatedAt)}</td><td><div class="v3-admin-actions"><button onclick="v6ResourceAction('${kind}',${index},'edit')">编辑</button><button onclick="v6ResourceAction('${kind}',${index},'toggle')">${item.status==='启用'?'停用':'启用'}</button><button class="v3-delete-action" onclick="v6ResourceAction('${kind}',${index},'delete')">删除</button></div></td></tr>`).join('')||'<tr><td colspan="9">暂无符合条件的图片</td></tr>'}</tbody></table></div></section>`;
 return v3AdminFrame('空间选材配置',content,S.v3AdminModal?v3AdminItemDialog():'');
}
const v6OpenAdmin=openAdminModal;
openAdminModal=function(){if(!['floor','render'].includes(S.adminSection))return v6OpenAdmin();S.v3AdminForm={name:'',image:'',sort:'1',status:'启用',editIndex:null,resourceType:S.v6TypeFilter||'floor'};S.v3AdminModal='item';render();};
function v6ChangeResourceType(kind){S.v3AdminForm.resourceType=kind;render();}
const v6AdminDialog=v3AdminItemDialog;
v3AdminItemDialog=function(){
 if(!['floor','render'].includes(S.adminSection))return v6AdminDialog();
 const f=S.v3AdminForm,editing=Number.isInteger(f.editIndex),title=editing?'编辑'+(S.adminSection==='floor'?'户型图':'效果图'):'新增空间选材';
 const typeChoice=editing?'':`<fieldset class="v6-inline-types"><legend>类型 <em>*</em></legend>${[['floor','户型图'],['render','效果图']].map(([key,label])=>`<label><input type="radio" name="resourceType" value="${key}" ${(f.resourceType||S.adminSection)===key?'checked':''} onchange="v6ChangeResourceType(this.value)">${label}</label>`).join('')}</fieldset>`;
 return `<div class="v3-mask"><section class="v3-admin-dialog" role="dialog" aria-modal="true" aria-label="${title}"><header class="v3-dialog-head"><h2>${title}</h2><button class="v3-icon-btn" aria-label="关闭图片编辑" onclick="S.v3AdminModal=null;render()">×</button></header><div class="v3-dialog-body">${typeChoice}<div class="v3-admin-form"><label><span class="v6-field-caption">名称 <em>*</em></span><input aria-label="图片名称" aria-required="true" value="${v3Esc(f.name)}" oninput="S.v3AdminForm.name=this.value"></label><label><span class="v6-field-caption">排序 <em>*</em></span><input aria-label="图片排序" aria-required="true" type="number" min="1" value="${v3Esc(f.sort)}" oninput="S.v3AdminForm.sort=this.value"></label><label class="v3-admin-upload">${f.image?`<img src="${v3Esc(f.image)}" alt="${v3Esc(f.name)}">`:'<span>＋ 选择图片</span>'}<input aria-label="上传图片" aria-required="true" type="file" accept="image/png,image/jpeg" onchange="v3AdminFileChosen(event)"></label></div></div><footer class="v3-dialog-foot"><button class="v3-btn" onclick="S.v3AdminModal=null;render()">取消</button><button class="v3-btn primary" onclick="saveV3AdminItem()">保存</button></footer></section></div>`;
};
const v6SaveAdmin=saveV3AdminItem;
saveV3AdminItem=function(){
 if(!['floor','render'].includes(S.adminSection))return v6SaveAdmin();
 const f=S.v3AdminForm,sort=Number(f.sort);
 if(!f.name.trim()||!f.image||!Number.isInteger(sort)||sort<1){toast('请填写名称、图片和有效排序');return;}
 const target=Number.isInteger(f.editIndex)?S.adminSection:(f.resourceType||S.adminSection);
 const item={...f,name:f.name.trim(),sort,operator:V6_USER.name,updatedAt:v3Now()};delete item.editIndex;delete item.resourceType;
 if(Number.isInteger(f.editIndex))V3_ADMIN_ITEMS[S.adminSection][f.editIndex]=item;else V3_ADMIN_ITEMS[target].push(item);
 S.adminSection=target;if(S.v6TypeFilter)S.v6TypeFilter=target;S.adminQuery='';S.adminStatus='all';v4SyncLibrary(target);S.v3AdminModal=null;render();
};
const v6Toggle=toggleAdminStatus,v6Delete=deleteV3AdminItem;
toggleAdminStatus=function(index){v6Toggle(index);v4SyncLibrary(S.adminSection);render();};
deleteV3AdminItem=function(index){v6Delete(index);v4SyncLibrary(S.adminSection);render();};
// Project lifecycle now affects case publishing only, not independent resources.
v5ToggleProject=function(id){const p=v5Project(id);p.status=p.status==='启用'?'停用':'启用';v4SyncLibrary('effect');render();};
v5DeleteProject=function(id){if(V3_ADMIN_ITEMS.effect.some(x=>x.projectId===id)){toast('该项目已关联案例，请先移出案例再删除');return;}const i=V5_PROJECTS.findIndex(x=>x.id===id);if(i>=0)V5_PROJECTS.splice(i,1);render();};
const v6SaveProject=v5SaveProject;
v5SaveProject=function(){const preserved=V3_ADMIN_ITEMS.floor.map(x=>({primary:x.primary,secondary:x.secondary,projectId:x.projectId}));v6SaveProject();V3_ADMIN_ITEMS.floor.forEach((x,i)=>Object.assign(x,preserved[i]));};
// Management sees all records; iPad retains the current user's creation history.
function v6CanRead(record){return !!record&&(S.v6Mode==='admin'||record.operator===V6_USER.name);}
const v6SetMode=setPrototypeMode;
setPrototypeMode=function(mode){S.v6Mode=mode;S.effectSelection=null;S.v3CallDetail=null;S.callSelected=[];v6SetMode(mode);};

const v6FilteredCalls=v3FilteredCalls;
v3FilteredCalls=function(){return v6FilteredCalls().filter(v6CanRead);};
openV3CallDetail=function(id){S.v3CallDetail=V3_CALL_LOGS.find(x=>x.id===id&&v6CanRead(x))||null;render();};
const v6CallScreen=v3CallLogScreen;
v3CallLogScreen=function(){
 const t=document.createElement('template');t.innerHTML=v6CallScreen();
 t.content.querySelectorAll('tbody tr').forEach((row,i)=>{const log=v3FilteredCalls()[i];if(!log)return;const actions=row.querySelector('.v3-admin-actions');actions.querySelector('.v3-export-unavailable')?.remove();if(!actions.querySelector('[onclick^="v3ExportCalls"]'))actions.insertAdjacentHTML('beforeend',`<button onclick="v3ExportCalls('${log.id}')">导出</button>`);});
 const selected=new Set(S.callSelected||[]);t.content.querySelector('.v3-call-toolbar>button').disabled=!v3FilteredCalls().some(x=>selected.has(x.id));t.content.querySelector('.v3-call-toolbar>small').textContent='按创作类型导出对应模板';
 t.content.querySelector('.v3-admin-title p').textContent=S.v6Mode==='admin'?'全部创作记录':'我的创作记录';return t.innerHTML;
};
// Unified download: each creation type has its own concise worksheet.
v3ExportCalls=async function(id){
 if(S.callExportBusy)return;const ids=id?[id]:(S.callSelected||[]),rows=V3_CALL_LOGS.filter(x=>ids.includes(x.id)&&v6CanRead(x));
 if(!rows.length){toast('请选择可导出的创作记录');return;}S.callExportBusy=true;toast('正在生成 Excel…');
 try{await v6DownloadRecords(rows);toast('Excel 已下载');}catch(e){toast(e.message||'导出失败，请重试');}finally{S.callExportBusy=false;}
};
function v6RecordStyle(log){return log.inputs?.find(input=>input.label==='风格参考图')?.image||log.styleImage||'';}
async function v6DownloadRecords(records){
 const missing=records.filter(log=>log.type==='生成效果图'&&!v6RecordStyle(log));
 if(missing.length)throw new Error('记录 '+missing.map(log=>log.id).join('、')+' 缺少必填的风格参考图，请补齐记录后导出');
 await loadMaterialExcelLibrary();const workbook=new ExcelJS.Workbook();
 for(const type of ['材质替换','生成效果图']){
  const logs=records.filter(x=>x.type===type);if(!logs.length)continue;
  const material=type==='材质替换',sheet=workbook.addWorksheet(material?'材质替换用料明细':'效果图生成记录',{views:[{state:'frozen',ySplit:1,showGridLines:false}]});
  const headers=material?['记录编号','操作人','提交时间','平台编号','物料名称','物料分类','标点编号','物料图片','带标点原图','结果图']:['记录编号','操作人','提交时间','生成视角','户型图及框选范围','风格参考图','结果图'];
  sheet.columns=(material?[28,16,23,22,24,18,12,18,42,42]:[28,16,23,24,48,40,48]).map(width=>({width}));sheet.addRow(headers);
  sheet.getRow(1).height=30;sheet.getRow(1).eachCell(c=>{c.font={name:'Microsoft YaHei',bold:true,color:{argb:'FFFFFFFF'}};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF147E9E'}};});
  async function addImage(src,col,row,w,h,points=[],box=null){if(!src){sheet.getCell(row,col).value='暂无图片';return;}const base64=box?await v6FloorThumbnail(src,box,w*2,h*2):await materialExcelThumbnail(src,w*2,h*2,points);const image=workbook.addImage({base64,extension:'png'});sheet.addImage(image,{tl:{col:col-1+.08,row:row-1+.08},ext:{width:w,height:h},editAs:'oneCell'});}
  for(const [group,log] of logs.entries()){
   const start=sheet.rowCount+1,points=log.points||[],items=material?(points.length?points:[null]):[null];
   for(const [i,point] of items.entries()){
    const m=point?.material||{},box=log.floorBox||log.inputs?.find(x=>x.floorBox)?.floorBox;
    const direction=V3_CAMERAS.find(x=>x.id===box?.view)?.label||'AI 自动判断';
    const row=sheet.addRow(material?[log.id,log.operator,log.time,m.platformCode||'',m.name||'',m.category||'',point?i+1:'','','','']:[log.id,log.operator,log.time,direction,'','','']);row.height=112;
    for(let c=1;c<=headers.length;c++){const cell=row.getCell(c);cell.font={name:'Microsoft YaHei',size:10};cell.alignment={vertical:'middle',horizontal:'center',wrapText:true};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:group%2?'FFFFFFFF':'FFEAF5FA'}};}
    if(material&&m.image)await addImage(m.image,8,row.number,96,96);
    if(!material){await addImage(log.mainImage,5,row.number,310,130,[],box);await addImage(v6RecordStyle(log),6,row.number,250,130);await addImage(log.resultImage,7,row.number,310,130);}
   }
   if(material){const end=sheet.rowCount;if(end>start)[1,2,3,9,10].forEach(c=>sheet.mergeCells(start,c,end,c));await addImage(log.mainImage,9,start,270,Math.min(240,items.length*140),points);await addImage(log.resultImage,10,start,270,Math.min(240,items.length*140));}
  }
 }
 const buffer=await workbook.xlsx.writeBuffer(),url=URL.createObjectURL(new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
 const a=document.createElement('a');a.href=url;a.download=`创作记录_${records.length}条.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
async function v6FloorThumbnail(src,box,width,height){
 const image=new Image();image.src=await materialExcelThumbnail(src,width,height);await image.decode();
 const original=new Image();original.src=src;await original.decode();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);
 const scale=Math.min(width/original.naturalWidth,height/original.naturalHeight),w=original.naturalWidth*scale,h=original.naturalHeight*scale,x=(width-w)/2+w*box.x/100,y=(height-h)/2+h*box.y/100,bw=w*box.w/100,bh=h*box.h/100;
 ctx.strokeStyle='#078bbc';ctx.lineWidth=4;ctx.fillStyle='#078bbc22';ctx.fillRect(x,y,bw,bh);ctx.strokeRect(x,y,bw,bh);
 const camera=V3_CAMERAS.find(c=>c.id===box.view);if(camera){const cx=x+bw/2,cy=y+bh/2;ctx.beginPath();ctx.moveTo(cx+camera.dx*bw*.4,cy+camera.dy*bh*.4);ctx.lineTo(cx,cy);ctx.stroke();ctx.beginPath();ctx.arc(cx+camera.dx*bw*.4,cy+camera.dy*bh*.4,9,0,Math.PI*2);ctx.fillStyle='#078bbc';ctx.fill();}
 return canvas.toDataURL('image/png');
}
// Four catalog fields, with an explicit detail action that does not select a point.
function v6Enrich(m){const i=MATERIAL_CATALOG.findIndex(x=>x.image===m.image||x.name===m.name);return i<0?m:{...v4Material(i),...m,model:m.model||v4Material(i).model,brand:m.brand||MATERIAL_CATALOG[i].brand};}
function v6MaterialCopy(m){m=v6Enrich(m);return `<b>${v3Esc(m.name||'本地上传物料')}</b><span>型号：${v3Esc(m.model||'未提供')}</span><span>品类：${v3Esc(m.category||'未提供')}</span><span>品牌：${v3Esc(m.brand||'未提供')}</span>`;}
function v6OpenMaterial(id){const m=S.materialCandidates.find(x=>x.id===id);if(!m)return;S.v6DetailBack=S.page;S.v5CaseMaterial=v6Enrich(m);S.page='material';render();}
const v6BackMaterial=v5BackToCaseMaterial;
v5BackToCaseMaterial=function(){if(!S.v6DetailBack)return v6BackMaterial();S.v5CaseMaterial=null;S.page=S.v6DetailBack;S.v6DetailBack=null;render();};
const v6Marker=markerScreen;
markerScreen=function(){const t=document.createElement('template');t.innerHTML=v6Marker();t.content.querySelectorAll('.v3-marker-material').forEach((card,i)=>{const m=S.materialCandidates[i];card.querySelector('.v3-marker-material-copy').innerHTML=v6MaterialCopy(m);});return t.innerHTML;};
const v6Scene=v4Scene;
v4Scene=function(image,points,mode){const t=document.createElement('template');t.innerHTML=v6Scene(image,points,mode);const m=points.find(x=>x.id===S.v4PointSelected)?.material,copy=t.content.querySelector('.v4-point-copy');if(mode==='case'&&m&&copy)copy.innerHTML=v6MaterialCopy(m);return t.innerHTML;};
const v6MaterialDetail=materialDetail;
materialDetail=function(){const t=document.createElement('template');t.innerHTML=v6MaterialDetail();t.content.querySelector('.detail-title>b')?.remove();return t.innerHTML;};
function v6OpenCatalogDetail(index){const material=MATERIAL_CATALOG[index];if(!material)return;S.v6DetailBack=S.page;S.v5CaseMaterial=v4Material(index);S.page='material';render();}
const v6SourceDialog=materialSourceDialog;
materialSourceDialog=function(){
 const t=document.createElement('template');t.innerHTML=v6SourceDialog();
 t.content.querySelectorAll('.v3-library-card').forEach(card=>{
  const action=card.getAttribute('onclick'),index=Number(action.match(/\((\d+)/)[1]),material=v4Material(index);
  const wrapper=document.createElement('article');wrapper.className=card.className+' v6-catalog-card';
  const select=document.createElement('button');select.className='v6-catalog-select';select.setAttribute('onclick',action);select.setAttribute('aria-label','选择物料 '+material.name);select.append(card.querySelector('.v3-library-image'));
  const copy=document.createElement('div');copy.className='v6-catalog-copy';copy.innerHTML=v6MaterialCopy(material);select.append(copy);wrapper.append(select);
  wrapper.insertAdjacentHTML('beforeend',`<button class="v6-catalog-detail" onclick="v6OpenCatalogDetail(${index})">查看详情</button>`);card.replaceWith(wrapper);
 });return t.innerHTML;
};
const v6Compare=compareScreen;
compareScreen=function(){
 const t=document.createElement('template');t.innerHTML=v6Compare();
 t.content.querySelectorAll('.v3-compare-materials .v3-marker-material').forEach(card=>{
  const img=card.querySelector('img'),material=S.materialCandidates.find(m=>m.image===img?.getAttribute('src'));if(!material)return;
  const copy=card.querySelector('.v3-marker-material-copy');if(copy)copy.innerHTML=v6MaterialCopy(material);
  card.insertAdjacentHTML('beforeend',`<button class="v6-catalog-detail" onclick="v6OpenMaterial('${material.id}')">详情</button>`);
 });return t.innerHTML;
};
// Preserve the existing case-to-material-replacement entry. Case data is not mutated.
// Reader events can enter without any manual RFID action in the product UI.
window.addEventListener('tiangong:rfid',event=>{if(S.page!=='mark')return;const indices=event.detail?.indices||[];let added=0;for(const index of indices){if(!MATERIAL_CATALOG[index])continue;const m=v4Material(index);if(S.materialCandidates.some(x=>x.image===m.image))continue;S.materialCandidates.push({...m,id:'rfid-'+index,source:'RFID'});added++;}if(added)toast(`已自动识别 ${added} 个物料`);});
render();
fit=function(){const device=document.getElementById('ipad'),isAdmin=device.classList.contains('admin-canvas'),bw=isAdmin?1440:1194,bh=isAdmin?900:834,bar=document.querySelector('.previewbar').offsetHeight;const scale=Math.max(.1,Math.min((innerWidth-12)/bw,(innerHeight-bar-24)/bh,1));const stage=document.getElementById('stage');stage.style.width=bw*scale+'px';stage.style.height=bh*scale+'px';device.style.width=bw+'px';device.style.height=bh+'px';device.style.transform=`scale(${scale})`;};
fit();
