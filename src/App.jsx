import { useState, useEffect } from "react";

const WA_NUMBER = "+8618157970409";
const SHEET_ID = "1MSwdIxakWwu7G6GbRjjJsUx5UNOnCxrAWYmXGTkdP_Y";
// Use CSV export URL for better compatibility
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

const openWhatsApp = (productName, productCode) => {
  const msg = encodeURIComponent(
    `Hi! I'm interested in the following item from HUEPAN:\n\n🛍️ ${productName} (${productCode})\n\nIs it available? Thank you!`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
};

const SAN = "'Inter', 'PingFang SC', 'Helvetica Neue', system-ui, -apple-system, Arial, sans-serif";
const SER = "'Playfair Display', Georgia, 'Times New Roman', serif";

// New broader categories for general merchandise
const CAT_EN = {
  "串珠": "DIY Accessories",
  "吊坠配件": "DIY Accessories",
  "链条线材": "DIY Accessories",
  "五金配件": "DIY Accessories",
  "工具": "Daily Essentials",
};

const CAT_CONFIG = {
  "DIY Accessories": { icon:"🧵", color:"#FF6B6B", bg:"#fff5f5", desc:"Beads, charms, chains & findings" },
  "Outdoor & Sport": { icon:"🏕️", color:"#00C9A7", bg:"#f0fdfa", desc:"Camping, hiking & sport gear" },
  "Home Decor":      { icon:"🏡", color:"#5E60CE", bg:"#f0f4ff", desc:"Decorations & living essentials" },
  "Daily Essentials":{ icon:"✨", color:"#9B5DE5", bg:"#f8f0ff", desc:"Everyday must-haves" },
  "Stationery":      { icon:"📝", color:"#F72585", bg:"#fff0f7", desc:"Notebooks, pens & craft tools" },
};

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g,"").trim());
  return lines.slice(1).map(line => {
    const values=[]; let cur="",inQ=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){inQ=!inQ;}
      else if(ch===','&&!inQ){values.push(cur.trim());cur="";}
      else{cur+=ch;}
    }
    values.push(cur.trim());
    const obj={};
    headers.forEach((h,i)=>{obj[h]=(values[i]||"").replace(/^"|"$/g,"");});
    return obj;
  }).filter(r=>r.id);
}

function driveImgUrl(url) {
  if (!url) return null;
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  return url;
}

function getCatEn(p) {
  return CAT_EN[p.cat] || "Daily Essentials";
}

function getCfg(catEn) {
  return CAT_CONFIG[catEn] || { color:"#f59e6c", bg:"#fff7f0" };
}

function WhatsAppIcon({ size=20, color="#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.504L4 29l7.752-2.033A12.95 12.95 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill={color}/>
      <path d="M22.4 19.6c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.21 3.05c.15.2 2.08 3.17 5.04 4.45.7.3 1.25.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.19-.57-.34z" fill={color==="#fff"?"#25D366":"#fff"}/>
    </svg>
  );
}

function ProductShape({ cat, color, size=60 }) {
  const c = color || "#f59e6c";
  if(cat==="串珠"||cat==="DIY Accessories") return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {[8,20,30,42,54].map((x,i)=>(
        <circle key={i} cx={x} cy="30" r={i===2?10:i===1||i===3?7:5} fill={c} opacity={0.2+i*0.13}/>
      ))}
      <line x1="2" y1="30" x2="58" y2="30" stroke={c} strokeWidth="1.5" opacity="0.35"/>
    </svg>
  );
  if(cat==="吊坠配件") return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="14" r="6" stroke={c} strokeWidth="2" fill="none"/>
      <line x1="30" y1="20" x2="30" y2="32" stroke={c} strokeWidth="2"/>
      <path d="M18 48 Q30 32 42 48 Q30 60 18 48Z" fill={c} opacity="0.75"/>
    </svg>
  );
  if(cat==="链条线材") return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {[0,1,2,3,4].map(i=>(
        <ellipse key={i} cx={6+i*12} cy="30" rx="5" ry="3.5" stroke={c} strokeWidth="1.8" fill="none" opacity={0.4+i*0.1}/>
      ))}
    </svg>
  );
  if(cat==="五金配件") return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="24" cy="30" r="13" stroke={c} strokeWidth="2.5" fill="none"/>
      <path d="M37 30 Q46 21 54 23 Q56 30 54 37 Q46 39 37 30Z" fill={c} opacity="0.65"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <rect x="10" y="22" width="32" height="16" rx="8" fill={c} opacity="0.55"/>
      <rect x="40" y="18" width="12" height="24" rx="5" fill={c} opacity="0.85"/>
    </svg>
  );
}

