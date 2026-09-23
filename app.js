const topics = [
  {id:"science",icon:"🔬",name:"Science",desc:"Big ideas about our universe"},
  {id:"technology",icon:"💻",name:"Technology",desc:"How modern tech actually works"},
  {id:"psychology",icon:"🧠",name:"Psychology",desc:"How minds and behavior work"},
  {id:"history",icon:"📜",name:"History",desc:"Moments that shaped our world"},
  {id:"economics",icon:"💰",name:"Economics",desc:"Money, markets and decisions"},
  {id:"space",icon:"🌌",name:"Space",desc:"Explore the cosmos"},
  {id:"biology",icon:"🧬",name:"Biology",desc:"Life from cells to ecosystems"},
  {id:"math",icon:"∑",name:"Mathematics",desc:"Patterns hiding everywhere"}
];

const lessons = [
  {topic:"science",icon:"⚛️",title:"Quantum Computing",tag:"PHYSICS",concept:"Quantum computers use <em>qubits</em> rather than ordinary bits. A normal bit is 0 or 1; a qubit can be described as a combination of states until it is measured.",example:"Imagine a coin spinning in the air. Before it lands, it is not simply heads or tails. A qubit uses a quantum version of this idea called <b>superposition</b>.",question:"Which property lets a qubit represent a combination of states?",options:["Encryption","Superposition","Compilation","Compression"],answer:1},
  {topic:"technology",icon:"🌐",title:"How the Internet Works",tag:"TECHNOLOGY",concept:"The internet is a huge network of connected computers. Your device sends packets through routers to servers, which send information back.",example:"Think of a package delivery system. A message is split into small packages, routed through a network and reassembled when they arrive.",question:"What do routers primarily do?",options:["Create websites","Route data between networks","Store passwords","Generate electricity"],answer:1},
  {topic:"psychology",icon:"🧠",title:"The Attention Trap",tag:"PSYCHOLOGY",concept:"Your attention is limited. Switching rapidly between tasks feels productive, but each switch carries a mental cost.",example:"Imagine reading while someone keeps tapping your shoulder. You can continue, but your brain keeps paying a tiny switching cost.",question:"What does rapid task switching generally add?",options:["More focus","A switching cost","More memory","More sleep"],answer:1},
  {topic:"space",icon:"🌌",title:"Black Holes",tag:"ASTRONOMY",concept:"A black hole is a region of spacetime where gravity is so strong that past the event horizon, nothing—not even light—can escape.",example:"Picture a waterfall. Far upstream you can swim away; past a certain point the current becomes impossible to overcome.",question:"What is the event horizon?",options:["A black hole’s surface","A boundary beyond which escape is impossible","A visible star","The center of a galaxy"],answer:1},
  {topic:"biology",icon:"🧬",title:"DNA",tag:"BIOLOGY",concept:"DNA is a molecule that stores biological instructions. Genes provide information used by cells to build proteins and regulate processes.",example:"Think of DNA as a huge library. Genes are like individual recipes that cellular machinery can read.",question:"What does DNA primarily store?",options:["Heat","Biological information","Electricity","Oxygen"],answer:1},
  {topic:"science",icon:"🌈",title:"Why Is the Sky Blue?",tag:"PHYSICS",concept:"Sunlight contains many wavelengths. Earth’s atmosphere scatters shorter blue wavelengths more strongly than longer red wavelengths.",example:"Shine a flashlight through a misty room: tiny particles scatter light sideways. Earth’s air does something similar.",question:"Which color is scattered more strongly by Earth’s atmosphere?",options:["Red","Blue","Infrared","Black"],answer:1},
  {topic:"technology",icon:"🔐",title:"Public-Key Cryptography",tag:"CYBERSECURITY",concept:"Public-key cryptography uses a pair of mathematically related keys. A public key can be shared while a private key is kept secret.",example:"Imagine a mailbox anyone can put a letter into, but only the owner has the key to open.",question:"Which key should normally remain secret?",options:["Public key","Private key","Browser key","Router key"],answer:1},
  {topic:"psychology",icon:"🧩",title:"Confirmation Bias",tag:"PSYCHOLOGY",concept:"Confirmation bias is the tendency to notice, interpret or remember information in ways that support beliefs we already hold.",example:"If you think a brand is unreliable, you may remember its failures while overlooking times it worked normally.",question:"What does confirmation bias tend to favor?",options:["Evidence that challenges beliefs","Information consistent with existing beliefs","Random information","Perfectly neutral memories"],answer:1},
  {topic:"history",icon:"🏛️",title:"The Printing Press",tag:"HISTORY",concept:"Movable-type printing made it faster and cheaper to reproduce texts in large quantities, helping information circulate more widely.",example:"Before mass printing, copying a book by hand took a long time. A press made many similar pages efficiently.",question:"What did printing primarily make easier?",options:["Mass reproduction of texts","Building ships","Predicting weather","Generating electricity"],answer:0},
  {topic:"economics",icon:"📈",title:"Supply and Demand",tag:"ECONOMICS",concept:"Supply describes how much sellers offer, while demand describes how much buyers want. Their interaction helps determine market prices.",example:"If concert tickets are scarce but many people want them, buyers may compete for limited supply, pushing price upward.",question:"What can happen when demand rises while supply stays fixed?",options:["Price pressure can rise","Demand disappears","Supply becomes infinite","Money stops existing"],answer:0},
  {topic:"space",icon:"🪐",title:"Why Planets Orbit",tag:"ASTRONOMY",concept:"A planet’s forward motion combines with the Sun’s gravitational pull. The planet continually falls toward the Sun while moving sideways.",example:"Swing a ball on a string: it wants to travel straight while the string pulls inward, creating a curved path.",question:"What keeps a planet bound to the Sun?",options:["Gravity","Sound","Magnetism alone","Clouds"],answer:0},
  {topic:"biology",icon:"🫀",title:"How Your Heart Beats",tag:"BIOLOGY",concept:"The heart is a muscular pump. Electrical signals coordinate contractions so blood moves through the lungs and body.",example:"Think of a two-stage pump: one side sends blood to the lungs while the other sends oxygen-rich blood around the body.",question:"What coordinates the heart’s contractions?",options:["Electrical signals","Bones","Hair follicles","Stomach acid"],answer:0},
  {topic:"math",icon:"∞",title:"Infinity",tag:"MATHEMATICS",concept:"Infinity is not an ordinary number. It describes something without an upper bound, and infinite sets can have surprising relationships.",example:"The counting numbers never end: 1, 2, 3, 4, and so on. There is always another number.",question:"Is infinity an ordinary finite number?",options:["Yes","No","Only on weekends","Only in geometry"],answer:1}
];

