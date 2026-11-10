// Smoke test: loads index.html with a stand-in for three.js (works offline),
// clicks "Lift off!", lets the pre-flight check run, opens the fact book, and
// presses Good Night. Prints any page errors.
// Usage: node tools/smoke-test.js [path/to/index.html]
const {chromium}=require('playwright'); const fs=require('fs'); const path=require('path');
const page=path.resolve(process.argv[2]||path.join(__dirname,'..','index.html'));
const stub=fs.readFileSync(path.join(__dirname,'three-stub.js'),'utf8');
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1000,height:700}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message+' @ '+(e.stack||'').split('\n')[1]));
  await p.route('**/*',r=>{ const u=r.request().url();
    if(u.includes('three')) return r.fulfill({body:stub,contentType:'application/javascript'});
    if(u.startsWith('file:')) return r.continue(); return r.abort(); });
  await p.goto('file://'+page); await p.waitForTimeout(800);
  await p.click('#beginBtn'); await p.waitForTimeout(3000);
  await p.evaluate(()=>document.getElementById('bookBtn').click()); await p.waitForTimeout(500);
  const bookOpen=await p.evaluate(()=>!document.getElementById('bookScrim').hidden);
  await p.evaluate(()=>document.getElementById('bookClose').click());
  await p.evaluate(()=>document.getElementById('goodnightBtn').click()); await p.waitForTimeout(1600);
  const backToStart=await p.evaluate(()=>!document.getElementById('intro').hidden);
  console.log({liftOffWorked:true,bookOpen,backToStart});
  console.log(errs.length?errs.join('\n'):'no errors');
  await b.close(); process.exit(errs.length?1:0);
})();
