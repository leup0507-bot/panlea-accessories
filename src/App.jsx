import { useState, useEffect } from "react";

const WA_NUMBER = "+8618157970409";
const SHEET_ID = "1MSwdIxakWwu7G6GbRjjJsUx5UNOnCxrAWYmXGTkdP_Y";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

const openWhatsApp = (productName, productCode) => {
  const msg = encodeURIComponent(
    `Hi! I'm interested in the following item from Panlea Accessories:\n\n🛍️ ${productName} (${productCode})\n\nIs it available? Thank you!`
  );
  window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
};

const SAN = "'PingFang SC','Microsoft YaHei','Helvetica Neue',Arial,sans-serif";
const SER = "Georgia,'Times New Roman',serif";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
  return lines.slice(1).map(line => {
    const values = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { values.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    values.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (values[i] || "").replace(/^"|"$/g, ""); });
    return obj;
  }).filter(r => r.id);
}

function CatIcon({ cat, color }) {
  const c = color || "#c8956c";
  if (cat === "串珠") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {[8,18,28,38,46].map((x,i)=>(
        <circle key={i} cx={x} cy="26" r={i===2?8:i===1||i===3?6:4} fill={c} opacity={0.15+i*0.12}/>
      ))}
      <line x1="2" y1="26" x2="50" y2="26" stroke={c} strokeWidth="1.5" opacity="0.4"/>
    </svg>
  );
  if (cat === "吊坠配件") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="14" r="5" stroke={c} strokeWidth="1.5" fill="none"/>
      <line x1="26" y1="19" x2="26" y2="28" stroke={c} strokeWidth="1.5"/>
      <path d="M16 38 Q26 28 36 38 Q26 48 16 38Z" fill={c} opacity="0.7"/>
    </svg>
  );
  if (cat === "链条线材") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      {[0,1,2,3].map(i=>(
        <ellipse key={i} cx={10+i*10} cy="26" rx="5" ry="3" stroke={c} strokeWidth="1.5" fill="none" opacity={0.5+i*0.1}/>
      ))}
      <ellipse cx="46" cy="26" rx="5" ry="3" stroke={c} strokeWidth="1.5" fill="none" opacity="0.9"/>
    </svg>
  );
  if (cat === "五金配件") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="20" cy="26" r="10" stroke={c} strokeWidth="2" fill="none"/>
      <path d="M30 26 Q38 18 44 20 Q46 26 44 32 Q38 34 30 26Z" fill={c} opacity="0.6"/>
    </svg>
  );
  if (cat === "工具") return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="8" y="22" width="28" height="8" rx="4" fill={c} opacity="0.6"/>
      <rect x="34" y="20" width="10" height="12" rx="3" fill={c} opacity="0.85"/>
    </svg>
  );
  return <svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="18" fill={c} opacity="0.3"/></svg>;
}

function WhatsAppIcon({ size = 20, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.504L4 29l7.752-2.033A12.95 12.95 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill={color}/>
      <path d="M22.4 19.6c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.21 3.05c.15.2 2.08 3.17 5.04 4.45.7.3 1.25.48 1.67.62.7.22 1.34.19 1.84.11.56-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.19-.57-.34z" fill={color === "#fff" ? "#25D366" : "#fff"}/>
    </svg>
  );
}

// Category English label mapping
const CAT_EN = {
  "串珠": "Beads",
  "吊坠配件": "Charms",
  "链条线材": "Chains & Wire",
  "五金配件": "Findings",
  "工具": "Tools",
};