const defaults = {xp:0,lessons:0,streak:0,completed:[],recent:[],lastDay:null,dailyDate:null,dailyDone:0,topicScores:{},wrong:[]};
let state = loadState();
let queue = [];
let index = 0;
let phase = 0;
let answered = false;
let timer = null;
let mode = "all";
let lessonCompleted = false;
let searchHandler = null;

const $ = id => document.getElementById(id);

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("omu-state") || "{}");
    return {
      ...defaults,
      ...saved,
      completed:Array.isArray(saved.completed) ? saved.completed : [],
      recent:Array.isArray(saved.recent) ? saved.recent : [],
      wrong:Array.isArray(saved.wrong) ? saved.wrong : [],
      topicScores:saved.topicScores && typeof saved.topicScores === "object" ? saved.topicScores : {}
    };
  } catch {
    return {...defaults};
  }
}

function save() {
  try { localStorage.setItem("omu-state", JSON.stringify(state)); } catch {}
  renderStats();
}

function localDay(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

function resetDaily() {
  const today = localDay();
  if (state.dailyDate !== today) {
    state.dailyDate = today;
    state.dailyDone = 0;
    try { localStorage.setItem("omu-state", JSON.stringify(state)); } catch {}
  }
}

function renderStats() {
  resetDaily();
  ["xpStat","profileXP"].forEach(id => { if ($(id)) $(id).textContent = state.xp; });
  ["streakStat","profileStreak"].forEach(id => { if ($(id)) $(id).textContent = state.streak; });
  if ($("profileLessons")) $("profileLessons").textContent = state.lessons;
  const pct = lessons.length ? Math.min(100, Math.round(state.completed.length / lessons.length * 100)) : 0;
  if ($("progressPercent")) $("progressPercent").textContent = pct + "%";
  if ($("progressBar")) $("progressBar").style.width = pct + "%";
  if ($("dailyProgress")) $("dailyProgress").textContent = `${Math.min(5,state.dailyDone)}/5 complete`;
  renderRecent();
  renderJourney();
}

function renderRecent() {
  const e = $("recentList");
  if (!e) return;
  e.innerHTML = state.recent.length
    ? state.recent.slice(0,6).map(x => `<div class="recent-item"><b>${escapeHtml(x.icon)} ${escapeHtml(x.title)}</b><span>+${x.xp} XP</span></div>`).join("")
    : '<div class="recent-item"><span>No lessons yet.</span><b>Start learning →</b></div>';
}

function renderJourney() {
  if (!$("journeyTitle")) return;
  if (!state.lessons) {
    $("journeyTitle").textContent = "Your first lesson is waiting.";
    $("journeyText").textContent = "Complete a lesson to start building your knowledge streak.";
    return;
  }
  $("journeyTitle").textContent = "Keep your streak alive.";
  const left = Math.max(0,5-state.dailyDone);
  $("journeyText").textContent = left ? `You've learned ${state.lessons} topic${state.lessons===1?"":"s"}. ${left} Daily 5 lesson${left===1?"":"s"} left.` : "You've completed today's Daily 5!";
}

function renderTopics() {
  const g = $("topicGrid");
  if (!g) return;
  g.innerHTML = topics.map(t => `<button class="topic-card" data-topic="${t.id}">
    <div class="topic-icon">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p>
  </button>`).join("");
  g.querySelectorAll(".topic-card").forEach(b => b.addEventListener("click", () => startTopic(b.dataset.topic)));
}

function showView(id) {
  document.querySelectorAll("main>section").forEach(s => s.classList.add("hidden"));
  $(id)?.classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === id));
  window.scrollTo({top:0,behavior:"smooth"});
}