// ── Detail Page ──────────────────────────────────────────────────────────────
function DetailPage({ p, onBack }) {
  const [imgError, setImgError] = useState(false);
  const imgUrl = driveImgUrl(p.image);
  const catEn = getCatEn(p);
  const cfg = getCfg(catEn);

  useEffect(()=>{ window.scrollTo(0,0); },[]);

  return (
    <div style={{ minHeight:"100vh", background:"#f8f7f4" }}>
      {/* Breadcrumb */}
      <div style={{ background:"#fff", borderBottom:"1px solid #eee", padding:"0 32px", height:"48px", display:"flex", alignItems:"center", gap:"8px", position:"sticky", top:"64px", zIndex:50 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:SAN, fontSize:"13px", color:"#999", padding:0 }}>← Shop</button>
        <span style={{ color:"#ddd" }}>/</span>
        <span style={{ fontFamily:SAN, fontSize:"13px", color:cfg.color, fontWeight:700 }}>{catEn}</span>
        <span style={{ color:"#ddd" }}>/</span>
        <span style={{ fontFamily:SAN, fontSize:"13px", color:"#333", fontWeight:600 }}>{p.en}</span>
      </div>

      <div style={{ maxWidth:"1080px", margin:"0 auto", padding:"48px 32px 80px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"56px", alignItems:"start" }}>
        {/* LEFT: Image */}
        <div>
          <div style={{ borderRadius:"20px", overflow:"hidden", aspectRatio:"1/1", background:`linear-gradient(145deg,${cfg.bg},#fff)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", border:`1.5px solid ${cfg.color}22` }}>
            {imgUrl && !imgError ? (
              <img src={imgUrl} alt={p.en} onError={()=>setImgError(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            ) : (
              <div style={{ textAlign:"center" }}>
                <div style={{ transform:"scale(2.6)", opacity:0.55, marginBottom:"20px" }}><ProductShape cat={p.cat} color={cfg.color} size={60}/></div>
                <p style={{ fontFamily:SAN, fontSize:"10px", color:"#ccc", letterSpacing:"2px", marginTop:"48px" }}>IMAGE COMING SOON</p>
              </div>
            )}
            {p.tag && (
              <span style={{ position:"absolute", top:"14px", left:"14px", background:p.tag==="新品"?"#10b981":"#f59e0b", color:"#fff", fontSize:"10px", fontFamily:SAN, fontWeight:700, letterSpacing:"1.5px", padding:"4px 12px", borderRadius:"6px" }}>
                {p.tag==="新品"?"NEW":"HOT"}
              </span>
            )}
          </div>
          {/* Thumbnails */}
          <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
            {[1,2,3,4].map(i=>(
              <div key={i} style={{ flex:1, aspectRatio:"1/1", borderRadius:"10px", background:cfg.bg, border:i===1?`2px solid ${cfg.color}`:`1px solid ${cfg.color}22`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <div style={{ opacity:0.3, transform:"scale(0.55)" }}><ProductShape cat={p.cat} color={cfg.color} size={60}/></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Info */}
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
            <span style={{ fontFamily:SAN, fontSize:"10px", letterSpacing:"2px", color:"#bbb", fontWeight:600 }}>{p.id}</span>
            <span style={{ width:"1px", height:"12px", background:"#e0dbd3" }}/>
            <span style={{ fontFamily:SAN, fontSize:"10px", letterSpacing:"2px", color:cfg.color, fontWeight:700 }}>{catEn.toUpperCase()}</span>
          </div>
          <h1 style={{ fontFamily:SER, fontSize:"28px", fontWeight:700, color:"#1a1a1a", lineHeight:1.3, marginBottom:"6px" }}>{p.en}</h1>
          <p style={{ fontFamily:SAN, fontSize:"13px", color:"#bbb", marginBottom:"24px" }}>{p.name}</p>

          {/* Price */}
          <div style={{ display:"flex", alignItems:"baseline", gap:"6px", marginBottom:"24px", padding:"18px 20px", background:cfg.bg, borderRadius:"12px", border:`1px solid ${cfg.color}22` }}>
            <span style={{ fontFamily:SER, fontSize:"36px", fontWeight:700, color:cfg.color, letterSpacing:"-1px" }}>{p.price}</span>
            <span style={{ fontFamily:SAN, fontSize:"13px", color:"#bbb" }}>{p.unit}</span>
          </div>

          {/* Desc */}
          <p style={{ fontFamily:SAN, fontSize:"14px", color:"#555", lineHeight:1.9, marginBottom:"24px", paddingBottom:"24px", borderBottom:"1px solid #f0ede8" }}>{p.detail_desc || p.desc}</p>

          {/* Specs */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"28px" }}>
            {[
              {label:"Material",value:p.material},
              {label:"Size",value:p.size},
              {label:"Colours",value:p.color_options},
              {label:"Category",value:catEn},
            ].filter(s=>s.value).map(spec=>(
              <div key={spec.label} style={{ padding:"13px 16px", background:"#fff", borderRadius:"10px", border:"1px solid #f0ede8" }}>
                <div style={{ fontFamily:SAN, fontSize:"9px", letterSpacing:"2px", color:"#ccc", fontWeight:700, marginBottom:"4px" }}>{spec.label.toUpperCase()}</div>
                <div style={{ fontFamily:SAN, fontSize:"13px", color:"#333", fontWeight:500 }}>{spec.value}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={()=>openWhatsApp(p.en,p.id)} style={{ width:"100%", padding:"16px", background:"#25D366", color:"#fff", border:"none", borderRadius:"12px", fontFamily:SAN, fontWeight:700, fontSize:"15px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", boxShadow:"0 6px 20px rgba(37,211,102,0.3)", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}
          >
            <WhatsAppIcon size={18}/> Order via WhatsApp
          </button>
          <p style={{ fontFamily:SAN, fontSize:"11px", color:"#bbb", textAlign:"center", marginTop:"10px" }}>Fast reply · Worldwide shipping available</p>

          <div style={{ display:"flex", gap:"8px", marginTop:"20px", flexWrap:"wrap" }}>
            {["🌍 Worldwide Shipping","📦 Retail & Wholesale","✅ Quality Assured"].map(b=>(
              <span key={b} style={{ fontFamily:SAN, fontSize:"11px", color:"#888", background:cfg.bg, borderRadius:"6px", padding:"5px 12px", border:`1px solid ${cfg.color}22` }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ p, idx, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imgUrl = driveImgUrl(p.image);
  const catEn = getCatEn(p);
  const cfg = getCfg(catEn);

  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={onClick}
      style={{ background:"#fff", borderRadius:"16px", overflow:"hidden", cursor:"pointer", border:`1.5px solid ${hovered?cfg.color:"#eeebe5"}`, transition:"all 0.22s", display:"flex", flexDirection:"column", boxShadow:hovered?`0 10px 30px ${cfg.color}22`:"0 2px 8px rgba(0,0,0,0.04)", transform:hovered?"translateY(-4px)":"none", animationDelay:`${idx*0.04}s`, animationFillMode:"both" }}
      className="card-in"
    >
      <div style={{ height:"190px", position:"relative", overflow:"hidden", background:`linear-gradient(145deg,${cfg.bg},#fff)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {imgUrl && !imgError ? (
          <img src={imgUrl} alt={p.en} onError={()=>setImgError(true)} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s", transform:hovered?"scale(1.06)":"scale(1)" }}/>
        ) : (
          <div style={{ opacity:hovered?0.85:0.55, transition:"all 0.3s", transform:hovered?"scale(1.08)":"scale(1)" }}>
            <ProductShape cat={p.cat} color={cfg.color} size={64}/>
          </div>
        )}
        {p.tag && (
          <span style={{ position:"absolute", top:"10px", left:"10px", background:p.tag==="新品"?"#10b981":"#f59e0b", color:"#fff", fontSize:"9px", fontFamily:SAN, fontWeight:700, letterSpacing:"1.5px", padding:"3px 9px", borderRadius:"4px" }}>
            {p.tag==="新品"?"NEW":"HOT"}
          </span>
        )}
        <div style={{ position:"absolute", inset:0, background:`${cfg.color}08`, display:"flex", alignItems:"center", justifyContent:"center", opacity:hovered?1:0, transition:"opacity 0.22s" }}>
          <span style={{ background:"#fff", color:cfg.color, fontFamily:SAN, fontSize:"11px", fontWeight:700, letterSpacing:"2px", padding:"8px 18px", borderRadius:"6px", border:`1px solid ${cfg.color}` }}>VIEW →</span>
        </div>
      </div>

      <div style={{ padding:"14px 16px 16px", flex:1, display:"flex", flexDirection:"column" }}>
        <span style={{ fontFamily:SAN, fontSize:"9px", letterSpacing:"2px", color:cfg.color, fontWeight:700, marginBottom:"5px" }}>{catEn.toUpperCase()}</span>
        <h3 style={{ fontFamily:SER, fontSize:"14px", fontWeight:700, color:"#1a1a1a", lineHeight:1.4, margin:"0 0 4px", flex:1 }}>{p.en}</h3>
        <p style={{ fontFamily:SAN, fontSize:"11px", color:"#bbb", margin:"0 0 12px" }}>{p.name}</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:"3px" }}>
            <span style={{ fontFamily:SER, fontSize:"18px", fontWeight:700, color:"#1a1a1a" }}>{p.price}</span>
            <span style={{ fontFamily:SAN, fontSize:"10px", color:"#bbb" }}>{p.unit}</span>
          </div>
          <button onClick={e=>{e.stopPropagation();openWhatsApp(p.en,p.id);}} style={{ background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.color}33`, borderRadius:"6px", padding:"5px 10px", fontFamily:SAN, fontSize:"10px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"4px", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background=cfg.color;e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background=cfg.bg;e.currentTarget.style.color=cfg.color;}}
          >
            <WhatsAppIcon size={11} color={cfg.color}/> Order
          </button>
        </div>
      </div>
    </div>
  );
}

const STRIPS = ["✦ VIBRANT FINDS WEEKLY ✦","✦ BOLD COLORS • CURATED PIECES ✦","✦ WORLDWIDE SHIPPING ✦","✦ RETAIL & WHOLESALE WELCOME ✦","✦ QUALITY YOU'LL LOVE ✦"];

// ── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    fetch(SHEET_URL)
      .then(r=>{
        if(!r.ok) throw new Error("fetch failed");
        return r.text();
      })
      .then(text=>{
        const data = parseCSV(text);
        setProducts(data);
        setLoading(false);
      })
      .catch(err=>{
        console.error(err);
        setError(true);
        setLoading(false);
      });
  },[]);

  const allCatLabels = ["All",...Object.keys(CAT_CONFIG)];
  const usedCats = new Set(products.map(p=>getCatEn(p)));
  const catLabels = ["All", ...Object.keys(CAT_CONFIG).filter(c => usedCats.has(c))];

  const filtered = products.filter(p=>{
    const pCatEn = getCatEn(p);
    const matchCat = cat==="All"||pCatEn===cat;
    const q = search.toLowerCase();
    const matchSearch = !q||p.name.includes(q)||p.en.toLowerCase().includes(q)||p.id.toLowerCase().includes(q);
    return matchCat&&matchSearch;
  });

  const Nav = ()=>(
    <header style={{ position:"sticky", top:0, zIndex:100, height:"64px", background:scrolled?"rgba(255,255,255,0.96)":"#fff", borderBottom:"1px solid #eee", backdropFilter:"blur(12px)", boxShadow:scrolled?"0 1px 16px rgba(0,0,0,0.07)":"none", transition:"all 0.3s" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 32px", height:"100%", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div onClick={()=>setDetail(null)} style={{ cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"0px" }}>
          <span style={{ fontFamily:SER, fontSize:"24px", fontWeight:800, background:"linear-gradient(135deg,#FF6B6B 0%,#4ECDC4 35%,#9B5DE5 70%,#F7B731 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-1px" }}>HUEPAN</span>
          <span style={{ fontFamily:SAN, fontSize:"9px", fontWeight:700, color:"#FF6B6B", letterSpacing:"3px", marginTop:"-2px" }}>VIBRANT LIVING</span>
        </div>
        <nav style={{ display:"flex", gap:"28px", alignItems:"center" }}>
          {["Home","Shop","About","Contact"].map(l=>(
            <a key={l} href="#"
              onClick={l==="Shop"?e=>{e.preventDefault();setDetail(null);document.getElementById("shop")?.scrollIntoView({behavior:"smooth"});}:undefined}
              style={{ fontFamily:SAN, fontSize:"13px", fontWeight:600, color:"#666", textDecoration:"none", transition:"color 0.2s" }}
              onMouseEnter={e=>e.target.style.color="#f59e6c"}
              onMouseLeave={e=>e.target.style.color="#666"}
            >{l}</a>
          ))}
          <button onClick={()=>openWhatsApp("General Enquiry","—")} style={{ background:"linear-gradient(135deg,#25D366,#1fb85a)", color:"#fff", border:"none", borderRadius:"8px", padding:"9px 18px", fontFamily:SAN, fontSize:"12px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"6px", boxShadow:"0 4px 12px rgba(37,211,102,0.3)" }}>
            <WhatsAppIcon size={13}/> WhatsApp
          </button>
        </nav>
      </div>
    </header>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8f7f4" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#f8f7f4;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:#f8f7f4;}
        ::-webkit-scrollbar-thumb{background:#e0dbd3;border-radius:4px;}
        @keyframes cardIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .card-in{animation:cardIn 0.45s ease both;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        .fade-up{animation:fadeUp 0.7s ease both;}
        @keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        .marquee-track{display:flex;animation:marquee 30s linear infinite;white-space:nowrap;}
        .cat-tab{border:1.5px solid #eee;border-radius:999px;padding:10px 22px;font-family:${SAN};font-size:12px;font-weight:700;letter-spacing:0.5px;color:#555;cursor:pointer;transition:all 0.2s;white-space:nowrap;background:#fff;}
        .cat-tab:hover{border-color:#FF6B6B;color:#FF6B6B;transform:translateY(-1px);}
        .cat-tab.active{background:linear-gradient(135deg,#FF6B6B,#9B5DE5);border-color:transparent;color:#fff;box-shadow:0 4px 12px rgba(255,107,107,0.3);}
        .search-box{border:1.5px solid #eee;border-radius:8px;padding:9px 16px 9px 40px;font-family:${SAN};font-size:13px;color:#1a1a1a;background:#fff;outline:none;transition:border-color 0.2s;width:220px;}
        .search-box:focus{border-color:#f59e6c;}
        .search-box::placeholder{color:#ccc;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .spinner{width:36px;height:36px;border:2px solid #eee;border-top-color:#f59e6c;border-radius:50%;animation:spin 0.7s linear infinite;margin:80px auto;}
        .wa-btn{position:fixed;bottom:28px;right:28px;z-index:200;background:linear-gradient(135deg,#25D366,#1fb85a);border-radius:50%;width:56px;height:56px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(37,211,102,0.35);cursor:pointer;border:none;transition:transform 0.2s;}
        .wa-btn:hover{transform:scale(1.1);}
        @keyframes pulse{0%,100%{box-shadow:0 4px 16px rgba(37,211,102,0.35);}50%{box-shadow:0 4px 28px rgba(37,211,102,0.55);}}
        .wa-btn{animation:pulse 2.5s ease infinite;}
      `}</style>

      <Nav/>

      {detail ? (
        <DetailPage p={detail} onBack={()=>setDetail(null)}/>
      ) : (
        <>
          {/* Ticker */}
          <div style={{ background:"linear-gradient(90deg,#1a1a2e,#16213e,#0f3460)", overflow:"hidden", padding:"10px 0" }}>
            <div className="marquee-track">
              {[...STRIPS,...STRIPS,...STRIPS].map((s,i)=>(
                <span key={i} style={{ fontFamily:SAN, fontSize:"11px", letterSpacing:"2px", color:"#666", padding:"0 32px", fontWeight:600 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Hero */}
          <section style={{ background:"linear-gradient(160deg,#fff 0%,#faf8f5 60%,#f5f0eb 100%)", borderBottom:"1px solid #f0e9e2", padding:"100px 32px 90px", textAlign:"center", position:"relative", overflow:"hidden" }}>
            {/* Background blobs - vibrant */}
            <div style={{ position:"absolute", top:"-120px", left:"-80px", width:"420px", height:"420px", borderRadius:"50%", background:"radial-gradient(circle,#FF6B6B12,transparent 75%)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", bottom:"-100px", right:"-60px", width:"380px", height:"380px", borderRadius:"50%", background:"radial-gradient(circle,#4ECDC412,transparent 75%)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", top:"35%", left:"12%", width:"240px", height:"240px", borderRadius:"50%", background:"radial-gradient(circle,#9B5DE510,transparent 70%)", pointerEvents:"none" }}/>
            <div style={{ position:"absolute", top:"25%", right:"8%", width:"200px", height:"200px", borderRadius:"50%", background:"radial-gradient(circle,#F7B73112,transparent 70%)", pointerEvents:"none" }}/>

            <div className="fade-up" style={{ animationDelay:"0.1s" }}>
              <h1 style={{ fontFamily:SER, fontSize:"clamp(68px,11vw,128px)", fontWeight:700, background:"linear-gradient(135deg,#2A9D8F 0%,#5E60CE 35%,#9B5DE5 65%,#E76F51 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:0.92, letterSpacing:"-4.5px", marginBottom:"8px" }}>
                HUEPAN
              </h1>
              <p style={{ fontFamily:SAN, fontSize:"clamp(12px,2vw,15px)", fontWeight:600, color:"#E76F51", letterSpacing:"6px", marginBottom:"40px", textTransform:"uppercase" }}>VIBRANT • CURATED • EVERYDAY</p>
            </div>

            <div className="fade-up" style={{ animationDelay:"0.35s", display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={()=>document.getElementById("shop").scrollIntoView({behavior:"smooth"})} style={{ background:"linear-gradient(135deg,#FF6B6B,#9B5DE5)", color:"#fff", border:"none", borderRadius:"12px", padding:"16px 48px", fontFamily:SAN, fontWeight:700, fontSize:"15px", cursor:"pointer", letterSpacing:"1.5px", boxShadow:"0 10px 30px rgba(255,107,107,0.4)", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(255,107,107,0.5)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 10px 30px rgba(255,107,107,0.4)";}}
              >
                SHOP NOW
              </button>
              <button onClick={()=>openWhatsApp("Wholesale Enquiry","—")} style={{ background:"#fff", color:"#555", border:"1.5px solid #e0dbd3", borderRadius:"10px", padding:"14px 40px", fontFamily:SAN, fontWeight:700, fontSize:"14px", cursor:"pointer", letterSpacing:"1px", display:"flex", alignItems:"center", gap:"8px" }}>
                <WhatsAppIcon size={14} color="#555"/> WHOLESALE
              </button>
            </div>

            {/* Feature pills */}
            <div className="fade-up" style={{ animationDelay:"0.5s", display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap", marginTop:"36px" }}>
              {[{t:"🌍 Worldwide",c:"#FF6B6B"},{t:"📦 Wholesale",c:"#9B5DE5"},{t:"💬 WhatsApp",c:"#00C9A7"},{t:"✨ New Weekly",c:"#F7B731"}].map(f=>(
                <span key={f.t} style={{ fontFamily:SAN, fontSize:"12px", fontWeight:600, color:f.c, background:`${f.c}15`, borderRadius:"20px", padding:"7px 18px", border:`1px solid ${f.c}30` }}>{f.t}</span>
              ))}
            </div>
          </section>

          {/* Category Grid */}
          <section style={{ padding:"56px 32px 48px", background:"#f8f7f4", borderBottom:"1px solid #eee" }}>
            <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
              <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:"28px" }}>
                <h2 style={{ fontFamily:SER, fontSize:"22px", fontWeight:700, color:"#1a1a1a" }}>Shop by Category</h2>
                <span style={{ fontFamily:SAN, fontSize:"11px", color:"#bbb", letterSpacing:"1px" }}>{products.length} PRODUCTS</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"12px" }}>
                {Object.entries(CAT_CONFIG).map(([label,cfg])=>(
                  <button key={label}
                    onClick={()=>{setCat(label);document.getElementById("shop").scrollIntoView({behavior:"smooth"});}}
                    style={{ background:"#fff", border:`1.5px solid ${cfg.color}22`, borderRadius:"16px", padding:"24px 12px", cursor:"pointer", textAlign:"center", transition:"all 0.25s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=cfg.color;e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 12px 28px ${cfg.color}22`;e.currentTarget.style.background=cfg.bg;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=`${cfg.color}22`;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";e.currentTarget.style.background="#fff";}}
                  >
                    <div style={{ fontSize:"32px", marginBottom:"10px" }}>{cfg.icon}</div>
                    <div style={{ fontFamily:SAN, fontSize:"12px", color:"#1a1a1a", fontWeight:700, letterSpacing:"0.3px", marginBottom:"5px" }}>{label}</div>
                    <div style={{ fontFamily:SAN, fontSize:"10px", color:"#bbb", lineHeight:1.5 }}>{cfg.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Why HUEPAN - Vibrant & Grand Benefits */}
          <section style={{ background:"linear-gradient(180deg,#fff 0%,#fff7f5 100%)", padding:"64px 32px", borderBottom:"1px solid #f0e9e2" }}>
            <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
              <div style={{ textAlign:"center", marginBottom:"40px" }}>
                <p style={{ fontFamily:SAN, fontSize:"11px", letterSpacing:"4px", color:"#FF6B6B", fontWeight:700, marginBottom:"8px" }}>THE HUEPAN DIFFERENCE</p>
                <h2 style={{ fontFamily:SER, fontSize:"28px", fontWeight:700, color:"#1a1a1a", marginBottom:"12px" }}>Why Shop Vibrant with Us</h2>
                <p style={{ fontFamily:SAN, fontSize:"14px", color:"#666", maxWidth:"520px", margin:"0 auto" }}>Boldly curated. Thoughtfully sourced. Designed for those who live in color.</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"20px" }}>
                {[
                  {icon:"🎨", title:"Vibrant Curation", desc:"Every piece hand-selected for bold color, quality & character", color:"#FF6B6B"},
                  {icon:"🌍", title:"Global Reach", desc:"Worldwide shipping with love. Fast, tracked & reliable.", color:"#4ECDC4"},
                  {icon:"💎", title:"Premium Quality", desc:"Only the finest materials. Built to last & impress.", color:"#9B5DE5"},
                  {icon:"✨", title:"Fresh Weekly Drops", desc:"New vibrant arrivals every week. Never miss the latest.", color:"#F7B731"},
                ].map((b,i)=>(
                  <div key={i} style={{ background:"#fff", borderRadius:"20px", padding:"32px 24px", border:`1px solid ${b.color}22`, transition:"all 0.3s", boxShadow:"0 4px 20px rgba(0,0,0,0.03)" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow=`0 20px 40px ${b.color}15`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.03)";}}
                  >
                    <div style={{ fontSize:"42px", marginBottom:"16px" }}>{b.icon}</div>
                    <div style={{ fontFamily:SER, fontSize:"18px", fontWeight:700, color:"#1a1a1a", marginBottom:"10px" }}>{b.title}</div>
                    <div style={{ fontFamily:SAN, fontSize:"13px", color:"#555", lineHeight:1.7 }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Shop */}
          <section id="shop" style={{ maxWidth:"1200px", margin:"0 auto", padding:"56px 32px 80px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"16px", marginBottom:"28px" }}>
              <h2 style={{ fontFamily:SER, fontSize:"22px", fontWeight:700, color:"#1a1a1a" }}>
                {cat==="All"?"All Products":cat}
                <span style={{ fontFamily:SAN, fontSize:"13px", fontWeight:400, color:"#bbb", marginLeft:"10px" }}>{filtered.length} items</span>
              </h2>
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input className="search-box" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
            </div>

            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"32px" }}>
              {catLabels.map(c=>(
                <button key={c} className={`cat-tab ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>
              ))}
            </div>

            {loading ? (
              <div className="spinner"/>
            ) : error ? (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <p style={{ fontFamily:SAN, fontSize:"14px", color:"#f59e6c", marginBottom:"16px" }}>⚠️ Failed to load products.</p>
                <button onClick={()=>window.location.reload()} style={{ background:"#f59e6c", color:"#fff", border:"none", borderRadius:"8px", padding:"10px 24px", fontFamily:SAN, fontWeight:700, cursor:"pointer" }}>Refresh</button>
              </div>
            ) : filtered.length > 0 ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px" }}>
                {filtered.map((p,i)=><ProductCard key={p.id} p={p} idx={i} onClick={()=>setDetail(p)}/>)}
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <p style={{ fontFamily:SAN, fontSize:"14px", color:"#bbb" }}>No products found.</p>
              </div>
            )}
          </section>

          {/* How to Order */}
          <section style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", padding:"64px 32px" }}>
            <div style={{ maxWidth:"960px", margin:"0 auto", textAlign:"center" }}>
              <p style={{ fontFamily:SAN, fontSize:"10px", letterSpacing:"4px", color:"#f59e6c", fontWeight:700, marginBottom:"14px" }}>HOW TO ORDER</p>
              <h2 style={{ fontFamily:SER, fontSize:"32px", color:"#fff", fontWeight:700, marginBottom:"48px" }}>Simple as 1, 2, 3</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"40px" }}>
                {[
                  {n:"01",icon:"🔍",title:"Browse",desc:"Explore our product range",c:"#f59e6c"},
                  {n:"02",icon:"💬",title:"WhatsApp",desc:"Tap Order on any product",c:"#a78bfa"},
                  {n:"03",icon:"✅",title:"Confirm",desc:"Confirm items & address",c:"#34d399"},
                  {n:"04",icon:"📦",title:"Delivered",desc:"Pay & receive your order",c:"#60a5fa"},
                ].map(s=>(
                  <div key={s.n} style={{ textAlign:"center", padding:"24px 16px", background:"rgba(255,255,255,0.04)", borderRadius:"14px", border:`1px solid ${s.c}22` }}>
                    <div style={{ fontFamily:SAN, fontSize:"10px", color:s.c, letterSpacing:"2px", fontWeight:700, marginBottom:"10px" }}>{s.n}</div>
                    <div style={{ fontSize:"26px", marginBottom:"10px" }}>{s.icon}</div>
                    <div style={{ fontFamily:SER, fontSize:"15px", color:"#fff", fontWeight:700, marginBottom:"6px" }}>{s.title}</div>
                    <div style={{ fontFamily:SAN, fontSize:"11px", color:"#555", lineHeight:1.6 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>openWhatsApp("Order Enquiry","—")} style={{ background:"#25D366", color:"#fff", border:"none", borderRadius:"10px", padding:"15px 44px", fontFamily:SAN, fontWeight:700, fontSize:"14px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"10px", boxShadow:"0 6px 20px rgba(37,211,102,0.3)", letterSpacing:"0.5px" }}>
                <WhatsAppIcon size={18}/> Start Ordering Now
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer style={{ background:"#111", padding:"36px 32px" }}>
            <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
              <div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"0px" }}>
                  <span style={{ fontFamily:SER, fontSize:"18px", fontWeight:800, background:"linear-gradient(135deg,#FF6B6B 0%,#4ECDC4 35%,#9B5DE5 70%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.5px" }}>HUEPAN</span>
                  <span style={{ fontFamily:SAN, fontSize:"8px", fontWeight:700, color:"#FF6B6B", letterSpacing:"2.5px", marginTop:"-1px" }}>VIBRANT LIVING</span>
                </div>
                <div style={{ fontFamily:SAN, fontSize:"10px", color:"#666", marginTop:"6px", letterSpacing:"1px" }}>CURATED ESSENTIALS • WORLDWIDE</div>
              </div>
              <div style={{ display:"flex", gap:"24px" }}>
                {["Shop","About","Contact"].map(l=>(
                  <a key={l} href="#" style={{ fontFamily:SAN, fontSize:"11px", color:"#555", textDecoration:"none", fontWeight:600, letterSpacing:"1px" }}>{l}</a>
                ))}
              </div>
              <p style={{ fontFamily:SAN, fontSize:"10px", color:"#444" }}>© 2024 HUEPAN. All rights reserved.</p>
            </div>
          </footer>
        </>
      )}

      <button className="wa-btn" onClick={()=>openWhatsApp("General Enquiry","—")}>
        <WhatsAppIcon size={26}/>
      </button>
    </div>
  );
}
