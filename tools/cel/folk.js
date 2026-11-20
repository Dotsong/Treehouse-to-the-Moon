/* ---------- the cast, in the cel style ---------- */
/* One maker for everybody: Michelle, and June, Pip, Lumi, Mom and Dad from Trail to the Top. Each is the same set of joints (hips, knees,
   ankles, shoulders, elbows, wrists, neck) and the same few smooth shapes, with what makes them themselves painted on: the dress or shirt,
   the hair, and the face. All of them have the newer build Michelle was given: about 6% taller, the slim fitted dress, the head at
   three-quarters. The face is one picture, repainted whenever the expression, a blink or a talking mouth changes it. */
const shade=(c,k)=>'#'+new THREE.Color(c).multiplyScalar(k).getHexString(), tint=(c,k)=>'#'+new THREE.Color(c).lerp(new THREE.Color('#ffffff'),k).getHexString();
const paintStar=(x,cx,cy,r,col)=>{ x.fillStyle=col; x.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*0.45:r; x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr); } x.closePath(); x.fill(); };
/* the expressions, as they are on the June & Pip model sheet: how the brows tilt and lift, how open and how big the eyes are, which way the
   mouth pulls and what shape it makes, and what the head does with it */
const FACES={Happy:{tilt:-0.1,lift:[0,0],eye:1,size:1,smirk:0,mouth:'smile'},'Big smile':{tilt:-0.14,lift:[0.008,0.008],eye:1,size:1.04,smirk:0,mouth:'grin'},
  Cheeky:{lid:[0.3,0.24],lidTilt:-0.2,under:0.13,tilt:0.24,lift:[-0.004,0.014],eye:0.78,size:1,smirk:1,mouth:'smile'},Surprised:{tilt:-0.02,lift:[0.022,0.022],eye:1.15,size:1.15,smirk:0,mouth:'oh'},
  Awe:{tilt:-0.2,lift:[0.018,0.018],eye:1.2,size:1.12,smirk:0,mouth:'oh',small:0.62,look:true},Curious:{tilt:-0.04,lift:[-0.002,0.022],eye:1.1,size:1.06,smirk:0,mouth:'oh',small:0.42,cock:0.22},
  Thinking:{gaze:[-0.7,0.9],tilt:0.12,lift:[0.002,0.02],eye:1,size:1,smirk:1.6,mouth:'hmm',think:true},
  'Toothy grin':{tilt:-0.16,lift:[0.012,0.012],eye:1,size:1.02,smirk:0,mouth:'teeth',happyShut:true},
  /* more feelings, most of them carried by the eyelids: how far each upper lid comes down (lid) and at what slant (lidTilt), how far the lower lid is
     pushed up (under), a shut eye (wink), and where she is looking (gaze). eye below 0.78 is what gives Michelle, who has heavy lids of her own, the same look. */
  Sleepy:{lid:[0.58,0.58],lidTilt:0.1,tilt:-0.12,lift:[-0.004,-0.004],eye:0.58,size:1,smirk:0,mouth:'oh',small:0.42},
  Bored:{lid:[0.5,0.5],tilt:0,lift:[-0.007,-0.007],eye:0.63,size:1,smirk:0,mouth:'flat',gaze:[0.7,0]},
  Smug:{lid:[0.46,0.46],lidTilt:-0.1,tilt:0.1,lift:[0.004,0.013],eye:0.66,size:1,smirk:1.5,mouth:'smile'},
  Suspicious:{lid:[0.4,0.5],lidTilt:-0.16,under:0.26,gaze:[0.85,0],tilt:0.28,lift:[-0.011,-0.003],eye:0.6,size:1,smirk:-0.9,mouth:'flat'},
  Sad:{lid:[0.3,0.3],lidTilt:0.36,tilt:-0.46,lift:[0.004,0.004],eye:0.74,size:1,smirk:0,mouth:'frown',gaze:[0,-0.7]},
  Angry:{lid:[0.34,0.34],lidTilt:-0.42,under:0.12,tilt:0.55,lift:[-0.015,-0.015],eye:0.7,size:1,smirk:0,mouth:'frown'},
  Worried:{tilt:-0.42,lift:[0.013,0.013],eye:1.08,size:1.05,smirk:0,mouth:'wavy'},
  Determined:{lid:[0.2,0.2],lidTilt:-0.32,under:0.1,tilt:0.4,lift:[-0.009,-0.009],eye:0.77,size:1,smirk:0.5,mouth:'flat'},
  Wink:{wink:1,under:0.14,tilt:-0.1,lift:[0.014,-0.005],eye:1,size:1,smirk:1,mouth:'smile'},
  Laughing:{happyShut:true,tilt:-0.2,lift:[0.014,0.014],eye:1,size:1,smirk:0,mouth:'grin'},
  Shocked:{tilt:-0.1,lift:[0.03,0.03],eye:1.25,size:1.22,smirk:0,mouth:'oh'},
  Asleep:{eye:0.05,tilt:-0.06,lift:[-0.004,-0.004],size:1,smirk:0,mouth:'oh',small:0.3},   /* fast asleep: eyes shut with the lashes swept down, brows smoothed out, lips just parted */
  Dreamy:{lid:[0.4,0.4],lidTilt:0.12,under:0.12,tilt:-0.2,lift:[0.006,0.006],eye:0.68,size:1,smirk:0,mouth:'smile',gaze:[0,0.8]},
  Scary:{tilt:0.6,lift:[-0.012,-0.012],eye:1,size:1,smirk:0,mouth:'roar',scaryEyes:true},Embarrassed:{tilt:-0.34,lift:[0.006,0.006],eye:0.1,size:1,smirk:0,mouth:'flat',blush:0.95}};
function paintFace(x,W,H,o,C,F,st){ const R=0.2, fp=ballAt(R,W,H), u=W/(Math.PI*2*R), dark='#2a1c26', eK=o.eyeK||1;
  x.setTransform(1,0,0,1,0,0); x.globalAlpha=1; x.lineCap=x.lineJoin='round'; x.fillStyle=C.skin; x.fillRect(0,0,W,H);
  [-1,1].forEach(s=>{ const [X,Y]=fp(s*0.118,-0.05), k=F.blush?1.3:1; x.fillStyle=F.blush?'#ee6f7c':C.blush; x.beginPath(); x.ellipse(X,Y,0.037*u*k,0.026*u*k,0,0,7); x.fill(); });   /* cheeks (a blush makes them bigger and redder) */
  if(o.freckles){ x.fillStyle=C.skinDeep; [[-0.1,-0.03],[-0.085,-0.042],[-0.115,-0.044],[0.1,-0.03],[0.085,-0.042],[0.115,-0.044],[-0.012,-0.012],[0.014,-0.014]].slice(0,o.freckles).forEach(([a,b])=>{ const [X,Y]=fp(a,b); x.beginPath(); x.arc(X,Y,0.0037*u,0,7); x.fill(); }); }
  [-1,1].forEach(s=>{ const [X,Y]=fp(s*0.072,0.012), rx=(o.blackEyes?0.025:0.029)*u*eK*F.size, ry0=(o.blackEyes?0.03:0.027)*u*eK, ry=ry0*(o.lids||o.browLid?Math.max(1,F.eye):Math.max(0.2,F.eye))*(F.size>1?1.04:1); x.strokeStyle=x.fillStyle=dark;
    if(F.scaryEyes){ x.lineWidth=0.0058*u; x.beginPath(); x.moveTo(X+s*rx*1.15,Y-ry0*0.8); x.lineTo(X-s*rx*0.9,Y); x.lineTo(X+s*rx*1.15,Y+ry0*0.8); x.stroke(); return; }   /* screwed tight shut: two creases meeting toward the nose */
    if(F.happyShut){ x.lineWidth=0.0072*u; x.lineCap='round'; x.beginPath(); x.moveTo(X-rx*1.05,Y+ry0*0.3); x.quadraticCurveTo(X,Y-ry0*0.75,X+rx*1.05,Y+ry0*0.3); x.stroke();   /* eyes squeezed shut in a grin: two arches */
      if(o.lash){ x.lineWidth=o.lash.w*0.8*u; o.lash.f.forEach((f,k)=>{ if(f[0]>0) return; const px=X+s*rx*(1.05-k*0.28), py=Y+ry0*(0.3-k*0.3); x.beginPath(); x.moveTo(px,py); x.lineTo(px+s*f[1]*0.8*u,py+(0.002-k*0.004)*u); x.stroke(); }); } return; }
    if(st.blink===2||st.blink===true||F.eye<0.2||F.wink===s){ x.lineWidth=0.0067*u; x.beginPath(); x.moveTo(X-rx,Y+0.001*u); x.quadraticCurveTo(X,Y+ry0*0.55,X+rx,Y+0.001*u); x.stroke();
      if(o.lash){ x.lineWidth=o.lash.w*0.8*u; o.lash.f.forEach((f,k)=>{ if(f[0]>0) return; x.beginPath(); x.moveTo(X+s*rx*(1-k*0.22),Y+(0.001+k*0.004)*u); x.lineTo(X+s*(rx*(1-k*0.22)+f[1]*0.75*u),Y+(0.006+k*0.006)*u); x.stroke(); }); } return; }   /* shut eyes keep their lashes, swept down */
    const L=o.lids?Math.max(clamp(0.66+(0.78-F.eye)*2.2,0,1.1),st.blink===1?1.15:0):0, top=Y-ry+ry*L;   /* (L: how far a heavy lid comes down over the eye) */
    /* the lids are their own part of an expression, set apart from the brows: each face says how far each lid comes down across the top
       of its eye (lid) and at what slant (lidTilt), so one eye can sit heavy and knowing while the other stays wide, whatever the brows do */
    const cut=Math.max(o.browLid&&F.lid?clamp(F.lid[s<0?0:1],0,0.72):0,st.blink===1&&!o.lids?0.56:0),   /* (a blink passes through a half-shut frame on its way down and up) */
      lid=cut>0.03, sl=Math.sin(F.lidTilt||0)*0.9, cy=Y-ry+2*ry*cut, hw=rx*Math.sqrt(Math.max(0,1-(1-2*cut)*(1-2*cut)))*1.08+0.003*u;
    x.save(); if(L>0){ x.beginPath(); x.rect(X-rx-0.006*u,top,rx*2+0.012*u,ry*2+0.01*u); x.clip(); }
    if(lid){ x.beginPath(); x.moveTo(X-s*rx*1.4,cy-rx*1.4*sl); x.lineTo(X+s*rx*1.4,cy+rx*1.4*sl); x.lineTo(X+s*rx*1.4,Y+ry*1.3); x.lineTo(X-s*rx*1.4,Y+ry*1.3); x.closePath(); x.clip(); }
    const un=o.browLid&&F.under?F.under:0, uy=Y+ry-2*ry*un; if(un){ x.beginPath(); x.rect(X-rx*1.5,Y-ry*1.5,rx*3,uy-(Y-ry*1.5)); x.clip(); }   /* a smile pushes the lower lid up */
    if(o.blackEyes){ x.fillStyle=dark; x.beginPath(); x.ellipse(X,Y,rx,ry,0,0,7); x.fill();   /* the original eye: all dark, a little warmth low in it, one catch of light */
      const gz=F.gaze||[0,0];   /* where she is looking: the warmth in the eye and its catch of light slide that way */
      x.fillStyle=o.eyeGlow||'#5a3f4a'; x.beginPath(); x.ellipse(X+gz[0]*rx*0.3,Y+ry*(0.34-gz[1]*0.5),rx*0.62,ry*0.46,0,0,7); x.fill();
      x.fillStyle='#fff'; x.beginPath(); x.arc(X+rx*(0.4+gz[0]*0.35),Math.max(top,Y-ry,lid?cy-ry*0.1:-1e9)+ry*(0.42-gz[1]*0.14),rx*0.3,0,7); x.fill(); x.restore();
      if(un){ const uw=rx*Math.sqrt(Math.max(0,1-(1-2*un)*(1-2*un))); x.strokeStyle=dark; x.lineWidth=0.0036*u; x.beginPath(); x.moveTo(X-uw,uy); x.quadraticCurveTo(X,uy-0.003*u,X+uw,uy); x.stroke(); }
      if(lid){ x.strokeStyle=dark; x.lineWidth=0.0078*u; x.beginPath(); x.moveTo(X-s*hw,cy-hw*sl); x.lineTo(X+s*(hw+0.002*u),cy+(hw+0.002*u)*sl); x.stroke();   /* the lid line, with her lashes at its outer end */
        if(o.lash){ x.lineWidth=o.lash.w*0.82*u; o.lash.f.forEach(([th,len,el],k)=>{ const px=X+s*hw*(1-k*0.22), py=cy+hw*(1-k*0.22)*sl-0.002*u; x.beginPath(); x.moveTo(px,py); x.lineTo(px+s*Math.cos(el)*len*u,py-Math.sin(el)*len*u); x.stroke(); }); } } } else {
    /* a natural eye: the white of it, a round coloured iris with its pupil sitting under the upper lid, a catch of light */
    const ir=ry0*0.93*Math.min(1,F.size), iy=Y-ry*0.02, ic=o.iris||['#4a3540','#7a5a66'];
    x.fillStyle='#fffaf4'; x.beginPath(); x.ellipse(X,Y,rx,ry,0,0,7); x.fill(); x.clip();
    x.fillStyle=ic[0]; x.beginPath(); x.arc(X,iy,ir,0,7); x.fill(); x.fillStyle=ic[1]; x.beginPath(); x.arc(X,iy+ir*0.12,ir*0.7,0,7); x.fill();
    x.fillStyle=dark; x.beginPath(); x.arc(X,iy,ir*0.42,0,7); x.fill();
    x.fillStyle='rgba(60,30,50,0.2)'; x.fillRect(X-rx,Math.max(top,Y-ry),rx*2,ry*0.34);   /* the lid's shadow across the top */
    x.fillStyle='#fff'; x.beginPath(); x.arc(X+ir*0.38,iy-ir*0.36,ir*0.27,0,7); x.fill(); x.restore();
    x.strokeStyle='rgba(70,35,45,0.5)'; x.lineWidth=0.0022*u; x.beginPath(); x.ellipse(X,Y,rx,ry,0,0.25,Math.PI-0.25); x.stroke(); x.strokeStyle=dark;   /* a soft line under the eye */ }
    if(o.lids){ const ly=L>0?top:Y-ry*0.9; x.strokeStyle=dark; x.lineWidth=(o.lash?o.lash.w:0.008)*u; x.beginPath(); x.moveTo(X-s*(rx+0.002*u),ly+0.003*u); x.quadraticCurveTo(X,ly-(L>0?0.0055:0.004)*u,X+s*(rx+0.0025*u),ly-0.0006*u); if(!o.lash) x.lineTo(X+s*(rx+0.0117*u),ly-0.0092*u); x.stroke();
      if(o.lash){ x.lineWidth=o.lash.w*0.82*u; o.lash.f.forEach(([th,len,el],k)=>{ const px=X+s*(rx+0.0025*u)*(1-k*0.2), py=ly-(0.0006+k*0.0022)*u; x.beginPath(); x.moveTo(px,py); x.quadraticCurveTo(px+s*Math.cos(el)*len*u*0.6,py-Math.sin(el)*len*u*0.35,px+s*Math.cos(el)*len*u,py-Math.sin(el)*len*u); x.stroke(); }); } }   /* heavy upper lashes with a flick */
    /* the other girls: a lash line over the open eye and flicks at its outer corner, cut differently for each of them */
    if(o.lash&&!o.lids&&!lid){ const a=o.lash, ex=rx*1.05, ey=ry*1.05, A=t=>s>0?t:-Math.PI-t; x.strokeStyle=a.col||dark; x.lineWidth=a.w*u;
      x.beginPath(); x.ellipse(X,Y,ex,ey,0,A(-Math.PI+0.55),A(-0.3),s<0); x.stroke(); x.lineWidth=a.w*0.82*u;
      a.f.forEach(([th,len,el])=>{ const px=X+s*Math.cos(th)*ex, py=Y+Math.sin(th)*ey; x.beginPath(); x.moveTo(px,py); x.quadraticCurveTo(px+s*Math.cos(el)*len*u*0.6,py-Math.sin(el)*len*u*0.35,px+s*Math.cos(el)*len*u,py-Math.sin(el)*len*u); x.stroke(); }); } });
  if(o.mole){ const [X,Y]=fp(o.mole[0],o.mole[1]); x.fillStyle='#5a3626'; x.beginPath(); x.arc(X,Y,0.0034*u,0,7); x.fill(); }   /* a beauty mark */
  [-1,1].forEach((s,i)=>{ const [X,Y]=fp(s*0.066,0.059+F.lift[i]), L=0.022*u, dy=Math.sin(F.tilt)*L; x.strokeStyle=o.brow||C.hair; x.lineWidth=0.0086*u;
    x.beginPath(); x.moveTo(X-s*L,Y-dy); x.quadraticCurveTo(X,Y-0.007*u,X+s*L,Y+dy); x.stroke(); });   /* brows: tilt lifts their inner ends, lift raises each whole */
  if(o.sculpt){ x.strokeStyle=C.skinDeep; x.lineCap='round';   /* painted definition over the sculpted face: lid creases, the shade under the nose and under the lip */
    if(!F.happyShut) [-1,1].forEach(s=>{ const [X,Y]=fp(s*0.072,0.012), r=0.03*u*eK; x.globalAlpha=0.75; x.lineWidth=0.003*u; x.beginPath(); x.ellipse(X,Y-r*0.42,r*1.02,r*0.95,0,Math.PI+0.5,-0.5); x.stroke(); });
    { const [X,Y]=fp(0,-0.036); x.globalAlpha=0.8; x.lineWidth=0.0034*u; x.beginPath(); x.arc(X,Y-0.006*u,0.0085*u,0.5,Math.PI-0.5); x.stroke();
      [-1,1].forEach(s=>{ x.beginPath(); x.arc(X+s*0.0105*u,Y-0.004*u,0.004*u,s>0?-0.9:Math.PI-1.1,s>0?1.1:Math.PI+0.9); x.stroke(); }); }
    x.globalAlpha=1; }
  if(!o.sculpt){ const [X,Y]=fp(0,-0.03); x.strokeStyle=C.skinDeep; x.lineWidth=0.0043*u; x.beginPath(); x.arc(X,Y-0.0037*u,0.008*u,0.35,Math.PI-0.35); x.stroke(); }   /* a button nose */
  { const [MX,MY]=fp(F.smirk*0.012,o.mouthY||-0.08), m=st.talk>0?'talk':F.mouth; x.save(); x.translate(MX,MY); x.rotate(-F.smirk*0.2); x.scale(o.mouthW||1,1);
    if(m==='smile'){ x.strokeStyle='#a8454f'; x.lineWidth=0.0062*u; x.beginPath(); x.moveTo(-0.029*u,-0.006*u); x.quadraticCurveTo(0,0.022*u,0.029*u,-0.006*u); x.stroke();
      if(o.dimple&&F.smirk>0){ x.strokeStyle='#c0706a'; x.lineWidth=0.0037*u; x.beginPath(); x.arc(0.037*u,-0.006*u,0.0068*u,-0.9,0.9); x.stroke(); } }
    else if(m==='hmm'){ x.strokeStyle='#a8454f'; x.lineWidth=0.0062*u; x.lineCap='round'; x.beginPath(); x.moveTo(-0.012*u,0.011*u); x.quadraticCurveTo(-0.002*u,0.004*u,0.006*u,0.009*u); x.quadraticCurveTo(0.011*u,0.012*u,0.015*u,0.005*u); x.stroke(); }   /* a small mouth pursed and pulled to one side */
    else if(m==='frown'){ x.strokeStyle='#a8454f'; x.lineWidth=0.0062*u; x.lineCap='round'; x.beginPath(); x.moveTo(-0.024*u,0.019*u); x.quadraticCurveTo(0,-0.003*u,0.024*u,0.019*u); x.stroke(); }   /* turned down */
    else if(m==='wavy'){ x.strokeStyle='#a8454f'; x.lineWidth=0.0058*u; x.lineCap='round'; x.beginPath(); x.moveTo(-0.022*u,0.012*u); x.bezierCurveTo(-0.012*u,0.002*u,-0.006*u,0.02*u,0.002*u,0.011*u); x.bezierCurveTo(0.009*u,0.003*u,0.015*u,0.019*u,0.022*u,0.01*u); x.stroke(); }   /* an uneasy wobble */
    else if(m==='flat'){ x.strokeStyle='#a8454f'; x.lineWidth=0.0062*u; x.beginPath(); x.moveTo(-0.02*u,0.012*u); x.quadraticCurveTo(0,0.015*u,0.02*u,0.012*u); x.stroke(); }
    else if(m==='oh'||m==='talk'){ const k=m==='oh'?(F.small||1):1; x.fillStyle='#7a2f3a'; x.beginPath(); x.ellipse(0,0.006*u,0.0165*u*k,0.0205*u*(m==='oh'?k:0.25+st.talk),0,0,7); x.fill(); }
    else if(m==='grin'){ x.fillStyle='#7a2f3a'; x.beginPath(); x.moveTo(-0.036*u,-0.008*u); x.quadraticCurveTo(0,-0.002*u,0.036*u,-0.008*u); x.quadraticCurveTo(0.03*u,0.034*u,0,0.034*u); x.quadraticCurveTo(-0.03*u,0.034*u,-0.036*u,-0.008*u); x.fill();
      x.save(); x.clip(); x.fillStyle='#f08a94'; x.beginPath(); x.ellipse(0,0.031*u,0.019*u,0.012*u,0,0,7); x.fill(); x.restore(); }   /* a half-moon with a tongue in it */
    else if(m==='teeth'){ const w=0.065*u, shape=()=>{ x.beginPath(); x.moveTo(-w,-0.011*u); x.quadraticCurveTo(0,-0.004*u,w,-0.011*u); x.bezierCurveTo(w*1.04,0.03*u,w*0.55,0.035*u,0,0.035*u); x.bezierCurveTo(-w*0.55,0.035*u,-w*1.04,0.03*u,-w,-0.011*u); x.closePath(); };   /* full right out to its corners */
      x.fillStyle='#fffaf2'; shape(); x.fill(); x.save(); shape(); x.clip(); x.strokeStyle='#55525a'; x.lineWidth=0.003*u;   /* a wide, deep band of teeth with no outline: the line where they meet, and the gaps between them */
      x.beginPath(); x.moveTo(-w,0.009*u); x.quadraticCurveTo(0,0.017*u,w,0.009*u); x.stroke(); for(let k=-2;k<=2;k++){ x.beginPath(); x.moveTo(k*0.0205*u,-0.012*u); x.lineTo(k*0.019*u,0.038*u); x.stroke(); } x.restore(); }
    else if(m==='roar'){ const N=24, up=q=>q*q*9, hh=q=>0.017*Math.sqrt(Math.max(0,1-(q/0.054)*(q/0.054))), pt=(q,sg)=>[q*u,-(up(q)+0.004+sg*hh(q))*u];
      x.fillStyle='#fff7ee'; x.strokeStyle='#3b1a22'; x.lineWidth=0.0042*u; x.beginPath(); for(let k=0;k<=N;k++){ const q=-0.054+0.108*k/N; x.lineTo(...pt(q,1)); } for(let k=N;k>=0;k--){ const q=-0.054+0.108*k/N; x.lineTo(...pt(q,-1)); } x.closePath(); x.fill(); x.stroke();
      x.lineWidth=0.0028*u; x.beginPath(); for(let k=0;k<=13;k++){ const q=(k/13-0.5)*0.088; x.lineTo(q*u,-(up(q)+0.004+(k%2?-0.0085:0.0085)*(1-Math.abs(k/13-0.5)*0.7))*u); } x.stroke(); }   /* one big white grin, curling up at its corners, with the teeth as a zigzag line */
    x.restore(); } }