function recommended() {
  const unseen = lessons.filter(l => !state.completed.includes(l.title));
  const seen = lessons.filter(l => state.completed.includes(l.title));
  const score = l => state.topicScores[l.topic] ?? 0;
  return [...unseen].sort((a,b) => score(a)-score(b)).concat([...seen].sort((a,b) => score(a)-score(b)));
}

function startTopic(topic) {
  const topicLessons = lessons.filter(l => l.topic === topic);
  queue = topicLessons.length ? topicLessons : recommended();
  mode = "topic";
  openLesson();
}

function startLearning() {
  queue = recommended();
  mode = "all";
  openLesson();
}

function startDaily() {
  resetDaily();
  if (state.dailyDone >= 5) {
    toast("Daily 5 is already complete. Great work!");
    return;
  }
  const unseen = lessons.filter(l => !state.completed.includes(l.title));
  const seen = lessons.filter(l => state.completed.includes(l.title));
  queue = [...unseen,...seen].slice(0, Math.min(5, lessons.length));
  mode = "daily";
  openLesson();
}

function review() {
  const missed = lessons.filter(l => state.wrong.includes(l.title));
  queue = missed.length ? missed : recommended().slice(0,5);
  mode = "review";
  openLesson();
}

function openLesson() {
  if (!queue.length) queue = [...lessons];
  index = 0;
  phase = 0;
  answered = false;
  lessonCompleted = false;
  $("lessonOverlay")?.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderLesson();
}

