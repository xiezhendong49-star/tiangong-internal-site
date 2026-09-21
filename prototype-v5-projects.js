/* Confirmed project / business / space model. Existing category trees remain intact. */
const V5_PROJECTS=[{id:'project-one',name:'花香壹号',business:'home',sort:1,status:'启用'},{id:'project-two',name:'花香二号',business:'home',sort:2,status:'启用'},{id:'project-chun',name:'春和',business:'home',sort:3,status:'启用'}];
V3_ADMIN_ITEMS.floor.forEach((item,i)=>item.projectId=i===0?'project-chun':'project-one');
V3_ADMIN_ITEMS.effect.forEach((item,i)=>item.projectId=['project-one','project-one','project-two','project-two','project-chun'][i]);
v4Empty=function(){return '<div class="v4-empty">暂无符合条件的图片</div>';};S.v4CategoryKind=null;S.v5ProjectForm=null;S.v5ProjectError='';S.v4Filters={};
function v5Project(id){return V5_PROJECTS.find(p=>p.id===id);}
function v5ActiveProject(id){return !id||v5Project(id)?.status==='启用';}
function v5SortedProjects(){return V5_PROJECTS.slice().sort((a,b)=>a.sort-b.sort);}
v4SyncLibrary=function(kind){if(!V4_CATEGORIES[kind])return;const target=kind==='floor'?V3_FLOORS:V3_EFFECT_PRESETS;target.splice(0,target.length,...V3_ADMIN_ITEMS[kind].filter(x=>x.status==='启用'&&v5ActiveProject(x.projectId)).slice().sort((a,b)=>a.sort-b.sort));};
// Populate every filter combination with session-only demonstration records.
V5_PROJECTS.find(p=>p.id==='project-chun').sort=1;
V5_PROJECTS.find(p=>p.id==='project-one').sort=2;
V5_PROJECTS.find(p=>p.id==='project-two').sort=3;
const V5_SAMPLE_CASES=V3_ADMIN_ITEMS.effect.map(item=>item.image);
const V5_SAMPLE_FLOORS=['prototype_assets/floorplan-98.png','prototype_assets/floorplan-135.png','prototype_assets/floorplan-162.png'];
for(const project of V5_PROJECTS){
 for(const business of V4_CATEGORIES.floor){
  const present=V3_ADMIN_ITEMS.floor.filter(item=>item.projectId===project.id&&item.primary===business.id).length;
  for(let n=present;n<3;n++)V3_ADMIN_ITEMS.floor.push({name:`${project.name} · ${business.name}平面示例 ${n+1}`,image:V5_SAMPLE_FLOORS[n%3],projectId:project.id,primary:business.id,secondary:'',sort:100+V3_ADMIN_ITEMS.floor.length,status:'启用',operator:'高志远',updatedAt:v3Now(),demo:true});
 }
 for(const business of V4_CATEGORIES.effect){
  for(const space of business.children){
   const present=V3_ADMIN_ITEMS.effect.filter(item=>item.projectId===project.id&&item.primary===business.id&&item.secondary===space.id).length;
   const source=space.id==='e-bedroom'?[V5_SAMPLE_CASES[0],V5_SAMPLE_CASES[2],'prototype_assets/room-alt.jpg']:space.id==='e-dining'?[V5_SAMPLE_CASES[1],V5_SAMPLE_CASES[4],'prototype_assets/style-4.jpg']:space.id==='e-living'?[V5_SAMPLE_CASES[3],'prototype_assets/room-original.jpg','prototype_assets/style-1.jpg']:['prototype_assets/style-3.jpg','prototype_assets/style-4.jpg','prototype_assets/style-6.jpg'];
   for(let n=present;n<3;n++)V3_ADMIN_ITEMS.effect.push({name:`${space.name} · 示例 ${n+1}`,image:source[n%3],projectId:project.id,primary:business.id,secondary:space.id,sort:100+V3_ADMIN_ITEMS.effect.length,status:'启用',operator:'高志远',updatedAt:v3Now(),caseId:`sample-${project.id}-${space.id}-${n}`,points:[],demo:true});
  }
 }
}
// Projects share a business key; image categories retain their existing IDs.
for(const category of V4_CATEGORIES.floor){
 const source=V4_CATEGORIES.effect.find(x=>x.id.slice(2)===category.id.slice(2));
 category.children=source.children.map(x=>({...x,id:'f-'+x.id.slice(2)}));
}
for(const kind of ['floor','effect'])for(const item of V3_ADMIN_ITEMS[kind]){
 if(v5Project(item.projectId)?.business!==item.primary.slice(2))item.projectId='';
 if(kind==='floor')item.secondary='';
}
function v5ApplyProject(kind,form){
 const project=v5Project(form.projectId);if(!project)return;
 form.primary=(kind==='floor'?'f-':'e-')+project.business;
 const category=V4_CATEGORIES[kind].find(x=>x.id===form.primary);
 if(!category?.children.some(x=>x.id===form.secondary))form.secondary='';
}
function v5ChooseImageProject(id){S.v3AdminForm.projectId=id;v5ApplyProject(S.adminSection,S.v3AdminForm);render();}
// Seed demonstration bindings once; later admin edits may intentionally leave no points.
V3_ADMIN_ITEMS.effect.forEach(item=>{
 if(item.points?.length)return;
 item.points=[
  {id:'demo-wall',box:{x:9,y:15,w:14,h:24},material:v4Material(0)},
  {id:'demo-wood',box:{x:69,y:14,w:13,h:27},material:v4Material(1)},
  {id:'demo-rug',box:{x:35,y:76,w:30,h:13},material:v4Material(2)}
 ];
});
// The original user-provided plan stays first under the first residential project.
V3_ADMIN_ITEMS.floor[0].sort=1;
const v5PreferredCase=V3_ADMIN_ITEMS.effect.find(item=>item.caseId==='sample-project-chun-e-bedroom-0');
if(v5PreferredCase)v5PreferredCase.sort=1;
v4SyncLibrary('floor');v4SyncLibrary('effect');
function v5AvailableProjects(kind,primary){const rows=kind==='floor'?V3_FLOORS:V3_EFFECT_PRESETS;return v5SortedProjects().filter(p=>p.status==='启用'&&rows.some(x=>x.projectId===p.id&&x.primary===primary));}
v4Filter=function(context,kind){let f=S.v4Filters[context];if(!f)f=S.v4Filters[context]={primary:V4_CATEGORIES[kind][0]?.id||'',project:'',secondary:''};const parent=V4_CATEGORIES[kind].find(x=>x.id===f.primary)||V4_CATEGORIES[kind][0];f.primary=parent?.id||'';const projects=v5AvailableProjects(kind,f.primary);if(f.project!=='*'&&!projects.some(p=>p.id===f.project)){f.project='*';f.secondary='';}if(f.secondary&&!parent?.children.some(x=>x.id===f.secondary))f.secondary='';return f;};
v4ResetFilter=function(context,kind){delete S.v4Filters[context];v4Filter(context,kind);};
v4Matches=function(item,context,kind){const f=v4Filter(context,kind);return !!item&&!!f.project&&item.primary===f.primary&&(f.project==='*'||item.projectId===f.project)&&(kind==='floor'||!f.secondary||item.secondary===f.secondary);};
v4CategoryBar=function(kind,context){const f=v4Filter(context,kind),tree=V4_CATEGORIES[kind],parent=tree.find(x=>x.id===f.primary),projects=v5AvailableProjects(kind,f.primary);const btn=(item,field)=>`<button class="${f[field]===item.id?'on':''}" aria-pressed="${f[field]===item.id}" onclick="v4ChooseCategory('${kind}','${context}','${field}','${item.id}')">${v3Esc(item.name)}</button>`;return `<nav class="v4-categories v5-filters" aria-label="${kind==='floor'?'户型图':'案例图'}筛选"><div class="v5-filter-row"><span>业态</span><div class="v4-primary">${tree.map(p=>btn(p,'primary')).join('')}</div></div><div class="v5-filter-row"><span>项目</span><div class="v4-secondary v5-project-options">${btn({id:'*',name:'全部'},'project')}${projects.map(p=>btn(p,'project')).join('')||'<small class="v5-no-project">暂无项目</small>'}</div></div>${kind==='effect'?`<div class="v5-filter-row"><span>空间</span><div class="v4-secondary">${btn({id:'',name:'全部'},'secondary')}${(parent?.children||[]).map(p=>btn(p,'secondary')).join('')}</div></div>`:''}</nav>`;};
v4ChooseCategory=function(kind,context,field,id){const f=v4Filter(context,kind);f[field]=id;if(field==='primary'){f.project='';f.secondary='';}if(field==='project')f.secondary='';v4Filter(context,kind);if(context==='effect')S.effectSelection=null;if(context==='floor'&&S.floorDraftIndex!==-1){v5SelectVisibleFloor();return;}render();};
function v5SelectVisibleFloor(){const i=V3_FLOORS.findIndex(x=>v4Matches(x,'floor','floor'));if(i>=0){pickV3Floor(i);return;}S.floorDraftIndex=-2;S.floorDraftBox=null;S.floorDraftImage='';S.floorDraftName='';render();}
const v5OpenPicker=openGeneratePicker;
openGeneratePicker=function(kind){v5OpenPicker(kind);if(kind==='floor'&&S.floorDraftIndex!==-1&&!v4Matches(V3_FLOORS[S.floorDraftIndex],'floor','floor'))v5SelectVisibleFloor();};
v4CategoryLabel=function(kind,item){const parent=V4_CATEGORIES[kind].find(p=>p.id===item.primary);return kind==='floor'&&!item.secondary?(parent?.name||'未设置业态'):`${parent?.name||'未设置业态'} · ${parent?.children.find(p=>p.id===item.secondary)?.name||'未设置空间'}`;};
v4CaseScreen=function(){const rows=V3_EFFECT_PRESETS.map((item,index)=>({item,index})).filter(({item})=>v4Matches(item,'cases','effect'));const cards=rows.map(({item,index})=>`<button class="v3-effect-card v4-case-card v5-case-card" onclick="S.v4CaseIndex=${index};S.v4PointSelected=null;S.page='caseDetail';render()"><img src="${v3Esc(item.image)}" alt="${v3Esc(item.name)}"><div class="v5-case-copy"><b>${v3Esc(item.name)}</b><span title="${v3Esc(v5Project(item.projectId)?.name||'')}">${v3Esc(v5Project(item.projectId)?.name||'')}</span><small>${v3Esc(v4CategoryLabel('effect',item))}</small></div></button>`).join('');return v3Shell('看案例',`<section class="v4-case-library">${v4CategoryBar('effect','cases')}<div class="v4-case-grid">${cards||v4Empty()}</div></section>`,'home');};
/* Exact legacy material workflow: preset case points never enter the editor. */
markerScreen=v4PointMarker;
compareScreen=v4PointCompare;
finishV3Replacement=v4PointFinish;
startMaterialFromGenerated=v4PointGenerated;
confirmEffectSource=function(){if(!S.effectSelection)return;S.v4Swap=null;S.v4SwapPicker=null;S.inputImage=S.effectSelection.image;S.inputName=S.effectSelection.name;S.materialCandidates=[];S.activeMaterialId=null;S.active=null;S.marks=[];S.materialMenuOpen=false;S.materialSourceModal='';S.page='mark';render();};
v4StartCaseSwap=function(){const item=V3_EFFECT_PRESETS[S.v4CaseIndex];if(!item)return;S.effectSelection={image:item.image,name:item.name,source:'案例图'};confirmEffectSource();};
const v5Scene=v4Scene;
v4Scene=function(image,points,mode){let html=v5Scene(image,points,mode);if(mode!=='case')return html;const template=document.createElement('template');template.innerHTML=html;template.content.querySelector('.v4-scene')?.setAttribute('onclick',"if(event.target===this)v4ClosePoint('case')");template.content.querySelector('.v4-popup-close')?.remove();template.content.querySelector('.v4-point-copy small')?.remove();return template.innerHTML;};
const v5CaseDetail=v4CaseDetail;
v4CaseDetail=function(){const item=V3_EFFECT_PRESETS[S.v4CaseIndex];const template=document.createElement('template');template.innerHTML=v5CaseDetail();if(item){const footer=template.content.querySelector('.v4-case-footer>span');if(footer)footer.textContent=`${v5Project(item.projectId)?.name||''}　·　${v4CategoryLabel('effect',item)}${item.points?.length?'　·　点击圆点查看物料':''}`;}return template.innerHTML;};
/* Management navigation, images, and project master data. */
v3AdminNav=function(){return `<aside class="v3-admin-nav"><img src="${IMG.logo}" alt="天工云仓"><h4>AI空间选材</h4>${[['projects','项目配置'],['floor','户型图配置'],['style','风格参考图配置'],['effect','案例图配置'],['calls','创作记录']].map(([key,label])=>`<button class="${S.adminSection===key?'on':''}" onclick="switchAdmin('${key}')">${label}</button>`).join('')}</aside>`;};
const v5SwitchAdmin=switchAdmin;
switchAdmin=function(section){S.v5ProjectForm=null;S.v5ProjectError='';S.v4PointEditor=null;v5SwitchAdmin(section);};
const v5SetMode=setPrototypeMode;
setPrototypeMode=function(mode){v5SetMode(mode);if(mode==='admin'){S.adminSection='projects';S.adminQuery='';S.adminStatus='all';S.v4CategoryKind=null;render();}};
admin=function(){if(S.adminSection==='projects')return v5ProjectsScreen();if(!['floor','effect'].includes(S.adminSection))return v4OriginalAdmin();const kind=S.adminSection,title=kind==='floor'?'户型图配置':'案例图配置';const rows=V3_ADMIN_ITEMS[kind].map((item,index)=>({item,index})).filter(({item})=>(!S.adminQuery||(item.name+(v5Project(item.projectId)?.name||'')).includes(S.adminQuery))&&(S.adminStatus==='all'||item.status===S.adminStatus));const body=rows.map(({item,index},i)=>`<tr><td>${i+1}</td><td><img class="v3-table-thumb" src="${v3Esc(item.image)}" alt="${v3Esc(item.name)}"></td><td><b>${v3Esc(item.name)}</b></td><td>${v3Esc(v5Project(item.projectId)?.name||'未设置项目')}${!v5ActiveProject(item.projectId)?'<small class="v5-inactive">项目已停用</small>':''}</td><td>${v3Esc(v4CategoryLabel(kind,item))}</td><td>${item.sort}</td><td><span class="v3-status ${item.status==='停用'?'fail':''}">${item.status}</span></td><td>${v3Esc(item.operator||'高志远')}<br><small>${v3Esc(item.updatedAt||'')}</small></td><td><div class="v3-admin-actions"><button onclick="openAdminEdit(${index})">编辑</button>${kind==='effect'?`<button onclick="v4OpenPointEditor(${index})">点位配置${item.points?.length?' ('+item.points.length+')':''}</button>`:''}<button onclick="toggleAdminStatus(${index})">${item.status==='启用'?'停用':'启用'}</button><button class="v3-delete-action" onclick="deleteV3AdminItem(${index})">删除</button></div></td></tr>`).join('');const content=`<section class="v3-admin-card"><div class="v3-admin-title"><div><h1>${title}</h1><p>每条配置对应一张图片</p></div><button class="v3-btn primary" onclick="openAdminModal()">＋ 新增</button></div><div class="v3-admin-filters"><input aria-label="搜索图片或项目" placeholder="搜索名称或项目" value="${v3Esc(S.adminQuery||'')}" oninput="S.adminQuery=this.value"><select aria-label="图片状态" onchange="S.adminStatus=this.value;render()"><option value="all">全部状态</option>${['启用','停用'].map(s=>`<option ${S.adminStatus===s?'selected':''}>${s}</option>`).join('')}</select><button class="v3-btn" onclick="render()">查询</button></div><div class="v3-table-wrap"><table class="v3-table"><thead><tr><th>序号</th><th>图片</th><th>名称</th><th>项目</th><th>业态 / 空间</th><th>排序</th><th>状态</th><th>操作人 / 时间</th><th>操作</th></tr></thead><tbody>${body||'<tr><td colspan="9">暂无记录</td></tr>'}</tbody></table></div></section>`;return v3AdminFrame(title,content,S.v3AdminModal?v3AdminItemDialog():'')+(S.v4PointEditor?v4PointEditorDialog():'');};
v3AdminItemDialog=function(){const kind=S.adminSection;if(!['floor','effect'].includes(kind))return v4OriginalAdminDialog();const f=S.v3AdminForm;v5ApplyProject(kind,f);const parent=V4_CATEGORIES[kind].find(p=>p.id===f.primary);const title=(Number.isInteger(f.editIndex)?'编辑':'新增')+(kind==='floor'?'户型图':'案例图');const projectOptions=v5SortedProjects().filter(p=>p.status==='启用'||p.id===f.projectId);return `<div class="v3-mask"><section class="v3-admin-dialog v5-image-dialog" role="dialog" aria-modal="true" aria-label="${title}"><header class="v3-dialog-head"><h2>${title}</h2><button class="v3-icon-btn" aria-label="关闭图片编辑" onclick="S.v3AdminModal=null;render()">×</button></header><div class="v3-dialog-body"><div class="v3-admin-form"><label class="v5-form-wide">项目<select aria-label="项目" onchange="v5ChooseImageProject(this.value)"><option value="">请选择项目（选填）</option>${projectOptions.map(p=>`<option value="${p.id}" ${p.id===f.projectId?'selected':''} ${p.status==='停用'?'disabled':''}>${v3Esc(p.name)}${p.status==='停用'?'（已停用）':''}</option>`).join('')}</select></label><label>业态<select aria-label="业态" ${f.projectId?'disabled aria-describedby="v5-business-hint"':''} onchange="S.v3AdminForm.primary=this.value;S.v3AdminForm.secondary='';render()"><option value="">请选择业态</option>${V4_CATEGORIES[kind].map(p=>`<option value="${p.id}" ${p.id===f.primary?'selected':''}>${v3Esc(p.name)}</option>`).join('')}</select>${f.projectId?'<small id="v5-business-hint">业态由所选项目带出，不可编辑</small>':''}</label>${`<label>空间<select aria-label="空间" ${parent?'':'disabled'} onchange="S.v3AdminForm.secondary=this.value"><option value="">请选择空间</option>${(parent?.children||[]).map(p=>`<option value="${p.id}" ${p.id===f.secondary?'selected':''}>${v3Esc(p.name)}</option>`).join('')}</select></label>`}<label>名称<input aria-label="图片名称" value="${v3Esc(f.name)}" oninput="S.v3AdminForm.name=this.value"></label><label>排序<input aria-label="图片排序" type="number" min="1" value="${v3Esc(f.sort)}" oninput="S.v3AdminForm.sort=this.value"></label><label class="v3-admin-upload">${f.image?`<img src="${v3Esc(f.image)}" alt="${v3Esc(f.name)}">`:'<span>＋ 选择图片</span>'}<input type="file" accept="image/png,image/jpeg" onchange="v3AdminFileChosen(event)"></label></div></div><footer class="v3-dialog-foot"><button class="v3-btn" onclick="S.v3AdminModal=null;render()">取消</button><button class="v3-btn primary" onclick="saveV3AdminItem()">保存</button></footer></section></div>`;};
saveV3AdminItem=function(){const kind=S.adminSection;if(!['floor','effect'].includes(kind))return v4OriginalSaveAdmin();const f=S.v3AdminForm;v5ApplyProject(kind,f);const sort=Number(f.sort),parent=V4_CATEGORIES[kind].find(p=>p.id===f.primary);if(!f.name.trim()||!f.image||!Number.isInteger(sort)||sort<1||!v5ActiveProject(f.projectId)||!parent||((kind==='effect'||f.secondary)&&!parent.children.some(p=>p.id===f.secondary))){toast('请填写必填图片信息，并选择有效的业态'+(kind==='effect'?'和空间':''));return;}const item={...f,name:f.name.trim(),sort,status:f.status||'启用',operator:'高志远',updatedAt:v3Now()};delete item.editIndex;if(Number.isInteger(f.editIndex))V3_ADMIN_ITEMS[kind][f.editIndex]=item;else V3_ADMIN_ITEMS[kind].push(item);v4SyncLibrary(kind);S.v3AdminModal=null;render();};
function v5ProjectsScreen(){const rows=v5SortedProjects().filter(p=>(!S.adminQuery||p.name.includes(S.adminQuery))&&(S.adminStatus==='all'||p.status===S.adminStatus));const content=`<section class="v3-admin-card"><div class="v3-admin-title"><div><h1>项目配置</h1><p>管理项目名称、业态和展示顺序</p></div><button class="v3-btn primary" onclick="v5EditProject()">＋ 新增项目</button></div><div class="v3-admin-filters"><input aria-label="搜索项目" placeholder="搜索项目名称" value="${v3Esc(S.adminQuery||'')}" oninput="S.adminQuery=this.value"><select aria-label="项目状态" onchange="S.adminStatus=this.value;render()"><option value="all">全部状态</option>${['启用','停用'].map(s=>`<option ${S.adminStatus===s?'selected':''}>${s}</option>`).join('')}</select><button class="v3-btn" onclick="render()">查询</button></div><div class="v3-table-wrap"><table class="v3-table"><thead><tr><th>序号</th><th>项目名称</th><th>业态</th><th>排序</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map((p,i)=>`<tr><td>${i+1}</td><td><b>${v3Esc(p.name)}</b></td><td>${v3Esc(V4_CATEGORIES.floor.find(x=>x.id==='f-'+p.business)?.name||'未设置业态')}</td><td>${p.sort}</td><td><span class="v3-status ${p.status==='停用'?'fail':''}">${p.status}</span></td><td><div class="v3-admin-actions"><button onclick="v5EditProject('${p.id}')">编辑</button><button onclick="v5ToggleProject('${p.id}')">${p.status==='启用'?'停用':'启用'}</button><button class="v3-delete-action" onclick="v5DeleteProject('${p.id}')">删除</button></div></td></tr>`).join('')||'<tr><td colspan="6">暂无项目</td></tr>'}</tbody></table></div></section>`;return v3AdminFrame('项目配置',content,S.v5ProjectForm?v5ProjectDialog():'');}
function v5EditProject(id){S.v5ProjectForm=id?{...v5Project(id)}:{name:'',business:'',sort:1};S.v5ProjectError='';render();}
function v5ProjectDialog(){const f=S.v5ProjectForm;return `<div class="v3-mask"><section class="v3-admin-dialog v5-project-dialog" role="dialog" aria-modal="true" aria-label="项目编辑"><header class="v3-dialog-head"><h2>${f.id?'编辑':'新增'}项目</h2><button class="v3-icon-btn" aria-label="关闭项目编辑" onclick="S.v5ProjectForm=null;render()">×</button></header><div class="v3-dialog-body"><div class="v3-admin-form"><label><span class="v5-field-caption">项目名称 <em class="v5-required">*</em></span><input aria-required="true" aria-label="项目名称" maxlength="60" value="${v3Esc(f.name)}" oninput="S.v5ProjectForm.name=this.value"></label><label><span class="v5-field-caption">业态 <em class="v5-required">*</em></span><select aria-label="项目业态" required aria-required="true" aria-describedby="v5-project-error" onchange="S.v5ProjectForm.business=this.value"><option value="">请选择业态</option>${V4_CATEGORIES.floor.map(p=>`<option value="${p.id.slice(2)}" ${f.business===p.id.slice(2)?'selected':''}>${v3Esc(p.name)}</option>`).join('')}</select></label><label><span class="v5-field-caption">排序 <em class="v5-required">*</em></span><input aria-required="true" aria-label="项目排序" type="number" min="1" step="1" value="${f.sort}" oninput="S.v5ProjectForm.sort=this.value"></label></div><p id="v5-project-error" class="v5-project-error" role="alert">${v3Esc(S.v5ProjectError)}</p></div><footer class="v3-dialog-foot"><button class="v3-btn" onclick="S.v5ProjectForm=null;render()">取消</button><button class="v3-btn primary" onclick="v5SaveProject()">保存</button></footer></section></div>`;}
function v5SaveProject(){const f=S.v5ProjectForm,name=f.name.trim(),sort=Number(f.sort);if(!name||!Number.isInteger(sort)||sort<1){S.v5ProjectError='请输入项目名称和大于 0 的整数排序';render();return;}if(!V4_CATEGORIES.floor.some(p=>p.id==='f-'+f.business)){S.v5ProjectError='请选择项目业态';render();document.querySelector('[aria-label="项目业态"]')?.focus();return;}if(V5_PROJECTS.some(p=>p.id!==f.id&&p.name===name)){S.v5ProjectError='项目名称不能重复';render();return;}if(f.id)Object.assign(v5Project(f.id),{name,sort,business:f.business});else V5_PROJECTS.push({id:'project-'+Date.now(),name,sort,business:f.business,status:'启用'});for(const kind of ['floor','effect']){for(const item of V3_ADMIN_ITEMS[kind])if(item.projectId===f.id)v5ApplyProject(kind,item);v4SyncLibrary(kind);}S.v5ProjectForm=null;render();}
function v5ToggleProject(id){const p=v5Project(id);p.status=p.status==='启用'?'停用':'启用';v4SyncLibrary('floor');v4SyncLibrary('effect');S.effectSelection=null;S.floorImage='';S.floorBox=null;render();}
function v5DeleteProject(id){if(['floor','effect'].some(kind=>V3_ADMIN_ITEMS[kind].some(item=>item.projectId===id))){toast('该项目已关联图片，请先移出图片再删除');return;}const i=V5_PROJECTS.findIndex(p=>p.id===id);if(i>=0)V5_PROJECTS.splice(i,1);render();}
const v5PointEditorDialog=v4PointEditorDialog;
v4PointEditorDialog=function(){
 const e=S.v4PointEditor,template=document.createElement('template');
 template.innerHTML=v5PointEditorDialog().replace('aria-label="效果图点位配置"','aria-label="案例图点位配置"');
 const tools=template.content.querySelector('.v4-editor-tools');
 const heading=template.content.querySelector('.v4-editor-right h3');
 const toolbar=document.createElement('div');toolbar.className='v5-point-list-heading';
 heading.replaceWith(toolbar);toolbar.append(heading,tools.querySelector('button'));tools.remove();
 template.content.querySelector('.v4-demo-note')?.remove();
 const target=e.points.findIndex(p=>p.id===e.demoTarget);
 const head=template.content.querySelector('.v3-dialog-head');
 head.querySelector('.v3-icon-btn').insertAdjacentHTML('beforebegin',`<div class="v5-demo-link-tool"><select aria-label="选择示例链接，仅供演示，实际上线后不做" onchange="v5FillDemoLink(this.value)"><option value="">仅供演示，实际上线后不做</option>${MATERIAL_CATALOG.map((m,j)=>`<option value="${j}">${v3Esc(m.name)}</option>`).join('')}</select><span id="v5-demo-link-target">${target<0?'先点击下方需要填写的链接框':'将填入点位 '+(target+1)}</span></div>`);
 template.content.querySelectorAll('.v4-admin-point-row').forEach((row,i)=>{
  const point=e.points[i],input=row.querySelector('input'),actions=row.querySelector('.v4-link-actions');
  input.setAttribute('onfocus',`v5FocusPointLink('${point.id}')`);
  const line=document.createElement('div');line.className='v5-point-link-line';
  input.replaceWith(line);line.append(input,actions.querySelector('button'));actions.remove();
 });
 return template.innerHTML;
};
function v5FocusPointLink(id){
 const e=S.v4PointEditor;e.demoTarget=id;e.active=id;
 document.querySelectorAll('.v4-admin-point-row').forEach((row,i)=>row.classList.toggle('on',e.points[i].id===id));
 const hint=document.getElementById('v5-demo-link-target');if(hint)hint.textContent='将填入点位 '+(e.points.findIndex(p=>p.id===id)+1);
}
function v5FillDemoLink(index){
 if(index==='')return;const e=S.v4PointEditor;
 if(!e.points.some(p=>p.id===e.demoTarget)){toast('请先点击需要填写的物料链接框');const select=document.querySelector('.v5-demo-link-tool select');if(select)select.value='';return;}
 v4SetSampleLink(e.demoTarget,index);
}


