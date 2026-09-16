/* Browser export for the material replacement demo. ExcelJS is served locally. */
let materialExcelLibrary;
function loadMaterialExcelLibrary() {
  if (window.ExcelJS) return Promise.resolve();
  if (!materialExcelLibrary) materialExcelLibrary = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'vendor/exceljs.min.js';
    script.onload = resolve;
    script.onerror = () => { materialExcelLibrary = null; script.remove(); reject(new Error('导出组件加载失败')); };
    document.head.appendChild(script);
  });
  return materialExcelLibrary;
}

async function materialExcelThumbnail(src, width=144, height=144, points=[]) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('物料图片加载超时')), 15000);
    img.onload = () => { clearTimeout(timer); resolve(); };
    img.onerror = () => { clearTimeout(timer); reject(new Error('物料图片加载失败')); };
    img.src = src;
  });
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height);
  const ratio = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
  const left=(width-w)/2, top=(height-h)/2;
  ctx.drawImage(img, left, top, w, h);
  points.forEach((point,index)=>{
    const x=left+w*point.x/100,y=top+h*point.y/100;
    ctx.beginPath();ctx.arc(x,y,16,0,Math.PI*2);ctx.fillStyle='#078bbc';ctx.fill();
    ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='bold 19px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(index+1),x,y);
  });
  return canvas.toDataURL('image/png');
}

async function downloadMaterialExcel(records) {
  await loadMaterialExcelLibrary();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('材质替换用料明细', {
    views: [{state: 'frozen', xSplit: 4, ySplit: 2, showGridLines: false}],
  });
  const headers = ['记录编号','操作人','提交时间','状态','标点编号','平台编号','物料名称','物料分类','供应商名称','物料来源','物料图片','带标点原图','结果图'];
  const widths = [26,17,23,10,12,22,23,13,27,22,15,40,40];
  sheet.columns = widths.map(width => ({width}));
  const details = records.flatMap(log => (log.points || []).map((point,i) => ({log,point,i})));
  if (!details.length) throw new Error('所选记录暂无用料明细');
  sheet.addRow(['创作信息','','','','替换物料','','','','','','','效果对照','']);
  sheet.mergeCells('A1:D1'); sheet.mergeCells('E1:K1'); sheet.mergeCells('L1:M1');
  sheet.addRow(headers);
  sheet.addRows(details.map(({log,point,i}) => {
      const m = point.material;
      return [log.id,log.operator,new Date(log.time.replace(' ','T')+':00Z'),log.status,i+1,m.platformCode||'',m.name||'本地上传物料',m.category||'',m.supplier||'',m.source==='天工云仓'?'天工云仓物料库':m.source,'','',''];
    }));
  const thumbnails = new Map();
  for (let index=0; index<details.length; index++) {
    const row = sheet.getRow(index+3);
    row.height = 100;
    for (let col=1; col<=13; col++) {
      const cell = row.getCell(col);
      cell.font = {name:'Microsoft YaHei',size:11,color:{argb:'FF243746'}};
      cell.alignment = {vertical:'middle',wrapText:true};
      cell.fill = {type:'pattern',pattern:'solid',fgColor:{argb:records.indexOf(details[index].log)%2?'FFFFFFFF':'FFEAF5F9'}};
      cell.border = {bottom:{style:'hair',color:{argb:'FF36B4DE'}}};
    }
    row.getCell(3).numFmt = 'yyyy-mm-dd hh:mm';
    const src=details[index].point.material.image;
    if(src) {
      if(!thumbnails.has(src)) thumbnails.set(src,workbook.addImage({base64:await materialExcelThumbnail(src),extension:'png'}));
      sheet.addImage(thumbnails.get(src),{tl:{col:10.14,row:index+2.2},ext:{width:72,height:72},editAs:'oneCell'});
    }
  }
  let first=3;
  for(const log of records) {
    const count=(log.points||[]).length;
    if(!count) continue;
    const last=first+count-1;
    if(count>1) [1,2,3,4,12,13].forEach(col=>sheet.mergeCells(first,col,last,col));
    for(const [col,src,points] of [[11,log.mainImage,log.points||[]],[12,log.resultImage,[]]]) {
      if(src) {
        const height=Math.min(210,count*133-16);
        const base64=await materialExcelThumbnail(src,520,height*2,points);
        const imageId=workbook.addImage({base64,extension:'png'});
        sheet.addImage(imageId,{tl:{col:col+0.04,row:first-1+0.06},ext:{width:260,height},editAs:'oneCell'});
      } else sheet.getCell(first,col+1).value='暂无图片';
    }
    first=last+1;
  }
  for(const rowNumber of [1,2]) {
  sheet.getRow(rowNumber).height=31;
  sheet.getRow(rowNumber).eachCell(cell => {
    cell.font={name:'Microsoft YaHei',size:11,bold:true,color:{argb:'FFFFFFFF'}};
    cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF147E9E'}};
    cell.alignment={vertical:'middle',horizontal:'center'};
  });
  }
  const buffer=await workbook.xlsx.writeBuffer();
  const url=URL.createObjectURL(new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  const a=document.createElement('a');
  a.href=url; a.download='材质替换用料明细_'+(records.length===1?records[0].id:'批量'+records.length+'条')+'.xlsx';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
