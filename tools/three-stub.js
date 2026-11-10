(function(){ const mk=()=>{ const f=function(){}, store={}; return new Proxy(f,{
  get:(t,k)=>{ if(k===Symbol.toPrimitive) return ()=>0; if(k===Symbol.iterator) return function*(){}; if(k==='then') return undefined; if(k!=='length'&&k!=='name'&&k in t) return t[k]; if(!(k in store)) store[k]=mk(); return store[k]; },
  set:(t,k,v)=>{t[k]=v;return true}, apply:()=>mk(), construct:()=>mk()}); };
window.THREE=mk(); })();
