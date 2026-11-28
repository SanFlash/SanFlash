(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast = (message) => { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2200); };

  // Public GitHub profile data: no token or private account scope is used.
  fetch('https://api.github.com/users/SanFlash', {headers:{Accept:'application/vnd.github+json'}})
    .then(r=>{if(!r.ok) throw new Error('GitHub API unavailable'); return r.json();})
    .then(data=>{
      const values={repos:data.public_repos,followers:data.followers,following:data.following,joined:new Date(data.created_at).getFullYear()};
      Object.entries(values).forEach(([key,value])=>{const node=$('[data-stat="'+key+'"]'); if(node) node.textContent=Number(value).toLocaleString();});
      $('#stats-note').textContent='Live public profile data · refreshed when this page loads';
    }).catch(()=>{$('#stats-note').textContent='Live GitHub counters are temporarily unavailable. Explore the public profile directly.';});

  $('#year').textContent=new Date().getFullYear();
  const roles=['QA Automation Engineer','Test Engineering','Playwright Automation','AI-Assisted Development'];
  let roleIndex=0; if(!reduced) setInterval(()=>{roleIndex=(roleIndex+1)%roles.length; const el=$('#role-text'); el.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:300}); el.textContent=roles[roleIndex];},2600);

  // Mobile navigation.
  $('#menu-toggle').addEventListener('click',()=>{const nav=$('.main-nav'); const open=nav.classList.toggle('open'); $('#menu-toggle').setAttribute('aria-expanded',String(open));});
  $$('.main-nav a').forEach(a=>a.addEventListener('click',()=>{$('.main-nav').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');}));

  // Persist the visitor's theme preference across visits.
  try { if(localStorage.getItem('sanflash-theme')==='light') document.body.classList.add('light'); } catch {}
  $('#theme-toggle').textContent=document.body.classList.contains('light')?'☀':'◐';
  $('#theme-toggle').addEventListener('click',()=>{document.body.classList.toggle('light');const light=document.body.classList.contains('light');$('#theme-toggle').textContent=light?'☀':'◐';try{localStorage.setItem('sanflash-theme',light?'light':'dark');}catch{}toast(light?'Light theme enabled':'Dark theme enabled');});

  // Project filtering and search work together.
  let activeFilter='all';
  const filterProjects=()=>{const query=$('#project-search').value.trim().toLowerCase();let shown=0;$$('.project-card').forEach(card=>{const matchesFilter=activeFilter==='all'||card.dataset.category===activeFilter;const matchesSearch=!query||(card.dataset.search+' '+card.textContent).toLowerCase().includes(query);const visible=matchesFilter&&matchesSearch;card.classList.toggle('is-hidden',!visible);if(visible)shown++;});$('#empty-state').hidden=shown!==0;};
  $$('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter;$$('.filter-chip').forEach(b=>b.classList.toggle('active',b===btn));filterProjects();}));
  $('#project-search').addEventListener('input',filterProjects);

  // Project deep-dive dialog: content is read from each existing project card.
  const projectDialog=$('#project-dialog');
  const closeProjectDialog=()=>{if(projectDialog.open)projectDialog.close();};
  $('.project-card').forEach(card=>{
    const actions=$('.card-actions',card);
    const quickView=document.createElement('button');
    quickView.type='button';quickView.className='quick-view';quickView.textContent='Quick view ↗';
    quickView.addEventListener('click',()=>{
      $('#project-dialog-category').textContent=$('.project-meta span',card)?.textContent||'PROJECT';
      $('#project-dialog-title').textContent=$('h3',card)?.textContent||'Project';
      $('#project-dialog-description').textContent=$('.project-info p',card)?.textContent||'';
      $('#project-dialog-tags').replaceChildren(...$('.tag-row span',card).map(tag=>{const item=document.createElement('span');item.textContent=tag.textContent;return item;}));
      const repoLink=$('.card-actions a',card);
      $('#project-dialog-link').href=repoLink?.href||'https://github.com/SanFlash';
      projectDialog.showModal();
    });
    actions?.append(quickView);
  });
  $('#project-dialog-close').addEventListener('click',closeProjectDialog);
  projectDialog.addEventListener('click',e=>{if(e.target===projectDialog)closeProjectDialog();});
  $('#project-dialog-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#project-dialog-link').href);toast('Repository link copied');}catch{toast('Copy is unavailable in this browser');}});

  // Copy-to-clipboard actions.
  $$('.copy-link').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);toast('Repository link copied');}catch{toast('Copy is unavailable in this browser');}}));

  // Clickable system map: each node changes the live engineering readout.
  const signalContent={
    qa:['Quality engineering','Explore behaviour, isolate risk and verify outcomes'],
    ai:['AI / intelligence','Use context and automation to reduce repetitive work'],
    api:['API / integration','Validate contracts, data flow and service boundaries'],
    ux:['User experience','Follow real journeys across screens and devices']
  };
  $('[data-signal]').forEach(node=>node.addEventListener('click',()=>{
    $('[data-signal]').forEach(item=>item.classList.toggle('selected',item===node));
    const [title,description]=signalContent[node.dataset.signal];
    $('#signal-title').textContent=title;$('#signal-description').textContent=description;
    node.setAttribute('aria-pressed','true');
    $('[data-signal]').filter(item=>item!==node).forEach(item=>item.setAttribute('aria-pressed','false'));
  }));

  // Technology tabs.
  const stacks={quality:{items:['Playwright','Selenium','Appium','Pytest','API Testing','Page Object Model'],caption:'Reliable checks, maintainable suites and clear test evidence.'},engineering:{items:['Python','JavaScript','TypeScript','Flask','FastAPI','SQL'],caption:'Practical application development and integration foundations.'},delivery:{items:['Git','GitHub Actions','Docker','Vercel','Render','CI workflows'],caption:'Repeatable builds, delivery pipelines and deployment workflows.'}};
  $$('.stack-tab').forEach(btn=>btn.addEventListener('click',()=>{const data=stacks[btn.dataset.stack];$$('.stack-tab').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});$('#stack-panel .stack-items').innerHTML=data.items.map(x=>'<span>'+x+'</span>').join('');$('#stack-panel .stack-caption').textContent=data.caption;}));

  // Command palette: Ctrl/Command + K, Escape to close.
  const overlay=$('#command-overlay'), commandInput=$('#command-input');
  const openPalette=()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');commandInput.value='';$('.command-list a').forEach(a=>a.hidden=false);commandInput.focus();};
  const closePalette=()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');};
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette();}if(e.key==='Escape')closePalette();});
  overlay.addEventListener('click',e=>{if(e.target===overlay)closePalette();});
  $$('.command-list a').forEach(a=>a.addEventListener('click',closePalette));
  commandInput.addEventListener('input',()=>{const q=commandInput.value.toLowerCase();$$('.command-list a').forEach(a=>a.hidden=!(a.dataset.command+' '+a.textContent).toLowerCase().includes(q));});

  // Scroll-aware navigation and subtle card tilt.
  if('IntersectionObserver' in window){const sections=$$('main section[id]');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('.main-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(s=>observer.observe(s));}
  if(!reduced&&window.matchMedia('(pointer:fine)').matches){$$('.project-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(900px) rotateY('+(x*4)+'deg) rotateX('+(-y*4)+'deg) translateY(-2px)';});card.addEventListener('pointerleave',()=>card.style.transform='');});}

  // Interactive hero depth: subtle pointer parallax, disabled for touch/reduced motion.
  const heroArt=$('.hero-art');
  if(heroArt&&!reduced&&window.matchMedia('(pointer:fine)').matches){
    heroArt.addEventListener('pointermove',e=>{const r=heroArt.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-.5;const py=(e.clientY-r.top)/r.height-.5;heroArt.style.setProperty('--tilt-x',(py*-5)+'deg');heroArt.style.setProperty('--tilt-y',(px*6)+'deg');});
    heroArt.addEventListener('pointerleave',()=>{heroArt.style.setProperty('--tilt-x','0deg');heroArt.style.setProperty('--tilt-y','0deg');});
  }

  // Lightweight canvas particles; respects reduced-motion preferences.
  const canvas=$('#particle-field'),ctx=canvas?.getContext('2d');let particles=[],width=0,height=0,raf=0;
  const resize=()=>{width=canvas.width=innerWidth*devicePixelRatio;height=canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);particles=Array.from({length:Math.min(65,Math.floor(innerWidth/20))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.5+.4}));};
  const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(167,139,250,.48)';ctx.fill();});raf=requestAnimationFrame(draw);};
  if(!reduced&&ctx){resize();draw();addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else draw();});}


  // Ambient pointer glow and reading progress indicator.
  const progress=$('#scroll-progress'), glow=$('#cursor-glow');
  const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;const ratio=max>0?scrollY/max:0;if(progress)progress.style.width=(ratio*100)+'%';};
  addEventListener('scroll',updateProgress,{passive:true});updateProgress();
  if(!reduced&&window.matchMedia('(pointer:fine)').matches&&glow){
    let glowX=innerWidth/2,glowY=innerHeight/2;
    addEventListener('pointermove',e=>{glowX=e.clientX;glowY=e.clientY;glow.style.left=glowX+'px';glow.style.top=glowY+'px';},{passive:true});
  }
  // Reveal graphic cards as they enter the viewport; CSS remains the fallback.
  if(!reduced&&'IntersectionObserver' in window){
    const graphicObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');graphicObserver.unobserve(entry.target);}
    }),{threshold:.18});
    $('.signal-card').forEach(card=>graphicObserver.observe(card));
  }

  // Pause decorative animation while the tab is hidden and keep motion accessible.
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf)cancelAnimationFrame(raf);else if(!reduced&&ctx&&!raf)draw();});

  // GSAP progressive enhancement; all content remains usable without the CDN.
  window.addEventListener('load',()=>{if(reduced||!window.gsap)return;gsap.registerPlugin(ScrollTrigger);gsap.from('.hero-copy > *',{y:22,opacity:0,duration:.75,stagger:.08,ease:'power3.out'});gsap.utils.toArray('.content-section,.manifesto').forEach(section=>gsap.from(section,{y:35,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 82%'}}));});
})();
