/* V4: independent category trees. Names and assignments below are demo data. */
const V4_CATEGORIES = {
  floor: [
    {id:'f-home',name:'住宅',children:[{id:'f-chun',name:'春和'},{id:'f-one',name:'花香壹号'}]},
    {id:'f-hotel',name:'酒店',children:[{id:'f-guest',name:'客房'}]},
    {id:'f-shop',name:'商业',children:[{id:'f-retail',name:'零售空间'}]},
    {id:'f-office',name:'办公',children:[{id:'f-work',name:'办公空间'}]}
  ],
  effect: [
    {id:'e-home',name:'住宅',children:[{id:'e-bedroom',name:'卧室'},{id:'e-dining',name:'餐厅'},{id:'e-living',name:'客厅'}]},
    {id:'e-hotel',name:'酒店',children:[{id:'e-lobby',name:'大堂'}]},
    {id:'e-shop',name:'商业',children:[{id:'e-store',name:'店铺'}]},
    {id:'e-office',name:'办公',children:[{id:'e-meeting',name:'会议空间'}]}
  ]
};
V3_FLOORS.forEach((item,i)=>Object.assign(item,{primary:'f-home',secondary:i===0?'f-chun':'f-one'}));
V3_EFFECT_PRESETS.forEach((item,i)=>Object.assign(item,{primary:'e-home',secondary:['e-bedroom','e-dining','e-bedroom','e-living','e-dining'][i]}));
// Use the complete library in both the admin and iPad interfaces.
for(const kind of ['floor','effect']) {
 const items=kind==='floor'?V3_FLOORS:V3_EFFECT_PRESETS;
 V3_ADMIN_ITEMS[kind]=items.map((item,i)=>({...item,sort:i+1,status:'启用',operator:'高志远',updatedAt:v3Now()}));
}
S.v4Filters={};
function v4ResetFilter(context,kind){S.v4Filters[context]={primary:V4_CATEGORIES[kind][0]?.id||'',secondary:''};}
function v4Filter(context,kind){if(!S.v4Filters[context])v4ResetFilter(context,kind);return S.v4Filters[context];}
function v4Matches(item,context,kind){const f=v4Filter(context,kind);return item.primary===f.primary&&(!f.secondary||item.secondary===f.secondary);}
function v4CategoryBar(kind,context){
 const f=v4Filter(context,kind),tree=V4_CATEGORIES[kind],parent=tree.find(x=>x.id===f.primary);
 const button=(item,level)=>`<button type="button" class="${f[level]===item.id?'on':''}" aria-pressed="${f[level]===item.id}" onclick="v4ChooseCategory('${kind}','${context}','${level}','${item.id}')">${v3Esc(item.name)}</button>`;
 return `<nav class="v4-categories" aria-label="${kind==='floor'?'户型图':'效果图'}分类"><div class="v4-primary">${tree.map(x=>button(x,'primary')).join('')}</div><div class="v4-secondary">${button({id:'',name:'全部分类'},'secondary')}${(parent?.children||[]).map(x=>button(x,'secondary')).join('')}</div></nav>`;
}
function v4ChooseCategory(kind,context,level,id){const f=v4Filter(context,kind);f[level]=id;if(level==='primary')f.secondary='';if(context==='effect')S.effectSelection=null;if(context==='floor'&&S.floorDraftIndex!==-1){const index=V3_FLOORS.findIndex(x=>v4Matches(x,'floor','floor'));if(index>=0){pickV3Floor(index);return;}S.floorDraftIndex=-2;S.floorDraftBox=null;S.floorDraftImage='';S.floorDraftName='';}render();}
function v4Empty(){return '<div class="v4-empty">该分类暂无图片</div>';}
const v4OriginalSource=source;
source=function(){return v4OriginalSource().replace('v3-entry-grid-compact','v3-entry-grid-compact v4-entry-grid').replace('<button class="v3-entry-card',`<button class="v4-case-entry" onclick="v4OpenCases()"><img src="${(V3_EFFECT_PRESETS[0]?.image||V3_USER_ASSETS.effectBefore)}" alt=""><span class="v4-case-entry-copy"><small>空间灵感</small><h2>项目案例库</h2><p>浏览空间案例，发现搭配灵感</p></span><span class="v3-entry-arrow">→</span></button><button class="v3-entry-card`);};
const v4OriginalOpenPicker=openGeneratePicker;
openGeneratePicker=function(kind){if(kind==='floor'){v4ResetFilter('floor','floor');if(!V3_FLOORS.length){S.flowModal='floor';S.floorDraftIndex=-2;S.floorDraftBox=null;S.floorDraftImage='';S.floorDraftName='';render();return;}}v4OriginalOpenPicker(kind);};
const v4OriginalStartRoute=startRoute;
startRoute=function(route){if(route==='effect')v4ResetFilter('effect','effect');v4OriginalStartRoute(route);};
const v4OriginalPicker=generatePickerDialog;
generatePickerDialog=function(){
 let html=v4OriginalPicker();if(S.flowModal!=='floor')return html;
 const template=document.createElement('template');template.innerHTML=html;
 const body=template.content.querySelector('.v3-dialog-body');body.classList.add('v4-floor-body');body.insertAdjacentHTML('afterbegin',v4CategoryBar('floor','floor'));
 const grid=template.content.querySelector('.v3-mini-grid');
 grid.querySelectorAll('button').forEach(button=>{const index=Number(button.getAttribute('onclick').match(/\((\d+)\)/)[1]);if(!v4Matches(V3_FLOORS[index],'floor','floor'))button.remove();});
 if(!S.floorDraftImage){const canvas=template.content.querySelector('.v3-crop-canvas');canvas.removeAttribute('onpointerdown');canvas.removeAttribute('onwheel');canvas.classList.add('v4-crop-empty');canvas.innerHTML='请选择户型图或本地上传';}const count=V3_FLOORS.filter(x=>v4Matches(x,'floor','floor')).length;
 template.content.querySelector('.v3-count').textContent=count;
 if(!count)grid.insertAdjacentHTML('beforeend',v4Empty());
 return template.innerHTML;
};
const v4OriginalEffectScreen=effectSelectScreen;
effectSelectScreen=function(){
 const template=document.createElement('template');template.innerHTML=v4OriginalEffectScreen();
 const section=template.content.querySelector('.v3-effect-section');section.insertAdjacentHTML('afterbegin',v4CategoryBar('effect','effect'));
 section.querySelectorAll('button[onclick^="selectV3Effect"]').forEach(button=>{const index=Number(button.getAttribute('onclick').match(/,(\d+)/)[1]);if(!v4Matches(V3_EFFECT_PRESETS[index],'effect','effect'))button.remove();});
 if(!V3_EFFECT_PRESETS.some(x=>v4Matches(x,'effect','effect')))section.querySelector('.v3-effect-grid').insertAdjacentHTML('beforeend',v4Empty());
 return template.innerHTML;
};
function v4OpenCases(){v4ResetFilter('cases','effect');S.page='cases';render();}
function v4CaseScreen(){
 const cards=V3_EFFECT_PRESETS.map((item,index)=>({item,index})).filter(({item})=>v4Matches(item,'cases','effect')).map(({item,index})=>`<button class="v3-effect-card v4-case-card" onclick="S.v4CaseIndex=${index};S.page='caseDetail';render()"><img src="${item.image}" alt="${v3Esc(item.name)}"><b>${v3Esc(item.name)}</b><small>${v3Esc(v4CategoryLabel('effect',item))}</small></button>`).join('');
 return v3Shell('项目案例库',`<section class="v4-case-library">${v4CategoryBar('effect','cases')}<div class="v4-case-grid">${cards||v4Empty()}</div></section>`,'source');
}
function v4CategoryLabel(kind,item){const p=V4_CATEGORIES[kind].find(x=>x.id===item.primary);return p?`${p.name} / ${p.children.find(x=>x.id===item.secondary)?.name||'未分类'}`:'未分类';}
function v4CaseDetail(){const item=V3_EFFECT_PRESETS[S.v4CaseIndex];if(!item)return v4CaseScreen();return v3Shell(item.name,`<div class="v4-case-detail"><img src="${item.image}" alt="${v3Esc(item.name)}"><div><span>${v3Esc(v4CategoryLabel('effect',item))}</span></div></div>`,'cases');}
// Category configuration is independently scoped to the current image library.
const v4OriginalAdmin=admin;
admin=function(){
 if(S.v4CategoryKind)return v4CategoryAdmin();
 let html=v4OriginalAdmin();if(!V4_CATEGORIES[S.adminSection])return html;
 const template=document.createElement('template');template.innerHTML=html;
 const table=template.content.querySelector('.v3-table');
 if(table){table.querySelector('thead tr').children[2].insertAdjacentHTML('afterend','<th>所属分类</th>');table.querySelectorAll('tbody tr').forEach(row=>{const edit=row.querySelector('button[onclick^="openAdminEdit"]');if(edit){const index=Number(edit.getAttribute('onclick').match(/\((\d+)\)/)[1]);row.children[2].insertAdjacentHTML('afterend',`<td>${v3Esc(v4CategoryLabel(S.adminSection,V3_ADMIN_ITEMS[S.adminSection][index]))}</td>`);}else row.querySelector('td')?.setAttribute('colspan','8');});}
 const title=template.content.querySelector('.v3-admin-title');title.insertAdjacentHTML('beforeend',`<button class="v3-btn" onclick="S.v4CategoryKind='${S.adminSection}';render()">分类管理</button>`);
 return template.innerHTML;
};
const v4OriginalSwitchAdmin=switchAdmin;
switchAdmin=function(section){S.v4CategoryKind=null;v4OriginalSwitchAdmin(section);};
function v4CategoryAdmin(){const kind=S.v4CategoryKind;
 const content=`<section class="v3-admin-card"><div class="v3-admin-title"><div><h1>${kind==='floor'?'户型图':'效果图'}分类管理</h1><p>一级分类与二级分类</p></div><button class="v3-btn" onclick="S.v4CategoryKind=null;render()">返回图片配置</button></div><form class="v4-category-add" onsubmit="event.preventDefault();v4AddCategory(this)"><select name="parent" aria-label="分类层级"><option value="">新增一级分类</option>${V4_CATEGORIES[kind].map(p=>`<option value="${p.id}">新增二级分类 · ${v3Esc(p.name)}</option>`).join('')}</select><input name="categoryName" aria-label="分类名称" placeholder="请输入分类名称" maxlength="24" required><button class="v3-btn primary" type="submit">添加分类</button></form><div class="v4-category-tree">${V4_CATEGORIES[kind].map(p=>`<section><form onsubmit="event.preventDefault();v4RenameCategory('${p.id}',this)"><strong>一级分类</strong><input name="categoryName" aria-label="一级分类名称" value="${v3Esc(p.name)}" maxlength="24" required><button class="v3-btn">保存名称</button><button type="button" class="v3-btn danger" onclick="v4DeleteCategory('${p.id}')">删除</button></form>${p.children.map(c=>`<form class="v4-child-row" onsubmit="event.preventDefault();v4RenameCategory('${c.id}',this)"><span>二级分类</span><input name="categoryName" aria-label="二级分类名称" value="${v3Esc(c.name)}" maxlength="24" required><button class="v3-btn">保存名称</button><button type="button" class="v3-btn danger" onclick="v4DeleteCategory('${c.id}')">删除</button></form>`).join('')}</section>`).join('')}</div></section>`;
 return v3AdminFrame('分类管理',content);
}
function v4AddCategory(form){const kind=S.v4CategoryKind,name=form.elements.categoryName.value.trim(),parent=V4_CATEGORIES[kind].find(x=>x.id===form.elements.parent.value),siblings=parent?parent.children:V4_CATEGORIES[kind];if(!name)return;if(siblings.some(x=>x.name===name)){toast('同级分类名称不能重复');return;}const item={id:`${kind}-${Date.now()}`,name};if(!parent)item.children=[];siblings.push(item);toast('分类已添加');}
function v4RenameCategory(id,form){const tree=V4_CATEGORIES[S.v4CategoryKind],parent=tree.find(p=>p.children.some(c=>c.id===id)),siblings=parent?parent.children:tree,item=siblings.find(x=>x.id===id),name=form.elements.categoryName.value.trim();if(!name)return;if(siblings.some(x=>x.id!==id&&x.name===name)){toast('同级分类名称不能重复');return;}item.name=name;toast('分类名称已保存');}
function v4DeleteCategory(id){const kind=S.v4CategoryKind,tree=V4_CATEGORIES[kind],parent=tree.find(p=>p.children.some(c=>c.id===id)),siblings=parent?parent.children:tree,item=siblings.find(x=>x.id===id);if(V3_ADMIN_ITEMS[kind].some(x=>x.primary===id||x.secondary===id)||item.children?.length){toast('请先移出图片并删除下级分类');return;}if(!parent&&tree.length===1){toast('至少保留一个一级分类');return;}siblings.splice(siblings.indexOf(item),1);for(const key of Object.keys(S.v4Filters))if(S.v4Filters[key].primary===id||S.v4Filters[key].secondary===id)delete S.v4Filters[key];toast('分类已删除');}
const v4OriginalAdminDialog=v3AdminItemDialog;
v3AdminItemDialog=function(){let html=v4OriginalAdminDialog();const kind=S.adminSection;if(!V4_CATEGORIES[kind])return html;const form=S.v3AdminForm;form.primary ||= V4_CATEGORIES[kind][0]?.id;const parent=V4_CATEGORIES[kind].find(x=>x.id===form.primary);if(!parent?.children.some(c=>c.id===form.secondary))form.secondary=parent?.children[0]?.id||'';
 const fields=`<label>一级分类<select aria-label="图片一级分类" onchange="S.v3AdminForm.primary=this.value;S.v3AdminForm.secondary='';render()">${V4_CATEGORIES[kind].map(p=>`<option value="${p.id}" ${p.id===form.primary?'selected':''}>${v3Esc(p.name)}</option>`).join('')}</select></label><label>二级分类<select aria-label="图片二级分类" onchange="S.v3AdminForm.secondary=this.value">${(parent?.children||[]).map(c=>`<option value="${c.id}" ${c.id===form.secondary?'selected':''}>${v3Esc(c.name)}</option>`).join('')||'<option value="">请先建立二级分类</option>'}</select></label>`;
 return html.replace('<label class="v3-admin-upload">',fields+'<label class="v3-admin-upload">');};