function makeCelFolk(o){
  const D=o.col||{}, C=Object.assign({},CEL,D);
  if(D.dress){ C.dressDeep=D.dressDeep||shade(D.dress,0.84); C.dressLine=D.dressLine||shade(D.dress,0.62); } if(D.hair){ C.hairDeep=D.hairDeep||shade(D.hair,0.74); C.hairHi=D.hairHi||tint(D.hair,0.22); } if(D.skin&&!D.blush) C.blush='#f4a08e'; C.ribbon=C.ribbon||C.band; C.pocket=C.pocket||C.dressDeep;
  const g=new THREE.Group(), hi={knees:[],feet:[],elbows:[],hands:[],brows:[],thighs:[],shins:[]}, X={sway:[]}, skin=toon({color:C.skin});
  const LK=o.adult?1.9:1, hipY=o.adult?0.57:0.31, A=o.kneeAt?hipY-o.kneeAt:0.15*LK, B=0.275*LK-A,   /* (kneeAt: how high off the ground her knee sits; the leg's whole length stays as it was) */
    upY=o.adult?0.57:0.3, boots=o.legs==='boots', shirt=o.top==='shirt';

  /* --- legs: striped stockings and boots (Michelle); tights with a turned-down cuff and strapped shoes; or trousers and plain shoes --- */
  const thighMat=boots?toon({map:celTex(64,128,(x,W,H)=>{ x.fillStyle=C.tights; x.fillRect(0,0,W,H); x.fillStyle=C.stripe; for(let k=0;k<5;k++) x.fillRect(0,8+k*25,W,11); })}):toon({color:C.tights});
  const shinMat=boots?toon({map:celTex(128,128,(x,W,H)=>{ x.fillStyle=C.boot; x.fillRect(0,0,W,H); x.fillStyle=C.bootDeep; x.fillRect(0,0,W,16); x.fillStyle='#c9b8a6'; x.fillRect(30,16,3,H); })})
    :o.legs==='trousers'?toon({color:C.tights}):toon({map:celTex(32,128,(x,W,H)=>{ x.fillStyle=C.tights; x.fillRect(0,0,W,H); x.fillStyle=C.cream; x.fillRect(0,H*0.7,W,H*0.09); x.fillStyle=shade(C.tights,0.8); x.fillRect(0,H*0.79,W,2); })});
  const shoe=toon({color:boots?C.boot:o.shoe||'#3b2a3a'}), shoeGeo=boots?celDeform(new THREE.SphereGeometry(0.055,16,10),v=>{ v.y*=0.56; v.z=v.z*1.8+0.016; v.x*=0.9; if(v.z>0.035) v.x*=1-(v.z-0.035)*1.1; if(v.y<-0.02) v.y=-0.02-(-0.02-v.y)*0.3; })
    :celDeform(new THREE.SphereGeometry(0.062,16,10),v=>{ v.y*=0.62; v.z=v.z*1.55+0.012; v.x*=1.02; if(v.y<-0.02) v.y=-0.02-(-0.02-v.y)*0.35; });
  /* leather-strapped clogs: a thick wooden sole with a raised heel and a turned-up toe, a leather upper over the toes nailed down with
     brass studs, an open back that shows her heel, and a strap round the back of the ankle with a brass buckle on the outside */
  const clog=o.clogs?(()=>{ const wood=toon({map:celTex(128,64,(x,W,H)=>{ x.fillStyle='#c79a5e'; x.fillRect(0,0,W,H); x.strokeStyle='#a87a44'; x.lineWidth=2; for(let k=0;k<7;k++){ x.beginPath(); x.moveTo(0,k*10+4); x.bezierCurveTo(W*0.3,k*10+8,W*0.6,k*10,W,k*10+5); x.stroke(); } x.fillStyle='#8f6435'; x.fillRect(0,H-9,W,9); })}),
      leather=toon({map:celTex(128,128,(x,W,H)=>{ x.fillStyle='#8a5230'; x.fillRect(0,0,W,H); x.fillStyle='#a06438'; x.fillRect(0,H*0.18,W,H*0.16); x.strokeStyle='#5e3620'; x.lineWidth=3; x.setLineDash([7,6]); x.beginPath(); x.moveTo(0,H*0.46); x.lineTo(W,H*0.46); x.stroke(); })}),
      strapM=toon({color:'#7a4526'}), brass=toon({color:'#d4ad5c'}), sock=toon({color:C.tights}), ball=new THREE.SphereGeometry(1,10,8);
    const sole=celDeform(new THREE.CylinderGeometry(1,1,1,22,1),v=>{ const back=clamp(-v.z,0,1), front=clamp(v.z,0,1); v.x*=0.047*(1-0.2*back*back); v.y=-0.036+(v.y+0.5)*(0.017+0.009*back)+0.006*front*front*front; v.z=v.z*0.083+0.026; });
    const vamp=celDeform(new THREE.SphereGeometry(1,18,10,0,Math.PI*2,0,Math.PI/2),v=>{ v.x*=0.0465; v.y=-0.018+v.y*0.037; v.z=v.z*0.056+0.052; if(v.z<0.02) v.z=0.02+(v.z-0.02)*0.25; });
    const heel=celDeform(new THREE.SphereGeometry(1,12,8),v=>{ v.x*=0.034; v.y=-0.004+v.y*0.02; v.z=v.z*0.05-0.004; });
    const strap=new THREE.TorusGeometry(o.legShape||o.legK?0.037:0.042,0.0065,6,26,Math.PI+1.1); strap.rotateZ(Math.PI-0.55); strap.rotateX(Math.PI/2); strap.scale(1.08,2.3,1.2); strap.rotateX(0.42); strap.translate(0,-0.006,0.004);   /* round the back of her ankle, higher behind, down to the upper at each side */
    return {wood,leather,strapM,brass,sock,ball,sole,vamp,heel,strap}; })():null;
  /* T-bar shoes in chestnut leather: a thin dark sole, a rounded toe cap and a heel counter with the foot showing between them, a
     strap across the instep, a second strap running from the toe up to meet it, and a small brass buckle on the outside */
  const tbar=o.tbar?(()=>{ const TB=o.tbarCol||'#93502b', leather=toon({map:celTex(128,128,(x,W,H)=>{ x.fillStyle=TB; x.fillRect(0,0,W,H); x.fillStyle=tint(TB,0.2); x.fillRect(0,H*0.2,W,H*0.14); x.strokeStyle=shade(TB,0.62); x.lineWidth=3; x.setLineDash([6,5]); x.beginPath(); x.moveTo(0,H*0.62); x.lineTo(W,H*0.62); x.stroke(); })}),
      strapM=toon({color:TB}), soleM=toon({color:shade(TB,0.42)}), brass=toon({color:'#d9b566'}), sock=toon({color:C.tights});
    const sole=celDeform(new THREE.CylinderGeometry(1,1,1,22,1),v=>{ const back=clamp(-v.z,0,1); v.x*=0.044*(1-0.16*back*back); v.y=-0.036+(v.y+0.5)*0.008; v.z=v.z*0.079+0.024; });
    const upper=celDeform(new THREE.SphereGeometry(1,20,10,0,Math.PI*2,0,Math.PI/2),v=>{ const zn=v.z, h=0.014+0.021*celSm(0.3,0.85,zn)+0.02*celSm(-0.35,-0.95,zn); v.x*=0.0425*(1-0.14*clamp(-zn,0,1)); v.y=-0.03+v.y*h; v.z=zn*0.077+0.024; });
    const foot=celDeform(new THREE.SphereGeometry(1,12,8),v=>{ v.x*=0.032; v.y=-0.013+v.y*0.017; v.z=v.z*0.052+0.014; });
    const across=new THREE.TorusGeometry(0.0365,0.0052,6,16,Math.PI); across.scale(1,0.8,1.9); across.translate(0,-0.03,0.043);
    return {leather,strapM,soleM,brass,sock,sole,upper,foot,across,box:new THREE.BoxGeometry(1,1,1)}; })():null;
  const legs=[-1,1].map(s=>{ const piv=new THREE.Group(); piv.position.set(s*(o.legX||0.08),hipY,0); g.add(piv);
    const th=new THREE.CylinderGeometry(0.05,0.05,A,14,o.legShape?6:1,true); th.translate(0,-A/2,0); if(o.legK) th.scale(o.legK,1,o.legK);
    if(o.legShape) celDeform(th,v=>{ const t=-v.y/A, r=(0.057-0.012*t+0.003*Math.sin(Math.PI*t))/0.05; v.x*=r; v.z*=r; });   /* a thigh that narrows to the knee */ hi.thighs.push(celM(th,thighMat,0,0,0,piv,0.004));
    const knee=new THREE.Group(); knee.position.y=-A; piv.add(knee); celM(new THREE.SphereGeometry((o.legShape?0.0462:0.0505)*(o.legK||1),12,8),toon({color:C.tights}),0,0,0,knee);
    const sh=new THREE.CylinderGeometry(boots?0.056:0.05,boots?0.046:0.04,B,14,o.legShape?8:1,true); sh.translate(0,-B/2,0); if(s<0) sh.rotateY(Math.PI); if(o.legK) sh.scale(o.legK,1,o.legK);
    if(o.legShape) celDeform(sh,v=>{ const t=-v.y/B, calf=0.0075*Math.exp(-Math.pow((t-0.3)/0.22,2)), r0=0.05-0.01*t, r=0.0445+(0.031-0.0445)*celSm(0.3,1,t)+calf*0.5; v.x*=r/r0; v.z=v.z*r/r0-calf*0.75; });   /* a calf that swells at the back and tapers to a slim ankle */ hi.shins.push(celM(sh,shinMat,0,0,0,knee,0.004));
    const foot=new THREE.Group(); foot.position.y=-B; knee.add(foot);
    if(clog){ celM(clog.heel,clog.sock,0,0,0,foot,0.003); celM(clog.sole,clog.wood,0,0,0,foot,0.004); celM(clog.vamp,clog.leather,0,0,0,foot,0.004); celM(clog.strap,clog.strapM,0,0,0,foot,0.003);
      const bits=[]; for(let k=0;k<5;k++) [-1,1].forEach(q=>{ const a=0.55+k*0.5; bits.push([clog.ball,celAt(q*Math.sin(a)*0.0465,-0.0155,0.052+Math.cos(a)*0.056,0,0,0,0.0042)]); });
      bits.push([new THREE.BoxGeometry(1,1,1),celAt(s*(o.legShape||o.legK?0.0425:0.048),-0.004,0.002,0.42,0,0,0.006,0.02,0.017)]); foot.add(new THREE.Mesh(celMerge(bits),clog.brass)); }
    else if(tbar){ celM(tbar.foot,tbar.sock,0,0,0,foot); celM(tbar.sole,tbar.soleM,0,0,0,foot,0.0035); celM(tbar.upper,tbar.leather,0,0,0,foot,0.004); celM(tbar.across,tbar.strapM,0,0,0,foot,0.003);
      celM(celMerge([[tbar.box,celAt(0,-0.0045,0.064,0.2,0,0,0.0115,0.0052,0.046)]]),tbar.strapM,0,0,0,foot,0.003);   /* the bar of the T, from the toe cap up to the strap */
      foot.add(new THREE.Mesh(celMerge([[tbar.box,celAt(s*0.0345,-0.014,0.043,0,0,s*-0.3,0.0045,0.012,0.013)]]),tbar.brass)); }
    else celM(shoeGeo,shoe,0,0,0.03,foot,0.004);
    if(boots) celM(new THREE.BoxGeometry(0.056,0.026,0.042),toon({color:C.bootDeep}),0,-0.03,-0.045,foot);
    else if(o.legs!=='trousers'&&!clog&&!tbar){ const st=celM(new THREE.TorusGeometry(0.046,0.008,5,14),shoe,0,0.02,0.012,foot); st.rotation.x=Math.PI/2-0.25; }   /* the strap of her shoe */
    if(o.adult){ foot.scale.setScalar(1.12); }
    hi.knees.push(knee); hi.feet.push(foot); return piv; });
  const upper=new THREE.Group(); upper.position.y=upY; g.add(upper);

  /* --- the dress, or the shirt: one shape from hem to collar, with everything else about it painted --- */
  const DP=shirt?[[0.128,-0.045],[0.14,-0.02],[0.14,0.04],[0.137,0.2],[0.134,0.33],[0.13,0.4],[0.114,0.452],[0.098,0.47],[0.082,0.482],[0.073,0.49]]
    :o.top==='long'?[[0.205,-0.2],[0.202,-0.175],[0.192,-0.04],[0.172,0.1],[0.146,0.2],[0.128,0.24],[0.116,0.262],[0.112,0.29],[0.118,0.33],[0.126,0.38],[0.125,0.42],[0.114,0.452],[0.098,0.47],[0.082,0.482],[0.073,0.49]]
    :[[0.19,-0.055],[0.187,-0.03],[0.176,0.08],[0.156,0.17],[0.128,0.24],[0.116,0.262],[0.112,0.29],[0.118,0.33],[0.126,0.38],[0.125,0.42],[0.114,0.452],[0.098,0.47],[0.082,0.482],[0.073,0.49]];
  const hemY=DP[0][1];
  const dressTex=celTex(1024,1024,(x,W,H)=>{ const Y=y=>(1-vOf(DP,y))*H, Xa=a=>(0.5+a/(Math.PI*2))*W; x.lineJoin=x.lineCap='round';
    x.fillStyle=C.dress; x.fillRect(0,0,W,H);
    if(!shirt){ const yW=Y(0.252), yH=Y(hemY);
      for(let k=0;k<16;k++){ const X0=(k+0.5)/16*W; x.fillStyle=C.dressDeep; x.beginPath(); x.moveTo(X0,yW+(yH-yW)*0.12); x.lineTo(X0+26,yH); x.lineTo(X0-2,yH); x.closePath(); x.fill();   /* box pleats */
        x.strokeStyle=C.dressLine; x.lineWidth=3; x.beginPath(); x.moveTo(X0+1,yW); x.lineTo(X0-2,yH); x.stroke(); }
      x.fillStyle=C.cream; x.fillRect(0,Y(hemY+0.019),W,yH-Y(hemY+0.019)+4); x.fillStyle=C.dressLine; x.fillRect(0,Y(hemY+0.019)-3,W,3); }   /* the white hem */
    else { x.strokeStyle=C.dressDeep; x.lineWidth=5; [-14,14].forEach(d=>{ x.beginPath(); x.moveTo(Xa(0)+d,Y(0.45)); x.lineTo(Xa(0)+d,Y(0)); x.stroke(); });   /* the shirt's front placket */
      const b0=Y(0.012), b1=Y(-0.03); x.fillStyle='#5a4030'; x.fillRect(0,b0,W,b1-b0); x.fillStyle=INK; x.fillRect(0,b0-2,W,3); x.fillStyle=C.tights; x.fillRect(0,b1,W,H-b1);   /* tucked in at a belt, over trousers */
      x.fillStyle=C.brass; x.strokeStyle=INK; x.lineWidth=3; x.beginPath(); x.rect(Xa(0)-22,b0-3,44,b1-b0+6); x.fill(); x.stroke(); }
    if(o.seams) [-1,1].forEach(s=>{ x.strokeStyle=C.dressDeep; x.lineWidth=5; x.beginPath(); x.moveTo(Xa(s*0.55),Y(0.29)); x.quadraticCurveTo(Xa(s*0.56),Y(0.38),Xa(s*0.43),Y(0.46)); x.stroke(); });
    if(o.waist==='belt'){ const b0=Y(0.292), b1=Y(0.25); x.fillStyle=C.leather; x.fillRect(0,b0,W,b1-b0); x.fillStyle=INK; x.fillRect(0,b0-2,W,3); x.fillRect(0,b1-1,W,3);
      x.fillStyle='#e8d9b8'; for(let k=0;k<64;k++){ x.fillRect(k*16+3,b0+7,9,3); x.fillRect(k*16+3,b1-11,9,3); }
      x.fillStyle=C.brass; [0.6,-0.6,2.4,-2.4].forEach(a=>{ x.beginPath(); x.arc(Xa(a),(b0+b1)/2,6,0,7); x.fill(); });
      x.fillStyle=C.brass; x.strokeStyle=INK; x.lineWidth=3; x.beginPath(); x.rect(Xa(0)-24,b0-6,48,b1-b0+12); x.fill(); x.stroke(); x.fillStyle=C.leatherDeep; x.fillRect(Xa(0)-13,b0+5,26,b1-b0-10); }
    else if(o.waist==='sash'){ const b0=Y(0.298), b1=Y(0.256); x.fillStyle=C.ribbon; x.fillRect(0,b0,W,b1-b0); x.fillStyle=shade(C.ribbon,0.72); x.fillRect(0,b0-2,W,3); x.fillRect(0,b1-1,W,3); x.fillRect(0,(b0+b1)/2-1,W,2); }
    if(o.pocket){ const px=Xa(0.5), y0=Y(0.19), y1=Y(0.1), w=92; x.fillStyle='#f2c230'; x.strokeStyle=INK; x.lineWidth=3; x.beginPath(); x.rect(px-18,y0-34,36,60); x.fill(); x.stroke(); x.fillStyle='#c44f3f'; x.fillRect(px-18,y0-16,36,14);   /* a snack pocket, with one of the nine peeking out */
      x.fillStyle=C.pocket; x.strokeStyle=C.dressLine; x.lineWidth=4; x.beginPath(); x.moveTo(px-w/2,y0); x.lineTo(px+w/2,y0); x.lineTo(px+w/2,y1-14); x.quadraticCurveTo(px+w/2,y1,px+w/2-14,y1); x.lineTo(px-w/2+14,y1); x.quadraticCurveTo(px-w/2,y1,px-w/2,y1-14); x.closePath(); x.fill(); x.stroke();
      x.strokeStyle=C.cream; x.lineWidth=4; x.setLineDash([8,7]); x.beginPath(); x.moveTo(px-w/2+8,y0+9); x.lineTo(px+w/2-8,y0+9); x.stroke(); x.setLineDash([]); }
    if(o.hipPockets) [-1,1].forEach(s=>{ const px=Xa(s*1.5), py=Y(0.13); x.fillStyle=C.pocket; x.strokeStyle=C.dressLine; x.lineWidth=4; x.beginPath(); x.moveTo(px-50,py-26); x.quadraticCurveTo(px-52,py+52,px,py+56); x.quadraticCurveTo(px+52,py+52,px+50,py-26); x.closePath(); x.fill(); x.stroke();
      x.strokeStyle=C.cream; x.lineWidth=9; x.beginPath(); x.moveTo(px-50,py-26); x.quadraticCurveTo(px,py-8,px+50,py-26); x.stroke(); });   /* a pocket at each hip, with a white welt along its mouth */
    if(o.moon){ for(let i=0;i<9;i++){ const a=i/9*Math.PI*2+0.35-Math.PI; paintStar(x,Xa(a),Y(0.0+(i%2)*0.07),13+(i%3)*3,'#ffe9a0'); } paintStar(x,Xa(0),Y(0.418),17,'#ffe9a0'); }   /* little stars scattered round her skirt, and one at her collar */
    (shirt?[0.4,0.33,0.26,0.19,0.12]:o.moon?[0.375,0.33]:[0.425,0.375,0.325]).forEach(y=>{ x.fillStyle=C.cream; x.strokeStyle=C.dressLine; x.lineWidth=3; x.beginPath(); x.arc(Xa(0),Y(y),shirt?8:10,0,7); x.fill(); x.stroke(); });   /* buttons */
    if(shirt) [-1,1].forEach(s=>{ x.fillStyle=tint(C.dress,0.4); x.strokeStyle=C.dressLine; x.lineWidth=4; x.beginPath(); x.moveTo(Xa(0)+s*8,Y(0.49)); x.lineTo(Xa(0)+s*150,Y(0.49)); x.lineTo(Xa(0)+s*112,Y(0.452)); x.lineTo(Xa(0)+s*14,Y(0.43)); x.closePath(); x.fill(); x.stroke(); });   /* a shirt collar, in two points */
    else [-1,1].forEach(s=>{ x.fillStyle=C.cream; x.strokeStyle=C.dressLine; x.lineWidth=4; x.beginPath(); x.ellipse(Xa(0)+s*95,Y(0.482),101,Y(0.461)-Y(0.482),0,0,7); x.fill(); x.stroke(); }); });   /* a Peter Pan collar */
  const dress=new THREE.Group(); upper.add(dress);
  { const dg=celLathe(DP,44); celDeform(dg,v=>{ v.z*=0.94; if(o.posture){ const k=celSm(0.27,0.41,v.y)*(1-0.8*celSm(0.44,0.485,v.y)); if(v.z<0) v.z*=1-0.36*k; else v.z*=1+0.06*k; v.z-=0.004*k; } });   /* (posture: a straighter upper back rising to the neck, instead of a round one that reads as a hump) */ const dm=celM(dg,toon({map:dressTex}),0,0,0,dress,0.005); let um=null, under=null;
    if(shirt) celM(new THREE.SphereGeometry(0.128,14,8),toon({color:C.tights}),0,-0.045,0,dress).scale.set(1,0.5,0.94);   /* the seat of his trousers */
    else { under=new THREE.CircleGeometry(DP[0][0]-0.004,32); under.rotateX(Math.PI/2); um=celM(under,toon({color:C.under||'#d6e6cd',side:THREE.DoubleSide}),0,hemY+0.005,0,dress); um.scale.z=0.94; }
    if(o.skirtPhys&&um){ const np=DP.length, base=dg.attributes.position.array.slice(), ub=under.attributes.position.array.slice(), ang=i=>Math.atan2(base[i*np*3],base[i*np*3+2]), link=[];
      for(let k=0;k<under.attributes.position.count;k++){ const x=ub[k*3], z=ub[k*3+2]*0.94; if(Math.hypot(x,z)<0.01){ link.push(-1); continue; } const a=Math.atan2(x,z); let best=0, bd=9; for(let i=0;i<44;i++){ let d=Math.abs(ang(i)-a); if(d>Math.PI) d=Math.PI*2-d; if(d<bd){ bd=d; best=i; } } link.push(best); }
      X.skirt={mesh:dm,geo:dg,base,np,seg:44,hem:DP[0][1],top:0.24,um,ug:under,link,q:new THREE.Vector3(),v:new THREE.Vector3(),ready:false,W:new Float32Array(base.length),E:new Float32Array(base.length),E2:new Float32Array(base.length)}; } X.dm=dm; X.um=um; X.ug=under; }
  celM(new THREE.CylinderGeometry(0.062,0.076,0.09,12),skin,0,0.49,0,upper);
  if(o.waist==='sash'){ const ball=new THREE.SphereGeometry(1,10,8), parts=[]; [-1,1].forEach(s=>{ parts.push([ball,celAt(s*0.05,0.292,-0.125,0,0,s*0.35,0.058,0.046,0.018)],[ball,celAt(s*0.032,0.215,-0.14,0.25,0,s*-0.25,0.026,0.07,0.01)]); }); parts.push([ball,celAt(0,0.288,-0.132,0,0,0,0.022)]);
    X.bow=celM(celMerge(parts),toon({color:C.ribbon}),0,0,0,upper,0.003); }   /* the sash is tied in a bow behind */
  if(o.witch){
/*__GEAR__*/
    X.sheath=sheath; X.bag=bag; X.bagMouth=bagMouth; }

  /* --- arms: a puffed sleeve with a cuff, an arm that bends at the elbow, a mitten of a hand --- */
  const sleeveMat=toon({map:celTex(64,64,(x,W,H)=>{ x.fillStyle=C.dress; x.fillRect(0,0,W,H); x.fillStyle=shirt?tint(C.dress,0.4):C.cream; x.fillRect(0,H*0.8,W,H); x.fillStyle=C.dressLine; x.fillRect(0,H*0.8-2,W,2); })});
  const arms=[-1,1].map(s=>{ const piv=new THREE.Group(); piv.position.set(s*0.125,0.435,o.posture?-0.022:0); upper.add(piv);   /* (posture: shoulders set back) */
    const sl=celM(new THREE.SphereGeometry(0.063,14,10),sleeveMat,0,-0.03,0,piv,0.004); sl.scale.y=0.92; if(shirt){ sl.scale.set(0.84,1.5,0.84); sl.position.y=-0.05; }
    const ua=new THREE.CylinderGeometry(0.036,0.032,0.13,10,1,true); ua.translate(0,-0.125,0); celM(ua,skin,0,0,0,piv,0.0035);
    const elbow=new THREE.Group(); elbow.position.y=-0.19; piv.add(elbow); celM(new THREE.SphereGeometry(0.032,10,8),skin,0,0,0,elbow);
    const fa=new THREE.CylinderGeometry(0.0315,0.026,0.125,10,1,true); fa.translate(0,-0.0625,0); celM(fa,skin,0,0,0,elbow,0.0035);
    const hand=new THREE.Group(); hand.position.y=-0.135; elbow.add(hand); if(o.armK){ piv.scale.y=o.armK; hand.scale.y=1/o.armK; }   /* (armK: longer arms, with the hand kept its own size) */
    celM(celDeform(new THREE.SphereGeometry(0.04,12,10),v=>{ v.x*=0.62; v.y=v.y*1.25-0.012; v.z*=0.92; }),skin,0,0,0,hand,0.0035); celM(new THREE.SphereGeometry(0.013,8,6),skin,s*-0.012,-0.012,0.036,hand);
    hi.elbows.push(elbow); hi.hands.push(hand); return piv; });

  /* --- winter things. The girls' parkas are the ones from the trail: a puffy quilted bell over the dress with a fur hem, a fur strip
         and wooden toggles down the front, a fur collar, the hood folded down behind the neck, long sleeves with fur cuffs, and mittens.
         Dad's is a heavy brown wool coat to mid-thigh: wide lapels, two rows of buttons, a belt, flap pockets, a turned-up collar.
         Either one takes over as the cloth that moves, in place of the skirt. --- */
  if(o.coat){ const parka=o.coat==='parka', mink=o.coat==='mink', CC=o.coatCol||(mink?'#fbf7f0':parka?'#d9506e':'#7a5234'), CD=shade(CC,0.74), CH=tint(CC,0.16), FUR='#fff6ec', seg=44;
    const CP=parka?[[0.21,-0.062],[0.212,-0.04],[0.2,0.08],[0.182,0.17],[0.162,0.24],[0.152,0.29],[0.15,0.34],[0.152,0.39],[0.146,0.425],[0.128,0.455],[0.105,0.474],[0.085,0.487],[0.074,0.494]]
      :mink?[[0.228,-0.215],[0.23,-0.19],[0.218,-0.04],[0.198,0.1],[0.178,0.2],[0.166,0.27],[0.162,0.34],[0.164,0.39],[0.156,0.425],[0.134,0.455],[0.108,0.474],[0.088,0.487],[0.076,0.494]]
      :[[0.178,-0.22],[0.18,-0.19],[0.172,-0.05],[0.164,0.1],[0.16,0.25],[0.162,0.35],[0.156,0.41],[0.132,0.455],[0.105,0.476],[0.086,0.49]];
    const np=CP.length, rAt=y=>{ for(let k=0;k<np-1;k++) if(y>=CP[k][1]&&y<=CP[k+1][1]){ const f=(y-CP[k][1])/(CP[k+1][1]-CP[k][1]); return CP[k][0]+(CP[k+1][0]-CP[k][0])*f; } return CP[0][0]; };
    const tex=celTex(1024,512,(x,W,H)=>{ const Y=y=>(1-vOf(CP,y))*H, Xa=a=>(0.5+a/(Math.PI*2))*W; x.fillStyle=CC; x.fillRect(0,0,W,H); x.lineCap='round';
      if(mink){ /* Mom's white mink: long pelts running top to hem, each with a soft shadow down its seam, and the fur brushed downward in fine strokes */
        for(let k=0;k<22;k++){ const x0=(k+0.5)/22*W; x.fillStyle='#ebe4d8'; x.fillRect(x0-3,0,6,H); x.fillStyle='#ffffff'; x.fillRect(x0+10,0,12,H); }
        x.lineWidth=2; for(let k=0;k<3200;k++){ const px=Math.random()*W, py=Math.random()*H, l=8+Math.random()*12; x.strokeStyle=k%3?'#e6dfd2':'#ffffff'; x.beginPath(); x.moveTo(px,py); x.lineTo(px+(Math.random()-0.5)*4,py+l); x.stroke(); }
        x.strokeStyle='#d5ccbc'; x.lineWidth=5; x.beginPath(); x.moveTo(Xa(0.05),Y(0.36)); x.lineTo(Xa(0.05),H); x.stroke();   /* where it wraps over at the front */
        x.fillStyle='#e4dccf'; x.beginPath(); x.moveTo(0,H); for(let k=0;k<=140;k++) x.lineTo(k/140*W,H-7+(k%2?-4:3)); x.lineTo(W,H); x.closePath(); x.fill(); }
      else if(parka){ for(let y=0.03;y<0.44;y+=0.064){ x.fillStyle=CH; x.fillRect(0,Y(y)+4,W,7); x.fillStyle=CD; x.fillRect(0,Y(y)-2,W,5); }   /* quilted rolls */
        x.strokeStyle=CD; x.lineWidth=5; [-1,1].forEach(q=>{ x.beginPath(); x.moveTo(Xa(q*0.75)-q*30,Y(0.17)); x.lineTo(Xa(q*0.75)+q*26,Y(0.09)); x.stroke(); });   /* slanted pockets */
        x.fillStyle=FUR; x.fillRect(Xa(0)-13,Y(0.47),26,H);                                                    /* the fur strip down the front */
        x.beginPath(); x.moveTo(0,H); for(let k=0;k<=120;k++) x.lineTo(k/120*W,Y(-0.03)+(k%2?-4:3)); x.lineTo(W,H); x.closePath(); x.fill(); }   /* the fur hem */
      else { for(let k=0;k<1400;k++){ x.fillStyle=k%2?shade(CC,0.88):tint(CC,0.08); x.fillRect(Math.random()*W,Math.random()*H,3,2); }   /* the nap of the wool */
        x.fillStyle=shade(CC,0.6); x.fillRect(0,H-9,W,9);
        x.strokeStyle=CD; x.lineWidth=5; x.beginPath(); x.moveTo(Xa(0.11),Y(0.36)); x.lineTo(Xa(0.11),H); x.stroke();                /* where the front laps over */
        [-1,1].forEach(q=>{ x.fillStyle=CD; x.strokeStyle=shade(CC,0.5); x.lineWidth=4; x.beginPath(); x.moveTo(Xa(0.05),Y(0.34)); x.lineTo(Xa(q*0.5),Y(0.455)); x.lineTo(Xa(q*0.16),Y(0.492)); x.closePath(); x.fill(); x.stroke();   /* lapels */
          x.strokeStyle=CD; x.lineWidth=5; x.strokeRect(Xa(q*0.85)-36,Y(0.03),72,26); x.fillStyle=CD; x.fillRect(Xa(q*0.85)-36,Y(0.03),72,9); });   /* flap pockets */
        { const b0=Y(0.24), b1=Y(0.205); x.fillStyle=shade(CC,0.58); x.fillRect(0,b0,W,b1-b0); x.fillStyle='#c9a45c'; x.fillRect(Xa(0.05)-17,b0-3,34,b1-b0+6); x.fillStyle=shade(CC,0.58); x.fillRect(Xa(0.05)-9,b0+3,18,b1-b0-6); }   /* a belt and its buckle */
        [0.31,0.15,0.07].forEach(y=>[-0.13,0.3].forEach(a=>{ x.fillStyle='#3b2616'; x.beginPath(); x.arc(Xa(a),Y(y),11,0,7); x.fill(); x.fillStyle='#6b4a30'; x.beginPath(); x.arc(Xa(a)-3,Y(y)-3,4,0,7); x.fill(); })); } });   /* two rows of buttons */
    const cg=celLathe(CP,seg); celDeform(cg,v=>{ v.z*=0.94; }); const cm=celM(cg,toon({map:tex}),0,0,0,dress,0.005);
    /* over her coat Michelle's foraging things go on her back: a leather strap over one shoulder and across her chest to the other hip,
       with the bark pouch hung from it behind one shoulder blade and the hori-hori in its sheath slung slantwise behind the other */
    if(o.witch&&X.bag){ const R=y=>rAt(y)+0.009, yAt=t=>0.357+0.113*Math.cos(t-Math.PI/2), pts=[]; for(let k=0;k<40;k++){ const t=k/40*Math.PI*2, y=yAt(t); pts.push(new THREE.Vector3(Math.sin(t)*R(y),y,Math.cos(t)*R(y)*0.94)); }
      celM(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),80,0.0105,6,true),toon({color:C.leather}),0,0,0,upper,0.003);
      celM(new THREE.BoxGeometry(0.03,0.022,0.012),toon({color:C.brass}),Math.sin(0.55)*R(yAt(0.55)),yAt(0.55),Math.cos(0.55)*R(yAt(0.55))*0.94+0.004,upper,0.002).rotation.set(0,0.55,0.6);   /* its buckle, on her chest */
      { const a=Math.PI+0.5, y=yAt(a)+0.012, r=R(y)-0.002; X.bag.position.set(Math.sin(a)*r,y,Math.cos(a)*r*0.94); X.bag.rotation.set(-0.1,a,0); }
      { const a=Math.PI-0.5, y=yAt(a)+0.05, r=R(y)+0.014; X.sheath.position.set(Math.sin(a)*r+0.03,y,Math.cos(a)*r*0.94); X.sheath.rotation.set(0.05,a,0.42); } }
    if((parka||mink)&&X.dm) X.dm.visible=false; if(X.bow) X.bow.visible=false;   /* the dress, and a sash's bow, are inside the coat */
    if(o.skirtPhys){ const base=cg.attributes.position.array.slice(), link=[];
      if(X.um){ const ub=X.ug.attributes.position.array, ang=i=>Math.atan2(base[i*np*3],base[i*np*3+2]); for(let k=0;k<X.ug.attributes.position.count;k++){ const x=ub[k*3], z=ub[k*3+2]*0.94; if(Math.hypot(x,z)<0.01){ link.push(-1); continue; } const a=Math.atan2(x,z); let best=0, bd=9; for(let i=0;i<seg;i++){ let d=Math.abs(ang(i)-a); if(d>Math.PI) d=Math.PI*2-d; if(d<bd){ bd=d; best=i; } } link.push(best); } }
      X.skirt={mesh:cm,geo:cg,base,np,seg,hem:CP[0][1],top:parka?0.24:mink?0.2:0.17,um:X.um||null,ug:X.ug||null,link,q:new THREE.Vector3(),v:new THREE.Vector3(),ready:false,W:new Float32Array(base.length),E:new Float32Array(base.length),E2:new Float32Array(base.length)}; }
    if(mink){ const fm=toon({color:'#ffffff'}), b=new THREE.SphereGeometry(1,12,9), parts=[];   /* a deep shawl collar: a thick roll of fur round her neck running down into two soft lapels that cross at her chest */
      const roll=celM(new THREE.TorusGeometry(0.094,0.04,9,24),fm,0,0.482,-0.006,upper,0.004); roll.rotation.x=Math.PI/2; roll.scale.set(1.08,1.02,1.25);
      [-1,1].forEach(q=>{ for(let k=0;k<4;k++){ const y=0.455-k*0.043, r=rAt(y)*0.94; parts.push([b,celAt(q*(0.066-k*0.015),y,r*0.9+0.008,0.25,0,q*0.3,0.036-k*0.003,0.058,0.026)]); } });
      celM(celMerge(parts),fm,0,0,0,upper,0.004); }
    else if(parka){ celM(new THREE.TorusGeometry(0.083,0.027,8,22),toon({color:FUR}),0,0.492,0.002,upper,0.0035).rotation.x=Math.PI/2;
      const hd=celM(celDeform(new THREE.SphereGeometry(1,16,12),v=>{ v.x*=0.135; v.y*=0.07; v.z*=0.085; }),toon({color:CC}),0,0.452,-0.125,upper,0.004);
      const rim=celM(new THREE.TorusGeometry(0.095,0.026,8,20),toon({color:FUR}),0,0.487,-0.108,upper,0.0035); rim.scale.set(1.15,0.8,1); rim.rotation.x=Math.PI/2-0.45;
      /* the hood can be worn up: a deep hood round her head, open at the front with its fur rim framing her face. It is made the first time it is wanted. Pigtails, buns and a hat go inside or come off. */
      let hoodUp=null, hairOrig=null; X.setHood=up=>{ if(up&&!hoodUp){ hoodUp=new THREE.Group(); hoodUp.position.set(0,0.18,-0.012); X.head.add(hoodUp);
          const hg=celLathe([[0.001,-0.27],[0.09,-0.262],[0.17,-0.225],[0.225,-0.16],[0.25,-0.07],[0.252,0.02],[0.235,0.09],[0.212,0.13]],28); hg.rotateX(Math.PI/2); celDeform(hg,v=>{ v.x*=0.93; if(v.y<0) v.y*=1.22; });
          celM(hg,toon({color:CC,side:THREE.DoubleSide}),0,0,0,hoodUp,0.0045); const fr=celM(new THREE.TorusGeometry(0.207,0.032,9,30),toon({color:FUR}),0,-0.022,0.128,hoodUp,0.004); fr.scale.set(0.93,1.11,1); }
        if(hoodUp) hoodUp.visible=up; hd.visible=rim.visible=!up; X.sway.forEach(q=>q.visible=!up); if(X.setHat) X.setHat(X.hatOn,up); if(X.moon) X.moon.visible=!up;
        /* with the hood up her hair is tucked inside it: nothing hangs out of the bottom, bulges through the sides, or pushes past the fur rim */
        const hp=hairGeo.attributes.position, H=X.hairPhys;
        if(up){ let src; if(X.setHat) src=H.base; else { if(!hairOrig) hairOrig=(H&&H.base)||hp.array.slice(); src=hairOrig; }
          const tk=new Float32Array(src); for(let i=0;i<tk.length;i+=3){ let x=tk[i], y=tk[i+1], z=tk[i+2]; if(y<-0.03) y=-0.03; let dy=y-0.18;
            const L=Math.hypot(x/0.93,dy/(dy<0?1.22:1),z), R=0.228; if(L>R){ const k=R/L; x*=k; dy*=k; z*=k; }
            if(z>0.07){ const r=Math.hypot(x/0.93,dy/1.11), lim=0.16+0.03*celSm(0.115,0.07,z); if(r>lim){ const k=lim/r; x*=k; dy*=k; } }
            tk[i]=x; tk[i+1]=dy+0.18; tk[i+2]=z; }
          hp.array.set(tk); hp.needsUpdate=true; hairGeo.computeVertexNormals(); if(H){ H.base=tk; H.ready=false; } }
        else if(hairOrig){ hp.array.set(hairOrig); hp.needsUpdate=true; hairGeo.computeVertexNormals(); if(H){ H.base=hairOrig; H.ready=false; } hairOrig=null; } };
      [0.37,0.28,0.19].forEach(y=>{ celM(new THREE.CylinderGeometry(0.011,0.011,0.036,8),toon({color:'#8a5a3c'}),0.028,y,rAt(y)*0.94+0.007,upper,0.0025).rotation.z=Math.PI/2; }); }
    else { const col=celM(new THREE.TorusGeometry(0.087,0.024,8,22),toon({color:CD}),0,0.49,-0.004,upper,0.0035); col.rotation.x=Math.PI/2; col.scale.set(1.04,1.04,1.7); }
    const slM=mink?toon({map:celTex(64,128,(x,W,H)=>{ x.fillStyle=CC; x.fillRect(0,0,W,H); x.lineWidth=2; for(let k=0;k<260;k++){ const px=Math.random()*W, py=Math.random()*H; x.strokeStyle=k%3?'#e6dfd2':'#ffffff'; x.beginPath(); x.moveTo(px,py); x.lineTo(px,py+10); x.stroke(); } })}):parka?toon({map:celTex(64,128,(x,W,H)=>{ x.fillStyle=CC; x.fillRect(0,0,W,H); for(let y=14;y<H;y+=30){ x.fillStyle=CH; x.fillRect(0,y+3,W,5); x.fillStyle=CD; x.fillRect(0,y,W,4); } })}):toon({color:CC}), plain=toon({color:CC}), dark=toon({color:CD});
    arms.forEach((piv,j)=>{ const sl=piv.children[0], el=hi.elbows[j], h=hi.hands[j]; sl.material=plain; sl.scale.set(1,shirt?1.25:1.12,1); sl.position.y=shirt?-0.04:-0.03;
      const ug=new THREE.CylinderGeometry(0.052,0.05,0.15,12,1,true); ug.translate(0,-0.12,0); celM(ug,slM,0,0,0,piv,0.004); celM(new THREE.SphereGeometry(0.05,10,8),plain,0,0,0,el);
      const fg=new THREE.CylinderGeometry(0.05,0.045,0.12,12,1,true); fg.translate(0,-0.058,0); celM(fg,slM,0,0,0,el,0.004);
      if(mink) celM(new THREE.TorusGeometry(0.043,0.026,8,18),toon({color:'#ffffff'}),0,-0.108,0,el,0.0035).rotation.x=Math.PI/2;   /* deep fur cuffs */
      else if(parka){ celM(new THREE.TorusGeometry(0.04,0.017,7,16),toon({color:FUR}),0,-0.118,0,el,0.003).rotation.x=Math.PI/2;
        celM(celDeform(new THREE.SphereGeometry(0.046,12,10),v=>{ v.x*=0.66; v.y=v.y*1.25-0.012; v.z*=0.95; }),dark,0,0,0,h,0.0035); celM(new THREE.SphereGeometry(0.016,8,6),dark,(j?1:-1)*-0.013,-0.012,0.04,h); }   /* mittens */
      else celM(new THREE.CylinderGeometry(0.053,0.053,0.032,12),dark,0,-0.104,0,el,0.003); }); }
  /* --- the head: a ball with the face painted on it, and the picture repainted for every expression --- */
  const head=new THREE.Group(); head.position.y=0.5; head.scale.setScalar(0.75*(o.headK||1)); upper.add(head);   /* (headK: this one's head, against everyone's usual size) */
  const fc=document.createElement('canvas'); fc.width=2048; fc.height=1024; const fx=fc.getContext('2d'), faceTex=new THREE.CanvasTexture(fc); faceTex.anisotropy=4; celTextures++;
  /* the test head: the ball is sculpted into a face. It keeps the ball's own picture coordinates, so the painted features still land
     where they did and simply follow the new surface: a skull that narrows through the cheeks to a small chin, a flatter face plane,
     shallow sockets for the eyes under a soft brow, round cheeks, and a nose that stands out from the face. */
  const headGeo=new THREE.SphereGeometry(0.2,72,56);
  if(o.sculpt){ const R=0.2, bump=(x,y,cx,cy,r)=>Math.exp(-((x-cx)*(x-cx)+(y-cy)*(y-cy))/(r*r));
    celDeform(headGeo,v=>{ const x=v.x, y=v.y, f=Math.max(0,v.z/R), ff=f*f, n=v.clone().normalize();
      const jaw=celSm(0.04,-0.2,y), low=celSm(-0.02,-0.2,y);
      v.x*=1-0.34*jaw*(0.55+0.45*f);                                   /* cheeks drawing in to the chin, more at the front than behind the ears */
      v.z*=1-0.1*low*(1-f);                                           /* the back of the jaw tucks in toward the neck */
      v.y-=0.02*low*ff*Math.max(0,1-Math.abs(x)/0.07);                 /* the chin comes down to a soft point */
      v.z+=0.012*low*ff*Math.max(0,1-Math.abs(x)/0.09);                /* ... and forward a little */
      v.z-=0.014*ff*celSm(-0.13,0.0,y)*celSm(0.13,0.02,y);             /* the face plane, flatter than a ball between brow and mouth */
      v.x*=1-0.045*celSm(0.0,0.09,y)*celSm(0.19,0.09,y)*(1-ff);        /* temples */
      let d=0; for(const sx of [-1,1]){ d+=0.015*bump(x,y,sx*0.094,-0.05,0.045);            /* cheeks */
        d-=0.013*bump(x,y,sx*0.072,0.014,0.038);                       /* eye sockets */
        d+=0.008*bump(x,y,sx*0.068,0.064,0.032); }                     /* brow */
      d+=0.02*bump(x,y,0,-0.027,0.018)+0.009*bump(x,y,0,0.0,0.015)+0.004*bump(x,y,0,0.03,0.016);   /* the nose, and its bridge */
      d-=0.004*bump(x,y,0,-0.058,0.018);                                /* the dip between nose and lip */
      d+=0.007*bump(x,y,0,-0.084,0.026)-0.004*bump(x,y,0,-0.112,0.02)+0.007*bump(x,y,0,-0.14,0.03);   /* lips, the dip under them, the chin */                                /* lips */
      if(v.z>0) v.addScaledVector(n,d*Math.min(1,f*3)); v.x*=0.9; }); }   /* and the whole head a tenth narrower */
  /* a sculpted face catches the hard shade band across its jaw and lip, which reads as stubble; it gets its own gentler bands of light */
  const faceRamp=o.sculpt?(()=>{ const t=new THREE.DataTexture(new Uint8Array([128,146,152]),3,1,THREE.LuminanceFormat); t.minFilter=t.magFilter=THREE.NearestFilter; t.needsUpdate=true; return t; })():celRamp;
  celM(headGeo,toon({map:faceTex,gradientMap:faceRamp}),0,0.17,0,head,0.0045);
  let faceKey=''; const setFace=(F,blink,talk)=>{ const tk=talk>0?Math.round(talk*5)/5+0.01:0, key=(F.id||'')+'|'+(blink===true?2:blink|0)+'|'+tk; if(key===faceKey) return; faceKey=key; paintFace(fx,2048,1024,o,C,F,{blink,talk:tk}); faceTex.needsUpdate=true; };
  if(o.ears) [-1,1].forEach(s=>{ celM(celDeform(new THREE.SphereGeometry(0.034,10,8),v=>{ v.x*=0.5; v.y*=1.15; }),skin,s*(o.sculpt?0.18:0.2),0.16,0,head,0.003); });

  /* --- hair: one shell over the head, falling as far as hers does. The opening for the face, the fringe along its top, the strands and the
         band of shine are in its picture; where the picture is clear there is no hair. --- */
  const HY0=o.hairTo, HY1=0.4068, HP=[]; for(let j=0;j<=30;j++){ const t=j/30, y=HY0+(HY1-HY0)*(1-(1-t)*(1-t));
    const r=y>0.17?0.226*Math.sqrt(Math.max(0,1-Math.pow((y-0.17)/0.237,2))):0.226+0.02*celSm(0.17,-0.02,y)+0.035*celSm(0,-0.13,y)*(HY0<-0.05?1:0); HP.push([r+(o.wavy?0.012*Math.sin(y*42+0.6)*celSm(0.26,0.12,y):0),y]); }
  const hairTex=celTex(1024,512,(x,W,H)=>{ const Y=y=>(1-vOf(HP,y))*H, Xa=a=>(0.5+a/(Math.PI*2))*W; x.lineJoin=x.lineCap='round';
    x.fillStyle=C.hair; x.fillRect(0,0,W,H);
    x.fillStyle=C.hairHi; x.beginPath(); for(let k=0;k<=64;k++) x.lineTo(k/64*W,Y(o.witch?0.2:0.3)+(k%2?-13:9)); for(let k=64;k>=0;k--) x.lineTo(k/64*W,Y(o.witch?0.2:0.3)+24+(k%2?13:-7)); x.closePath(); x.fill();   /* the band of shine round her head */
    x.strokeStyle=C.hairDeep; x.lineWidth=4; for(let k=0;k<34;k++){ const x0=(k+0.5)/34*W; x.beginPath(); for(let y=0;y<=H;y+=8){ const xx=x0+(o.wavy?10*Math.sin(y*0.05+k*1.7)*celSm(Y(0.26),Y(0.1),y):0); y?x.lineTo(xx,y):x.moveTo(xx,y); } x.stroke(); }   /* strands */
    const sd=o.sideCut, win=()=>{ x.beginPath();
      if(sd){ x.moveTo(Xa(-sd[0]),H+4); x.lineTo(Xa(-sd[0]),Y(sd[1])); x.lineTo(Xa(-0.98),Y(sd[1]+0.035)); x.lineTo(Xa(-0.9),Y(0.27)); } else { x.moveTo(Xa(-1.1),H+4); x.lineTo(Xa(-1.04),Y(-0.02)); x.quadraticCurveTo(Xa(-0.98),Y(0.12),Xa(-0.9),Y(0.28)); }
      o.fringe.forEach(([a,y])=>x.lineTo(Xa(a),Y(y)));
      if(sd){ x.lineTo(Xa(0.9),Y(0.27)); x.lineTo(Xa(0.98),Y(sd[1]+0.035)); x.lineTo(Xa(sd[0]),Y(sd[1])); x.lineTo(Xa(sd[0]),H+4); } else { x.lineTo(Xa(0.9),Y(0.27)); x.quadraticCurveTo(Xa(0.98),Y(0.12),Xa(1.04),Y(-0.02)); x.lineTo(Xa(1.1),H+4); } x.closePath(); };
    x.globalCompositeOperation='destination-out'; win(); x.fill(); x.globalCompositeOperation='source-over'; x.strokeStyle=C.hairDeep; x.lineWidth=6; win(); x.stroke();
    /* hair drawn back into ties: its lower edge is cut to a line that changes round the head (by angle from the front): a wisp left hanging before each ear, tight above the ears where it is gathered, dipping to the nape */
    if(o.cutLine||o.ragged){ const cl=o.cutLine||[[0,HY0],[3.1416,HY0]], baseY=a=>{ const b=Math.abs(a); for(let k=0;k<cl.length-1;k++) if(b<=cl[k+1][0]){ const f=clamp((b-cl[k][0])/(cl[k+1][0]-cl[k][0]),0,1), e=f*f*(3-2*f); return cl[k][1]+(cl[k+1][1]-cl[k][1])*e; } return cl[cl.length-1][1]; };
      /* uneven ends: the hair falls in locks of different lengths, each coming to its own soft point */
      const NL=46, rnd=i=>{ const v=Math.sin(i*12.9898+4.1)*43758.5453; return v-Math.floor(v); }, cutY=a=>{ const base=Math.max(baseY(a),HY0); if(!o.ragged) return base; const u=(a+Math.PI)/(Math.PI*2)*NL, i=Math.floor(u), f=u-i; return base+o.ragged*(0.2+rnd(i)*1.5+Math.pow(Math.abs(2*f-1),1.5)*1.1); };
      const cut=()=>{ x.beginPath(); x.moveTo(-4,H+8); for(let k=0;k<=552;k++){ const a=-Math.PI+k/552*Math.PI*2; x.lineTo(Xa(a),Y(cutY(a))); } x.lineTo(W+4,H+8); x.closePath(); };
      x.strokeStyle=C.hairDeep;
      x.lineWidth=13; cut(); x.stroke(); x.lineWidth=12; win(); x.stroke(); x.globalCompositeOperation='destination-out'; win(); x.fill(); cut(); x.fill(); x.globalCompositeOperation='source-over'; }
    if(o.locks){ x.globalCompositeOperation='destination-out'; [-1,1].forEach(q=>{ const xa=Xa(q*0.9), xb=Xa(q*1.4); x.fillRect(Math.min(xa,xb),Y(0.15),Math.abs(xb-xa),H); }); x.globalCompositeOperation='source-over'; }   /* the two front locks are their own pieces, so the shell is cut away where they hang */
    /* a shaped cut: chin length at the sides, sweeping down in soft layers to a rounded point at the back (the back is the picture's two ends) */
    if(o.back){ const cutY=a=>{ const b=Math.abs(a), k=Math.min(1,Math.max(0,(b-1.25)/(Math.PI-1.25))), e=k*k*(3-2*k); return o.back[0]+(o.back[1]-o.back[0])*(e*0.82+0.18*e*e)+0.014*e*(1-e)*4*Math.cos(b*9); };
      const cut=()=>{ x.beginPath(); x.moveTo(-4,H+8); for(let k=0;k<=128;k++){ const a=-Math.PI+k/128*Math.PI*2; x.lineTo(Xa(a),Y(cutY(a))); } x.lineTo(W+4,H+8); x.closePath(); };
      x.strokeStyle=C.hairDeep; x.lineWidth=13; cut(); x.stroke(); x.lineWidth=12; win(); x.stroke(); x.globalCompositeOperation='destination-out'; win(); x.fill(); cut(); x.fill(); x.globalCompositeOperation='source-over'; } });
  const hairFit=v=>{ if(o.snug){ v.x*=o.snug; v.z*=o.snug; v.y=0.17+(v.y-0.17)*(v.y>0.17?o.snug:1); }   /* (snug: short hair sitting close to the scalp instead of standing off it like a cap) */
    v.x*=o.sculpt?0.885:1.04; v.z*=0.93;
    if(o.sculpt){ const k=celSm(0.16,-0.035,v.y), e=celSm(0.03,-0.035,v.y), side=Math.abs(v.x)/0.2;   /* fitted to the sculpted head: close at the temples, falling in along the cheeks toward the jaw, the ends turning under */
      v.x*=1-0.1*k-0.05*e; if(v.z<0) v.z*=1-0.07*k-0.05*e; else v.z-=0.014*k*Math.min(1,side)+0.006*e; v.z-=0.006*celSm(0.2,0.3,v.y)*(v.z>0?1:0); } if(o.back&&v.y<-0.03){ const k=Math.min(1,(-0.03-v.y)/0.25), q=1-0.3*k*k; v.x*=q; v.z=v.z*q-0.02*k; }
    /* the back of her hair lies on her head: below the widest part of the skull it follows the curve of the head in and down to the nape of the neck, instead of hanging off it like a curtain. The sides are left to fall. */
    if(o.nape&&(v.z<0||o.snug)&&v.y<0.19){ const r=Math.hypot(v.x,v.z), w=(o.snug?1:celSm(0.2,0.75,-v.z/r))*celSm(0.19,0.12,v.y), dy=v.y-0.17, tr=(Math.max(0.09,Math.sqrt(Math.max(0,0.04-dy*dy)))+(o.snug?0.011:0.017))*(o.snug?1-0.08*Math.abs(v.x)/r:1); if(tr<r){ const k=(r+(tr-r)*w)/r; v.x*=k; v.z*=k; } } };
  const hairGeo=celLathe(HP,56); celDeform(hairGeo,hairFit); const hairMesh=celM(hairGeo,toon({map:hairTex,alphaTest:0.5,side:THREE.DoubleSide}),0,0,-0.012,head,0.0045,hairTex);
  if(o.hairPhys) X.hairPhys={geo:hairGeo,mesh:hairMesh,base:null,q:new THREE.Vector3(),v:new THREE.Vector3(),off:new THREE.Vector3(),ready:false};   /* (its resting shape is noted on the first step, once a hat has had its say) */
  /* the two locks that frame her face: each a ribbon of hair hung from the temple, tapering to its end, on a spring of its own */
  if(o.locks){ const rOf=y=>{ for(let j=0;j<HP.length-1;j++) if(y>=HP[j][1]&&y<=HP[j+1][1]){ const f=(y-HP[j][1])/(HP[j+1][1]-HP[j][1]||1); return HP[j][0]+(HP[j+1][0]-HP[j][0])*f; } return y<HP[0][1]?HP[0][0]:0.226; };
    const lockTex=celTex(64,128,(x,W,H)=>{ x.fillStyle=C.hair; x.fillRect(0,0,W,H); x.strokeStyle=C.hairDeep; x.lineWidth=4; [0.22,0.5,0.78].forEach(u=>{ x.beginPath(); x.moveTo(u*W,0); x.lineTo(u*W,H); x.stroke(); }); });
    X.locks=[-1,1].map((q,li)=>{ const NC=5, NR=12, yT=0.25, yB=-0.055, pos=[], uv=[], idx=[], v=new THREE.Vector3();
      for(let r=0;r<=NR;r++){ const f=r/NR, y=yT+(yB-yT)*f, hw=0.28*(1-0.32*f*f*f), ac=1.17; for(let c=0;c<=NC;c++){ const a=ac+(c/NC*2-1)*hw, R=rOf(Math.max(y,HP[0][1]))*(y>0.14?0.985:0.985+0.03*Math.min(1,(0.14-y)/0.05));   /* its top is tucked under the rest of her hair */ v.set(q*Math.sin(a)*R,y,Math.cos(a)*R); hairFit(v); pos.push(v.x,v.y,v.z); uv.push(c/NC,1-f); } }
      for(let r=0;r<NR;r++) for(let c=0;c<NC;c++){ const a=r*(NC+1)+c, b=a+1, d=a+NC+1, e=d+1; q>0?idx.push(a,d,b,b,d,e):idx.push(a,b,d,b,e,d); }
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2)); geo.setIndex(idx); geo.computeVertexNormals();
      const mesh=celM(geo,toon({map:lockTex,side:THREE.DoubleSide}),0,0,-0.012,head,0.004); const mid=Math.floor(NC/2), top=mid*3, bot=(NR*(NC+1)+mid)*3;
      return {geo,mesh,base:geo.attributes.position.array.slice(),root:new THREE.Vector3(pos[top],pos[top+1],pos[top+2]),tip:new THREE.Vector3(pos[bot],pos[bot+1],pos[bot+2]),yT:0.16,yB,q:new THREE.Vector3(),v:new THREE.Vector3(),ready:false,ph:li*2.3+0.7}; }); }
  const hairM=toon({color:C.hair}), ribbonM=toon({color:C.ribbon}), ballG=new THREE.SphereGeometry(1,12,9);
  /* June's two plaits: each a rope of plump links drawn from behind the ear forward over the shoulder to lie down her front, narrowing to its end, tied there with a ribbon bow above a little tuft */
  if(o.style==='braids') [-1,1].forEach(s=>{ const tp=new THREE.Group(); tp.position.set(s*0.168,0.1,-0.01); head.add(tp);
    const strand=celTex(64,64,(x,W,H)=>{ x.fillStyle=C.hair; x.fillRect(0,0,W,H); x.strokeStyle=C.hairDeep; x.lineWidth=4; for(let k=-2;k<6;k++){ x.beginPath(); x.moveTo(k*16,0); x.lineTo(k*16+26,H); x.stroke(); } x.fillStyle=C.hairHi; x.fillRect(0,H*0.3,W,7); });
    const at=u=>{ const a=[0,0,0], b=[-0.015,-0.1,0.17], c=[-0.055,-0.37,0.2], q=1-u; return [s*(q*q*a[0]+2*q*u*b[0]+u*u*c[0]),q*q*a[1]+2*q*u*b[1]+u*u*c[1],q*q*a[2]+2*q*u*b[2]+u*u*c[2]]; };
    const links=[], N=11; for(let k=0;k<N;k++){ const u=k/(N-1)*0.9, P=at(u), r=0.039*(1-0.4*u), side=k%2?1:-1; links.push([ballG,celAt(P[0]+side*0.008,P[1],P[2],0.35,0,side*0.55,r*1.05,r*0.8,r*0.92)]); }
    celM(celMerge(links),toon({map:strand}),0,0,0,tp,0.004);
    const E=at(0.93), T=at(1.03); celM(celMerge([[ballG,celAt(T[0],T[1]-0.012,T[2],0.2,0,0,0.02,0.034,0.02)]]),hairM,0,0,0,tp,0.0035);
    celM(celMerge([[ballG,celAt(E[0]-0.03,E[1],E[2]+0.012,0,0,-0.45,0.04,0.025,0.013)],[ballG,celAt(E[0]+0.03,E[1],E[2]+0.012,0,0,0.45,0.04,0.025,0.013)],[ballG,celAt(E[0],E[1],E[2]+0.018,0,0,0,0.015)]]),ribbonM,0,0,0,tp,0.003);
    X.sway.push(tp); });
  /* a flower clip holding her fringe back on its short side */
  if(o.clip==='flower'){ const a=0.86, fl=new THREE.Group(); fl.position.set(Math.sin(a)*0.187,0.262,Math.cos(a)*0.192); fl.rotation.set(-0.25,a,0.2); head.add(fl); const petals=[]; for(let k=0;k<5;k++){ const t=k/5*Math.PI*2; petals.push([ballG,celAt(Math.cos(t)*0.02,Math.sin(t)*0.02,0,0,0,t,0.016,0.012,0.006)]); }
    celM(celMerge(petals),ribbonM,0,0,0,fl,0.003); celM(new THREE.SphereGeometry(0.0095,8,6),toon({color:'#f08a4a'}),0,0,0.005,fl); }
  if(o.style==='pigtails') [-1,1].forEach(s=>{ const tp=new THREE.Group(); const TL=o.tails||{}; tp.position.set(s*(TL.x||(o.sculpt?0.178:0.2)),TL.y||0.19,TL.z===undefined?-0.03:TL.z); tp.scale.set(TL.w||0.7,TL.l||0.92,TL.w||0.7); head.add(tp);   /* (tails: where each pigtail is tied, how long and full it is, how far it splays) */   /* June: two long teardrops of hair, each tied with a bow */
    const strand=celTex(128,128,(x,W,H)=>{ x.fillStyle=C.hair; x.fillRect(0,0,W,H); x.strokeStyle=C.hairDeep; x.lineWidth=4; for(let k=0;k<9;k++){ x.beginPath(); x.moveTo((k+0.5)/9*W-8,0); x.lineTo((k+0.5)/9*W+8,H); x.stroke(); } x.fillStyle=C.hairHi; x.fillRect(0,H*0.3,W,10); });
    celM(celLathe([[0.002,-0.3],[0.03,-0.27],[0.07,-0.19],[0.082,-0.11],[0.06,-0.035],[0.03,0.0]],14),toon({map:strand}),s*0.02,-0.01,-0.005,tp,0.004).rotation.z=s*(TL.out===undefined?0.1:TL.out);
    celM(celMerge([[ballG,celAt(s*0.015-0.036,0.006,0.012,0,0,-0.5,0.052,0.032,0.016)],[ballG,celAt(s*0.015+0.036,0.006,0.012,0,0,0.5,0.052,0.032,0.016)],[ballG,celAt(s*0.015,0.004,0.02,0,0,0,0.019)],[ballG,celAt(s*0.015-0.018,-0.04,0.018,0,0,-0.3,0.016,0.045,0.006)],[ballG,celAt(s*0.015+0.018,-0.04,0.018,0,0,0.3,0.016,0.045,0.006)]]),ribbonM,0,0,0,tp,0.003);
    X.sway.push(tp); });
  (o.style==='bun'?[[0,0.37,-0.115,1,0]]:o.style==='buns'?[[-0.135,0.375,-0.03,0.6,0.45],[0.135,0.375,-0.03,0.6,-0.45]]:[]).forEach(([bx,by,bz,bk,br])=>{ const bun=new THREE.Group(); bun.position.set(bx,by,bz); bun.scale.setScalar(bk); bun.rotation.z=br; head.add(bun);   /* Pip and Lumi: a round bun wound in a spiral, held by a scrunchie */
    const spiral=celTex(256,128,(x,W,H)=>{ x.fillStyle=C.hair; x.fillRect(0,0,W,H); x.strokeStyle=C.hairDeep; x.lineWidth=5; for(let k=-4;k<10;k++){ x.beginPath(); x.moveTo(k*36,H); x.lineTo(k*36+110,0); x.stroke(); } x.fillStyle=C.hairHi; x.fillRect(0,H*0.26,W,9); });
    celM(new THREE.SphereGeometry(0.112,20,14),toon({map:spiral}),0,0,0,bun,0.0045).scale.y=0.94; const sc=celM(new THREE.TorusGeometry(0.082,0.027,7,22),ribbonM,0,-0.065,0.022,bun,0.003); sc.rotation.x=Math.PI/2-(bk<1?0:0.38);
    X.sway.push(bun); });
  if(o.moon){ const cr=X.moon=celM(new THREE.TorusGeometry(0.05,0.014,7,20,Math.PI*1.25),new THREE.MeshBasicMaterial({color:0xffe9a0}),0.19,0.3,0.1,head,0.003); cr.rotation.set(0,0.95,2.2); cr.scale.set(1.15,1.15,0.7); }   /* a crescent pinned in her hair */
  if(o.style==='mom') celM(new THREE.BoxGeometry(0.075,0.03,0.022),ribbonM,0.185,0.3,0.06,head,0.003).rotation.set(0,0.9,0.5);   /* a clip at one side */
  if(o.style==='dad'){ const gm=new THREE.MeshBasicMaterial({color:0x2e2433}), parts=[], ring=new THREE.TorusGeometry(0.052,0.008,5,20), bar=new THREE.CylinderGeometry(1,1,1,5);   /* round glasses */
    [-1,1].forEach(s=>{ parts.push([ring,celAt(s*0.074,0.182,0.196,0,s*0.3,0,1)],[bar,celAt(s*0.165,0.186,0.13,Math.PI/2,0,0,0.005,0.13,0.005)]); }); parts.push([bar,celAt(0,0.19,0.214,0,0,Math.PI/2,0.006,0.05,0.006)]); head.add(new THREE.Mesh(celMerge(parts),gm)); }
  if(o.witch){
    const hairFull=hairGeo.attributes.position.array.slice();   /* her whole head of hair, as it is before the hat presses it down */
/*__WITCH__*/
    X.hat=hat; X.pom=pom; X.rat=rat;
    /* the hat comes off: under it her hair is its full shape, rounded over the crown; with it on, the hair is pressed down beneath the brim */
    const hairHat=hairGeo.attributes.position.array.slice(); X.hatOn=true;
    X.setHat=(on,hooded)=>{ X.hatOn=on; const show=on&&!hooded; hat.visible=show; const src=show?hairHat:hairFull, p=hairGeo.attributes.position; p.array.set(src); p.needsUpdate=true; hairGeo.computeVertexNormals(); if(X.hairPhys){ X.hairPhys.base=src; X.hairPhys.ready=false; } }; }
  /* bedhead: her hair just out of bed. The whole head of it puffed up and pushed about in lumps, and tufts sticking up at the crown, in her hair's own colour with an ink line. setBedhead(true) puts it on, setBedhead(false) combs it out again; a hat
     hides the tufts (and the hat going on or off keeps whichever she has). */
  { const tufts=new THREE.Group(); head.add(tufts); tufts.visible=false; X.bedhead=false;
    const hp=hairGeo.attributes.position, near=(d)=>{ let best=-1, bi=0; const v=new THREE.Vector3(); for(let i=0;i<hp.count;i++){ v.fromBufferAttribute(hp,i); const k=v.clone().normalize().dot(d); if(k>best){ best=k; bi=i; } } return v.fromBufferAttribute(hp,bi).add(hairMesh.position); };
    const tuftG=celDeform(new THREE.ConeGeometry(0.036,0.16,8,6),v=>{ const t=(v.y+0.08)/0.16; v.x+=0.05*t*t; v.z*=0.7; });   /* (each a little horn of hair, curled over at its tip) */
    [[0,1,-0.15,0,0.2],[0.25,0.95,-0.35,0.5,-0.5],[-0.3,0.9,-0.4,-0.6,2.6],[0.05,0.8,-0.7,0.2,1.6],[0.5,0.6,-0.6,0.9,-1.2]].forEach(([dx,dy,dz,lean,turn],i)=>{
      const d=new THREE.Vector3(dx,dy,dz).normalize(), p=near(d), m=celM(tuftG,hairM,0,0,0,tufts,0.004); m.position.copy(p).addScaledVector(d,0.03);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().add(new THREE.Vector3(lean*0.08,0.9,0)).normalize()); m.rotateY(turn); m.scale.setScalar(0.85+0.25*((i*7)%3)/2); });
    let neat=null; const mess=on=>{ const H=X.hairPhys, src=H&&H.base?H.base:hp.array;
      if(on){ if(!X.bedhead) neat=src.slice(); const out=neat.slice(); for(let i=0;i<out.length;i+=3){ const x=out[i], y=out[i+1], z=out[i+2], a=Math.atan2(x,z), up=celSm(-0.08,0.12,y)*(1-0.75*celSm(0.18,0.26,y));   /* (less at the very top, where a bun sits) */
          const k=1+up*(0.07+0.06*Math.sin(a*5+y*30)*Math.cos(a*3-y*22)+0.03*Math.sin(a*11+1.7)); out[i]=x*k; out[i+2]=z*k; out[i+1]=y+up*0.018*(1+Math.sin(a*7+y*18)); }   /* (puffed out and up, in lumps) */
        hp.array.set(out); if(H){ H.base=out; H.ready=false; } }
      else if(neat){ hp.array.set(neat); if(H){ H.base=neat; H.ready=false; } neat=null; }
      hp.needsUpdate=true; hairGeo.computeVertexNormals(); X.bedhead=on; tufts.visible=on&&!(X.hat&&X.hat.visible); };
    X.setBedhead=mess;
    if(X.setHat){ const sh=X.setHat; X.setHat=(on,hooded)=>{ const was=X.bedhead; if(was){ mess(false); } sh(on,hooded); if(was) mess(true); }; } }
  const scale=o.scale; g.scale.setScalar(scale);
  g.traverse(m=>{ if(m.isMesh&&!m.userData.outline) m.castShadow=true; });
  /* her arms crossed, as Michelle stands on her own page: worked out once, so the pose can be eased into from any other */
  const cross=(()=>{ const out={arm:[],elbow:[],hand:[]}, set=(arm,i,fwd,side,dir,twist)=>{ const s=i?1:-1, e=new THREE.Euler(-fwd,0,s*side), q=new THREE.Quaternion().setFromEuler(e); out.arm.push(q);
      const local=new THREE.Vector3(...dir).normalize().applyQuaternion(q.clone().invert()), eq=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,-1,0),local); eq.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),twist)); out.elbow.push(eq); };
    /* properly folded: both elbows drawn in front of her chest; one forearm lies low and close with its hand tucked away under the
       other arm, the other crosses over the top of it and rests its hand on the first arm */
    set(arms[0],0,0.85,-0.36,[0.97,0.1,-0.12],0.6); set(arms[1],1,1.25,-0.36,[-0.96,-0.1,-0.03],-0.6); out.hand=[new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0.25)),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,-0.35))]; return out; })();
  return Object.assign(X,{g,o,C,legs,upper,head,arms,armL:arms[0],armR:arms[1],hi,dress,scale,setFace,LK,hipY,upY,cross,drop:0,hop:1,legA:A,legB:B});
}
/* who they are. Colors, hair and clothes are as they are in Trail to the Top; the heights are those, a little taller. */
/* versions of June's hair to choose between: each keeps her pigtails and changes the fringe, where the hair is cut, and how the tails sit */
const JUNE_HAIR={
  'Pulled back':{tails:null,cutLine:[[0,-0.04],[1.1,-0.04],[1.22,0.1],[1.65,0.125],[2.05,0.03],[2.5,-0.005],[3.1416,-0.005]],
    fringe:[[-0.86,0.15],[-0.74,0.185],[-0.6,0.212],[-0.5,0.236],[-0.36,0.25],[-0.26,0.275],[-0.12,0.286],[-0.03,0.31],[0.03,0.31],[0.12,0.286],[0.26,0.275],[0.36,0.25],[0.5,0.236],[0.6,0.212],[0.74,0.185],[0.86,0.15]]},
  'Original':{tails:null,cutLine:null,fringe:[[-0.78,0.252],[-0.6,0.288],[-0.43,0.236],[-0.26,0.288],[-0.09,0.228],[0.09,0.288],[0.26,0.232],[0.43,0.288],[0.6,0.238],[0.78,0.262]]},
  'High twin tails':{tails:{x:0.15,y:0.3,z:-0.05,l:1.3,w:0.72,out:0.34},cutLine:[[0,0.13],[1.5,0.15],[2.05,0.03],[2.5,-0.005],[3.1416,-0.005]],
    fringe:[[-0.86,0.19],[-0.8,0.24],[-0.6,0.246],[-0.4,0.24],[-0.2,0.246],[0,0.24],[0.2,0.246],[0.4,0.24],[0.6,0.246],[0.8,0.24],[0.86,0.19]]},
  'Low and long':{tails:{x:0.165,y:0.07,z:-0.07,l:1.4,w:0.74,out:0.03},cutLine:[[0,-0.04],[1.05,-0.04],[1.3,0.02],[2.3,0.01],[3.1416,-0.01]],
    fringe:[[-0.84,0.2],[-0.7,0.19],[-0.6,0.225],[-0.48,0.205],[-0.36,0.245],[-0.22,0.228],[-0.08,0.268],[0.08,0.256],[0.22,0.292],[0.36,0.288],[0.5,0.312],[0.6,0.3],[0.68,0.265],[0.8,0.24]]},
  'Short bunches':{tails:{x:0.172,y:0.25,z:-0.04,l:0.55,w:1.0,out:0.5},cutLine:[[0,0.02],[1.0,0.03],[1.2,0.12],[1.7,0.14],[2.05,0.03],[2.5,-0.005],[3.1416,-0.005]],
    fringe:[[-0.84,0.2],[-0.72,0.262],[-0.6,0.24],[-0.48,0.274],[-0.36,0.246],[-0.24,0.28],[-0.12,0.25],[0,0.284],[0.12,0.25],[0.24,0.28],[0.36,0.246],[0.48,0.274],[0.6,0.24],[0.72,0.262],[0.84,0.2]]}};
