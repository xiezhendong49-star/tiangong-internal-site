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

async function materialExcelThumbnail(src) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('物料图片加载超时')), 15000);
    img.onload = () => { clearTimeout(timer); resolve(); };
    img.onerror = () => { clearTimeout(timer); reject(new Error('物料图片加载失败')); };
    img.src = src;
  });
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 144;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 144, 144);
  const ratio = Math.min(144 / img.naturalWidth, 144 / img.naturalHeight);
  const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
  ctx.drawImage(img, (144-w)/2, (144-h)/2, w, h);
  return canvas.toDataURL('image/png');
}

async function downloadMaterialExcel(records) {
  await loadMaterialExcelLibrary();
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('材质替换用料明细', {
    views: [{state: 'frozen', xSplit: 2, ySplit: 1, showGridLines: false}],
  });
  const headers = ['记录编号','操作人','创作时间','状态','标点编号','平台编号','物料名称','物料分类','供应商名称','物料来源','物料图片','带标点原图链接','结果图链接'];
  const widths = [24,17,23,10,12,22,23,13,27,22,15,39,36];
  sheet.columns = widths.map(width => ({width}));
  const details = records.flatMap(log => (log.points || []).map((point,i) => ({log,point,i})));
  if (!details.length) throw new Error('所选记录暂无用料明细');
  const link = value => value && !value.startsWith('data:') && !value.startsWith('blob:') ? new URL(value, location.href).href : '';
  sheet.addTable({name:'MaterialReplacementDetails',ref:'A1',headerRow:true,
    style:{theme:'TableStyleMedium2',showRowStripes:true},
    columns:headers.map(name=>({name,filterButton:true})),
    rows:details.map(({log,point,i}) => {
      const m = point.material;
      return [log.id,log.operator,new Date(log.time.replace(' ','T')+':00Z'),log.status,i+1,m.platformCode||'',m.name||'本地上传物料',m.category||'',m.supplier||'',m.source==='天工云仓'?'天工云仓物料库':m.source,'',link(log.mainImage),link(log.resultImage)];
    })});
  const thumbnails = new Map();
  for (let index=0; index<details.length; index++) {
    const row = sheet.getRow(index+2);
    row.height = 68;
    for (let col=1; col<=13; col++) {
      const cell = row.getCell(col);
      cell.font = {name:'Microsoft YaHei',size:11,color:{argb:'FF243746'}};
      cell.alignment = {vertical:'middle',wrapText:true};
      cell.fill = {type:'pattern',pattern:'solid',fgColor:{argb:index%2?'FFFFFFFF':'FFC0E6F2'}};
      cell.border = {bottom:{style:'hair',color:{argb:'FF36B4DE'}}};
    }
    row.getCell(3).numFmt = 'yyyy-mm-dd hh:mm';
    [12,13].forEach(col => {
      const cell=row.getCell(col);
      if(cell.value) cell.value={text:cell.value,hyperlink:cell.value};
      cell.font={name:'Microsoft YaHei',size:10,color:{argb:'FF008AC1'},underline:true};
    });
    const src=details[index].point.material.image;
    if(src) {
      if(!thumbnails.has(src)) thumbnails.set(src,workbook.addImage({base64:await materialExcelThumbnail(src),extension:'png'}));
      sheet.addImage(thumbnails.get(src),{tl:{col:10.14,row:index+1.08},ext:{width:72,height:72},editAs:'oneCell'});
    }
  }
  sheet.getRow(1).height=31;
  sheet.getRow(1).eachCell(cell => {
    cell.font={name:'Microsoft YaHei',size:11,bold:true,color:{argb:'FFFFFFFF'}};
    cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF147E9E'}};
    cell.alignment={vertical:'middle'};
  });
  const buffer=await workbook.xlsx.writeBuffer();
  const url=URL.createObjectURL(new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  const a=document.createElement('a');
  a.href=url; a.download='材质替换用料明细_'+(records.length===1?records[0].id:'批量'+records.length+'条')+'.xlsx';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