// Cases are a home-level destination, alongside AI space selection.
source=v4OriginalSource;
const v5AppTop=appTop;
appTop=function(){const html=v5AppTop();return S.page==='home'?html.replace('<button class="top-ai-entry"','<button class="top-ai-entry" onclick="v4OpenCases()">看案例</button><button class="top-ai-entry"'):html;};

const v5RequiredImageDialog=v3AdminItemDialog;
v3AdminItemDialog=function(){
 const html=v5RequiredImageDialog();if(!['floor','effect','style'].includes(S.adminSection))return html;
 const t=document.createElement('template');t.innerHTML=html;
 if(S.adminSection==='style'){const fields=t.content.querySelectorAll('.v3-admin-form>label:not(.v3-admin-upload) input');fields[0]?.setAttribute('aria-label','图片名称');fields[1]?.setAttribute('aria-label','图片排序');}
 for(const name of ['业态','空间','图片名称','图片排序']){const input=t.content.querySelector('[aria-label="'+name+'"]');if(!input||(name==='空间'&&S.adminSection==='floor'))continue;input.setAttribute('aria-required','true');const label=input.closest('label');const caption=document.createElement('span');caption.className='v5-field-caption';while(label.firstChild&&label.firstChild!==input)caption.append(label.firstChild);caption.append(Object.assign(document.createElement('em'),{className:'v5-required',textContent:' *'}));label.insertBefore(caption,input);}
 const upload=t.content.querySelector('.v3-admin-upload');upload.insertAdjacentHTML('afterbegin','<span class="v5-upload-label">图片 <em class="v5-required">*</em></span>');upload.querySelector('input').setAttribute('aria-required','true');
 return t.innerHTML;
};
render();