const UP=1.058, FOLK={
  Michelle:{lash:{w:0.0056,f:[[-0.3,0.0115,0.3],[-0.62,0.0075,0.75]]},scale:1.27,witch:true,legs:'boots',waist:'belt',seams:true,wavy:true,hairTo:-0.13,lids:true,dimple:true,freckles:6,eyeK:1.16,iris:['#7f8f3a','#b9812e'],own:'Cheeky',role:'scary',
    fringe:[[-0.74,0.25],[-0.6,0.285],[-0.42,0.243],[-0.27,0.284],[-0.08,0.238],[0.07,0.282],[0.26,0.24],[0.4,0.285],[0.58,0.25],[0.7,0.288],[0.9,0.27]]},
  June:{iris:['#356aa6','#7db6ea'],lash:{w:0.0052,f:[[-0.3,0.0115,0.3],[-0.62,0.0075,0.75]]},scale:1.3*UP,ragged:0.012,nape:true,style:'pigtails',cutLine:[[0,-0.04],[1.1,-0.04],[1.22,0.1],[1.65,0.125],[2.3,0.07],[3.1416,0.035]],mole:[-0.098,-0.03],eyeGlow:'#4a74b4',waist:'sash',hipPockets:true,hairTo:-0.035,own:'Happy',role:'shy',col:{dress:'#ff8a7a',hair:'#4a2e22',skin:'#f2c7a5',skinDeep:'#d9a383',tights:'#fff3e8',ribbon:'#fff3a3',under:'#ffd9cf',pocket:'#f0705f'},
    fringe:[[-0.86,0.15],[-0.74,0.185],[-0.6,0.212],[-0.5,0.236],[-0.36,0.25],[-0.26,0.275],[-0.12,0.286],[-0.03,0.31],[0.03,0.31],[0.12,0.286],[0.26,0.275],[0.36,0.25],[0.5,0.236],[0.6,0.212],[0.74,0.185],[0.86,0.15]]},   /* curtain bangs: parted in the middle and swept down to each side */
  Pip:{iris:['#a35f1c','#e2a23e'],lash:{w:0.005,f:[[-0.28,0.0085,0.15],[-0.66,0.0095,0.7],[-1.04,0.0085,1.15]]},scale:1.08*UP,style:'bun',pocket:true,hipPockets:true,freckles:8,hairTo:-0.035,own:'Big smile',role:'scary',col:{dress:'#b79cff',hair:'#d9783c',skin:'#c99372',skinDeep:'#a87355',tights:'#ffe1ea',ribbon:'#9fd8ff',under:'#e3d9ff',pocket:'#9c82e6',blush:'#e58a78'},
    fringe:[[-0.78,0.238],[-0.56,0.276],[-0.38,0.23],[-0.14,0.282],[0.08,0.238],[0.34,0.294],[0.58,0.262],[0.8,0.286]]},
  Lumi:{iris:['#7566cf','#c6baff'],lash:{w:0.0042,col:'#5b568f',f:[[-0.3,0.015,0.5],[-0.56,0.0125,0.85],[0.5,0.0065,-0.75],[0.82,0.0055,-1.0]]},scale:1.16*UP,style:'buns',waist:'sash',moon:true,hairTo:-0.3,back:[-0.035,-0.285],brow:'#9a94c8',eyeGlow:'#6a6aa0',own:'Curious',role:'shy',col:{dress:'#c9d2f0',hair:'#f6f3ff',hairDeep:'#cfc9ea',hairHi:'#ffffff',skin:'#e6e2f5',skinDeep:'#c4bfe0',tights:'#f3efff',ribbon:'#fff3a3',under:'#eef1ff',pocket:'#b3bfe8',blush:'#e9b6d8'},
    fringe:[[-0.84,0.2],[-0.74,0.262],[-0.5,0.258],[-0.25,0.262],[0,0.258],[0.25,0.262],[0.5,0.258],[0.74,0.262],[0.84,0.2]]},
  Mom:{iris:['#5f3d22','#9a6636'],lash:{w:0.0068,f:[[-0.26,0.0145,0.52]]},scale:1.72*UP,adult:true,top:'long',style:'mom',hairTo:-0.3,own:'Happy',role:'shy',col:{dress:'#e58fa6',hair:'#4a2e22',skin:'#f2c7a5',skinDeep:'#d9a383',tights:'#f6e7dc',ribbon:'#fff3a3',under:'#f7d3dc',pocket:'#d67893'},
    fringe:[[-0.8,0.2],[-0.58,0.262],[-0.24,0.292],[0.2,0.284],[0.56,0.25],[0.82,0.196]]},
  Dad:{armK:1.32,iris:['#3c774a','#82bd6c'],scale:1.8*UP,adult:true,top:'shirt',legs:'trousers',shoe:'#5a4030',style:'dad',ears:true,hairTo:0.015,snug:0.935,nape:true,ragged:0.004,cutLine:[[0,0.2],[1.75,0.2],[1.95,0.13],[2.45,0.075],[3.1416,0.055]],sideCut:[1.75,0.2],own:'Cheeky',role:'scary',col:{dress:'#6f8fd0',hair:'#d9783c',skin:'#c99372',skinDeep:'#a87355',tights:'#3b3550',ribbon:'#ffffff',blush:'#e58a78'},
    fringe:[[-0.72,0.268],[-0.4,0.294],[-0.1,0.272],[0.22,0.296],[0.5,0.276],[0.74,0.268]]}};