function renderLesson() {
  clearInterval(timer);
  const l = queue[index % queue.length];
  $("lessonCount").textContent = `${index+1} / ${queue.length}`;
  $("lessonProgress").style.width = (index / Math.max(1,queue.length) * 100) + "%";

  if (phase === 0) {
    $("lessonContent").innerHTML = `<span class="lesson-kicker">${l.tag} · 30 SEC</span><h2>${l.icon} ${l.title}</h2><p>${l.concept}</p>`;
    startTimer(30,"30 sec");
  } else if (phase === 1) {
    $("lessonContent").innerHTML = `<span class="lesson-kicker">MAKE IT CLICK · 20 SEC</span><h2>Think of it <em>like this.</em></h2><div class="example-box"><strong>REAL-WORLD EXAMPLE</strong><div>${l.example}</div></div>`;
    startTimer(20,"20 sec");
  } else {
    $("lessonContent").innerHTML = `<span class="lesson-kicker">RECALL · 10 SEC</span><h2>Quick <em>test.</em></h2><p>${l.question}</p><div class="quiz-options">${l.options.map((o,i)=>`<button class="quiz-option" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join("")}</div>`;
    document.querySelectorAll(".quiz-option").forEach(b => b.addEventListener("click", () => answer(Number(b.dataset.i))));
    $("timerLabel").textContent = "10 sec";
    $("lessonNext").textContent = "Choose an answer";
  }
}

function startTimer(seconds,label) {
  let left = seconds;
  $("timerLabel").textContent = left + " sec";
  timer = setInterval(() => {
    left--;
    $("timerLabel").textContent = left + " sec";
    if (left <= 0) {
      clearInterval(timer);
      if (phase < 2) {
        phase++;
        renderLesson();
      } else {
        toast("Pick an answer to finish this lesson.");
        $("timerLabel").textContent = "Waiting";
      }
    }
  },1000);
}

function advance() {
  if (phase < 2) {
    phase++;
    renderLesson();
    return;
  }
  if (!answered) {
    toast("Choose an answer first.");
    return;
  }
  next();
}

function answer(choice) {
  if (answered) return;
  answered = true;
  clearInterval(timer);
  const l = queue[index % queue.length];
  const correct = choice === l.answer;
  document.querySelectorAll(".quiz-option").forEach((b,n) => {
    b.disabled = true;
    if (n === l.answer) b.classList.add("correct");
    if (n === choice && !correct) b.classList.add("wrong");
  });
  $("lessonNext").textContent = "Next topic →";
  completeLesson(l,correct);
  toast(correct ? "+10 XP · Correct!" : "Not quite · added to review");
}

function completeLesson(l,correct) {
  if (lessonCompleted) return;
  lessonCompleted = true;
  const fresh = !state.completed.includes(l.title);
  if (correct) state.xp += 10;
  if (mode === "daily" && !state.completed.includes(l.title)) state.dailyDone = Math.min(5,state.dailyDone+1);

  if (fresh) {
    state.completed.push(l.title);
    state.lessons++;
    state.recent.unshift({title:l.title,icon:l.icon,xp:correct?10:0});
    state.recent = state.recent.slice(0,10);
  }
  if (correct) {
    state.wrong = state.wrong.filter(x => x !== l.title);
  } else if (!state.wrong.includes(l.title)) {
    state.wrong.push(l.title);
  }
  state.topicScores[l.topic] = (state.topicScores[l.topic] || 0) + (correct ? 1 : -1);
  updateStreak();
  save();
}

function updateStreak() {
  const today = localDay();
  if (state.lastDay === today) return;
  if (!state.lastDay) {
    state.streak = 1;
  } else {
    const previous = new Date(state.lastDay + "T00:00:00");
    const current = new Date(today + "T00:00:00");
    const diff = Math.round((current-previous)/86400000);
    state.streak = diff === 1 ? state.streak + 1 : 1;
  }
  state.lastDay = today;
}

function next() {
  index++;
  phase = 0;
  answered = false;
  lessonCompleted = false;

  if (mode === "daily" && (index >= queue.length || state.dailyDone >= 5)) {
    toast("🎉 Daily 5 complete!");
    closeLesson();
    return;
  }

  if (index >= queue.length) {
    if (mode === "topic") {
      toast("Topic complete! Choose another topic.");
      closeLesson();
      return;
    }
    queue = recommended();
    index = 0;
    if (!queue.length) { closeLesson(); return; }
  }
  renderLesson();
}

function closeLesson() {
  clearInterval(timer);
  $("lessonOverlay")?.classList.add("hidden");
  document.body.style.overflow = "";
  renderStats();
}

function toast(message) {
  const t = $("toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"),1800);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function openSearch() {
  const query = window.prompt("Search lessons or topics");
  if (query === null) return;
  const q = query.trim().toLowerCase();
  if (!q) return;
  const matches = lessons.filter(l =>
    [l.title,l.tag,l.topic,l.concept,l.example].join(" ").toLowerCase().includes(q)
  );
  if (!matches.length) {
    toast("No lessons found.");
    return;
  }
  const first = matches[0];
  queue = matches;
  mode = "search";
  openLesson();
  toast(`${matches.length} lesson${matches.length===1?"":"s"} found`);
}

function bind() {
  [
    ["startBtn",startLearning],
    ["continueBtn",startLearning],
    ["dailyBtn",startDaily],
    ["reviewBtn",review],
    ["closeLesson",closeLesson],
    ["lessonNext",advance],
    ["profileBtn",()=>showView("profileView")],
    ["searchBtn",openSearch],
    ["homeBtn",()=>showView("homeView")],
    ["exploreBtn",()=>showView("topicsView")],
    ["allTopicsBtn",()=>showView("topicsView")],
    ["profileBack",()=>showView("homeView")]
  ].forEach(([id,fn]) => $(id)?.addEventListener("click",fn));

  document.querySelectorAll(".nav-item").forEach(n =>
    n.addEventListener("click",()=>showView(n.dataset.nav))
  );

  let startY = 0;
  const shell = document.querySelector(".lesson-shell");
  shell?.addEventListener("touchstart",e=>{startY=e.changedTouches[0].screenY},{passive:true});
  shell?.addEventListener("touchend",e=>{
    const delta=e.changedTouches[0].screenY-startY;
    if (Math.abs(delta)>60) {
      if (delta<0) advance();
      else if (phase>0) { phase--; answered=false; lessonCompleted=false; renderLesson(); }
    }
  },{passive:true});
}

renderTopics();
bind();
renderStats();
