function zcGo(section) { S.zcSection=section;S.v3CallDetail=null;render();document.querySelector('.zc-sidebar .active')?.scrollIntoView({block:'nearest'}); }
function zcCallState() { return S.zcCalls ||= {platform:'',org:'',type:'',status:'',query:'',start:'',end:'',selected:[]}; }
function zcFilter(key,value) {const f=zcCallState();f[key]=value;f.selected=[];render();}
function zcCallRows() {
 const f=zcCallState();
 return V3_CALL_LOGS.filter(r=>(!f.platform||f.platform==='天工云仓')&&(!f.org||r.institution===f.org)&&(!f.type||r.type===f.type)&&(!f.status||r.status===f.status)&&(!f.start||r.time.slice(0,10)>=f.start)&&(!f.end||r.time.slice(0,10)<=f.end)&&(!f.query||r.operator.includes(f.query)||r.id.includes(f.query)));
}
function zcSelectCall(id,checked) {const f=zcCallState();f.selected=checked?[...new Set([...f.selected,id])]:f.selected.filter(x=>x!==id);render();}
async function zcExportCalls(id) {
 if(S.callExportBusy)return;
 const rows=zcCallRows().filter(r=>r.type==='材质替换'&&(id?r.id===id:zcCallState().selected.includes(r.id)));
 if(!rows.length)return toast('请选择材质替换记录');
 S.callExportBusy=true;toast('正在生成 Excel…');
 try{await downloadMaterialExcel(rows);toast('Excel 已下载');}catch(e){toast(e.message||'导出失败，请重试');}finally{S.callExportBusy=false;}
}
function zcThirdPartyContent() {
 const f=zcCallState(),rows=zcCallRows();
 const select=(label,key,options)=>`<label><span>${label}</span><select aria-label="${label}" onchange="zcFilter('${key}',this.value)"><option value="">全部</option>${options.map(x=>`<option ${f[key]===x?'selected':''}>${v3Esc(x)}</option>`).join('')}</select></label>`;
 const selected=rows.filter(r=>f.selected.includes(r.id));
 return `<nav class="zc-main-tabs"><button onclick="zcGo('tenants')">兆材云系统租户列表</button><button class="on">第三方创作记录</button></nav><section class="zc-panel zc-third-party"><header class="zc-third-title"><div><h2>第三方创作记录</h2><p>查看接入平台的创作结果与用料明细</p></div><span>AI绘画 / 第三方创作记录</span></header>
 <div class="zc-third-filters">${select('接入平台','platform',['天工云仓'])}${select('所属机构','org',[...new Set(V3_CALL_LOGS.map(r=>r.institution))])}${select('创作类型','type',['生成效果图','材质替换'])}${select('状态','status',['成功','失败','处理中','已取消'])}
 <label><span>操作人 / 记录编号</span><input aria-label="操作人或记录编号" placeholder="输入操作人或记录编号" value="${v3Esc(f.query)}" oninput="zcCallState().query=this.value" onkeydown="if(event.key==='Enter'){zcFilter('query',this.value)}"></label><label><span>开始日期</span><input aria-label="创作开始日期" type="date" value="${f.start}" onchange="zcFilter('start',this.value)"></label><label><span>结束日期</span><input aria-label="创作结束日期" type="date" value="${f.end}" onchange="zcFilter('end',this.value)"></label><div class="zc-third-filter-actions"><button class="v3-btn primary" onclick="zcFilter('query',zcCallState().query)">查询</button><button class="v3-btn" onclick="S.zcCalls=null;render()">重置</button></div></div>
 <div class="zc-toolbar"><button ${selected.some(r=>r.type==='材质替换')?'':'disabled'} onclick="zcExportCalls()">导出用料清单</button><span>已选 ${selected.length} 条<span class="zc-third-muted">　仅导出材质替换记录</span></span><span class="zc-third-total">共 ${rows.length} 条</span></div>
 <div class="zc-table-wrap zc-third-table"><table><thead><tr><th><input type="checkbox" aria-label="全选第三方记录" ${rows.length&&selected.length===rows.length?'checked':''} onchange="zcCallState().selected=this.checked?zcCallRows().map(r=>r.id):[];render()"></th><th>记录编号 / 接入平台</th><th>所属机构</th><th>操作人</th><th>创作类型</th><th>结果图</th><th>创作时间</th><th>状态</th><th>额度扣减</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><input type="checkbox" aria-label="选择第三方记录 ${r.id}" ${f.selected.includes(r.id)?'checked':''} onchange="zcSelectCall('${r.id}',this.checked)"></td><td><b>${v3Esc(r.id)}</b><small>天工云仓</small></td><td>${v3Esc(r.institution)}</td><td>${v3Esc(r.operator)}</td><td>${r.type}</td><td>${r.resultImage?`<img src="${v3Esc(r.resultImage)}" alt="创作结果" loading="lazy">`:'—'}</td><td>${r.time}</td><td><span class="v3-status ${r.status==='失败'?'fail':''}">${r.status}</span></td><td>${r.counted?'已扣减':'未扣减'}</td><td><div class="zc-row-actions"><button onclick="openV3CallDetail('${r.id}')">查看</button>${r.type==='材质替换'?`<button onclick="zcExportCalls('${r.id}')">导出</button>`:''}</div></td></tr>`).join('')||'<tr><td colspan="10" class="zc-third-empty">暂无符合条件的创作记录</td></tr>'}</tbody></table></div></section>`;
}
function zhaocaiAdminScreen() {
 const template=document.createElement('template');template.innerHTML=zhaocaiTenantScreen();
 const sidebar=template.content.querySelector('.zc-sidebar');
 const third=S.zcSection==='thirdParty';
 const tenant=sidebar.querySelector('.zc-side-sub.active');
 if(tenant) {tenant.setAttribute('onclick',"zcGo('tenants')");if(third)tenant.classList.remove('active');}
 const aiNav=`<button class="${third?'on':''}" onclick="S.zcAiNavClosed=!S.zcAiNavClosed;render()">♧　AI绘画　${S.zcAiNavClosed?'⌄':'⌃'}</button>${S.zcAiNavClosed?'':`<button class="zc-side-sub" onclick="toast('原有 Transfusion 创作记录未接入此演示')">创作记录</button><button class="zc-side-sub ${third?'active':''}" onclick="zcGo('thirdParty')">第三方创作记录</button>`}`;
 sidebar.insertAdjacentHTML('beforeend',aiNav);
 if(third) {
  sidebar.querySelectorAll('button.on').forEach(b=>{if(!b.textContent.includes('AI绘画'))b.classList.remove('on');});
  template.content.querySelector('.zc-main').innerHTML=zcThirdPartyContent();
  if(S.v3CallDetail) {
   const log=S.v3CallDetail;
   const detail=document.createElement('template');detail.innerHTML=v3CallDetailDialog();
   detail.content.querySelector('.v3-dialog-body').insertAdjacentHTML('afterbegin',`<div class="zc-third-detail-meta"><span>接入平台：<b>天工云仓</b></span><span>所属机构：<b>${v3Esc(log.institution)}</b></span><span>额度扣减：<b>${log.counted?'已扣减':'未扣减'}</b></span></div>`);
   template.content.appendChild(detail.content);
  }
 }
 return template.innerHTML;
}