/* the build worked out on Pip's test model, given to everyone: the sculpted face and narrower head, the dark eyes at their new size, lids
   that shape the eye, the lower and wider mouth, shoulders set back and a straighter upper back, slimmer legs set closer together, and hair
   and skirts that move. Those in short dresses have their knees at the hem and wear T-bar shoes; Michelle keeps her boots and striped
   tights, and her own heavy lids; Dad keeps his trousers and loafers, and his short hair stays put. */
Object.keys(FOLK).forEach(n=>{ const D=FOLK[n]; Object.assign(D,{sculpt:true,blackEyes:true,browLid:!D.lids,mouthY:-0.088,mouthW:1.42,posture:true,legK:0.86,legX:D.adult?0.064:0.058,hairPhys:n!=='Dad',skirtPhys:true,eyeK:(D.eyeK||1)*0.85});
  if(!D.legs){ D.tbar=true; D.kneeAt=D.adult?0.37:0.245; } });
FOLK.Lumi.tbarCol='#8f8ac0'; FOLK.Mom.tbarCol='#6e3b22';
/* what each of them wears when it is cold: June's and Pip's parkas are the colours they had on the trail */
const WINTER={June:{coat:'parka',coatCol:'#d9506e'},Pip:{coat:'parka',coatCol:'#4fa0dc'},Lumi:{coat:'parka',coatCol:'#8f86d8'},Dad:{coat:'coat',coatCol:'#7a5234'},Mom:{coat:'mink'},Michelle:{coat:'parka',coatCol:'#5b3f73'}};
Object.assign(FOLK.June,JUNE_HAIR['Original'],{headK:0.9});   /* June: the original cut (the chin-length bob and zigzag fringe, with her pigtails), and a head a tenth smaller */
Object.keys(FACES).forEach(k=>{ FACES[k].id=k; });

