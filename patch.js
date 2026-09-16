/* One-Minute University reliability patch */
(function(){
  const localDay=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  today=localDay;
  completeLesson=function(l,correct){
    const isNew=!state.completed.includes(l.title);
    if(feedMode==='daily') state.dailyDone=Math.min(5,state.dailyDone+1);
    if(!isNew){save();return}
    state.completed.push(l.title);
    state.lessons++;
    state.recent.unshift({title:l.title,icon:l.icon,xp:correct?10:0});
    state.recent=state.recent.slice(0,10);
    const day=today();
    if(!state.lastDay) state.streak=1;
    else if(state.lastDay!==day){
      const prev=new Date(state.lastDay+'T00:00:00');
      const cur=new Date(day+'T00:00:00');
      const diff=Math.round((cur-prev)/86400000);
      state.streak=diff===1?state.streak+1:1;
    }
    state.lastDay=day;
    save();
  };
  const oldStartDaily=startDaily;
  startDaily=function(){
    resetDailySafe();
    const unseen=lessons.filter(l=>!state.completed.includes(l.title));
    const seen=lessons.filter(l=>state.completed.includes(l.title));
    queue=[...unseen,...seen].slice(0,5);
    feedMode='daily';
    openLesson();
  };
  resetDailySafe=function(){
    if(state.dailyDate!==today()){
      state.dailyDate=today();
      state.dailyDone=0;
      localStorage.setItem('omu-state',JSON.stringify(state));
    }
  };
  document.documentElement.classList.add('omu-ready');
})();
