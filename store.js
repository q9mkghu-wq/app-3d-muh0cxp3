/* 드레스룸 스토어 공통 데이터와 장바구니. store-data.js(빌드가 planner에서 뽑아 만듦)를 먼저 불러와야 해요. */
(function(){
const D=window.STORE_DATA||{};
const PILLAR={white:{name:'화이트',hex:'#ECECE9'},black:{name:'블랙',hex:'#2A2B2E'},silver:{name:'실버',hex:'#B6B9BC'}};
const SHELF={
  white:{name:'화이트',hex:'#F7F7F4',desc:'심플하고 세련된 순백의 솔리드 화이트 컬러예요.'},
  warmbeige:{name:'웜베이지',hex:'#DCD4C6',desc:'따뜻한 잿빛이 감도는 베이지 톤의 그레이 컬러예요.'},
  babypink:{name:'베이비핑크',hex:'#F6E3DC',desc:'우유에 핑크 한 방울, 순수하고 부드러운 연핑크예요.'},
  cottonblue:{name:'코튼블루',hex:'#C9D6D6',desc:'부드럽고 차분하게 톤 다운된, 은은하고 포근한 연블루예요.'},
  browngray:{name:'브라운 그레이',hex:'#6F6760',bg:'linear-gradient(160deg,#7a716a,#5f5852)',desc:'브라운과 그레이의 나뭇결이 어우러진 컬러예요.'},
  walnut:{name:'월넛',hex:'#6B4E3F',bg:'linear-gradient(160deg,#7a5a49,#5a4136)',desc:'자연스러운 나뭇결과 따뜻한 브라운 톤이 매력적인 월넛이에요.'},
  lightoak:{name:'라이트 오크',hex:'#DDBA8B',bg:'linear-gradient(160deg,#e6c79d,#cfa874)',desc:'자연스러운 나뭇결의 따뜻한 느낌을 주는 라이트 오크예요.'},
  marble:{name:'마블스톤',hex:'#ECEBE7',bg:'linear-gradient(135deg,#f2f1ed 40%,#cfcfcf 46%,#f2f1ed 52%,#e3e2de)',desc:'우아한 마블 패턴이 더해져 고급스럽고 세련된 컬러예요.'}};
const TYPES={hang2:{name:'2단 상하행거',short:'2단 행거',kind:'bay'},hangTop:{name:'1단 상부 긴행거',short:'상부 긴행거',kind:'bay'},hangBot:{name:'1단 하부 긴행거',short:'하부 긴행거',kind:'bay'},
  drawer3:{name:'3단 서랍장형',short:'3단 서랍형',kind:'bay',opt:'drawer3'},shelf5:{name:'5단 선반장',short:'5단 선반',kind:'bay',opt:'shelf5'},corner:{name:'코너장',short:'코너장',kind:'corner'},
  island4:{name:'아일랜드 서랍장',short:'아일랜드 서랍',kind:'free'},chest4:{name:'4단 서랍장',short:'4단 서랍장',kind:'free'},islandOpen:{name:'아일랜드 수납장',short:'아일랜드 수납',kind:'free'},mirrorCab:{name:'전신거울장',short:'전신거울장',kind:'free'}};
const OPTS=[["acc1","1단 악세서리장","W80×D40×H14cm"],["drawer2top","2단 서랍장(상단)","W80×D40×H26cm"],["pants2","2단 바지걸이장","W80×D40×H26cm"],["drawer2bot","2단 서랍장(하단)","W80×D40×H43cm"],["quilt","이불 수납장","W80×D42×H80cm"],["drawer3","3단 서랍장","W80×D40×H64cm"],["shelf5","5단 선반장","W40×D40cm, 5단"],["pullMirror","인출식 거울","W35×H100cm"],["cornerShelf","코너선반 추가","W×D 맞춤"],["island4","아일랜드 서랍장","W80×D40×H80cm"],["chest4","4단 서랍장","W80×D40×H80cm"],["islandOpen","아일랜드 수납장","W80×D40×H80cm"],["mirrorCab","전신거울장","W40×D40×H190cm"],["measure","전문가 방문 실측","서울·경기 한정"]].map(([k,name,size])=>({k,name,size}));
const REGIONS=[['metro','서울·경기·수도권',0],['incheon-isl','인천 영종도·강화도',30000],['gw1','강원 철원·춘천·원주',50000],['gw2','강원 그 외 지역',70000],['cc','충청도·세종·대전',50000],['jg','전라도·경상도',100000]];
const DEFAULT_PRICE={"unit-white":12000,"unit-warmbeige":12000,"unit-babypink":12000,"unit-cottonblue":12000,"unit-browngray":12000,"unit-walnut":12000,"unit-lightoak":12000,"unit-marble":12000,"pillar-white":0,"pillar-black":0,"pillar-silver":0,"fee-under24":50000,"fee-under15":80000};
let PRICE=Object.assign({},DEFAULT_PRICE,D.prices||{});
let SETS=Array.isArray(D.sets)?D.sets.filter(validSet):[];
function validSet(s){return s&&typeof s.k==='string'&&typeof s.g==='string'&&Array.isArray(s.items)&&s.items.length&&s.items.every(m=>m&&TYPES[m.t])}

const won=n=>Math.round(n).toLocaleString('ko-KR')+'원';
const cm=v=>(Math.round(v*10)/10).toLocaleString('ko-KR',{maximumFractionDigits:1});
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const optOf=k=>OPTS.find(o=>o.k===k);
const optPrice=k=>{const v=PRICE['opt-'+k];return typeof v==='number'?v:null};
const unitOf=(p,s)=>(PRICE['unit-'+s]||0)+(PRICE['pillar-'+p]||0);

function varName(t,o,short){o=o||{};
  if(t==='hangTop'&&o.low==='drawer2bot')return short?'상부 긴행거 + 하단 서랍':'1단 상부 긴행거 + 2단 서랍장(하단)';
  if(t==='hangBot'){if(o.up==='acc1')return '1단 악세서리장형';if(o.up==='drawer2top')return short?'2단 서랍장형':'2단 서랍장(상단)형';if(o.up==='pants2')return '2단 바지걸이장형';if(o.low==='quilt')return '이불 수납장형'}
  return null}
/* 세트 계산 (mm 단위 데이터) */
function runLen(m){const T=TYPES[m.t];return T.kind==='bay'?m.w+30:T.kind==='corner'?m.w+(m.w2||m.w)+30-400:0}
function setInfo(s){
  let L=0;const bays=new Map(),opts=new Map(),add=k=>opts.set(k,(opts.get(k)||0)+1);
  s.items.forEach(m=>{const T=TYPES[m.t];L+=runLen(m);if(T.kind!=='free'){const nm=(T.kind==='bay'&&varName(m.t,m.o))||T.name;bays.set(nm,(bays.get(nm)||0)+1)}
    if(T.kind==='free')add(m.t);if(T.opt)add(T.opt);const o=m.o||{};if(o.up)add(o.up);if(o.low)add(o.low);if(o.mir)add('pullMirror');for(let i=0;i<(o.cs||0);i++)add('cornerShelf')});
  return{lengthCm:Math.round(L)/10,bays:[...bays],opts:[...opts]};
}
function setMods(s){return [...s.items].sort((a,b)=>(a.y-b.y)||(a.x-b.x)).map(m=>{const T=TYPES[m.t];return T.kind==='bay'?`${varName(m.t,m.o,true)||T.short} ${cm(m.w/10)}`:T.short}).join(' + ')}
function setBox(s){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;s.items.forEach(m=>{const T=TYPES[m.t];let w,h;
  if(T.kind==='corner'){const U=m.w+15,V=(m.w2||m.w)+15;[w,h]=m.r%180===0?[U,V]:[V,U]}
  else{const L=T.kind==='free'?(m.t==='mirrorCab'?430:800):m.w+30,Dp=400;[w,h]=m.r%180===0?[L,Dp]:[Dp,L]}
  x0=Math.min(x0,m.x);y0=Math.min(y0,m.y);x1=Math.max(x1,m.x+w);y1=Math.max(y1,m.y+h)});return{w:(x1-x0)/10,h:(y1-y0)/10}}

/* 금액 (개수 표시 없이 설치 길이 기준) */
function price(item){
  const unit=unitOf(item.pillar,item.shelf),L=+item.lengthCm||0;
  const sys=Math.round(L/10)*unit;
  const fee=L<=0?0:L<150?(PRICE['fee-under15']||0):L<240?(PRICE['fee-under24']||0):0;
  let opt=0;const unknown=[],lines=[];
  (item.opts||[]).forEach(([k,n])=>{const o=optOf(k);if(!o||!(n>0))return;const p=optPrice(k);if(p==null)unknown.push(o.name);else opt+=p*n;lines.push([`${o.name} × ${n}`,p==null?'가격 문의':won(p*n)])});
  return{sys,fee,opt,lines,unknown,total:sys+fee+opt};
}

/* 장바구니 */
const CART_KEY='broad-store-cart';
function cart(){try{const a=JSON.parse(localStorage.getItem(CART_KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&PILLAR[x.pillar]&&SHELF[x.shelf]&&x.lengthCm>0):[]}catch(e){return[]}}
function saveCart(a){try{localStorage.setItem(CART_KEY,JSON.stringify(a));return true}catch(e){return false}}
function addCart(item){const a=cart();a.push(Object.assign({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),at:Date.now()},item));const ok=saveCart(a);updateCount();return ok}
function updateCount(){document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cart().length)}
window.addEventListener('storage',e=>{if(e.key===CART_KEY){updateCount();document.dispatchEvent(new Event('cartchange'))}});

/* 관리자가 Firebase에 저장한 단가·세트 */
async function loadRemote(){const F=D.firebase;if(!F||!F.apiKey||!F.projectId)return false;
  try{const r=await fetch(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(F.projectId)}/databases/(default)/documents/planner/config?key=${encodeURIComponent(F.apiKey)}`,{cache:'no-store'});
    if(!r.ok)return false;const j=await r.json(),d=JSON.parse(j.fields.data.stringValue);
    if(d.prices&&typeof d.prices==='object')PRICE=Object.assign({},DEFAULT_PRICE,d.prices);
    if(Array.isArray(d.sets)){const v=d.sets.filter(validSet);if(v.length)SETS=v}
    return true}catch(e){return false}}

let tt;function toast(m){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3200)}

window.Store={PILLAR,SHELF,TYPES,OPTS,REGIONS,get PRICE(){return PRICE},get SETS(){return SETS},won,cm,esc,optOf,optPrice,unitOf,setInfo,setMods,setBox,price,cart,saveCart,addCart,updateCount,loadRemote,toast};
document.addEventListener('DOMContentLoaded',updateCount);
})();