/* ---------- the pose sheet ---------- */
/* The poses from the June & Pip model sheet (Pockets, T-pose, Wave, Cheer, Walk, Crouch, Talk, Scary face), four that the girls strike on
   the trail (Look, Point, Hug, Shy), and Michelle's own arms-crossed stance. Each arm is a list: how far it swings out from the body (0
   hangs straight down), how far forward, whether the hand is tucked away, the elbow's bend, the wrist's bend, whether the hand claws, the
   forearm's fold across the body, the wrist's tip and its roll, and how far the arm stretches to reach. */
/* Hair that moves. The ends of her hair are a weight on a spring: it is pulled toward where the ends would hang (partway between
   rigid with her head and straight down from the crown, so a tilted head lets it hang), it overshoots and settles, and each strand
   follows by how far it is from the roots. A little breeze keeps it alive when she is still. */
/* the wind: a steady push from one side that comes in gusts. Hair and skirt lean their resting place downwind and ripple in it. */
const WIND={on:false,k:0,v:new THREE.Vector3(),gust:0};
function windAt(t){ WIND.gust=WIND.k*(0.62+0.26*Math.sin(t*1.7)+0.16*Math.sin(t*4.3+1)+0.1*Math.sin(t*7.9+2)); return WIND.v.set(-0.93,0.08,0.36).multiplyScalar(WIND.gust); }
const HV={a:new THREE.Vector3(),b:new THREE.Vector3(),c:new THREE.Vector3(),q:new THREE.Quaternion()};
function hairStep(P,t,dt,live){ const H=P.hairPhys, m=H.mesh; P.g.updateMatrixWorld(true);
  const root=m.localToWorld(HV.a.set(0,0.22,0)), tip=m.localToWorld(HV.b.set(0,-0.03,0)), len=root.distanceTo(tip), sc=len/0.25;
  const goal=HV.c.copy(root); goal.y-=len; goal.lerp(tip,0.45); if(live&&WIND.k>0.001) goal.addScaledVector(windAt(t),len*0.55);
  if(!H.ready||!live||dt>0.2||!isFinite(H.q.x+H.q.y+H.q.z+H.v.x+H.v.y+H.v.z)){ H.q.copy(goal); H.v.set(0,0,0); H.ready=true; }
  else for(let n=0;n<3;n++){ const h=dt/3; H.v.x+=((goal.x-H.q.x)*70-H.v.x*7)*h; H.v.y+=((goal.y-H.q.y)*70-H.v.y*7)*h; H.v.z+=((goal.z-H.q.z)*70-H.v.z*7)*h; H.q.addScaledVector(H.v,h); }
  const off=H.off.copy(H.q).sub(tip).divideScalar(sc).applyQuaternion(m.getWorldQuaternion(HV.q).invert());   /* how far the ends are from rigid, in the hair's own space */
  if(live){ off.x+=0.006*Math.sin(t*1.3)+0.003*Math.sin(t*2.9+1); off.z+=0.004*Math.sin(t*1.7+2); }
  const L=off.length(), Lm=0.09+0.06*WIND.k; if(L>Lm) off.multiplyScalar(Lm/L); const rip=live?WIND.gust*0.012:0;
  const p=H.geo.attributes.position, B=H.base||(H.base=p.array.slice());
  for(let i=0;i<p.count;i++){ const x=B[i*3], y=B[i*3+1], z=B[i*3+2], w=clamp((0.2-y)/0.235,0,1), k=w*w*(1+0.3*Math.sin(Math.atan2(x,z)*7+t*1.1))*(z>0.05?0.55:1);
    let nx=x+off.x*k+rip*w*Math.sin(t*11+y*40+Math.atan2(x,z)*3), nz=z+off.z*k+rip*w*Math.cos(t*9+y*34); const ny=y+off.y*k*0.4+0.25*k*Math.hypot(off.x,off.z)*w;   /* swinging out lifts the ends a little */
    { const rb=Math.hypot(x,z)*0.93, rn=Math.hypot(nx,nz); if(rn<rb&&rn>0){ nx*=rb/rn; nz*=rb/rn; } }   /* it does not pass through her head */
    p.setXYZ(i,nx,ny,nz); }
  p.needsUpdate=true; }
