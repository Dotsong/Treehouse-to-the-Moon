/* ---------- the cel-shaded Michelle ---------- */
/* The same girl on the same joints (hips, knees, ankles, shoulders, elbows, wrists, neck, all in the same places as the rig from Treehouse
   to the Moon, so anything that animates one animates the other), but nothing small is modelled. Each part is one smooth shape, and what
   used to be built from hundreds of little pieces is painted on it instead: her face, the fall and fringe of her hair, the pleats, seams,
   buttons, collar and belt of her dress, the stitching and patch on her hat, her striped stockings, and Big Boss's face, belly and folded
   arms. The paint is flat color with dark lines; the light falls in three hard bands; a dark shell behind each shape draws its outline. */
const INK='#2a1424';
const CEL={ dress:'#2f6a45', dressDeep:'#24563a', dressLine:'#1c4630', hair:'#74301f', hairDeep:'#5a2416', hairHi:'#a2492c', skin:'#f1c4a2', skinDeep:'#d59a78', blush:'#f2a08e', felt:'#3d3049', feltDeep:'#2f2439', band:'#9e7591', bandDeep:'#6b4560',
  patch:'#7f5a96', thread:'#efe2c6', tights:'#9e7591', stripe:'#f3e8d4', boot:'#3d3d42', bootDeep:'#26262b', cream:'#fff7ee', leather:'#8a5a38', leatherDeep:'#5e3b24', brass:'#c9a45c', fur:'#2b2427', furDeep:'#1c1719', belly:'#f3ece2', pink:'#e9a3a3', pinkDeep:'#d98b8f' };
let celTextures=0;
function celTex(w,h,draw){ const c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); const t=new THREE.CanvasTexture(c); t.anisotropy=4; celTextures++; return t; }
const celRamp=(()=>{ const t=new THREE.DataTexture(new Uint8Array([74,120,152]),3,1,THREE.LuminanceFormat); t.minFilter=t.magFilter=THREE.NearestFilter; t.needsUpdate=true; return t; })();   /* three bands of light: shade, mid, lit */
const toon=o=>new THREE.MeshToonMaterial(Object.assign({gradientMap:celRamp},o));
/* the outline: the same shape again, swollen a little along its normals, turned inside out and painted dark */
function celLine(mesh,th,map){ const m=new THREE.MeshBasicMaterial({color:map?0x4a3038:0x2a1424,side:THREE.BackSide,map:map||null,alphaTest:map?0.5:0}); m.userData.th={value:th};
  m.onBeforeCompile=s=>{ s.uniforms.uTh=m.userData.th; s.vertexShader='uniform float uTh;\n'+s.vertexShader.replace('#include <begin_vertex>','vec3 transformed = position + normalize(normal)*uTh;'); };
  const o=new THREE.Mesh(mesh.geometry,m); o.userData.outline=true; mesh.add(o); return mesh; }
function celM(geo,mat,x,y,z,parent,line,lineMap){ const m=new THREE.Mesh(geo,mat); m.position.set(x||0,y||0,z||0); if(parent) parent.add(m); if(line) celLine(m,line,lineMap); return m; }
/* a shape turned on a lathe, with its seam at the back, so the middle of its picture is the front */
function celLathe(pts,seg){ const g=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(Math.max(0.0001,p[0]),p[1])),seg); g.rotateY(Math.PI); return g; }
const vOf=(pts,y)=>{ const n=pts.length; for(let i=0;i<n-1;i++){ const a=pts[i][1], b=pts[i+1][1]; if((y>=a&&y<=b)||(y<=a&&y>=b)) return (i+(b===a?0:(y-a)/(b-a)))/(n-1); } return y<pts[0][1]?0:1; };
const celSm=(a,b,x)=>{ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
function celDeform(geo,f){ const p=geo.attributes.position, v=new THREE.Vector3(); for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i); f(v); p.setXYZ(i,v.x,v.y,v.z); } geo.computeVertexNormals(); return geo; }
/* where a point on the front of a ball lands in the ball's picture (px,py measured from its middle), and how many pixels one unit is there */
/* several shapes welded into one, each placed by its own matrix: for small things of one color that would otherwise be dozens of parts */
function celMerge(parts){ const pos=[], nor=[], v=new THREE.Vector3(), nm=new THREE.Matrix3();
  for(const [g0,m] of parts){ const g=g0.index?g0.toNonIndexed():g0, p=g.attributes.position, n=g.attributes.normal; nm.getNormalMatrix(m);
    for(let i=0;i<p.count;i++){ v.fromBufferAttribute(p,i).applyMatrix4(m); pos.push(v.x,v.y,v.z); v.fromBufferAttribute(n,i).applyMatrix3(nm).normalize(); nor.push(v.x,v.y,v.z); } }
  const out=new THREE.BufferGeometry(); out.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); out.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3)); return out; }
const celAt=(x,y,z,rx,ry,rz,sx,sy,sz)=>new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)),new THREE.Vector3(sx,sy===undefined?sx:sy,sz===undefined?sx:sz));
const ballAt=(R,W,H)=>(px,py)=>{ const th=Math.acos(clamp(py/R,-1,1)), a=Math.asin(clamp(px/(R*Math.sin(th)||1),-1,1)); return [(0.25+a/(Math.PI*2))*W,th/Math.PI*H]; };

