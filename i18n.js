/* FIELDNOTES / GeoAI Research Radar bilingual UI (client-side, no paid service). */
(() => {
  'use strict';
  const LOCALE_KEY = 'geoai-radar-locale-v1';
  const translations = {
    '研究总览':'Overview','发现论文':'Discover papers','我的文献库':'My library','投稿期刊匹配':'Journal matching',
    '设置与推送':'Settings & alerts','设置与自动推送':'Settings & alerts',
    '管理追踪方向':'Manage research topics','从信息噪声中，发现真正值得阅读的论文。':'Find papers worth reading, beyond the noise.',
    '↧ 导出收藏':'↧ Export saved','本地个人研究空间':'Local research workspace','主要导航':'Main navigation',
    '你的下一篇重要论文，':'Your next breakthrough paper','也许就在这里。':'might be here.',
    '追踪野火烟雾暴露、人类移动、环境公平与 GeoAI 的最新交叉研究。少一点筛选，多一点发现。':'Track new work where wildfire smoke exposure, human mobility, environmental justice and GeoAI meet. Less searching, more discovery.',
    '↗ 扫描新论文':'↗ Find new papers','探索投稿期刊':'Explore journals','收录论文':'Papers tracked',
    '初始精选文献库':'Curated starter library','近 90 天发表':'Published in 90 days','按论文发表日期统计':'Based on publication dates',
    '开放获取标记':'Open access','来源元数据 / 初始链接标记':'Metadata / curated OA links','已收藏':'Saved',
    '保存在当前浏览器':'Stored in this browser','与你最相关的研究':'Most relevant research',
    '按研究关键词匹配度排序，并优先展示近期发表的成果。':'Ranked by research-topic fit, with a preference for recent work.',
    '查看全部论文':'Browse all papers','探索所有研究文献':'Explore all papers',
    '关注中的研究领域':'Your research focus','根据当前文献库中的主题标签统计。':'Topics across your current paper collection.',
    '每周精选文献':'Weekly reading digest','部署后可通过 GitHub Actions 每日更新，设置邮件后按周发送高匹配论文。':'GitHub Actions can refresh the feed daily and send a weekly email digest after setup.',
    '复制本期简报':'Copy digest','订阅 RSS 文献源 ↗':'Subscribe to RSS ↗','精选初始数据':'Curated starter data',
    '点击「扫描新论文」从 OpenAlex 补充实时检索结果。':'Use Find new papers to retrieve additional results from OpenAlex.',
    '发现值得读的论文':'Discover papers worth reading','跨来源检索、按主题过滤，并识别与你研究最匹配的论文。':'Search across sources, filter by topic, and find research that matches your interests.',
    '↻ 实时检索':'↻ Live search','时间':'Date','排序':'Sort','全部时间':'All time','近 90 天':'Last 90 days',
    '近 1 年':'Last year','近 2 年':'Last 2 years','匹配度':'Relevance','最新发表':'Newest','被引次数':'Citations',
    '开放获取':'Open access','篇结果':'results','在当前文献库中筛选':'Filtered within your library',
    '↧ 导出检索结果 CSV':'↧ Export results CSV','没有匹配的论文':'No matching papers',
    '试试切换追踪方向，或输入英文关键词点击「实时检索」。':'Try another topic or enter an English keyword, then select Live search.',
    '保存值得深读的论文，并导出为 CSV、RIS（可导入 Zotero）。':'Save papers to read, then export CSV or RIS for Zotero.',
    '↧ 导出 RIS':'↧ Export RIS','↧ 导出 CSV':'↧ Export CSV','你的阅读清单还是空的':'Your reading list is empty',
    '从「发现论文」中点击 ☆ 收藏，就会出现在这里。':'Save papers from Discover by clicking ☆ to add them here.',
    '去发现论文 ↗':'Discover papers ↗','隐私说明：收藏记录保存在当前设备浏览器的 localStorage，清除网站数据会丢失。它不会自动同步到其他设备。':'Privacy: Saved items are kept in local browser storage. Clearing site data removes them; they are not synced across devices.',
    '根据你的论文标题和摘要，给出研究范围匹配的初步建议。':'Find journals whose scope may fit your paper title and abstract.',
    '这项研究适合投向哪里？':'Where might this research fit?','建议输入英文标题与 150–300 词摘要；也可以试用内置研究主题。':'Enter an English title and a 150–300 word abstract, or try the built-in example.',
    '填入 LA 野火研究示例':'Use LA wildfire example','分析期刊匹配 ↗':'Match journals ↗',
    '候选期刊':'Suggested journals','展示适合你研究方向的期刊；输入摘要后可按领域匹配重新排序。':'A shortlist of potentially relevant venues. Enter an abstract to rerank by subject fit.',
    '重要：这是基于关键词与研究范围的启发式匹配，不代表期刊官方推荐、稿件质量评估或录用概率。提交前请核对期刊最新 aims & scope、文章类型、开放获取费用与投稿政策。':'Important: These heuristic matches are based on keywords and journal scope—not official recommendations, quality assessments or acceptance probabilities. Verify each journal’s current aims, article types, open-access fees and submission rules.',
    '微调你的研究兴趣，建立更符合你近期项目的阅读节奏。':'Adjust research interests to fit your current projects and reading routine.',
    '我的研究重点':'My research priorities','调整当前网页的推荐打分与主题条目（仅保存在本机）。':'Adjust relevance weights and tracked topics (saved locally).',
    '恢复默认权重 ↺':'Reset weights ↺','自定义检索词':'Custom search query',
    '用于浏览器中的实时 OpenAlex 检索。建议使用英文，例如':'Used for live searches in OpenAlex. Use English, for example',
    '保存':'Save','如需改变每天自动更新的批量检索词，请编辑项目里的':'To change daily batch searches, edit the project file',
    '收藏与数据管理':'Reading list & data','所有个人收藏仅在本浏览器保存；你可以导出 RIS、CSV 备份。':'Your saved papers remain in this browser. Export RIS or CSV to back them up.',
    '↧ 备份全部收藏 JSON':'↧ Back up saved papers JSON','清除本机收藏':'Clear saved items',
    '开启自动文献推送':'Set up literature alerts','项目已带有定时脚本与 GitHub Actions 配置。上传 GitHub 后，完成以下设置：':'The full project includes scripts and GitHub Actions. After uploading it, complete these steps:',
    '在 Repository Settings → Secrets 添加':'Add under Repository Settings → Secrets',
    '（推荐但非必须）':'(recommended, optional)',
    '在 Settings → Pages 开启 GitHub Pages（Deploy from branch，选择 main / root）':'Enable GitHub Pages in Settings → Pages (Deploy from branch; main / root)',
    '若需邮件推送，再添加 SMTP 相关 Secrets':'For email alerts, add SMTP secrets',
    '在 Actions 运行一次':'Run once in Actions:',
    '复制 Secrets 名称 ↗':'Copy secret names ↗','数据说明':'About the data',
    '初始数据库含人工核验 DOI 的示例论文。线上定时更新依赖 OpenAlex API、GitHub Actions 与网络可用性，不能保证每次执行准时成功。':'The starter data includes DOI-verified papers. Scheduled updates rely on OpenAlex, GitHub Actions and network availability; execution timing is not guaranteed.',
    '连接 OpenAlex':'Connect to OpenAlex','正在检索最新论文…':'Searching for new papers…','关闭':'Close',
    '关键词、标题、作者、期刊；输入英文可进行实时检索…':'Keywords, title, author, journal; use English for live search…',
    '清空搜索':'Clear search','全部研究':'All topics','野火烟雾与暴露':'Wildfire smoke & exposure',
    '人口流动与疏散':'Human mobility & evacuation','环境公平与脆弱性':'Environmental justice & vulnerability',
    'GeoAI 与基础模型':'GeoAI & foundation models','城市韧性与空间模型':'Urban resilience & spatial models',
    '遥感与地球观测':'Remote sensing & Earth observation','暂无摘要元数据；点击论文标题查看原文。':'No abstract available. Select the title to visit the source.',
    '开放全文 ↗':'Open full text ↗','期刊待确认':'Journal unavailable','收起 ↑':'Collapse ↑',
    '研究关联 ↓':'Why recommended ↓','取消收藏':'Remove from library','收藏论文':'Save paper',
    '相关性':'Relevance','为什么推荐：':'Why this paper:','分数说明：':'About the score:',
    '关键词关联与发表日期的规则评分，不是文章质量、学术影响力或录用概率。':'A rule-based score from keywords and recency, not paper quality, impact or acceptance likelihood.',
    '已核验的初始示例库':'Verified starter collection','自动更新文献库':'Automatically updated collection',
    '初始精选文献（非最新完整列表）':'Curated starter papers (not a complete new-paper feed)',
    'OpenAlex 数据已同步':'OpenAlex data synchronized',
    '点击「扫描新论文」补充实时结果；部署后可自动更新。':'Select Find new papers for live results; scheduled refresh can be enabled after deployment.',
    '当前库内过滤 ·「实时检索」可向 OpenAlex 获取更多论文':'Filtering the current library · Live search retrieves more results from OpenAlex',
    '你的候选期刊 · 领域匹配排序':'Your shortlist · Ranked by scope match',
    '根据摘要中的关键词与每本期刊的研究范围排序（不预测录用率）。':'Ranked by abstract keywords and journal scope (not acceptance probability).',
    '与你的研究方向相关的期刊':'Journals relevant to your research',
    '默认领域清单；输入摘要后可以重新排序，需人工核查近期选题与投稿规则。':'Default subject-area shortlist. Enter an abstract to rerank; verify current scope and submission requirements.',
    '匹配提示：':'Why this fits:','查看期刊官网 ↗':'Journal website ↗',
    '文献库暂无论文。请尝试实时检索。':'No papers yet. Try live search.',
    '城市计算、时空行为、移动数据与城市系统分析':'Urban computing, spatiotemporal behavior, mobility data, urban systems',
    '应用地理学、社会空间差异、地理方法与政策应用':'Applied geography, socio-spatial disparities, geographic methods and policy',
    '环境污染暴露、污染物过程、测量与环境影响':'Environmental pollutant exposure, measurement and impacts',
    '地球环境变化与人群健康的交叉研究':'Earth systems, environmental change and human health',
    'GIScience 方法创新、空间信息计算与空间数据建模':'GIScience methods, geographic information computing and spatial modeling',
    '气候变化、人地系统与可持续性研究':'Climate change, human–environment systems and sustainability',
    '遥感方法、地球观测与环境过程遥感监测':'Remote sensing methods, Earth observation and environmental monitoring',
    '具有广泛科学与社会意义的环境问题研究':'Environmental research with broad scientific and societal relevance',
    '城市气候、空气污染与城市环境风险':'Urban climate, air pollution and environmental risk',
    '跨学科城市研究与具有广泛影响力的城市议题':'Interdisciplinary urban research of broad significance',
    '城市尺度的时空数据与计算方法尤其契合。':'Best suited to urban-scale spatiotemporal data and computational methods.',
    '强调地理学问题、空间异质性与可推广的应用价值。':'Emphasize geographic questions, spatial heterogeneity and transferable insights.',
    '如果核心贡献在暴露评估或环境科学机制，可重点考虑。':'Consider if exposure assessment or environmental mechanisms are central.',
    '适合明确建立环境暴露与人群健康联系的工作。':'Best when exposure is explicitly connected to population health.',
    '适合方法学与GIScience理论创新较强的研究。':'Best when GIScience methodology or theory is a core contribution.',
    '突出气候变化背景、人地系统与社会影响。':'Emphasize climate context, human–environment systems and societal impacts.',
    '需要遥感观测与方法本身具有明确创新，单纯使用遥感产品可能不足。':'A clear remote-sensing methodological advance is usually needed; using imagery alone may not be enough.',
    '注重环境议题的重要性、清晰结论及跨领域读者价值。':'Prioritize a consequential environmental question and clear interdisciplinary findings.',
    '空气污染与城市热环境、城市风险的交叉方向。':'A fit for air pollution, urban climate and environmental risk.',
    '非常注重广泛的城市研究意义；通常需要跨学科且有突破性的贡献。':'Requires broad urban significance and often a major cross-disciplinary advance.',
    ' · 暂停':' · Paused',
  };
  const partial = [
    ['同时涉及「','Spans “'],['」与「','” and “'],['」；与设置中的重点方向存在关键词交集。','”, with overlap across your prioritized research topics.'],
    ['与「','Related to “'],['」研究方向有关键词交集。','” through topic keywords.'],
    ['属于当前文献库；建议结合摘要人工判断相关性。','In the current library; assess relevance from the abstract.'],
    [' 篇论文',' papers'],[' 篇结果',' results'],[' 篇',' papers'],[' 次引用',' citations'],
    ['上次批量抓取 ','Last batch refresh: '],['；可继续实时检索。','; live search is also available.'],
    ['查看 ','View '],[' 文献',' papers'],[' 权重',' weight'],
    ['正在检索「','Searching “'],['」的近两年论文…','” from the last two years…'],
    ['已导出 ','Exported '],[' 篇论文',' papers'],['成功检索 ','Retrieved '],['，已加入本机文献库',' and added to your local library'],
    ['确定要删除本机收藏的 ','Delete all '],[' 篇论文吗？此操作不可撤销。',' saved papers? This cannot be undone.']
  ];
  const replacements = Object.entries(translations).sort((a,b)=>b[0].length-a[0].length);
  const originalTexts = new WeakMap();
  const originalAttrs = new WeakMap();
  const translatableAttrs = ['title','aria-label','placeholder'];
  let language = (() => {try {return localStorage.getItem(LOCALE_KEY)==='en'?'en':'zh';}catch(_){return 'zh';}})();
  let scheduled = false;
  function toEnglish(input){
    const raw=String(input||'');const trimmed=raw.trim();
    if(!trimmed)return raw;
    if(Object.prototype.hasOwnProperty.call(translations,trimmed))return raw.replace(trimmed,translations[trimmed]);
    let result=raw;
    if(/[\u3400-\u9fff]/.test(result)){for(const [from,to] of replacements){if(result.includes(from))result=result.split(from).join(to);}}
    for(const [from,to] of partial)result=result.split(from).join(to);
    result=result.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g,'$1-$2-$3');
    return result;
  }
  function paint(){
    const tree=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=tree.nextNode())){
      if(node.parentElement?.closest('script,style,textarea'))continue;
      const existing=originalTexts.get(node);let original=existing;
      if(original===undefined || (node.nodeValue!==existing&&node.nodeValue!==toEnglish(existing)))original=node.nodeValue;
      originalTexts.set(node,original);
      const wanted=language==='en'?toEnglish(original):original;
      if(node.nodeValue!==wanted)node.nodeValue=wanted;
    }
    for(const el of document.querySelectorAll('[title],[aria-label],[placeholder]')){
      const prior=originalAttrs.get(el)||{};
      for(const attr of translatableAttrs){
        if(!el.hasAttribute(attr))continue;
        const current=el.getAttribute(attr);let orig=prior[attr];
        if(orig===undefined||(current!==orig&&current!==toEnglish(orig)))orig=current;
        prior[attr]=orig;
        const wanted=language==='en'?toEnglish(orig):orig;
        if(current!==wanted)el.setAttribute(attr,wanted);
      }
      originalAttrs.set(el,prior);
    }
    const toggle=document.getElementById('langToggle');
    if(toggle){const label=language==='en'?'中文':'English';if(toggle.textContent!==label)toggle.textContent=label;toggle.setAttribute('aria-label',language==='en'?'Switch to Chinese':'Switch to English');toggle.setAttribute('title',language==='en'?'切换到中文':'Switch to English');}
    document.documentElement.lang=language==='en'?'en':'zh-CN';
    document.title=language==='en'?'Research Radar — GeoAI Literature':'Research Radar — GeoAI 文献雷达';
  }
  function requestPaint(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;paint();});}
  const button=document.getElementById('langToggle');
  if(button)button.addEventListener('click',()=>{
    language=language==='en'?'zh':'en';
    try{localStorage.setItem(LOCALE_KEY,language);}catch(_){}
    paint();
  });
  paint();
  new MutationObserver(requestPaint).observe(document.body,{childList:true,characterData:true,subtree:true});
})();