/* one front lock of hair: looser than the rest, with its own timing, so the two never move as one */
function lockStep(K,t,dt,live){ const m=K.mesh; m.updateWorldMatrix(true,false); const root=m.localToWorld(HV.a.copy(K.root)), tip=m.localToWorld(HV.b.copy(K.tip)), len=root.distanceTo(tip), sc=len/K.root.distanceTo(K.tip);
  const goal=HV.c.copy(root); goal.y-=len; goal.lerp(tip,0.4); if(live&&WIND.k>0.001) goal.addScaledVector(windAt(t+K.ph),len*0.8);
  if(!K.ready||!live||dt>0.2||!isFinite(K.q.x+K.q.y+K.q.z+K.v.x+K.v.y+K.v.z)){ K.q.copy(goal); K.v.set(0,0,0); K.ready=true; }
  else for(let n=0;n<3;n++){ const h=dt/3; K.v.x+=((goal.x-K.q.x)*46-K.v.x*4.6)*h; K.v.y+=((goal.y-K.q.y)*46-K.v.y*4.6)*h; K.v.z+=((goal.z-K.q.z)*46-K.v.z*4.6)*h; K.q.addScaledVector(K.v,h); }
  const off=HV.d||(HV.d=new THREE.Vector3()); off.copy(K.q).sub(tip).divideScalar(sc).applyQuaternion(m.getWorldQuaternion(HV.q).invert());
  if(live){ off.x+=0.007*Math.sin(t*1.5+K.ph)+0.003*Math.sin(t*3.3+K.ph*2); off.z+=0.006*Math.sin(t*1.9+K.ph*1.7); }
  const L=off.length(), Lm=0.1+0.05*WIND.k; if(L>Lm) off.multiplyScalar(Lm/L);
  const p=K.geo.attributes.position, B=K.base, rip=live?WIND.gust*0.01:0;
  for(let i=0;i<p.count;i++){ const x=B[i*3], y=B[i*3+1], z=B[i*3+2], w=clamp((K.yT-y)/(K.yT-K.yB),0,1), k=w*w; let nx=x+off.x*k+rip*k*Math.sin(t*12+y*40+K.ph), nz=z+off.z*k+rip*k*Math.cos(t*10+y*30+K.ph); const ny=y+off.y*k*0.4+0.3*k*Math.hypot(off.x,off.z);
    const rb=Math.hypot(x,z)*0.97, rn=Math.hypot(nx,nz); if(rn<rb&&rn>0){ nx*=rb/rn; nz*=rb/rn; } p.setXYZ(i,nx,ny,nz); }
  p.needsUpdate=true; K.geo.computeVertexNormals(); }