// Detail Modal
function DetailModal({ p, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "20px",
          maxWidth: "600px", width: "100%",
          maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          animation: "modalIn 0.28s ease",
        }}
      >
        {/* Image placeholder */}
        <div style={{
          height: "240px",
          background: `linear-gradient(135deg, ${p.color || "#e8c4a0"}66 0%, ${p.color || "#e8c4a0"}22 100%)`,
          borderRadius: "20px 20px 0 0",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{ transform: "scale(2.2)", opacity: 0.8 }}>
            <CatIcon cat={p.cat} color={p.color} />
          </div>
          {p.tag && (
            <span style={{
              position: "absolute", top: "16px", left: "16px",
              background: p.tag === "新品" ? "#7bbfac" : "#c8956c",
              color: "#fff", fontSize: "11px", fontFamily: SAN,
              fontWeight: 700, letterSpacing: "1px",
              padding: "4px 12px", borderRadius: "20px",
            }}>{p.tag === "新品" ? "NEW" : "BESTSELLER"}</span>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "rgba(255,255,255,0.9)", border: "none",
              borderRadius: "50%", width: "36px", height: "36px",
              cursor: "pointer", fontSize: "18px", color: "#666",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
          {/* Image placeholder label */}
          <div style={{
            position: "absolute", bottom: "12px", right: "16px",
            fontFamily: SAN, fontSize: "10px", color: "rgba(100,80,60,0.5)",
            letterSpacing: "1px",
          }}>PRODUCT IMAGE COMING SOON</div>
        </div>

        {/* Content */}
        <div style={{ padding: "28px 32px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <span style={{ fontFamily: SAN, fontSize: "10px", letterSpacing: "3px", color: "#c8956c", fontWeight: 700 }}>
                {p.id} · {CAT_EN[p.cat] || p.cat}
              </span>
              <h2 style={{ fontFamily: SER, fontSize: "22px", fontWeight: 700, color: "#2a1f18", marginTop: "6px", lineHeight: 1.3 }}>
                {p.en}
              </h2>
              <p style={{ fontFamily: SAN, fontSize: "13px", color: "#a08878", marginTop: "4px" }}>{p.name}</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "16px" }}>
              <div style={{ fontFamily: SER, fontSize: "26px", fontWeight: 700, color: "#c8956c", letterSpacing: "-0.5px" }}>{p.price}</div>
              <div style={{ fontFamily: SAN, fontSize: "11px", color: "#b0a090" }}>{p.unit}</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#f0ebe2", margin: "20px 0" }}/>

          {/* Detail description */}
          {p.detail_desc && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontFamily: SAN, fontSize: "13px", color: "#6a5848", lineHeight: 1.9 }}>{p.detail_desc}</p>
            </div>
          )}

          {/* Specs grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            {[
              { label: "Material", value: p.material },
              { label: "Size", value: p.size },
              { label: "Colour Options", value: p.color_options },
              { label: "Category", value: CAT_EN[p.cat] || p.cat },
            ].map(spec => spec.value ? (
              <div key={spec.label} style={{
                background: "#faf8f5", borderRadius: "10px", padding: "12px 16px",
                border: "1px solid #f0ebe2",
              }}>
                <div style={{ fontFamily: SAN, fontSize: "10px", letterSpacing: "2px", color: "#c8956c", fontWeight: 700, marginBottom: "4px" }}>
                  {spec.label.toUpperCase()}
                </div>
                <div style={{ fontFamily: SAN, fontSize: "13px", color: "#2a1f18", fontWeight: 500 }}>{spec.value}</div>
              </div>
            ) : null)}
          </div>

          {/* WhatsApp button */}
          <button
            onClick={() => openWhatsApp(p.name, p.id)}
            style={{
              width: "100%", padding: "14px 0",
              background: "#25D366", color: "#fff",
              border: "none", borderRadius: "12px",
              fontFamily: SAN, fontWeight: 700, fontSize: "15px",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
              transition: "background 0.2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="#1fb85a"}
            onMouseLeave={e=>e.currentTarget.style.background="#25D366"}
          >
            <WhatsAppIcon size={18} color="#fff"/>
            Order via WhatsApp
          </button>

          <p style={{ fontFamily: SAN, fontSize: "11px", color: "#b0a090", textAlign: "center", marginTop: "12px" }}>
            Click to chat with us directly on WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ p, idx, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#c8956c" : "#ede8e0"}`,
        borderRadius: "16px", overflow: "hidden",
        transition: "border-color 0.28s, box-shadow 0.28s, transform 0.28s",
        boxShadow: hovered ? "0 8px 32px rgba(200,149,108,0.14)" : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex", flexDirection: "column",
        cursor: "pointer",
        animationDelay: `${idx * 0.06}s`, animationFillMode: "both",
      }}
      className="card-in"
    >
      <div style={{
        height: "120px",
        background: `linear-gradient(135deg, ${p.color || "#e8c4a0"}55 0%, ${p.color || "#e8c4a0"}22 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      }}>
        <CatIcon cat={p.cat} color={p.color} />
        {p.tag && (
          <span style={{
            position: "absolute", top: "12px", right: "12px",
            background: p.tag === "新品" ? "#7bbfac" : "#c8956c",
            color: "#fff", fontSize: "10px", fontFamily: SAN,
            fontWeight: 700, letterSpacing: "1px", padding: "3px 10px", borderRadius: "20px",
          }}>{p.tag === "新品" ? "NEW" : "BESTSELLER"}</span>
        )}
        {/* View detail hint */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(200,149,108,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
          fontFamily: SAN, fontSize: "11px", letterSpacing: "2px",
          color: "#8a5c38", fontWeight: 700,
        }}>VIEW DETAILS</div>
      </div>

      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
        <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#c8956c", fontFamily: SAN, fontWeight: 700 }}>
          {p.id} · {CAT_EN[p.cat] || p.cat}
        </span>
        <h3 style={{ fontFamily: SER, fontSize: "15px", fontWeight: 700, color: "#2a1f18", lineHeight: 1.35, margin: 0 }}>
          {p.en}
        </h3>
        <p style={{ fontFamily: SAN, fontSize: "11px", color: "#a08878", margin: 0 }}>{p.name}</p>
        <p style={{ fontFamily: SAN, fontSize: "12px", color: "#8a7868", lineHeight: 1.7, margin: "4px 0 0", flex: 1 }}>
          {p.desc}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "12px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
            <span style={{ fontFamily: SER, fontSize: "20px", fontWeight: 700, color: "#c8956c", letterSpacing: "-0.5px" }}>{p.price}</span>
            <span style={{ fontSize: "11px", color: "#b0a090", fontFamily: SAN }}>{p.unit}</span>
          </div>
          <span style={{ fontFamily: SAN, fontSize: "10px", color: "#c8956c", letterSpacing: "1px" }}>Details →</span>
        </div>
      </div>
    </div>
  );
}

const STRIPS = ["✦ Order via WhatsApp", "✦ Worldwide Shipping", "✦ Wholesale & Retail", "✦ New Arrivals Weekly"];

export default function App() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(text => { setProducts(parseCSV(text)); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const catLabels = ["All", ...new Set(products.map(p => CAT_EN[p.cat] || p.cat).filter(Boolean))];

  const filtered = products.filter(p => {
    const pCatEn = CAT_EN[p.cat] || p.cat;
    const matchCat = cat === "All" || pCatEn === cat;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.includes(q) || p.en.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", color: "#2a1f18" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-track{background:#faf8f5;}
        ::-webkit-scrollbar-thumb{background:#ddd0c0;border-radius:4px;}
        @keyframes cardIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        .card-in{animation:cardIn 0.5s ease both;}
        @keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        .marquee-inner{display:flex;animation:marquee 22s linear infinite;white-space:nowrap;}
        @keyframes modalIn{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        .cat-pill{background:#fff;border:1.5px solid #ede8e0;border-radius:40px;padding:8px 20px;font-family:${SAN};font-size:12px;letter-spacing:1px;color:#7a6858;cursor:pointer;transition:all 0.22s;white-space:nowrap;font-weight:600;}
        .cat-pill:hover{border-color:#c8956c;color:#c8956c;}
        .cat-pill.active{background:#c8956c;border-color:#c8956c;color:#fff;}
        .search-box{border:1.5px solid #ede8e0;border-radius:40px;padding:10px 20px 10px 44px;font-family:${SAN};font-size:13px;color:#2a1f18;background:#fff;outline:none;transition:border-color 0.22s;width:220px;}
        .search-box:focus{border-color:#c8956c;}
        .search-box::placeholder{color:#c0b0a0;}
        .wa-float{position:fixed;bottom:28px;right:28px;z-index:200;background:#25D366;border-radius:50%;width:58px;height:58px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,0.35);cursor:pointer;border:none;transition:transform 0.2s;}
        .wa-float:hover{transform:scale(1.1);}
        @keyframes pulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,0.35);}50%{box-shadow:0 4px 28px rgba(37,211,102,0.6);}}
        .wa-float{animation:pulse 2.5s ease infinite;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .spinner{width:40px;height:40px;border:3px solid #ede8e0;border-top-color:#c8956c;border-radius:50%;animation:spin 0.8s linear infinite;margin:80px auto;}
      `}</style>

      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(250,248,245,0.97)" : "#faf8f5",
        borderBottom: scrolled ? "1px solid #ede8e0" : "1px solid transparent",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.05)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#e8b88a,#c8956c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: "16px" }}>✦</span>
            </div>
            <div>
              <div style={{ fontFamily: SER, fontSize: "17px", fontWeight: 700, color: "#2a1f18", lineHeight: 1 }}>Panlea</div>
              <div style={{ fontFamily: SAN, fontSize: "9px", letterSpacing: "3px", color: "#c8956c", fontWeight: 700 }}>ACCESSORIES</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            {["Home","Shop","About","Contact"].map(l => (
              <a key={l} href="#" style={{ fontFamily: SAN, fontSize: "12px", fontWeight: 600, letterSpacing: "1px", color: "#7a6858", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e=>e.target.style.color="#c8956c"}
                onMouseLeave={e=>e.target.style.color="#7a6858"}
              >{l}</a>
            ))}
            <button onClick={() => openWhatsApp("General Enquiry","—")}
              style={{ background: "#c8956c", color: "#fff", border: "none", borderRadius: "40px", padding: "9px 20px", fontFamily: SAN, fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e=>e.currentTarget.style.background="#a87050"}
              onMouseLeave={e=>e.currentTarget.style.background="#c8956c"}
            >
              <WhatsAppIcon size={13} color="#fff"/> Order Now
            </button>
          </nav>
        </div>
      </header>

      {/* Marquee */}
      <div style={{ background: "#2a1f18", overflow: "hidden", padding: "10px 0" }}>
        <div className="marquee-inner">
          {[...STRIPS,...STRIPS,...STRIPS].map((s,i) => (
            <span key={i} style={{ fontFamily: SAN, fontSize: "11px", letterSpacing: "3px", color: "#c8b098", padding: "0 40px", fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#fff8f2 0%,#fdf3eb 50%,#faf0e8 100%)", padding: "72px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {[280,180,100].map((s,i)=>(
          <div key={i} style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:`${s}px`,height:`${s}px`,borderRadius:"50%",border:`1px solid rgba(200,149,108,${0.06+i*0.04})`,pointerEvents:"none" }}/>
        ))}
        <p style={{ fontFamily: SAN, fontSize: "11px", letterSpacing: "5px", color: "#c8956c", fontWeight: 700, marginBottom: "16px" }}>DIY JEWELLERY ACCESSORIES STORE</p>
        <h1 style={{ fontFamily: SER, fontSize: "clamp(36px,7vw,72px)", fontWeight: 700, color: "#2a1f18", lineHeight: 1.15, marginBottom: "8px" }}>Panlea Accessories</h1>
        <p style={{ fontFamily: SER, fontStyle: "italic", fontSize: "clamp(14px,2vw,20px)", color: "#c8956c", letterSpacing: "2px", marginBottom: "24px" }}>Create · Personalise · Express</p>
        <p style={{ fontFamily: SAN, fontSize: "14px", color: "#9a8878", lineHeight: 2, maxWidth: "480px", margin: "0 auto 36px" }}>
          Beads · Charms · Chains · Findings · Tools<br/>Your one-stop DIY accessories supplier — Retail & Wholesale
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => document.getElementById("shop").scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#2a1f18", color: "#fff", border: "none", borderRadius: "40px", padding: "13px 32px", fontFamily: SAN, fontWeight: 700, fontSize: "14px", cursor: "pointer", letterSpacing: "0.5px" }}>
            Shop Now
          </button>
          <button onClick={() => openWhatsApp("Wholesale Enquiry","—")}
            style={{ background: "transparent", color: "#c8956c", border: "2px solid #c8956c", borderRadius: "40px", padding: "13px 32px", fontFamily: SAN, fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", letterSpacing: "0.5px" }}>
            <WhatsAppIcon size={15} color="#c8956c"/> Wholesale Enquiry
          </button>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "40px" }}>
          {["🌍 Worldwide Shipping","📦 Retail & Wholesale","💬 WhatsApp Order","✨ New Arrivals"].map(f => (
            <span key={f} style={{ background: "#fff", border: "1.5px solid #ede8e0", borderRadius: "40px", padding: "7px 18px", fontFamily: SAN, fontSize: "12px", color: "#7a6858", fontWeight: 600 }}>{f}</span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ background: "#fff", padding: "48px 24px 40px", borderBottom: "1px solid #f0ebe2" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <p style={{ fontFamily: SAN, fontSize: "11px", letterSpacing: "4px", color: "#c8956c", fontWeight: 700, textAlign: "center", marginBottom: "32px" }}>SHOP BY CATEGORY</p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label:"Beads", cat:"串珠", icon:"🪨" },
              { label:"Charms", cat:"吊坠配件", icon:"🔮" },
              { label:"Chains & Wire", cat:"链条线材", icon:"🧵" },
              { label:"Findings", cat:"五金配件", icon:"🪝" },
              { label:"Tools", cat:"工具", icon:"🔧" },
            ].map(c => (
              <button key={c.label}
                onClick={() => { setCat(c.label); document.getElementById("shop").scrollIntoView({ behavior: "smooth" }); }}
                style={{ background: "#faf8f5", border: "1.5px solid #ede8e0", borderRadius: "16px", padding: "20px 28px", cursor: "pointer", textAlign: "center", transition: "all 0.22s", minWidth: "120px" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="#c8956c"; e.currentTarget.style.background="#fff8f2"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="#ede8e0"; e.currentTarget.style.background="#faf8f5"; }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{c.icon}</div>
                <div style={{ fontFamily: SAN, fontSize: "13px", color: "#2a1f18", fontWeight: 700, letterSpacing: "0.5px" }}>{c.label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" style={{ maxWidth: "1240px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "36px" }}>
          <div>
            <h2 style={{ fontFamily: SER, fontSize: "28px", fontWeight: 700, color: "#2a1f18" }}>
              All Products <span style={{ fontStyle: "italic", color: "#c8956c" }}>Collection</span>
            </h2>
            <p style={{ fontFamily: SAN, fontSize: "12px", color: "#a09080", marginTop: "4px", letterSpacing: "0.5px" }}>
              {filtered.length} items · Click any product to view details
            </p>
          </div>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0b0a0" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className="search-box" placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
          {catLabels.map(c => (
            <button key={c} className={`cat-pill ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div className="spinner"/>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: SAN, fontSize: "14px", color: "#c8956c" }}>⚠️ Failed to load products. Please refresh.</p>
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "20px" }}>
            {filtered.map((p,i) => <ProductCard key={p.id} p={p} idx={i} onClick={()=>setSelected(p)}/>)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: SAN, fontSize: "14px", color: "#b0a090" }}>No products found. Try a different keyword.</p>
          </div>
        )}
      </section>

      {/* How to Order */}
      <section style={{ background: "#2a1f18", padding: "60px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: SAN, fontSize: "11px", letterSpacing: "5px", color: "#c8956c", fontWeight: 700, marginBottom: "16px" }}>HOW TO ORDER</p>
          <h2 style={{ fontFamily: SER, fontSize: "clamp(24px,4vw,40px)", color: "#f5ede0", fontWeight: 400, fontStyle: "italic", marginBottom: "40px" }}>Simple & Easy</h2>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { step:"01", icon:"🔍", title:"Browse", desc:"Explore our product collection" },
              { step:"02", icon:"💬", title:"WhatsApp", desc:"Click the WhatsApp button on any item" },
              { step:"03", icon:"✅", title:"Confirm", desc:"Confirm items, quantity & address" },
              { step:"04", icon:"📦", title:"Delivery", desc:"Pay & wait for your order" },
            ].map((s,i) => (
              <div key={s.step} style={{ flex:"1", minWidth:"160px", padding:"20px", position:"relative" }}>
                {i<3 && <div style={{ position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",color:"#4a3828",fontSize:"20px" }}>›</div>}
                <div style={{ fontSize:"28px", marginBottom:"12px" }}>{s.icon}</div>
                <div style={{ fontFamily:SAN, fontSize:"10px", color:"#c8956c", letterSpacing:"3px", marginBottom:"6px", fontWeight:700 }}>STEP {s.step}</div>
                <div style={{ fontFamily:SER, fontSize:"16px", color:"#f5ede0", fontWeight:700, marginBottom:"6px" }}>{s.title}</div>
                <div style={{ fontFamily:SAN, fontSize:"11px", color:"#8a7868", lineHeight:1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={() => openWhatsApp("Order Enquiry","—")}
            style={{ marginTop:"40px", background:"#25D366", color:"#fff", border:"none", borderRadius:"40px", padding:"14px 36px", fontFamily:SAN, fontWeight:700, fontSize:"15px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"10px", boxShadow:"0 4px 20px rgba(37,211,102,0.3)", letterSpacing:"0.5px" }}>
            <WhatsAppIcon size={18} color="#fff"/> Order via WhatsApp Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1e1610", padding: "40px 24px 28px" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontFamily: SER, fontSize: "18px", fontWeight: 700, color: "#e8d0b0" }}>Panlea Accessories</div>
            <div style={{ fontFamily: SAN, fontSize: "11px", color: "#6a5848", marginTop: "4px", letterSpacing: "1px" }}>DIY JEWELLERY ACCESSORIES · WORLDWIDE</div>
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {["Shop","About","Contact"].map(l => (
              <a key={l} href="#" style={{ fontFamily: SAN, fontSize: "12px", color: "#6a5848", textDecoration: "none", fontWeight: 600, letterSpacing: "1px" }}>{l}</a>
            ))}
          </div>
          <p style={{ fontFamily: SAN, fontSize: "11px", color: "#4a3828" }}>© 2024 Panlea Accessories. All rights reserved.</p>
        </div>
      </footer>

      {/* Float WhatsApp */}
      <button className="wa-float" onClick={() => openWhatsApp("General Enquiry","—")} title="WhatsApp Us">
        <WhatsAppIcon size={28} color="#fff"/>
      </button>

      {/* Detail Modal */}
      {selected && <DetailModal p={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}