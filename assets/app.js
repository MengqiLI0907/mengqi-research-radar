(() => {
  'use strict';
  const CATS = [
    {id:'smoke', name:'野火烟雾与暴露', short:'Wildfire smoke', color:'#e7a87a', weight:5, q:'wildfire smoke PM2.5 exposure'},
    {id:'mobility', name:'人口流动与疏散', short:'Human mobility', color:'#91a8d4', weight:5, q:'wildfire human mobility evacuation'},
    {id:'justice', name:'环境公平与脆弱性', short:'Environmental justice', color:'#e1b691', weight:4, q:'environmental justice wildfire exposure'},
    {id:'geoai', name:'GeoAI 与基础模型', short:'GeoAI & AI', color:'#b3a0d6', weight:4, q:'geospatial artificial intelligence foundation model'},
    {id:'resilience', name:'城市韧性与空间模型', short:'Urban resilience', color:'#76b8a7', weight:3, q:'urban mobility resilience spatial model'},
    {id:'remote', name:'遥感与地球观测', short:'Remote sensing', color:'#cab57f', weight:3, q:'wildfire smoke satellite remote sensing machine learning'}
  ];
  const CAT_WORDS = {
    smoke: [/wildfire/i,/smoke/i,/pm\s*2\.?5/i,/particulate/i,/air quality/i,/air pollution/i,/fire-induced/i],
    mobility: [/mobilit/i,/movement/i,/evacuat/i,/travel/i,/transport/i,/smartphone location/i,/commut/i,/traffic/i,/trip pattern/i],
    justice: [/equity/i,/inequalit/i,/disparit/i,/vulnerab/i,/environmental justice/i,/socioeconomic/i,/demographic/i,/population group/i,/health burden/i],
    geoai: [/geoai/i,/geospatial artificial/i,/foundation model/i,/deep learning/i,/geographic artificial/i,/spatial machine learning/i,/multimodal model/i],
    resilience: [/resilien/i,/recover/i,/disaster/i,/hazard/i,/spatial model/i,/urban system/i,/spatial association/i,/emergency response/i],
    remote: [/remote sensing/i,/satellite/i,/earth observation/i,/landsat/i,/sentinel-2/i,/imagery/i,/raster/i,/sensor network/i,/purpleair/i]
  };
  const JOURNALS = [
    {name:'Computers, Environment and Urban Systems',url:'https://www.sciencedirect.com/journal/computers-environment-and-urban-systems',desc:'城市计算、时空行为、移动数据与城市系统分析',focus:['mobility','resilience','geoai'],signals:['mobility','urban','evacuat','spatial','city','transport','resilien','geoai'],tip:'城市尺度的时空数据与计算方法尤其契合。'},
    {name:'Applied Geography',url:'https://www.sciencedirect.com/journal/applied-geography',desc:'应用地理学、社会空间差异、地理方法与政策应用',focus:['justice','mobility','resilience'],signals:['spatial','geograph','vulnerab','exposure','social','evacuat','urban','inequal'],tip:'强调地理学问题、空间异质性与可推广的应用价值。'},
    {name:'Environmental Science & Technology',url:'https://pubs.acs.org/journal/esthag',desc:'环境污染暴露、污染物过程、测量与环境影响',focus:['smoke','justice','remote'],signals:['pm2.5','pm₂.₅','air pollution','exposure','smoke','monitor','concentration','particulate'],tip:'如果核心贡献在暴露评估或环境科学机制，可重点考虑。'},
    {name:'GeoHealth',url:'https://agupubs.onlinelibrary.wiley.com/journal/24711403',desc:'地球环境变化与人群健康的交叉研究',focus:['smoke','justice'],signals:['health','exposure','pm2.5','population','smoke','vulnerab','respiratory'],tip:'适合明确建立环境暴露与人群健康联系的工作。'},
    {name:'International Journal of Geographical Information Science',url:'https://www.tandfonline.com/journals/tgis20',desc:'GIScience 方法创新、空间信息计算与空间数据建模',focus:['geoai','mobility','resilience'],signals:['gis','geospatial','algorithm','spatial model','foundation model','machine learning','methodology','geographic information'],tip:'适合方法学与GIScience理论创新较强的研究。'},
    {name:"Earth's Future",url:'https://agupubs.onlinelibrary.wiley.com/journal/23284277',desc:'气候变化、人地系统与可持续性研究',focus:['smoke','resilience','justice'],signals:['climate','wildfire','extreme heat','exposure','future','compound','hazard','environment'],tip:'突出气候变化背景、人地系统与社会影响。'},
    {name:'Remote Sensing of Environment',url:'https://www.sciencedirect.com/journal/remote-sensing-of-environment',desc:'遥感方法、地球观测与环境过程遥感监测',focus:['remote','geoai'],signals:['satellite','remote sensing','imagery','landsat','sentinel','retrieval','classification','foundation model'],tip:'需要遥感观测与方法本身具有明确创新，单纯使用遥感产品可能不足。'},
    {name:'Environmental Research Letters',url:'https://iopscience.iop.org/journal/1748-9326',desc:'具有广泛科学与社会意义的环境问题研究',focus:['smoke','justice','resilience'],signals:['climate','emission','exposure','pollution','inequal','hazard','policy','environment'],tip:'注重环境议题的重要性、清晰结论及跨领域读者价值。'},
    {name:'Urban Climate',url:'https://www.sciencedirect.com/journal/urban-climate',desc:'城市气候、空气污染与城市环境风险',focus:['smoke','resilience','remote'],signals:['urban','climate','heat','pm2.5','air quality','weather','exposure','wildfire'],tip:'空气污染与城市热环境、城市风险的交叉方向。'},
    {name:'Nature Cities',url:'https://www.nature.com/natcities/',desc:'跨学科城市研究与具有广泛影响力的城市议题',focus:['mobility','resilience','justice'],signals:['urban','city','cities','human mobility','resilien','environmental justice','infrastructure'],tip:'非常注重广泛的城市研究意义；通常需要跨学科且有突破性的贡献。'}
  ];
  const SETTINGS_KEY='geoai-radar-settings-v1';
  const SAVED_KEY='geoai-radar-saved-v1';
  const SAVED_DATA_KEY='geoai-radar-saved-records-v1';
  const LIVE_KEY='geoai-radar-live-v1';
  const $=s=>document.querySelector(s);
  const $$=s=>Array.from(document.querySelectorAll(s));
  const getStore=(k,fallback)=>{try{const v=JSON.parse(localStorage.getItem(k));return v===null?fallback:v;}catch(_){return fallback;}};
  const persist=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(_){return false;}};
  const seed=window.RADAR_DATA||{meta:{mode:'curated_starter'},papers:[]};
  const state={
    page:'overview',
    settings:getStore(SETTINGS_KEY,{weights:Object.fromEntries(CATS.map(t=>[t.id,t.weight])),customQuery:''}),
    saved:new Set(getStore(SAVED_KEY,[])),
    savedData:getStore(SAVED_DATA_KEY,{}),
    live:getStore(LIVE_KEY,[]),
    category:'all',search:'',date:'all',sort:'fit',oaOnly:false,
    journalText:'',matched:false,
    expanded:new Set()
  };
  const safeText=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const safeHref=u=>{try{const p=new URL(u);return ['https:','http:'].includes(p.protocol)?p.href:'#';}catch(_){return '#';}};
  const today=()=>new Date();
  const daysSince=date=>{const d=new Date(date+'T00:00:00Z');return Number.isNaN(+d)?9999:Math.max(0,(Date.now()-d.getTime())/86400000);};
  const formatDate=d=>{const p=String(d||'').split('-');return p.length>2?`${p[0]}.${p[1]}.${p[2]}`:'未知日期';};
  const asDOI=s=>String(s||'').replace(/^https?:\/\/(dx\.)?doi\.org\//i,'').trim();
  const cat=(id)=>CATS.find(c=>c.id===id);
  let toastTimeout;
  function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),3700);}
  function getPapers(){const m=new Map();[...Object.values(state.savedData||{}),...(seed.papers||[]),...state.live].forEach(p=>{if(p?.id)m.set(p.id,p);});return [...m.values()];}
  function classify(title='',abstract=''){
    const txt=title+' '+abstract;
    const found=CATS.filter(t=>(CAT_WORDS[t.id]||[]).some(r=>r.test(txt))).map(t=>t.id);
    return found.length?found:['resilience'];
  }
  function score(p){
    const categories=(p.categories||[]).filter(c=>state.settings.weights[c]>0);
    const w=categories.reduce((s,c)=>s+(+state.settings.weights[c]||0),0);
    const top=categories.length?Math.min(43,w*2.85):0;
    let n=35+top;
    if(categories.includes('smoke')&&categories.includes('mobility'))n+=8;
    if(categories.includes('smoke')&&categories.includes('justice'))n+=5;
    if(categories.includes('geoai')&&categories.includes('remote'))n+=4;
    n+=Math.max(0,11-daysSince(p.date)/90*1.5);
    const title=p.title||'';
    if(/mobility-adjusted|human mobility|wildfire smoke|geoai|evacuation/i.test(title))n+=3;
    return Math.min(99,Math.max(20,Math.round(n)));
  }
  function why(p){const cats=(p.categories||[]).filter(c=>(state.settings.weights[c]||0)>0).map(c=>cat(c)?.name).filter(Boolean);
    if(cats.length>=2)return `同时涉及「${cats.slice(0,2).join('」与「')}」；与设置中的重点方向存在关键词交集。`;
    return cats.length?`与「${cats[0]}」研究方向有关键词交集。`:'属于当前文献库；建议结合摘要人工判断相关性。';
  }
  function sortPapers(papers,which='fit'){
    return [...papers].sort((a,b)=>which==='new'?(b.date||'').localeCompare(a.date||''):which==='cites'?(b.citations||0)-(a.citations||0):score(b)-score(a)||(b.date||'').localeCompare(a.date||''));
  }
  function filteredPapers(){let list=getPapers();const term=state.search.toLowerCase().trim();
    if(state.category!=='all')list=list.filter(p=>(p.categories||[]).includes(state.category));
    if(term)list=list.filter(p=>[p.title,p.journal,(p.authors||[]).join(' '),p.abstract,(p.categories||[]).map(c=>cat(c)?.name).join(' ')].join(' ').toLowerCase().includes(term));
    if(state.date!=='all')list=list.filter(p=>daysSince(p.date)<=Number(state.date));
    if(state.oaOnly)list=list.filter(p=>p.is_oa===true);
    return sortPapers(list,state.sort);
  }
  function mkPaper(p){const cats=(p.categories||[]).slice(0,2).map(c=>`<span class="category-pill cat-${safeText(c)}">${safeText(cat(c)?.short||c)}</span>`).join('');
    const authors=(p.authors||[]).slice(0,3).join(', ')+((p.authors||[]).length>3?' et al.':'');
    const isSaved=state.saved.has(p.id),expand=state.expanded.has(p.id);
    const doi=p.doi?`<a target="_blank" rel="noopener noreferrer" href="${safeHref('https://doi.org/'+asDOI(p.doi))}">DOI ↗</a>`:'';
    const oa=p.is_oa&&p.oa_url?`<a target="_blank" rel="noopener noreferrer" href="${safeHref(p.oa_url)}">开放全文 ↗</a>`:'';
    const abs=p.abstract||'暂无摘要元数据；点击论文标题查看原文。';
    const cited=typeof p.citations==='number'?` · ${p.citations} 次引用`:'';
    return `<article class="paper-card" data-id="${safeText(p.id)}"><button class="bookmark ${isSaved?'is-saved':''}" data-save="${safeText(p.id)}" title="${isSaved?'取消收藏':'收藏论文'}" aria-label="${isSaved?'取消收藏':'收藏论文'}">${isSaved?'★':'☆'}</button><div class="paper-top">${cats}<span class="paper-date">${formatDate(p.date)}</span></div><h3 class="paper-title"><a href="${safeHref(p.url)}" target="_blank" rel="noopener noreferrer">${safeText(p.title)}</a></h3><div class="paper-meta"><span class="journal-name">${safeText(p.journal||'期刊待确认')}</span>${authors?`<span>· ${safeText(authors)}</span>`:''}${cited?`<span>${safeText(cited)}</span>`:''}</div><p class="paper-abstract ${expand?'expanded':''}">${safeText(abs)}</p><div class="paper-bottom"><div class="paper-links">${doi}${oa}<button class="paper-expand" data-expand="${safeText(p.id)}">${expand?'收起 ↑':'研究关联 ↓'}</button></div><div class="paper-tools"><span class="fit-score" title="自定义关键词权重 + 发表时间的启发式分数，并非 AI 评审或论文质量指标">相关性 <strong>${score(p)}</strong></span></div></div>${expand?`<div class="paper-why"><strong>为什么推荐：</strong>${safeText(why(p))}<br><strong>分数说明：</strong>关键词关联与发表日期的规则评分，不是文章质量、学术影响力或录用概率。</div>`:''}</article>`;
  }
  function renderHome(){const papers=sortPapers(getPapers());$('#homePapers').innerHTML=papers.slice(0,4).map(mkPaper).join('')||'<div class="empty-state">文献库暂无论文。请尝试实时检索。</div>';
    const all=getPapers();$('#statPapers').textContent=all.length;$('#statRecent').textContent=all.filter(p=>daysSince(p.date)<90).length;
    const oa=all.filter(p=>p.is_oa).length;$('#statOpen').textContent=oa;$('#statSaved').textContent=state.saved.size;
    const isCurated=(seed.meta?.mode||'')==='curated_starter';$('#statMode').textContent=isCurated?'已核验的初始示例库':'自动更新文献库';
    $('#dataSourceLabel').textContent=isCurated?'初始精选文献（非最新完整列表）':'OpenAlex 数据已同步';
    $('#dataSourceDetails').textContent=isCurated?'点击「扫描新论文」补充实时结果；部署后可自动更新。':`上次批量抓取 ${String(seed.meta.generated_at||'').slice(0,10)}；可继续实时检索。`;
    const bars=CATS.map(c=>({...c,n:all.filter(p=>(p.categories||[]).includes(c.id)).length})).sort((a,b)=>b.n-a.n).slice(0,5),m=Math.max(1,...bars.map(c=>c.n));
    $('#topicBars').innerHTML=bars.map(c=>`<div class="topic-bar"><div class="topic-bar-label"><span>${safeText(c.name)}</span><span>${c.n} 篇</span></div><div class="bar-track"><div class="bar-fill" style="width:${(c.n/m*100).toFixed(1)}%;background:${safeText(c.color)}"></div></div></div>`).join('');
  }
  function renderSidebar(){const weights=state.settings.weights||{};
    $('#sideTopics').innerHTML=CATS.map(c=>`<button class="side-topic" data-topic="${c.id}" title="查看 ${safeText(c.name)} 文献"><span class="topic-dot" style="--c:${c.color}"></span>${safeText(c.name)}${weights[c.id]===0?' · 暂停':''}</button>`).join('');
    $('#navSaved').textContent=state.saved.size;
  }
  function renderFilters(){$('#categoryFilters').innerHTML=[{id:'all',name:'全部研究'},...CATS].map(c=>`<button class="filter-chip ${state.category===c.id?'selected':''}" data-filter="${c.id}">${safeText(c.name)}</button>`).join('');
    $('#paperSearch').value=state.search;$('#dateFilter').value=state.date;$('#sortFilter').value=state.sort;$('#oaOnly').checked=state.oaOnly;
  }
  function renderDiscover(){const papers=filteredPapers();$('#resultsCount').textContent=papers.length;$('#resultsNote').textContent='当前库内过滤 ·「实时检索」可向 OpenAlex 获取更多论文';$('#discoverPapers').innerHTML=papers.map(mkPaper).join('');$('#emptyDiscover').hidden=papers.length>0;}
  function renderSaved(){const papers=sortPapers(getPapers().filter(p=>state.saved.has(p.id)),'new');$('#savedPapers').innerHTML=papers.map(mkPaper).join('');$('#emptySaved').hidden=papers.length>0;$('#statSaved').textContent=state.saved.size;}
  function renderSettings(){const weights=state.settings.weights||{};
    $('#settingsTopics').innerHTML=CATS.map(c=>`<label class="setting-topic-row"><span class="topic-dot" style="--c:${c.color}"></span><strong>${safeText(c.name)}</strong><input aria-label="${safeText(c.name)} 权重" type="range" min="0" max="5" step="1" value="${weights[c.id]??c.weight}" data-weight="${c.id}"/><span class="range-value" data-weight-val="${c.id}">${weights[c.id]??c.weight}</span></label>`).join('');
    $('#customQuery').value=state.settings.customQuery||'';
  }
  function journalScore(j,words){const text=words.toLowerCase();const terms=j.signals.filter(t=>text.includes(t)).length;
    const topics=classify(text).filter(c=>j.focus.includes(c)).length;
    return terms*3+topics*4;
  }
  function renderJournals(){let list=[...JOURNALS];if(state.matched&&state.journalText.trim()){list.sort((a,b)=>journalScore(b,state.journalText)-journalScore(a,state.journalText));$('#journalResultTitle').textContent='你的候选期刊 · 领域匹配排序';$('#journalResultDesc').textContent='根据摘要中的关键词与每本期刊的研究范围排序（不预测录用率）。';}
    else{$('#journalResultTitle').textContent='与你的研究方向相关的期刊';$('#journalResultDesc').textContent='默认领域清单；输入摘要后可以重新排序，需人工核查近期选题与投稿规则。';}
    $('#journalResults').innerHTML=list.map((j,i)=>`<article class="journal-card"><div class="journal-rank">${String(i+1).padStart(2,'0')}</div><div><h3>${safeText(j.name)}</h3><p>${safeText(j.desc)}</p>${state.matched?`<div class="journal-match">匹配提示：${safeText(j.tip)}</div>`:''}<a href="${safeHref(j.url)}" target="_blank" rel="noopener noreferrer">查看期刊官网 ↗</a></div></article>`).join('');
  }
  function updateEverything(){renderSidebar();renderHome();renderFilters();renderDiscover();renderSaved();renderSettings();renderJournals();}
  function pageTo(id){state.page=id;$$('.page').forEach(e=>e.classList.toggle('active',e.id==='page-'+id));$$('.nav-item').forEach(e=>e.classList.toggle('active',e.dataset.page===id));
    const names={overview:'研究总览',discover:'发现论文',saved:'我的文献库',journals:'投稿期刊匹配',settings:'设置与推送'};$('#breadcrumbCurrent').textContent=names[id]||id;
    if(id==='discover')renderDiscover();if(id==='saved')renderSaved();if(id==='settings')renderSettings();if(id==='journals')renderJournals();
    window.scrollTo({top:0,behavior:'smooth'});location.hash=id==='overview'?'':id;
  }
  function toggleSaved(id){if(state.saved.has(id)){state.saved.delete(id);delete state.savedData[id];}else{state.saved.add(id);const p=getPapers().find(p=>p.id===id);if(p)state.savedData[id]=p;}persist(SAVED_KEY,[...state.saved]);persist(SAVED_DATA_KEY,state.savedData);renderHome();renderDiscover();renderSaved();renderSidebar();toast(state.saved.has(id)?'已加入文献库':'已从文献库移除');}
  function copy(text){if(navigator.clipboard?.writeText){return navigator.clipboard.writeText(text).then(()=>{toast('已复制到剪贴板');}).catch(()=>manualCopy(text));}return manualCopy(text);}
  function manualCopy(s){const t=document.createElement('textarea');t.value=s;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();let ok=false;try{ok=document.execCommand('copy');}catch(_){}t.remove();toast(ok?'已复制到剪贴板':'当前浏览器不支持复制，请使用导出文件');}
  function download(filename,content,mime='text/plain;charset=utf-8'){const b=new Blob([content],{type:mime});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);}
  function csvExport(papers,filename){if(!papers.length){toast('没有可导出的论文');return;}const fields=['title','authors','journal','date','doi','url','is_oa','citations','abstract','categories'];const lines=[fields.join(',')];papers.forEach(p=>lines.push(fields.map(f=>{let v=p[f]??'';if(Array.isArray(v))v=v.join('; ');return '"'+String(v).replace(/"/g,'""')+'"';}).join(',')));download(filename,'\ufeff'+lines.join('\r\n'),'text/csv;charset=utf-8');toast(`已导出 ${papers.length} 篇论文`);}
  function risExport(papers){if(!papers.length){toast('先收藏论文，再导出 RIS');return;}const lines=[];for(const p of papers){lines.push('TY  - JOUR',`TI  - ${p.title}`);(p.authors||[]).forEach(a=>lines.push(`AU  - ${a}`));if(p.journal)lines.push(`JO  - ${p.journal}`);if(p.date)lines.push(`PY  - ${p.date.slice(0,4)}`,`DA  - ${p.date}`);if(p.doi)lines.push(`DO  - ${asDOI(p.doi)}`);if(p.url)lines.push(`UR  - ${p.url}`);if(p.abstract)lines.push(`AB  - ${p.abstract}`);lines.push('ER  - ','');}download('geoai-radar-reading-list.ris',lines.join('\r\n'));toast('RIS 已生成，可导入 Zotero');}
  function makeDigest(){const list=sortPapers(getPapers()).slice(0,7);const date=new Date().toLocaleDateString('zh-CN');return `GeoAI Research Radar · 精选简报 (${date})\n\n${list.map((p,i)=>`${i+1}. ${p.title}\n${p.journal||''} · ${p.date}\n${p.url}\n`).join('\n')}\n注：根据关键词规则排序，不是论文质量评级；请自行核验原文。`;}
  function showModal(title,text,error=false){$('#scanModal').hidden=false;$('#modalTitle').textContent=title;$('#modalText').textContent=text;$('.modal-loader').style.display=error?'none':'block';$('#modalDismiss').hidden=!error;}
  function closeModal(){$('#scanModal').hidden=true;}
  function fromInverted(inv){if(!inv||typeof inv!=='object')return '';const pairs=[];for(const [w,poses] of Object.entries(inv)){if(Array.isArray(poses))poses.forEach(n=>{if(Number.isSafeInteger(n)&&n>=0&&n<2000)pairs.push([n,w]);});}pairs.sort((a,b)=>a[0]-b[0]);return pairs.slice(0,420).map(x=>x[1]).join(' ');}
  function openAlexPaper(w){const title=String(w.title||w.display_name||'').trim();const abs=fromInverted(w.abstract_inverted_index);const doi=asDOI(w.doi||'');let id=doi?'doi:'+doi.toLowerCase():String(w.id||'');
    const url=safeHref(doi?'https://doi.org/'+doi:w.id||'');if(!title||url==='#')return null;
    const source=w.primary_location?.source?.display_name||w.primary_location?.source?.name||'Preprint / source unavailable';
    const authors=(w.authorships||[]).slice(0,8).map(a=>a.author?.display_name||'').filter(Boolean);
    const isOA=Boolean(w.open_access?.is_oa);
    const oaUrl=safeHref(w.best_oa_location?.pdf_url||w.best_oa_location?.landing_page_url||w.open_access?.oa_url||'');
    return {id,title,authors,journal:source,date:w.publication_date||'',doi,url,oa_url:oaUrl==='#'?null:oaUrl,is_oa:isOA,citations:Number.isFinite(w.cited_by_count)?w.cited_by_count:null,type:w.type||'article',abstract:abs,categories:classify(title,abs),source:'openalex'};
  }
  async function scan(q){const query=(q||'').trim()||'wildfire smoke human mobility';
    if(query.length<3){toast('请输入至少三个字符');return;}showModal('正在连接 OpenAlex',`正在检索「${query}」的近两年论文…`);
    const start=new Date(Date.now()-730*86400000).toISOString().slice(0,10);
    const params=new URLSearchParams({search:query,filter:'from_publication_date:'+start,sort:'publication_date:desc',per_page:'40',select:'id,title,doi,publication_date,authorships,primary_location,open_access,best_oa_location,cited_by_count,abstract_inverted_index,type'});
    try{
      const ctl=new AbortController();const timer=setTimeout(()=>ctl.abort(),16000);
      let res;try{res=await fetch('https://api.openalex.org/works?'+params.toString(),{headers:{Accept:'application/json'},signal:ctl.signal});}finally{clearTimeout(timer);}
      if(!res.ok)throw new Error(res.status===429?'OpenAlex 暂时达到查询额度，请稍后再试':`OpenAlex 返回 HTTP ${res.status}`);
      const data=await res.json();if(!Array.isArray(data.results))throw new Error('返回的数据格式不正确');
      const papers=data.results.map(openAlexPaper).filter(Boolean);
      const map=new Map(state.live.map(p=>[p.id,p]));papers.forEach(p=>map.set(p.id,p));state.live=[...map.values()].slice(-180);if(!persist(LIVE_KEY,state.live))toast('本机空间不足，实时结果仅在当前页面保留');
      closeModal();state.search='';state.date='all';state.category='all';state.sort='fit';pageTo('discover');updateEverything();toast(`成功检索 ${papers.length} 篇论文，已加入本机文献库`);
    }catch(e){showModal('本次检索未完成',`${e.name==='AbortError'?'网络请求超时':e.message||'网络连接失败'}。初始文献库仍可使用；可检查网络、稍后重试，或在 GitHub Actions 中配置 API key。`,true);}
  }
  function bind(){
    document.addEventListener('click',e=>{
      const nav=e.target.closest('[data-page]');if(nav){pageTo(nav.dataset.page);return;}
      const filter=e.target.closest('[data-filter]');if(filter){state.category=filter.dataset.filter;renderFilters();renderDiscover();return;}
      const topic=e.target.closest('[data-topic]');if(topic){state.category=topic.dataset.topic;state.search='';state.date='all';pageTo('discover');renderFilters();renderDiscover();return;}
      const saved=e.target.closest('[data-save]');if(saved){toggleSaved(saved.dataset.save);return;}
      const expand=e.target.closest('[data-expand]');if(expand){const id=expand.dataset.expand;state.expanded.has(id)?state.expanded.delete(id):state.expanded.add(id);renderHome();renderDiscover();renderSaved();return;}
    });
    $('#paperSearch').addEventListener('input',e=>{state.search=e.target.value;renderDiscover();});
    $('#paperSearch').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim()){scan(e.target.value.trim());}});
    $('#clearSearch').addEventListener('click',()=>{state.search='';renderFilters();renderDiscover();$('#paperSearch').focus();});
    $('#dateFilter').addEventListener('change',e=>{state.date=e.target.value;renderDiscover();});
    $('#sortFilter').addEventListener('change',e=>{state.sort=e.target.value;renderDiscover();});
    $('#oaOnly').addEventListener('change',e=>{state.oaOnly=e.target.checked;renderDiscover();});
    $('#heroScan').addEventListener('click',()=>scan(state.settings.customQuery||'wildfire smoke human mobility'));
    $('#discoverRefresh').addEventListener('click',()=>scan(state.search||state.settings.customQuery||(state.category==='all'?'wildfire smoke human mobility':cat(state.category)?.q)));
    $('#copyDigest').addEventListener('click',()=>copy(makeDigest()));
    $('#exportTop').addEventListener('click',()=>csvExport(getPapers().filter(p=>state.saved.has(p.id)),'geoai-radar-saved.csv'));
    $('#exportCSV').addEventListener('click',()=>csvExport(filteredPapers(),'geoai-radar-results.csv'));
    $('#exportSavedCSV').addEventListener('click',()=>csvExport(getPapers().filter(p=>state.saved.has(p.id)),'geoai-radar-saved.csv'));
    $('#exportRIS').addEventListener('click',()=>risExport(getPapers().filter(p=>state.saved.has(p.id))));
    $('#journalAbstract').addEventListener('input',e=>{state.journalText=e.target.value;state.matched=false;});
    $('#matchJournals').addEventListener('click',()=>{const text=$('#journalAbstract').value.trim();if(text.length<45){toast('请先输入完整的英文标题或摘要（至少 45 字符）');return;}state.journalText=text;state.matched=true;renderJournals();$('#journalResults').scrollIntoView({behavior:'smooth',block:'start'});});
    $('#fillExample').addEventListener('click',()=>{const v='Mobility-adjusted wildfire smoke exposure and social disparities during the January 2025 Los Angeles wildfires. We integrate fine-scale PM2.5 concentration surfaces with aggregated human mobility patterns across census tracts to compare residential and mobility-adjusted exposure. The study examines spatial heterogeneity, evacuation areas, and associations with social vulnerability using spatial and statistical models. We discuss uncertainty in mobility data during extreme events and the implications of residence-based exposure assessment for environmental justice.';$('#journalAbstract').value=v;state.journalText=v;state.matched=false;renderJournals();toast('已填入研究主题示例；可改为自己的摘要');});
    $('#settingsTopics').addEventListener('input',e=>{const id=e.target.dataset.weight;if(!id)return;state.settings.weights[id]=Number(e.target.value);persist(SETTINGS_KEY,state.settings);const el=document.querySelector(`[data-weight-val="${id}"]`);if(el)el.textContent=e.target.value;renderHome();renderDiscover();renderSaved();renderSidebar();});
    $('#resetPrefs').addEventListener('click',()=>{state.settings.weights=Object.fromEntries(CATS.map(t=>[t.id,t.weight]));persist(SETTINGS_KEY,state.settings);updateEverything();toast('推荐权重已恢复默认');});
    $('#saveQuery').addEventListener('click',()=>{state.settings.customQuery=$('#customQuery').value.trim();persist(SETTINGS_KEY,state.settings);toast('已保存自定义实时检索词');});
    $('#backupData').addEventListener('click',()=>{download('geoai-radar-reading-list.json',JSON.stringify({exported_at:new Date().toISOString(),saved:getPapers().filter(p=>state.saved.has(p.id))},null,2),'application/json');toast('JSON 收藏备份已导出');});
    $('#clearSaved').addEventListener('click',()=>{if(!state.saved.size){toast('没有需要清除的收藏');return;}if(confirm(`确定要删除本机收藏的 ${state.saved.size} 篇论文吗？此操作不可撤销。`)){state.saved.clear();state.savedData={};persist(SAVED_KEY,[]);persist(SAVED_DATA_KEY,{});updateEverything();toast('已清除本机收藏');}});
    $('#copySecrets').addEventListener('click',()=>copy('OPENALEX_API_KEY\nSMTP_HOST\nSMTP_PORT\nSMTP_USER\nSMTP_PASSWORD\nEMAIL_FROM\nEMAIL_TO'));
    $('#closeModal').addEventListener('click',closeModal);$('#modalDismiss').addEventListener('click',closeModal);
    $('#scanModal').addEventListener('click',e=>{if(e.target.id==='scanModal')closeModal();});
    window.addEventListener('hashchange',()=>{const id=location.hash.replace('#','');if(['overview','discover','saved','journals','settings'].includes(id)&&id!==state.page)pageTo(id);});
  }
  function init(){
    if(!state.settings.weights||typeof state.settings.weights!=='object')state.settings.weights=Object.fromEntries(CATS.map(t=>[t.id,t.weight]));
    CATS.forEach(c=>{if(typeof state.settings.weights[c.id]!=='number')state.settings.weights[c.id]=c.weight;});
    $('#todayText').textContent=new Date().toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric'});
    bind();updateEverything();const hash=location.hash.slice(1);if(['discover','saved','journals','settings'].includes(hash))pageTo(hash);
  }
  init();
})();