/* A skirt that moves. Everything below her waist is cloth: its hem is a weight on a spring (so it swings, lags and settles, and hangs
   toward straight down when she leans), each side follows its own leg as she strides, and wherever a thigh or shin would come through
   the cloth it is pushed out and up over the leg instead, which is what drapes it over her knees when she crouches. It never goes
   through the ground. The disc of petticoat under the skirt follows the hem. */
const SK={a:new THREE.Vector3(),b:new THREE.Vector3(),c:new THREE.Vector3(),d:new THREE.Vector3(),p:new THREE.Vector3(),f:new THREE.Vector3(),o:new THREE.Vector3(),hc:new THREE.Vector3(),inv:new THREE.Matrix4(),caps:[0,1,2,3].map(()=>({a:new THREE.Vector3(),b:new THREE.Vector3(),r:0}))};
function skirtStep(P,t,dt,live){ const K=P.skirt, m=K.mesh; P.g.updateMatrixWorld(true); const M=m.matrixWorld, S=M.getMaxScaleOnAxis(), np=K.np, B=K.base, W=K.W, E=K.E, E2=K.E2, n=B.length/3;
  const rigid=m.localToWorld(SK.a.set(0,K.hem,0)), waist=m.localToWorld(SK.b.set(0,0.27,0)), len=rigid.distanceTo(waist), goal=SK.c.copy(waist); goal.y-=len; goal.lerp(rigid,0.5); const wv=live&&WIND.k>0.001?windAt(t):null; if(wv) goal.addScaledVector(wv,len*0.6);
  if(!K.ready||!live||dt>0.2||!isFinite(K.q.x+K.q.y+K.q.z+K.v.x+K.v.y+K.v.z)){ K.q.copy(goal); K.v.set(0,0,0); K.ready=true; }
  else for(let k=0;k<3;k++){ const h=dt/3; K.v.x+=((goal.x-K.q.x)*60-K.v.x*6.5)*h; K.v.y+=((goal.y-K.q.y)*60-K.v.y*6.5)*h; K.v.z+=((goal.z-K.q.z)*60-K.v.z*6.5)*h; K.q.addScaledVector(K.v,h); }
  const off=SK.o.copy(K.q).sub(rigid); if(live){ off.x+=S*0.004*Math.sin(t*1.1+1); off.z+=S*0.003*Math.sin(t*1.6); } const L0=off.length(), Lk=(0.08+0.07*WIND.k)*S; if(L0>Lk) off.multiplyScalar(Lk/L0); const flut=wv?WIND.gust*0.016*S:0;
  const fwd=SK.f.set(0,0,1).transformDirection(P.g.matrixWorld), sw=[-Math.sin(P.legs[0].rotation.x),-Math.sin(P.legs[1].rotation.x)];
  P.legs.forEach((L,j)=>{ const c0=SK.caps[j*2], c1=SK.caps[j*2+1]; L.getWorldPosition(c0.a); P.hi.knees[j].getWorldPosition(c0.b); c0.r=0.05*S; c1.a.copy(c0.b); P.hi.feet[j].getWorldPosition(c1.b); c1.r=0.047*S; });
  SK.hc.copy(SK.caps[0].a).add(SK.caps[2].a).multiplyScalar(0.5);
  const push=(p,w,out)=>{ let hit=false; for(const c of SK.caps){ const ab=SK.d.copy(c.b).sub(c.a), tt=clamp(SK.b.copy(p).sub(c.a).dot(ab)/Math.max(1e-6,ab.lengthSq()),0,1), cp=ab.multiplyScalar(tt).add(c.a), dist=cp.distanceTo(p), R=c.r+0.018*S;
      if(dist<R){ const dir=SK.b.copy(cp).sub(SK.hc); dir.y=0; if(dir.lengthSq()<1e-6) dir.copy(fwd); dir.normalize(); dir.y=0.4; dir.normalize(); out.addScaledVector(dir,(R-dist)*Math.min(1,w*3)); hit=true; } } return hit; };
  /* first pass: swing, stride, and how far each point must move to clear the legs */
  for(let i=0;i<n;i++){ const bx=B[i*3], by=B[i*3+1], bz=B[i*3+2], w=clamp((K.top-by)/(K.top-K.hem),0,1), w2=w*w, p=SK.p.set(bx,by,bz).applyMatrix4(M);
    p.addScaledVector(off,w2); if(flut){ const a=Math.atan2(bx,bz), f=flut*w2*Math.sin(t*10-a*4+by*30); p.x+=wv.x/Math.max(0.05,WIND.gust)*f; p.z+=wv.z/Math.max(0.05,WIND.gust)*f; p.y+=flut*w2*0.6*Math.sin(t*7+a*3)+WIND.gust*0.02*S*w2; }
    for(let j=0;j<2;j++){ const sg=j?1:-1, side=clamp(0.5+bx*sg/0.12,0,1), lead=celSm(-0.012,0.012,bz*sw[j]); p.addScaledVector(fwd,sw[j]*0.075*S*w2*side*(0.25+0.75*lead)); }   /* the side the leg swings toward is carried further than the side it leaves, with no crease between them */
    W[i*3]=p.x; W[i*3+1]=p.y; W[i*3+2]=p.z; const e=SK.a.set(0,0,0); if(w>0) push(p,w,e); E[i*3]=e.x; E[i*3+1]=e.y; E[i*3+2]=e.z; }
  /* spread those pushes to their neighbours, so the cloth tents over a knee rather than spiking */
  for(let pass=0;pass<3;pass++){ for(let i=0;i<n;i++){ const ring=Math.floor(i/np), j=i%np, l=((ring+K.seg-1)%K.seg)*np+j, r=((ring+1)%K.seg)*np+j, u=j>0?i-1:i, d=j<np-1?i+1:i;
      for(let c=0;c<3;c++) E2[i*3+c]=Math.max(Math.abs(E[i*3+c]),0)*0+0.4*E[i*3+c]+0.15*(E[l*3+c]+E[r*3+c]+E[u*3+c]+E[d*3+c]); }
    for(let i=0;i<n*3;i++) E[i]=Math.abs(E2[i])>Math.abs(E[i])?E2[i]:E[i]*0.75+E2[i]*0.25; }
  SK.inv.copy(M).invert(); const pos=K.geo.attributes.position, floor=0.008*S;
  for(let i=0;i<n;i++){ const by=B[i*3+1], w=clamp((K.top-by)/(K.top-K.hem),0,1), p=SK.p.set(W[i*3]+E[i*3],W[i*3+1]+E[i*3+1],W[i*3+2]+E[i*3+2]);
    if(w>0){ const e=SK.a.set(0,0,0); if(push(p,w,e)) p.add(e); if(p.y<floor) p.y+=(floor-p.y)*Math.min(1,w*4); }
    W[i*3]=p.x; W[i*3+1]=p.y; W[i*3+2]=p.z; p.applyMatrix4(SK.inv); pos.setXYZ(i,p.x,p.y,p.z); }
  pos.needsUpdate=true;
  /* the petticoat disc: its rim rides just inside the hem, its middle stays put */
  if(!K.um) return;
  const up=K.ug.attributes.position; K.um.updateMatrixWorld(); SK.inv.copy(K.um.matrixWorld).invert();
  for(let k=0;k<up.count;k++){ const i=K.link[k]; if(i<0) continue; const h=i*np; SK.p.set(W[h*3],W[h*3+1],W[h*3+2]).lerp(SK.hc,0.02); SK.p.y=W[h*3+1]+0.004*S; SK.p.applyMatrix4(SK.inv); up.setXYZ(k,SK.p.x,SK.p.y,SK.p.z); }
  up.needsUpdate=true; }
/* Her walk, worked out from where her feet go rather than from swinging her legs. Each foot spends about three fifths of a stride
   planted, sliding straight back under her, then lifts and swings forward in a low arc; the hip and knee angles that put the ankle
   there are solved from the lengths of her thigh and shin. The shoe lands heel first, rolls flat, and peels off the toe. Her hips ride
   lowest when both feet are down and highest as she passes over one leg, shift over the planted foot, and turn with the stride, while
   her shoulders turn the other way and each arm swings with the opposite leg, bending a little as it comes forward. */
function gaitAt(P,ph){ const A=P.legA, B=P.legB, Lg=A+B, S=0.8*Lg, D=0.62, T2=Math.PI*2, fr=x=>x-Math.floor(x), o=P.gait||(P.gait={hip:[0,0],kn:[0,0],foot:[0,0],pz:[0,0],armX:[0,0],el:[0,0]});
  o.gy=-0.07*Lg-0.028*Lg*Math.cos(2*T2*(ph-0.05)); o.bx=-0.04*Lg*Math.sin(T2*(ph-0.05)); o.uy=-0.1*Math.cos(T2*ph); o.roll=0.022*Math.sin(T2*(ph-0.05));
  for(let j=0;j<2;j++){ const f=fr(ph+j*0.5); let z, lift, pitch;
    if(f<D){ const s=f/D; z=S/2-S*s; lift=0.075*Lg*celSm(0.68,1,s); pitch=s<0.14?-0.3*(1-s/0.14):0.6*celSm(0.62,1,s); }
    else { const s=(f-D)/(1-D), e=s*s*(3-2*s); z=-S/2+S*(0.85*e+0.15*s); lift=0.075*Lg*(1-celSm(0,0.45,s))+0.2*Lg*Math.sin(Math.PI*Math.pow(s,0.85)); pitch=0.6+(-0.3-0.6)*celSm(0,0.8,s); }
    const pz=0.06*Lg*Math.cos(T2*f), zr=z-pz, h=Lg+o.gy-lift, d=Math.min(Math.hypot(zr,h),Lg*0.9985), kn=Math.PI-Math.acos(clamp((A*A+B*B-d*d)/(2*A*B),-1,1)), al=Math.atan2(zr,h), be=Math.acos(clamp((A*A+d*d-B*B)/(2*A*d),-1,1));
    o.pz[j]=pz; o.hip[j]=-(al+be); o.kn[j]=kn; o.foot[j]=pitch;
    const c=Math.cos(T2*fr(ph+(1-j)*0.5+0.115)); o.armX[j]=-0.58*c+0.05; o.el[j]=-0.42*Math.max(0,c); }
  return o; }
const IDLE_LOOK=[-0.42,-1.72,0,-2.2,0.25,0,0,0,-0.4,1.08], IDLE_BACK=[-0.26,0.62,0,-0.06], IDLE_STRETCH=[2.8,0.12,0,-0.12,0,0,0,0,1.4], IDLE_HAIR=[0.42,-1.55,0,-2.62,0.2,0,0,0,-0.3];
const TUCK=0.16, CR_GROUND=[0.3,-0.6,0,0,-1.45,0,0,0,1.4,1.3], CR_KNEE=[0.15,-0.1,0,-0.9,-0.7,0,0,0,1.4], DOWN=[TUCK,0,1], UPARM=[2.5,0,0,-0.3,-0.15,0,0,0,1.4];
const POSES={'Pockets':{arms:[[TUCK,0],[TUCK,0]],pocket:true},'T-pose':{arms:[[Math.PI/2,0],[Math.PI/2,0]],still:true},'Wave':{a:[DOWN,UPARM],b:[UPARM,DOWN],wave:true},
  'Cheer':{arms:[[2.55,0,0,-0.3,-0.35,0,0,0,1.4],[2.55,0,0,-0.3,-0.35,0,0,0,1.4]],cheer:true},'Walk':{arms:[[0.17,0,0,-0.22],[0.17,0,0,-0.22]],walk:true},'Crouch':{a:[CR_KNEE,CR_GROUND],b:[CR_GROUND,CR_KNEE],crouch:true},
  'Talk':{arms:[DOWN,DOWN],talk:true},'Scary face':{arms:[DOWN,DOWN],scary:true},'Arms crossed':{arms:[DOWN,DOWN],crossed:true},
  'Look':{a:[DOWN,[0.25,-2.7,0,-0.55]],b:[[0.25,-2.7,0,-0.55],DOWN],look:true},'Point':{a:[DOWN,[0.05,-1.55]],b:[[0.05,-1.55],DOWN],point:true},
  'Hug':{arms:[[0.4,-1.5,0,-0.35],[0.4,-1.5,0,-0.35]],hug:true},'Shy':{arms:[[-0.26,0.62,0,-0.06],[-0.26,0.62,0,-0.06]],shy:true}};
const CLAW=[0.55,-1.85,0,-0.6,-0.5,1], CHIN=[-0.72,-1.02,0,-2.33,0.3,0,0,0,-0.5,1.1], PROP=[-0.05,-0.45,0,-1.15,0,0,1.25,0,0], TALKARM=[0.5,-0.9,0,-1.0,0.3,0,0,0,1.2];
/* one person, one frame: i is her place in the row, side which half of it she stands in (so that pairs mirror each other), speaker who
   is talking just now */
