function zcGo(section) { S.zcSection=section;S.v3CallDetail=null;render();document.querySelector('.zc-sidebar .active')?.scrollIntoView({block:'nearest'}); }
function zcCallState() { return S.zcCalls ||= {org:'',type:'',status:'',query:'',start:'',end:''}; }
function zcFilter(key,value) {const f=zcCallState();f[key]=value;render();}
function zcCallRows() {
 const f=zcCallState();
 return V3_CALL_LOGS.filter(r=>(!f.org||f.org==='天工云仓')&&(!f.type||r.type===f.type)&&(!f.status||r.status===f.status)&&(!f.start||r.time.slice(0,10)>=f.start)&&(!f.end||r.time.slice(0,10)<=f.end)&&(!f.query||r.operator.includes(f.query)||r.id.includes(f.query)));
}
function zcConsumedQuota(record) { return record.consumedQuota ?? '—'; }
function zcThirdPartyContent() {
 const f=zcCallState(),rows=zcCallRows();
 const select=(label,key,options)=>`<label><span>${label}</span><select aria-label="${label}" onchange="zcFilter('${key}',this.value)"><option value="">全部</option>${options.map(x=>`<option ${f[key]===x?'selected':''}>${v3Esc(x)}</option>`).join('')}</select></label>`;
 return `<nav class="zc-main-tabs"><button onclick="zcGo('tenants')">兆材云系统租户列表</button><button class="on">第三方创作记录</button></nav><section class="zc-panel zc-third-party"><header class="zc-third-title"><div><h2>第三方创作记录</h2><p>查看机构的创作结果与额度消耗</p></div><span>AI绘画 / 第三方创作记录</span></header>
 <div class="zc-third-filters">${select('所属机构','org',['天工云仓'])}${select('创作类型','type',['生成效果图','材质替换'])}${select('状态','status',['成功','失败','处理中','已取消'])}
 <label><span>操作人 / 记录编号</span><input aria-label="操作人或记录编号" placeholder="输入操作人或记录编号" value="${v3Esc(f.query)}" oninput="zcCallState().query=this.value" onkeydown="if(event.key==='Enter'){zcFilter('query',this.value)}"></label><div class="zc-third-date"><span>提交时间</span><div role="group" aria-label="提交时间范围"><input aria-label="提交开始日期" type="date" value="${f.start}" onchange="zcFilter('start',this.value)"><span>至</span><input aria-label="提交结束日期" type="date" value="${f.end}" onchange="zcFilter('end',this.value)"></div></div><div class="zc-third-filter-actions"><button class="v3-btn primary" onclick="zcFilter('query',zcCallState().query)">查询</button><button class="v3-btn" onclick="S.zcCalls=null;render()">重置</button></div></div>
 <div class="zc-toolbar"><span class="zc-third-total">共 ${rows.length} 条记录</span></div>
 <div class="zc-table-wrap zc-third-table"><table><thead><tr><th>记录编号</th><th>所属机构</th><th>操作人</th><th>创作类型</th><th>结果图</th><th>提交时间</th><th>状态</th><th>消耗额度</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${v3Esc(r.id)}</b></td><td>天工云仓</td><td>${v3Esc(r.operator)}</td><td>${r.type}</td><td>${r.resultImage?`<img src="${v3Esc(r.resultImage)}" alt="创作结果" loading="lazy">`:'—'}</td><td>${r.time}</td><td><span class="v3-status ${r.status==='失败'?'fail':''}">${r.status}</span></td><td>${zcConsumedQuota(r)}</td><td><div class="zc-row-actions"><button onclick="openV3CallDetail('${r.id}')">查看</button></div></td></tr>`).join('')||'<tr><td colspan="9" class="zc-third-empty">暂无符合条件的创作记录</td></tr>'}</tbody></table></div></section>`;
}
function zhaocaiAdminScreen() {
 const template=document.createElement('template');template.innerHTML=zhaocaiTenantScreen();
 const sidebar=template.content.querySelector('.zc-sidebar');
 const third=S.zcSection==='thirdParty';
 const tenant=sidebar.querySelector('.zc-side-sub.active');
 if(tenant) {tenant.setAttribute('onclick',"zcGo('tenants')");if(third)tenant.classList.remove('active');}
 const aiNav=`<button class="${third?'on':''}" onclick="S.zcAiNavClosed=!S.zcAiNavClosed;render()">♧　AI绘画　${S.zcAiNavClosed?'⌄':'⌃'}</button>${S.zcAiNavClosed?'':`<button class="zc-side-sub" onclick="toast('原有 Transfusion 创作记录未接入此演示')">创作记录</button><button class="zc-side-sub ${third?'active':''}" onclick="zcGo('thirdParty')">第三方创作记录</button>`}`;
 sidebar.insertAdjacentHTML('beforeend',aiNav);
 sidebar.insertAdjacentHTML('afterbegin','<div class="zc-prototype-guide"><b>原型说明</b><span>已开放 2 个入口，带“可查看”标记的菜单可点击。</span></div>');
 sidebar.querySelectorAll('.zc-side-sub').forEach(entry=>{
  if(!['兆材云系统租户列表','第三方创作记录'].includes(entry.textContent.trim()))return;
  entry.classList.add('zc-prototype-entry');
  entry.insertAdjacentHTML('beforeend','<span class="zc-prototype-badge" aria-hidden="true">可查看</span>');
  if(entry.tagName!=='BUTTON'){
   entry.setAttribute('role','button');entry.setAttribute('tabindex','0');
   entry.setAttribute('onkeydown',"if(event.key==='Enter'||event.key===' '){event.preventDefault();zcGo('tenants')}");
  }
 });
 if(third) {
  sidebar.querySelectorAll('button.on').forEach(b=>{if(!b.textContent.includes('AI绘画'))b.classList.remove('on');});
  template.content.querySelector('.zc-main').innerHTML=zcThirdPartyContent();
  if(S.v3CallDetail) {
   const log=S.v3CallDetail;
   const detail=document.createElement('template');detail.innerHTML=v3CallDetailDialog().replaceAll('未生成','—');
   detail.content.querySelector('.v3-dialog-body').insertAdjacentHTML('afterbegin',`<div class="zc-third-detail-meta"><span>所属机构：<b>天工云仓</b></span><span>消耗额度：<b>${zcConsumedQuota(log)}</b></span></div>`);
   template.content.appendChild(detail.content);
  }
 }
 return template.innerHTML;
}