function v4SyncLibrary(kind){if(!V4_CATEGORIES[kind])return;const target=kind==='floor'?V3_FLOORS:V3_EFFECT_PRESETS;target.splice(0,target.length,...V3_ADMIN_ITEMS[kind].filter(x=>x.status==='启用').slice().sort((a,b)=>a.sort-b.sort));}
const v4OriginalSaveAdmin=saveV3AdminItem;
saveV3AdminItem=function(){const kind=S.adminSection;if(!V4_CATEGORIES[kind])return v4OriginalSaveAdmin();const form=S.v3AdminForm,sort=Number(form.sort);if(!form.name.trim()||!form.image||!Number.isInteger(sort)||sort<1||!form.secondary){toast('请填写名称、图片、分类和有效排序');return;}const item={...form,name:form.name.trim(),sort,status:form.status||'启用',operator:'高志远',updatedAt:v3Now()};delete item.editIndex;if(Number.isInteger(form.editIndex))V3_ADMIN_ITEMS[kind][form.editIndex]=item;else V3_ADMIN_ITEMS[kind].push(item);v4SyncLibrary(kind);S.v3AdminModal=null;render();};
const v4OriginalToggleAdmin=toggleAdminStatus;
toggleAdminStatus=function(index){v4OriginalToggleAdmin(index);v4SyncLibrary(S.adminSection);};
const v4OriginalDeleteAdmin=deleteV3AdminItem;
deleteV3AdminItem=function(index){v4OriginalDeleteAdmin(index);v4SyncLibrary(S.adminSection);};
const v4OriginalRender=render;
render=function(){if(S.page==='cases'||S.page==='caseDetail'){app.innerHTML=S.page==='cases'?v4CaseScreen():v4CaseDetail();return;}v4OriginalRender();};
render();