function poseFolk(P,i,side,t,dt,poseName,faceName,speaker,still){ const Q=POSES[poseName], live=!still&&!Q.still, ka=still?1:1-Math.exp(-dt*7), ph=t*1.3+i*1.9, odd=i%2, sd=odd?-1:1, H=P.hi;
  let F=FACES[faceName==='Own'?P.o.own:faceName], armT=Q.arms||(odd?Q.b:Q.a), scary=Q.scary&&P.o.role==='scary', shyOne=Q.scary&&!scary;
  if(scary){ F=FACES.Scary; armT=[CLAW,CLAW]; } if(shyOne) F=FACES.Embarrassed;
  let hz=0, hy=0, hx=0, lean=0, bob=0, sideLean=0;
  if(live){ bob=Math.sin(ph)*0.004; hz=Math.sin(ph*0.5)*0.05; hy=Math.sin(ph*0.31+i)*0.14;
    /* glancing about: every four seconds or so she turns her head to look at something for a moment, to one side or the other, sometimes up or down a little */
    const gt=t*0.95+i*3.7, gn=Math.floor(gt/4.2), gu=gt-gn*4.2, r1=Math.sin(gn*12.9898+i*4.1)*43758.5453, r2=Math.sin(gn*78.233+i*1.7)*12345.678, ra=r1-Math.floor(r1), rb=r2-Math.floor(r2);
    if(ra>0.12){ const ge=celSm(0,0.45,gu)*celSm(1.5+rb*1.3,1.1+rb*1.3,gu); hy+=ge*(ra>0.56?1:-1)*(0.34+0.3*rb); hx+=ge*(rb-0.5)*0.22; hz*=1-0.6*ge; } }
  if(shyOne){ hy=still?0.3:Math.sin(t*5.2)*0.36; hx=0.2; hz=0; }                                              /* shaking her head, eyes shut */
  if(scary){ lean=0.2; hx=-0.1; hz=still?0.1:Math.sin(t*7)*0.09; hy=0; bob=still?0:Math.abs(Math.sin(t*3.5))*0.012; }   /* looming and wobbling */
  if(!Q.scary&&F.look){ if(live){ hy=Math.sin(t*0.55+i*2.1)*0.55; hx=-0.24+Math.sin(t*0.4+i)*0.1; hz=Math.sin(t*0.3+i)*0.06; } else { hy=sd*0.4; hx=-0.24; } }   /* in awe: looking slowly all around, and up */
  if(!Q.scary&&F.cock){ hz=sd*F.cock+(live?Math.sin(t*0.9+i)*0.04:0); hy=sd*0.18+(live?Math.sin(t*0.6+i*2)*0.12:0); hx=0.06; lean=0.12; }   /* curious: head cocked, leaning in */
  if(!Q.scary&&F.think){ hz=sd*-0.1; hy=sd*-0.12+(live?Math.sin(t*0.5+i)*0.05:0); hx=-0.16+(live?Math.sin(t*0.7+i*1.3)*0.03:0); if(Q.pocket) armT=odd?[CHIN,PROP]:[PROP,CHIN]; }   /* thinking: eyes up and away, a hand to her chin */
  if(Q.cheer&&live) bob=Math.abs(Math.sin(t*4+i))*0.03;
  if(Q.look){ hx=-0.3; lean=-0.08; hy=live?Math.sin(t*0.3+i)*0.3:0; } if(Q.point){ hx=-0.1; hy=live?Math.sin(t*0.6+i)*0.15:0; } if(Q.hug){ hx=-0.4; if(live) bob=Math.abs(Math.sin(t*2.5))*0.02; }
  /* Idling. Standing with nothing to do, she shifts her weight all the time, and every so often does one of four small things: shades her eyes and looks
     about, puts her hands behind her and rocks on her heels, has a big stretch, or lifts a hand to her hair. Each of them keeps her own time. */
  let idleTip=0; if(live&&Q.pocket&&!F.think&&!F.look&&!F.cock&&!scary&&!shyOne){ const c=(t+i*7.3)%40, env=(a,b)=>celSm(a,a+0.7,c)*celSm(b,b-0.7,c); let e; sideLean+=Math.sin(t*0.42+i*2)*0.03;
    if((e=env(0.8,4.4))>0.01){ hy=hy*(1-e)+e*Math.sin((c-0.8)/3.6*Math.PI*2)*0.62; hx-=0.05*e; }   /* a slow look from one side to the other */
    if((e=env(22.4,25.8))>0.01){ hy=hy*(1-e)-e*Math.sin((c-22.4)/3.4*Math.PI*2)*0.55; hx-=0.16*e*Math.sin((c-22.4)/3.4*Math.PI); }   /* and another, glancing up as she goes */
    if((e=env(8,12.6))>0.01){ hy=hy*(1-e)+e*Math.sin((c-8)/4.6*Math.PI*2)*0.6; hx-=0.08*e; if(e>0.45) armT=odd?[IDLE_LOOK,[TUCK,0]]:[[TUCK,0],IDLE_LOOK]; }
    if((e=env(17,21.2))>0.01){ idleTip=e*0.065*(0.5+0.5*Math.sin((c-17)*3.2)); hz+=e*Math.sin((c-17)*1.6)*0.08; if(e>0.45) armT=[IDLE_BACK,IDLE_BACK]; }
    if((e=env(27,30.6))>0.01){ lean-=0.1*e; hx-=0.3*e; bob+=0.014*e; if(e>0.35) armT=[IDLE_STRETCH,IDLE_STRETCH]; }
    if((e=env(34.5,37))>0.01){ hz+=e*sd*0.16; hy+=e*sd*0.2; if(e>0.45) armT=odd?[IDLE_HAIR,[TUCK,0]]:[[TUCK,0],IDLE_HAIR]; } }
  let tip=idleTip; if(Q.shy){ tip=0.085+(live?Math.sin(t*1.1+i)*0.012:0);   /* up on the balls of her feet, her whole weight tipped a little forward */
    hx=-0.2; hz=live?Math.sin(t*1.3+i)*0.18:0.12; if(live) bob=Math.abs(Math.sin(t*2+i))*0.02; }
  const w=t*(odd?7.2:6.2), hip=[0,0], kn=[0,0], fq=[0,0]; let drop=0, turn=side*-0.22, talking=false;
  let G=null; if(Q.walk){ G=gaitAt(P,still?0.08:(t*1.02+i*0.37)%1); hip[0]=G.hip[0]; hip[1]=G.hip[1]; kn[0]=G.kn[0]; kn[1]=G.kn[1]; lean=0.06; turn=side*-0.1; hy=-G.uy*0.7; }
  if(Q.crouch){ hip[0]=hip[1]=-1.5; kn[0]=kn[1]=2.6; drop=0.207*P.LK; lean=0.6; sideLean=sd*-0.2; hx=-0.45; hy=sd*-0.25; if(live) bob=Math.sin(ph)*0.005; }   /* down on their heels */
  let fo=null; const lz=[0,0];

  if(Q.talk){ const sp=speaker===i; talking=live&&sp; turn=side*-0.75; hy=0; hz=sp&&live?Math.sin(t*3.1)*0.07:0; hx=sp?0:(live?Math.max(0,Math.sin(t*4.5+i))*0.09:0); if(sp) armT=odd?[TALKARM,DOWN]:[DOWN,TALKARM]; }   /* the ones listening nod */
  P.g.rotation.order='YXZ'; P.tip=(P.tip||0)+(tip-(P.tip||0))*ka; P.g.rotation.x=P.tip;
  P.g.rotation.y+=(turn-P.g.rotation.y)*ka; P.drop+=(drop-P.drop)*ka;
  /* a cheat for the crouch: her knee sits up at her hem, which leaves too little thigh to fold into the crouch the others do. So as she
     goes down, the joint slides to where theirs is (thigh longer, shin shorter, the leg's whole length unchanged) and slides back as she rises. */
  if(P.o.kneeAt){ P.ck=(P.ck||0)+((Q.crouch?1:0)-(P.ck||0))*ka; const A0=P.legA, B0=P.legB, A1=A0+(0.15*P.LK-A0)*P.ck, B1=A0+B0-A1;
    for(let j=0;j<2;j++){ H.thighs[j].scale.y=A1/A0; H.knees[j].position.y=-A1; H.shins[j].scale.y=B1/B0; H.feet[j].position.y=-B1; } }
  P.gk=(P.gk||0)+((G?1:0)-(P.gk||0))*ka; const kl=G?(still?1:1-Math.exp(-dt*30)):ka, gk=P.gk, Gy=G?G.gy*gk:0, Gx=G?G.bx*gk:0;   /* (gk: how far she has eased into her walk) */
  P.legs.forEach((L,j)=>{ L.position.set((j?1:-1)*(P.o.legX||0.08)+Gx,P.hipY-P.drop+Gy,G?G.pz[j]*gk:0); L.rotation.x+=(hip[j]-L.rotation.x)*kl; const K=H.knees[j]; K.rotation.x+=(kn[j]-K.rotation.x)*kl; /* walking, the shoe is set against the ground rather than the shin: toe a little up as the heel lands in front, flat as it passes under her, toe down as it pushes off behind */
    L.rotation.z+=((j?1:-1)*lz[j]-L.rotation.z)*ka; const F=H.feet[j]; if(G) F.rotation.x=G.foot[j]*gk-(L.rotation.x+K.rotation.x); else F.rotation.x+=((fo?fo[j]:-(L.rotation.x+K.rotation.x)-P.tip*0.45)-F.rotation.x)*Math.min(1,ka*3); });
  if(P.upBase===undefined) P.upBase=P.upper.position.y; P.upBase+=((P.upY+bob-P.drop)-P.upBase)*ka; P.upper.position.y=P.upBase+Gy; P.upper.position.x=Gx*0.85; P.upper.rotation.y=G?G.uy*gk:0; if(G) sideLean+=G.roll;
  P.upper.rotation.x+=(lean-P.upper.rotation.x)*ka; P.upper.rotation.z+=(sideLean-P.upper.rotation.z)*ka;
  P.head.rotation.z+=(hz-P.head.rotation.z)*ka; P.head.rotation.y+=(hy-P.head.rotation.y)*(shyOne?1:ka); P.head.rotation.x+=(hx-P.head.rotation.x)*ka;
  P.arms.forEach((a,j)=>{ const T=armT[j], sg=j?1:-1, el=H.elbows[j], h=H.hands[j];
    if(Q.crossed){ a.quaternion.slerp(P.cross.arm[j],ka); el.quaternion.slerp(P.cross.elbow[j],ka); h.quaternion.slerp(P.cross.hand[j],ka); a.scale.y+=((P.o.armK||1)-a.scale.y)*ka; return; }
    let z=T[0], x=T[1];
    if(live&&Q.wave&&z>1) z+=Math.sin(t*7)*0.28; if(live&&Q.cheer) z+=Math.sin(t*8+j)*0.1; if(live&&scary){ z+=Math.sin(t*6+j*2)*0.14; x+=Math.sin(t*5+j)*0.1; }
    if(G) x+=G.armX[j]; if(talking&&z>0.4){ x+=Math.sin(t*5)*0.18; z+=Math.sin(t*3.3)*0.1; } if(live&&Q.point&&x<-1) x+=Math.sin(t*3)*0.06;
    if(live&&z<0.5&&x===0) x+=Math.sin(ph*0.7+j*Math.PI)*0.015;
    a.rotation.z+=(sg*z-a.rotation.z)*ka; a.rotation.x+=(x-a.rotation.x)*ka; a.rotation.y+=(0-a.rotation.y)*ka; a.scale.y+=((T[9]||1)*(P.o.armK||1)-a.scale.y)*ka;
    el.rotation.x+=((T[3]||0)+(G?G.el[j]:0)-el.rotation.x)*ka; el.rotation.z+=(sg*-(T[6]||0)-el.rotation.z)*ka; el.rotation.y+=(0-el.rotation.y)*ka;
    let wx=T[4]||0, wz=T[7]||0, wy=T[5]?-1.3:(T[8]||0);
    if(live&&Q.wave&&T[0]>1) wz+=Math.sin(t*7+0.9)*0.5; if(live&&Q.cheer){ wz+=Math.sin(t*8+j+0.8)*0.3; wx+=Math.sin(t*4+j)*0.15; } if(G) wx+=G.armX[j]*-0.35; if(talking&&T[0]>0.4){ wx+=Math.sin(t*5+0.7)*0.35; wz+=Math.sin(t*3.3)*0.25; }
    h.rotation.x+=(wx-h.rotation.x)*ka; h.rotation.y+=(sg*wy-h.rotation.y)*ka; h.rotation.z+=(sg*wz-h.rotation.z)*ka; });
  if(P.hairPhys) hairStep(P,t,dt,live);
  if(P.skirt) skirtStep(P,t,dt,live);
  if(P.locks) P.locks.forEach(K=>lockStep(K,t,dt,live));
  P.sway.forEach((s,j)=>{ s.rotation.z=live?Math.sin(ph*1.1+j)*0.07+(shyOne?-P.head.rotation.y*0.5:0):0; s.rotation.x=live?Math.sin(ph*0.8+j)*0.05:0; });
  if(P.hop<1){ P.hop=Math.min(1,P.hop+dt/0.5); P.g.position.y=still?0:Math.sin(P.hop*Math.PI)*0.2*P.scale; } else P.g.position.y=P.tip*0.1*P.scale;   /* she hops into her scary face */
  if(P.hat){ P.hat.rotation.z=-0.16+(live?Math.sin(t*1.3)*0.025:0); P.pom.position.y=0.48+(live?Math.sin(t*2.6)*0.006:0);    /* her hat sways, and Big Boss stands on its brim with his arms folded, and every so often has a good sniff about */
    const R=P.rat.userData.rig; if(R) bossPose(R,t,still?1:dt,{fold:1,sniff:live&&Math.sin(t*0.5)>0.35?1:0,t,still:!live}); }
  const open=talking?0.25+0.75*Math.abs(Math.sin(t*10.5)*Math.sin(t*3.7+1)):0;
  /* blinking: at uneven gaps of two to six seconds, quick, through a half-shut frame, and now and then twice running */
  let bl=0; if(live&&!F.happyShut&&!F.scaryEyes&&F.eye>=0.2){ const B=P.bk||(P.bk={next:t+0.6+Math.random()*3,t0:-1,again:false}); if(t<B.t0-0.5||B.next-t>12){ B.t0=-1; B.next=t+0.6+Math.random()*3; }
    if(B.t0<0&&t>=B.next){ B.t0=t; B.again=Math.random()<0.22; }
    if(B.t0>=0){ const u=t-B.t0; bl=u<0?0:u<0.045?1:u<0.125?2:u<0.19?1:0; if(u>=0.19){ if(B.again){ B.again=false; B.t0=t+0.1; } else { B.t0=-1; B.next=t+1.8+Math.random()*4.2; } } } }
  P.setFace(F,bl,open); }

/* ---------- the birds from the stone bench ---------- */
/* The five small birds that come down round the last bench on the mountain trail: brown, slate, russet, olive and dun, each with a pale
   breast. Each is three pieces (body and head and tail in one, its breast, its beak) and two wings, lit in bands with an ink line. */
const BIRD_COLORS=[['#8b6a4c','#dcc7a4'],['#6f7f93','#e8dccb'],['#a0553c','#e8cdaa'],['#5f6e55','#dad4aa'],['#7a6a5e','#f0e5d2']];
function makeCelBird([c1,c2],i){ const g=new THREE.Group(), body=new THREE.Group(), ball=new THREE.SphereGeometry(1,12,9), a=toon({color:c1}); g.add(body);
  celM(celMerge([[ball,celAt(0,0.1,0,0,0,0,0.07,0.0665,0.105)],[ball,celAt(0,0.17,0.08,0,0,0,0.05)],[ball,celAt(0,0.105,-0.14,0,0,0,0.036,0.0105,0.09)]]),a,0,0,0,body,0.006);
  celM(celMerge([[ball,celAt(0,0.085,0.025,0,0,0,0.054,0.048,0.072)]]),toon({color:c2}),0,0,0,body);
  celM(celMerge([[ball,celAt(0,0.165,0.135,0,0,0,0.016,0.016,0.038)]]),toon({color:'#d99a3a'}),0,0,0,body,0.003);
  const dk=new THREE.MeshBasicMaterial({color:0x1a1410}); [-1,1].forEach(s=>{ const e=new THREE.Mesh(ball,dk); e.scale.setScalar(0.012); e.position.set(s*0.036,0.182,0.108); body.add(e); });
  const wingG=celMerge([[ball,celAt(0,0,0,0,0,0,0.114,0.0108,0.066)]]), wings=[-1,1].map(s=>{ const piv=new THREE.Group(); piv.position.set(s*0.05,0.13,0); celM(wingG,toon({color:shade(c1,0.8)}),s*0.1,0,-0.01,piv,0.004); body.add(piv); return piv; });
  g.scale.setScalar(1.2); g.traverse(m=>{ if(m.isMesh&&!m.userData.outline) m.castShadow=true; });
  return {g,body,wings,st:2,t:0,dur:2+i*1.3,from:new THREE.Vector3(),to:new THREE.Vector3(),hop:0,ry:i*1.3,peck:0,act:0.5+i*0.4}; }
/* a small bird's every moment, as on the trail: gliding in to land; or, once down, hopping, pecking and looking about, and now and then
   off to another spot. spot() picks where it goes next. */
function birdStep(b,dt,spot,still){ b.t+=dt;
  if(b.st===1){ const u=Math.min(1,b.t/b.dur), e=1-(1-u)*(1-u); b.g.position.lerpVectors(b.from,b.to,e); b.g.position.y+=Math.sin(u*Math.PI)*0.75+0.06*Math.sin(b.t*9)*(1-u);
    b.ry=Math.atan2(b.to.x-b.from.x,b.to.z-b.from.z); b.body.rotation.x=-0.3; b.wings.forEach((w,k)=>{ w.rotation.z=(k?1:-1)*0.95*Math.sin(b.t*34); }); if(u>=1){ b.st=2; b.t=0; b.dur=5+Math.random()*9; b.act=0.5; b.hop=0; b.peck=0; } }
  else { b.wings.forEach((w,k)=>{ w.rotation.z=(k?1:-1)*-1.25; }); b.act-=dt;
    if(!still&&b.act<=0&&b.hop<=0){ const q=Math.random(); b.act=0.45+Math.random()*1.3; if(q<0.34) b.ry+=(Math.random()-0.5)*2.6; else if(q<0.7) b.peck=0.42; else { b.hop=0.26; b.ry+=(Math.random()-0.5)*1.2; } }
    if(b.hop>0){ b.hop-=dt; b.g.position.x+=Math.sin(b.ry)*dt; b.g.position.z+=Math.cos(b.ry)*dt; }
    b.g.position.y=b.hop>0?Math.sin(Math.PI*(1-b.hop/0.26))*0.09:0;
    if(b.peck>0){ b.peck-=dt; b.body.rotation.x=1.0*Math.sin(Math.PI*clamp(1-b.peck/0.42,0,1)); } else b.body.rotation.x=0;
    if(!still&&(b.t>b.dur||!spot(b.g.position,true))){ b.from.copy(b.g.position); spot(b.to); b.st=1; b.t=0; b.dur=1.1+b.from.distanceTo(b.to)*0.35; } }
  b.g.rotation.y=b.ry; }
