'use client';

import { useEffect } from "react";
import logo from "../../assets/Sanatan Logo-high res.png";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*{box-sizing:border-box;margin:0;padding:0;-webkit-font-smoothing:antialiased}
:root{
  --gold:#C9A74D;--gold2:#E8C870;--gold3:#F5DFA0;
  --bg:#060312;--bg1:#0D0821;--bg2:#140C2E;--bg3:#1C1040;
  --purple:#7C4DCE;--purple2:#9B72CF;--purple3:#BDA0E8;
  --text:#F0EBF8;--text2:#C0B0D8;--text3:#8070A0;
  --ok:#4CAF79;--red:#E85555;--blue:#4DA8CF;
  --border:rgba(201,167,77,.18);--border2:rgba(120,80,200,.2);
  --font-head:'Cinzel Decorative',serif;
  --font-body:'Cormorant Garamond',serif;
  --font-ui:'DM Sans',sans-serif;
}

html{scroll-behavior:smooth;overflow-x:hidden}
body{background:var(--bg);color:var(--text);font-family:var(--font-ui);overflow-x:hidden}

.deck{width:100%;max-width:1400px;margin:0 auto}
.slide{
  min-height:100vh;width:100%;position:relative;
  display:flex;flex-direction:column;justify-content:center;
  padding:60px 80px;overflow:hidden;
  border-bottom:1px solid var(--border2);
}
.slide-num{
  position:absolute;top:28px;right:36px;
  font-family:var(--font-ui);font-size:11px;font-weight:500;
  color:var(--text3);letter-spacing:2px;
}
.slide-tag{
  display:inline-flex;align-items:center;gap:6px;
  font-family:var(--font-ui);font-size:10px;font-weight:700;
  letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);
  background:rgba(201,167,77,.08);border:1px solid rgba(201,167,77,.2);
  padding:5px 14px;border-radius:99px;margin-bottom:22px;width:fit-content;
}

.t-hero{font-family:var(--font-head);font-size:clamp(38px,5vw,68px);font-weight:900;line-height:1.05;letter-spacing:-.5px;color:var(--text)}
.t-title{font-family:var(--font-head);font-size:clamp(26px,3.5vw,46px);font-weight:700;line-height:1.1;color:var(--text)}
.t-sub{font-family:var(--font-body);font-size:clamp(18px,2vw,26px);font-weight:300;color:var(--text2);line-height:1.6;font-style:italic}
.t-body{font-size:15px;color:var(--text2);line-height:1.7;font-family:var(--font-ui)}
.t-small{font-size:12px;color:var(--text3);font-family:var(--font-ui)}
.t-num{font-family:var(--font-head);font-size:clamp(32px,4vw,54px);font-weight:700;color:var(--gold2);line-height:1}
.t-label{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);font-family:var(--font-ui)}

.grad{background:linear-gradient(135deg,var(--gold),var(--gold2),var(--gold3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

.om-bg{
  position:absolute;right:-80px;top:50%;transform:translateY(-50%);
  font-size:480px;opacity:.03;user-select:none;pointer-events:none;
  font-family:var(--font-head);color:var(--gold);line-height:1;
}
.glow-orb{
  position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;
}

.card{background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:24px}
.card-gold{background:linear-gradient(135deg,rgba(201,167,77,.1),rgba(201,167,77,.04));border:1px solid rgba(201,167,77,.3);border-radius:20px;padding:24px}
.card-purple{background:rgba(124,77,206,.08);border:1px solid rgba(124,77,206,.2);border-radius:20px;padding:24px}
.pill{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:99px;font-size:11px;font-weight:600;font-family:var(--font-ui)}
.pill-gold{background:rgba(201,167,77,.12);border:1px solid rgba(201,167,77,.25);color:var(--gold)}
.pill-ok{background:rgba(76,175,121,.12);border:1px solid rgba(76,175,121,.25);color:var(--ok)}
.pill-purple{background:rgba(124,77,206,.15);border:1px solid rgba(124,77,206,.3);color:var(--purple3)}
.pill-red{background:rgba(232,85,85,.1);border:1px solid rgba(232,85,85,.2);color:var(--red)}
.divider{width:60px;height:3px;background:linear-gradient(90deg,var(--gold),transparent);border-radius:99px;margin:18px 0}
.divider-full{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent);margin:32px 0}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}

.stat-block{text-align:center;padding:22px 16px}
.stat-icon{font-size:32px;margin-bottom:10px}

.pbar{height:6px;background:rgba(120,80,200,.15);border-radius:99px;overflow:hidden;margin-top:8px}
.pbar-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold),var(--gold2))}

.tbl{width:100%;border-collapse:collapse;font-size:13px;font-family:var(--font-ui)}
.tbl th{padding:11px 14px;text-align:left;background:rgba(201,167,77,.1);color:var(--gold);font-weight:700;font-size:11px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--border)}
.tbl td{padding:10px 14px;border-bottom:1px solid var(--border2);color:var(--text2);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:rgba(201,167,77,.03)}

.slide-hero{background:radial-gradient(ellipse 80% 60% at 60% 50%,rgba(124,77,206,.18) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 20% 30%,rgba(201,167,77,.08) 0%,transparent 60%),var(--bg1)}
.slide-dark{background:var(--bg2)}
.slide-gold{background:linear-gradient(135deg,rgba(201,167,77,.06),rgba(120,80,200,.06)),var(--bg1)}
.slide-purple{background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(124,77,206,.12) 0%,transparent 70%),var(--bg1)}

.timeline{display:flex;flex-direction:column;gap:0;position:relative}
.timeline::before{content:'';position:absolute;left:19px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--gold),var(--purple),transparent)}
.tl-item{display:flex;gap:22px;padding:18px 0}
.tl-dot{width:40px;height:40px;border-radius:50%;background:var(--bg3);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;font-weight:700;color:var(--gold);font-family:var(--font-ui);z-index:1}
.tl-content{flex:1;padding-top:6px}
.tl-q{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:4px;font-family:var(--font-ui)}
.tl-title{font-size:16px;font-weight:700;color:var(--text);margin-bottom:4px;font-family:var(--font-ui)}
.tl-desc{font-size:13px;color:var(--text2);line-height:1.6;font-family:var(--font-ui)}

.feat{display:flex;gap:14px;align-items:flex-start;padding:14px 0}
.feat-icon{width:44px;height:44px;border-radius:12px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.feat-text{flex:1}
.feat-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:3px;font-family:var(--font-ui)}
.feat-desc{font-size:12px;color:var(--text2);line-height:1.5;font-family:var(--font-ui)}

.persona{background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:18px;text-align:center}
.persona-av{font-size:36px;margin-bottom:10px}
.persona-name{font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;font-family:var(--font-ui)}
.persona-role{font-size:11px;color:var(--gold);font-weight:600;text-transform:uppercase;letter-spacing:1px;font-family:var(--font-ui)}
.persona-desc{font-size:11px;color:var(--text2);margin-top:6px;line-height:1.5;font-family:var(--font-ui)}

.vs-row{display:grid;grid-template-columns:1fr 40px 1fr;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border2)}
.vs-label{font-size:13px;font-family:var(--font-ui);color:var(--text2)}
.vs-bad{color:var(--red);font-size:18px;text-align:center}
.vs-good{color:var(--ok);font-size:18px;text-align:center}
.vs-mid{text-align:center;font-size:10px;font-weight:700;color:var(--text3);font-family:var(--font-ui)}

.phone{
  width:200px;height:380px;background:var(--bg3);border-radius:36px;
  border:2px solid rgba(201,167,77,.3);position:relative;overflow:hidden;
  box-shadow:0 30px 60px rgba(0,0,0,.5),0 0 0 1px rgba(201,167,77,.1);
  flex-shrink:0;
}
.phone-notch{width:60px;height:18px;background:var(--bg);border-radius:0 0 14px 14px;position:absolute;top:0;left:50%;transform:translateX(-50%);z-index:2}
.phone-screen{padding:24px 12px 12px;height:100%}
.phone-screen-inner{background:var(--bg1);border-radius:24px;height:100%;overflow:hidden;position:relative}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.fade-up{animation:fadeUp .6s ease forwards}

@media(max-width:900px){.slide{padding:40px 32px}.g4{grid-template-columns:1fr 1fr}.g3{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.slide{padding:30px 20px}.g2,.g3,.g4{grid-template-columns:1fr}.t-hero{font-size:32px}}

.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(6,3,18,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);padding:0px 40px;display:flex;justify-content:space-between;align-items:center}
.nav-logo{font-family:var(--font-head);font-size:16px;color:var(--gold);font-weight:700}
.nav-links{display:flex;gap:6px}
.nav-link{padding:5px 12px;border-radius:8px;font-size:11px;font-weight:600;color:var(--text3);cursor:pointer;text-decoration:none;font-family:var(--font-ui);transition:all .2s;letter-spacing:.5px;white-space:nowrap}
.nav-link:hover{background:var(--border);color:var(--gold)}

.rev-bar{display:flex;align-items:flex-end;gap:12px;height:180px;padding:0 10px}
.rev-col{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
.rev-bar-fill{width:100%;border-radius:8px 8px 0 0;background:linear-gradient(180deg,var(--gold2),var(--gold));transition:height .8s ease;min-height:4px}
.rev-yr{font-size:10px;color:var(--text3);font-family:var(--font-ui);font-weight:600}
.rev-val{font-size:10px;color:var(--gold);font-family:var(--font-ui);font-weight:700}
.logo-imgg {
  position: absolute;
  height: 150px;   
  width: 150px;
  paddingTop:15
 
  pointer-events: none; /* optional */
}
  .nav-brand {
  position: relative;
  display: inline-block;
}

/* Logo */
.logo-img {
  height: 50px;
  display: block;
}

/* Text positioned to the RIGHT of image */
.nav-logo {
  position: absolute;
  top: 50%;
  left: 90px; /* adjust based on logo width */
  transform: translateY(-50%);
  
  color: #C9A74D;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
}
}
`;

export default function SanatanDiksha() {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      });
    });

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="nav">

        <div className="nav-brand">
          <img src={logo.src} alt="Logo" className="logo-img" />
          <span className="nav-logo">Sanatan Diksha</span>
        </div>
        <div className="nav-links">
          <a className="nav-link" href="#s1">Cover</a>
          <a className="nav-link" href="#s2">Problem</a>
          <a className="nav-link" href="#s3">Solution</a>
          <a className="nav-link" href="#s4">Market</a>
          <a className="nav-link" href="#s5">Product</a>
          <a className="nav-link" href="#s6">Business</a>
          <a className="nav-link" href="#s7">Financials</a>
          <a className="nav-link" href="#s8">Team</a>
          <a className="nav-link" href="#s9">Ask</a>
          <a className="nav-link" href="#sf1">Vedic AI</a>
          <a className="nav-link" href="#sf2">Wellness</a>
          <a className="nav-link" href="#sf3">Temples</a>
          <a className="nav-link" href="#sf4">Gurukul</a>
        </div>
      </nav>

      <div className="deck" style={{ paddingTop: 70 }}>

        {/* SLIDE 1 — COVER */}
        <section className="slide slide-hero" id="s1" style={{ minHeight: "100vh" }}>
          <div className="glow-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle,rgba(201,167,77,.12),transparent)", right: -200, top: -100 }}></div>
          <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(124,77,206,.15),transparent)", left: -150, bottom: -100 }}></div>
          <div className="om-bg" style={{ fontSize: 400, right: -60, opacity: 0.05 }}>ॐ</div>

          <svg style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", opacity: 0.08, width: 380, height: 380 }} viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill="none" stroke="#C9A74D" strokeWidth="0.8" />
            <circle cx="150" cy="150" r="100" fill="none" stroke="#C9A74D" strokeWidth="0.6" />
            <circle cx="150" cy="150" r="60" fill="none" stroke="#C9A74D" strokeWidth="0.6" />
            <polygon points="150,20 270,210 30,210" fill="none" stroke="#C9A74D" strokeWidth="0.8" />
            <polygon points="150,280 30,90 270,90" fill="none" stroke="#C9A74D" strokeWidth="0.8" />
            <circle cx="150" cy="150" r="8" fill="#C9A74D" opacity=".5" />
            <line x1="150" y1="10" x2="150" y2="290" stroke="#C9A74D" strokeWidth=".4" />
            <line x1="10" y1="150" x2="290" y2="150" stroke="#C9A74D" strokeWidth=".4" />
          </svg>

          <div style={{ maxWidth: 680, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  // background: "linear-gradient(135deg,var(--gold),var(--gold2))",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  boxShadow: "0 8px 24px rgba(201,167,77,.3)",
                  position: "relative",
                  overflow: "visible",  
                  
                }}
              >
                <img src={logo} alt="Logo" className="logo-imgg" style={{paddingTop:20}} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>SanatanDiksha</div>
                <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>by Digital Neurones India Pvt Ltd</div>
              </div>
            </div>

            <div className="t-hero" style={{ marginBottom: 20 }}>
              India's First<br /><span className="grad">Sacred Services</span><br />Super-App
            </div>

            <div className="t-sub" style={{ maxWidth: 560, marginBottom: 36 }}>
              Digitising the ₹5.3 Lakh Crore ($64B) spiritual economy — connecting 100 Crore Hindus with verified pandits, live puja streaming, sacred products, and funeral services. On mobile & web.
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <span className="pill pill-gold">🇮🇳 Made in India</span>
              <span className="pill pill-ok">📱 iOS + Android + Web</span>
              <span className="pill pill-purple">🤖 AI-Powered</span>
              <span className="pill" style={{ background: "rgba(77,168,207,.1)", border: "1px solid rgba(77,168,207,.25)", color: "var(--blue)" }}>🌍 NRI Global Reach</span>
            </div>

            <div className="g4" style={{ maxWidth: 600 }}>
              <div className="card" style={{ textAlign: "center", padding: 16 }}>
                <div className="t-num" style={{ fontSize: 28 }}>$64B</div>
                <div className="t-label" style={{ fontSize: 10, marginTop: 4 }}>Market Size 2025</div>
              </div>
              <div className="card" style={{ textAlign: "center", padding: 16 }}>
                <div className="t-num" style={{ fontSize: 28 }}>100Cr+</div>
                <div className="t-label" style={{ fontSize: 10, marginTop: 4 }}>Target Users</div>
              </div>
              <div className="card" style={{ textAlign: "center", padding: 16 }}>
                <div className="t-num" style={{ fontSize: 28 }}>0</div>
                <div className="t-label" style={{ fontSize: 10, marginTop: 4 }}>Dominant Platform</div>
              </div>
              <div className="card" style={{ textAlign: "center", padding: 16 }}>
                <div className="t-num" style={{ fontSize: 28 }}>10%</div>
                <div className="t-label" style={{ fontSize: 10, marginTop: 4 }}>CAGR (10yr)</div>
              </div>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 32, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-ui)" }}>INVESTOR PRESENTATION — CONFIDENTIAL — 2026</div>
            <div style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-ui)" }}>Series A — ₹25 Crore Ask</div>
          </div>
          <div className="slide-num">01 / 22</div>
        </section>

        {/* SLIDE 2 — THE PROBLEM */}
        <section className="slide slide-dark" id="s2">
          <div className="glow-orb" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(232,85,85,.08),transparent)", right: 100, top: 100 }}></div>
          <div className="slide-num">02 / 22</div>
          <div className="slide-tag">🔍 The Problem</div>
          <div className="t-title" style={{ maxWidth: 700, marginBottom: 8 }}>India's ₹5.3 Lakh Crore Spiritual Economy is <span className="grad">Shockingly Undigitised</span></div>
          <div className="t-sub" style={{ marginBottom: 36 }}>1.1 Billion Hindus. Zero dominant digital platform. The biggest untapped market in India.</div>

          <div className="g3" style={{ marginBottom: 28 }}>
            <div className="card" style={{ borderColor: "rgba(232,85,85,.3)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>😰</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-ui)" }}>No Pandit Discovery</div>
              <div className="t-body" style={{ fontSize: 13 }}>Families still rely on referrals, local directories, and WhatsApp groups to find pandits. No verified profiles, no ratings, no booking system. <strong style={{ color: "var(--red)" }}>75% of Indians can't find a qualified pandit for home rituals.</strong></div>
            </div>
            <div className="card" style={{ borderColor: "rgba(232,85,85,.3)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🌏</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-ui)" }}>NRI Diaspora Excluded</div>
              <div className="t-body" style={{ fontSize: 13 }}>32 Million NRIs worldwide cannot participate in family rituals. Funeral services (Antyesti) for NRI families require impossible physical coordination across time zones. <strong style={{ color: "var(--red)" }}>₹85,000 Cr NRI remittance for religious purposes is untapped.</strong></div>
            </div>
            <div className="card" style={{ borderColor: "rgba(232,85,85,.3)" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🛕</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-ui)" }}>Fragmented Ecosystem</div>
              <div className="t-body" style={{ fontSize: 13 }}>Sacred products, puja services, astrology, funeral rites — all exist in silos. No single platform unifies the complete spiritual journey of a Hindu family. <strong style={{ color: "var(--red)" }}>₹2.8 Lakh Cr sacred products market sold through unorganised channels.</strong></div>
            </div>
          </div>

          <div className="g2">
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>🔴 Current State vs What's Needed</div>
              <div className="vs-row"><div className="vs-label">Pandit booking</div><div className="vs-bad">✗</div><div className="vs-label" style={{ color: "var(--text3)" }}>WhatsApp, word-of-mouth</div></div>
              <div className="vs-row"><div className="vs-label">Live puja streaming</div><div className="vs-bad">✗</div><div className="vs-label" style={{ color: "var(--text3)" }}>Not available anywhere</div></div>
              <div className="vs-row"><div className="vs-label">Antyesti coordination</div><div className="vs-bad">✗</div><div className="vs-label" style={{ color: "var(--text3)" }}>Local agents only, no NRI</div></div>
              <div className="vs-row"><div className="vs-label">Sacred products verified</div><div className="vs-bad">✗</div><div className="vs-label" style={{ color: "var(--text3)" }}>Amazon/local, no authenticity</div></div>
              <div className="vs-row" style={{ border: "none" }}><div className="vs-label">Multi-language support</div><div className="vs-bad">✗</div><div className="vs-label" style={{ color: "var(--text3)" }}>Not addressed by any app</div></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="card-gold">
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--gold2)", fontFamily: "var(--font-head)" }}>7.2 Crore</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Pujas performed every day in India</div>
              </div>
              <div className="card-gold">
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--gold2)", fontFamily: "var(--font-head)" }}>79,154</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Temples in Tamil Nadu alone — none digitally connected</div>
              </div>
              <div className="card-gold">
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--gold2)", fontFamily: "var(--font-head)" }}>₹0</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Revenue captured by any dominant platform today</div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3 — THE SOLUTION */}
        <section className="slide slide-gold" id="s3">
          <div className="glow-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(201,167,77,.1),transparent)", left: -100, top: 0 }}></div>
          <div className="slide-num">03 / 22</div>
          <div className="slide-tag">✨ The Solution</div>
          <div className="t-title" style={{ marginBottom: 8 }}>SanatanDiksha — The <span className="grad">Complete Sacred Super-App</span></div>
          <div className="t-sub" style={{ marginBottom: 32, maxWidth: 660 }}>One platform. 7 user roles. Every sacred service from daily puja to Antyesti — online & offline, India & abroad.</div>

          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
              <div className="feat"><div className="feat-icon">🙏</div><div className="feat-text"><div className="feat-title">AI Pandit Discovery & Booking</div><div className="feat-desc">Search 127+ verified pandits by city, specialization, language & availability. Live slot booking with Razorpay payment. Geolocation-based matching with 22-language support.</div></div></div>
              <div style={{ height: 1, background: "var(--border2)" }}></div>
              <div className="feat"><div className="feat-icon">🎥</div><div className="feat-text"><div className="feat-title">Live Ritual Streaming (Agora WebRTC)</div><div className="feat-desc">HD live video of pujas & hawans for remote devotees. Auto cloud recording → AWS S3. Automated WhatsApp delivery of recording + pictures after ceremony.</div></div></div>
              <div style={{ height: 1, background: "var(--border2)" }}></div>
              <div className="feat"><div className="feat-icon">🕉️</div><div className="feat-text"><div className="feat-title">Antyesti (Funeral Services) Module</div><div className="feat-desc">End-to-end digital coordination of Hindu funeral rites. 8 sacred venues. NRI overseas support with live stream. Pind Daan at Gaya, Asthi Visarjan, Shraddh reminders.</div></div></div>
              <div style={{ height: 1, background: "var(--border2)" }}></div>
              <div className="feat"><div className="feat-icon">🛍️</div><div className="feat-text"><div className="feat-title">Sacred Products Marketplace</div><div className="feat-desc">26 product categories — Rudraksha, Yantras, Puja Kits, Gemstones, Books. AI-verified authenticity. Multi-vendor with 4-tier commission (7%–18%).</div></div></div>
              <div style={{ height: 1, background: "var(--border2)" }}></div>
              <div className="feat"><div className="feat-icon">🤖</div><div className="feat-text"><div className="feat-title">AI-Powered Personalisation (Claude)</div><div className="feat-desc">Festival-based recommendations. Auto-generated product descriptions in 22 languages. 24/7 Dharma knowledge chatbot. Rashi-based puja suggestions.</div></div></div>
            </div>

            <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
              <div className="phone" style={{ transform: "rotate(-3deg)" }}>
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="phone-screen-inner" style={{ background: "var(--bg2)", padding: 12 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-head)", textAlign: "center", marginBottom: 8 }}>SanatanDiksha</div>
                    <div style={{ background: "linear-gradient(135deg,rgba(201,167,77,.15),rgba(120,80,200,.15))", borderRadius: 10, padding: 8, marginBottom: 8, fontSize: 8, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>
                      <div style={{ color: "var(--gold)", fontWeight: 700, marginBottom: 3 }}>🙏 Book a Pandit</div>
                      <div>Ganesh Puja • Apr 7 • 9AM</div>
                      <div style={{ marginTop: 5, background: "var(--gold)", color: "var(--bg)", borderRadius: 6, padding: "3px 6px", fontSize: 7, fontWeight: 700, width: "fit-content" }}>Book Now ₹3,500</div>
                    </div>
                    <div style={{ fontSize: 7, fontWeight: 700, color: "var(--text3)", marginBottom: 6, fontFamily: "var(--font-ui)" }}>NEARBY PANDITS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 6, display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ fontSize: 16 }}>🪔</div>
                        <div><div style={{ fontSize: 7, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>Pt. Shiv Kumar</div><div style={{ fontSize: 6, color: "var(--gold)" }}>⭐4.9 • Varanasi</div></div>
                      </div>
                      <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 6, display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ fontSize: 16 }}>🕉️</div>
                        <div><div style={{ fontSize: 7, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>Pt. Anand Mishra</div><div style={{ fontSize: 6, color: "var(--gold)" }}>⭐5.0 • Mathura</div></div>
                      </div>
                      <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 6, display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ fontSize: 16 }}>🌺</div>
                        <div><div style={{ fontSize: 7, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>Pt. K. Iyer</div><div style={{ fontSize: 6, color: "var(--gold)" }}>⭐4.9 • Chennai</div></div>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, background: "rgba(201,167,77,.15)", border: "1px solid rgba(201,167,77,.3)", borderRadius: 8, padding: 6, fontSize: 7, color: "var(--gold)", fontFamily: "var(--font-ui)" }}>
                      🔴 LIVE NOW — Rudrabhishek<br /><span style={{ color: "var(--text2)" }}>42 devotees watching</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="phone" style={{ transform: "rotate(3deg)", marginTop: 30 }}>
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="phone-screen-inner" style={{ background: "var(--bg2)", padding: 12 }}>
                    <div style={{ fontSize: 8, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-head)", textAlign: "center", marginBottom: 8 }}>Pandit Portal 🪔</div>
                    <div style={{ background: "rgba(76,175,121,.1)", border: "1px solid rgba(76,175,121,.2)", borderRadius: 8, padding: 6, marginBottom: 8, fontSize: 7, color: "var(--ok)", fontFamily: "var(--font-ui)" }}>
                      ✓ New Booking Request!<br /><span style={{ color: "var(--text2)" }}>Satyanarayan Katha • Apr 8</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                      <div style={{ flex: 1, background: "var(--bg3)", borderRadius: 8, padding: 6, textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-head)" }}>12</div>
                        <div style={{ fontSize: 6, color: "var(--text3)" }}>Bookings</div>
                      </div>
                      <div style={{ flex: 1, background: "var(--bg3)", borderRadius: 8, padding: 6, textAlign: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-head)" }}>₹34K</div>
                        <div style={{ fontSize: 6, color: "var(--text3)" }}>Earnings</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 7, fontWeight: 700, color: "var(--text3)", marginBottom: 5, fontFamily: "var(--font-ui)" }}>📅 TODAY'S SCHEDULE</div>
                    <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 6, fontSize: 7, color: "var(--text2)", fontFamily: "var(--font-ui)", marginBottom: 5 }}>
                      🎥 9:00 AM — Ganesh Puja (Online)<br />🏠 3:00 PM — Hawan (Hyderabad)
                    </div>
                    <div style={{ background: "rgba(201,167,77,.1)", borderRadius: 8, padding: 6, fontSize: 7, color: "var(--gold)", fontFamily: "var(--font-ui)" }}>
                      📤 Recording sent via WhatsApp ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="divider-full" style={{ marginTop: 32 }}></div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, fontFamily: "var(--font-ui)" }}>7 User Personas on One Platform</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className="pill pill-gold">👑 Admin</span>
            <span className="pill pill-purple">🪔 Pandit</span>
            <span className="pill pill-ok">🙏 Customer</span>
            <span className="pill pill-gold">⛩️ Temple Trust</span>
            <span className="pill" style={{ background: "rgba(77,168,207,.1)", border: "1px solid rgba(77,168,207,.25)", color: "var(--blue)" }}>🏪 Vendor</span>
            <span className="pill" style={{ background: "rgba(120,200,100,.1)", border: "1px solid rgba(120,200,100,.25)", color: "#7EC870" }}>👤 Individual Biz</span>
            <span className="pill" style={{ background: "rgba(180,60,60,.1)", border: "1px solid rgba(180,60,60,.25)", color: "#D08080" }}>🔱 Aghori</span>
          </div>
        </section>

        {/* SLIDE 4 — MARKET SIZE */}
        <section className="slide slide-purple" id="s4">
          <div className="glow-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(124,77,206,.15),transparent)", right: -100, top: 0 }}></div>
          <div className="slide-num">04 / 22</div>
          <div className="slide-tag">📊 Market Opportunity</div>
          <div className="t-title" style={{ marginBottom: 8 }}>A <span className="grad">$64 Billion Market</span> With No Dominant Player</div>
          <div className="t-sub" style={{ marginBottom: 36 }}>The Indian religious & spiritual economy is the world's largest faith-based market — growing at 10% CAGR through 2035.</div>

          <div className="g2" style={{ marginBottom: 32, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 180, height: 180, borderRadius: "50%", background: "rgba(201,167,77,.06)", border: "2px solid rgba(201,167,77,.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 120, height: 120, borderRadius: "50%", background: "rgba(201,167,77,.1)", border: "2px solid rgba(201,167,77,.3)", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold),var(--gold2))", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute" }}>
                      <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, fontWeight: 900, color: "var(--bg)", fontFamily: "var(--font-head)" }}>₹1,200Cr</div></div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 8, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-ui)", letterSpacing: 1 }}>TAM</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(201,167,77,.2)", border: "2px solid rgba(201,167,77,.3)" }}></div><span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", fontFamily: "var(--font-ui)" }}>TAM</span></div><div style={{ fontSize: 22, fontWeight: 900, color: "var(--gold)", fontFamily: "var(--font-head)" }}>$64B / ₹5.3L Cr</div><div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Total Indian Religious & Spiritual Market (2025)</div></div>
                  <div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(201,167,77,.3)", border: "2px solid rgba(201,167,77,.5)" }}></div><span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", fontFamily: "var(--font-ui)" }}>SAM</span></div><div style={{ fontSize: 22, fontWeight: 900, color: "var(--gold2)", fontFamily: "var(--font-head)" }}>$8.2B / ₹68,000Cr</div><div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Digital-addressable puja services + products + NRI</div></div>
                  <div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}><div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--gold)", border: "2px solid var(--gold2)" }}></div><span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", fontFamily: "var(--font-ui)" }}>SOM</span></div><div style={{ fontSize: 22, fontWeight: 900, color: "var(--gold3)", fontFamily: "var(--font-head)" }}>$820M / ₹6,800Cr</div><div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>10% SOM capture in 5 years (Year 5 target)</div></div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="card-gold">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)" }}>📈 Market Growth Drivers</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Religious services market CAGR</span><span className="pill pill-ok" style={{ fontSize: 10 }}>10% / yr</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Online share (doubling by 2030)</span><span className="pill pill-gold" style={{ fontSize: 10 }}>18% → 36%</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>NRI remittances for religious use</span><span className="pill pill-purple" style={{ fontSize: 10 }}>₹85,000 Cr</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Varanasi pilgrims (2025)</span><span className="pill pill-gold" style={{ fontSize: 10 }}>72.6M/yr</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Daily pujas performed in India</span><span className="pill pill-ok" style={{ fontSize: 10 }}>7.2 Crore</span></div>
                </div>
              </div>
              <div className="card-purple">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>🎯 Target User Segments</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text2)", marginBottom: 3 }}><span>Urban Hindu Households</span><span style={{ color: "var(--purple3)" }}>32 Crore</span></div><div className="pbar"><div className="pbar-fill" style={{ width: "85%" }}></div></div></div>
                  <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text2)", marginBottom: 3 }}><span>Rural Hindu Households</span><span style={{ color: "var(--purple3)" }}>68 Crore</span></div><div className="pbar"><div className="pbar-fill" style={{ width: "60%", background: "linear-gradient(90deg,var(--purple),var(--purple2))" }}></div></div></div>
                  <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text2)", marginBottom: 3 }}><span>NRI Global Hindu Diaspora</span><span style={{ color: "var(--purple3)" }}>3.2 Crore</span></div><div className="pbar"><div className="pbar-fill" style={{ width: "40%" }}></div></div></div>
                  <div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text2)", marginBottom: 3 }}><span>Temple Trusts & Institutions</span><span style={{ color: "var(--purple3)" }}>5 Lakh+</span></div><div className="pbar"><div className="pbar-fill" style={{ width: "25%", background: "linear-gradient(90deg,var(--gold),var(--gold2))" }}></div></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="divider-full"></div>
          <div className="g4">
            <div style={{ textAlign: "center" }}><div className="t-num">1.1B</div><div className="t-label" style={{ marginTop: 6 }}>Hindus Worldwide</div></div>
            <div style={{ textAlign: "center" }}><div className="t-num" style={{ color: "var(--purple2)" }}>32M</div><div className="t-label" style={{ marginTop: 6 }}>NRI Diaspora</div></div>
            <div style={{ textAlign: "center" }}><div className="t-num" style={{ color: "var(--ok)" }}>$167B</div><div className="t-label" style={{ marginTop: 6 }}>Market by 2035</div></div>
            <div style={{ textAlign: "center" }}><div className="t-num" style={{ color: "var(--blue)" }}>0</div><div className="t-label" style={{ marginTop: 6 }}>Unicorns in Space</div></div>
          </div>
        </section>

        {/* SLIDE 5 — PRODUCT */}
        <section className="slide" id="s5" style={{ background: "var(--bg1)" }}>
          <div className="om-bg" style={{ right: -60, fontSize: 350, opacity: 0.04 }}>ॐ</div>
          <div className="slide-num">05 / 22</div>
          <div className="slide-tag">📱 The Product</div>
          <div className="t-title" style={{ marginBottom: 8 }}>iOS · Android · Web — <span className="grad">One Sacred Ecosystem</span></div>
          <div className="t-sub" style={{ marginBottom: 28 }}>Production-ready. React Native 0.74 + Node.js + PostgreSQL + Agora + Razorpay</div>

          <div className="g2" style={{ gap: 24 }}>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 36 }}>📱</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 4 }}>iOS App (iPhone + iPad)</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Swift/React Native · iOS 15+ · App Store · ATT compliant · Apple Pay · Face ID login · Live Activities for puja countdown</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 7 }}><span className="pill pill-ok" style={{ fontSize: 9 }}>Production Ready</span><span className="pill pill-gold" style={{ fontSize: 9 }}>EAS Build</span></div>
                  </div>
                </div>
                <div className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 36 }}>🤖</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 4 }}>Android App (Phone + Tablet)</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Kotlin/React Native · API 26+ · Play Store · UPI Intent · Google Pay · Material You widgets · PhonePe deep links</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 7 }}><span className="pill pill-ok" style={{ fontSize: 9 }}>Production Ready</span><span className="pill pill-purple" style={{ fontSize: 9 }}>APK + AAB</span></div>
                  </div>
                </div>
                <div className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 36 }}>🌐</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 4 }}>Progressive Web App (Desktop + Mobile Web)</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>SEO-optimised · 22-language · Admin console · Offline-capable · NRI diaspora accessible anywhere in the world</div>
                    <div style={{ display: "flex", gap: 5, marginTop: 7 }}><span className="pill pill-ok" style={{ fontSize: 9 }}>Live Now</span><span className="pill pill-gold" style={{ fontSize: 9 }}>All Browsers</span></div>
                  </div>
                </div>
              </div>

              <div className="card-purple">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>⚙️ Production Tech Stack</div>
                <div className="g2" style={{ gap: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>📱 React Native 0.74 + Expo 51</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>🖥️ Node.js + TypeScript API</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>🗄️ PostgreSQL + Redis + Prisma</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>🎥 Agora WebRTC (Live Video)</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>💳 Razorpay + PayU + Cashfree</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>📱 WhatsApp Business API</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>☁️ AWS S3 + CloudFront CDN</div>
                  <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>🤖 Claude AI (Anthropic)</div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, fontFamily: "var(--font-ui)" }}>Core Feature Set</div>
              <div className="g2" style={{ gap: 10 }}>
                {[
                  { icon: "🙏", title: "Pandit Booking", desc: "Browse 127+ pandits. Real-time slots. Online + offline. Agora video puja." },
                  { icon: "🕉️", title: "Antyesti Services", desc: "Full funeral coordination. 8 sacred venues. NRI support. Shraddh reminders." },
                  { icon: "🛍️", title: "Sacred Marketplace", desc: "26 categories. AI descriptions. Multi-vendor. GST/HSN. Fest calendar." },
                  { icon: "🎥", title: "Live Ritual Studio", desc: "HD stream. Auto cloud record. WhatsApp delivery post puja." },
                  { icon: "💳", title: "Multi-Gateway Payments", desc: "Razorpay + UPI + PhonePe + PayU. Smart gateway routing. EMI." },
                  { icon: "🤖", title: "AI Features (Claude)", desc: "22-lang content gen. Rashi recommendations. 24/7 Dharma support bot." },
                  { icon: "✓", title: "KYC & Trust Layer", desc: "Aadhaar + PAN via DigiLocker. Pandit cert verification. Fraud detection." },
                  { icon: "🗺️", title: "36 States Coverage", desc: "Festival calendar for all 36 states/UTs. 22 languages. State-specific products." },
                ].map((f, i) => (
                  <div key={i} className="card" style={{ padding: 14, borderColor: "rgba(201,167,77,.2)" }}>
                    <div style={{ fontSize: 22, marginBottom: 7 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 6 — BUSINESS MODEL */}
        <section className="slide slide-dark" id="s6">
          <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(201,167,77,.1),transparent)", right: 0, bottom: 0 }}></div>
          <div className="slide-num">06 / 22</div>
          <div className="slide-tag">💰 Business Model</div>
          <div className="t-title" style={{ marginBottom: 8 }}>Multiple <span className="grad">High-Margin Revenue Streams</span></div>
          <div className="t-sub" style={{ marginBottom: 28 }}>Commission-led marketplace + subscriptions + advertising + data APIs</div>

          <div className="g2" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>Revenue Stream Breakdown</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "🙏", title: "Puja Service Commission", pill: { cls: "pill-gold", text: "7–18%" }, desc: "Bronze 18% · Silver 14% · Gold 10% · Platinum 7% — on all puja bookings & hawan services", barW: "70%", note: "Primary revenue — 70% of GMV" },
                  { icon: "🛍️", title: "Sacred Products Marketplace", pill: { cls: "pill-purple", text: "12–20%" }, desc: "Commission on every sacred product sale across 26 categories from 834+ vendor stores", barW: "50%", barStyle: { background: "linear-gradient(90deg,var(--purple),var(--purple2))" }, note: "Growing revenue — 15% of GMV" },
                  { icon: "💎", title: "Pandit/Vendor Subscriptions", pill: { cls: "pill-ok", text: "₹999–₹4,999/mo" }, desc: "SaaS plans for pandits (featured listing, analytics, priority placement) & vendors (AI tools, bulk orders)", barW: "30%", barStyle: { background: "linear-gradient(90deg,var(--ok),#7EC870)" } },
                  { icon: "🕉️", title: "Antyesti & Premium Services", pillCustom: { bg: "rgba(77,168,207,.1)", border: "1px solid rgba(77,168,207,.25)", color: "var(--blue)", text: "₹3,500–₹25,000" }, desc: "Funeral coordination fixed-fee + 10% platform share. High-value, low-frequency, extremely loyal" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18 }}>{s.icon}</span><span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>{s.title}</span></div>
                      {s.pill && <span className={`pill ${s.pill.cls}`}>{s.pill.text}</span>}
                      {s.pillCustom && <span className="pill" style={{ background: s.pillCustom.bg, border: s.pillCustom.border, color: s.pillCustom.color }}>{s.pillCustom.text}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{s.desc}</div>
                    {s.barW && <><div className="pbar" style={{ marginTop: 8 }}><div className="pbar-fill" style={{ width: s.barW, ...(s.barStyle || {}) }}></div></div><div style={{ fontSize: 10, color: "var(--text3)", marginTop: 3, fontFamily: "var(--font-ui)" }}>{s.note}</div></>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="card-gold" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>📊 Unit Economics (Per Transaction)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "Avg Puja Booking Value", val: "₹4,500", valColor: "var(--gold)" },
                    { label: "Platform Take (14% Silver)", val: "₹630", valColor: "var(--gold)" },
                    { label: "Payment Gateway Cost (~2%)", val: "-₹90", valColor: "var(--red)" },
                    { label: "Agora + Infra (per txn)", val: "-₹25", valColor: "var(--red)" },
                  ].map((r, i) => (
                    <div key={i} className="vs-row" style={{ borderColor: "rgba(201,167,77,.15)" }}>
                      <div className="vs-label">{r.label}</div><div></div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: r.valColor, fontFamily: "var(--font-ui)", textAlign: "right" }}>{r.val}</div>
                    </div>
                  ))}
                  <div className="vs-row" style={{ border: "none" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>Net Margin / Booking</div><div></div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "var(--ok)", fontFamily: "var(--font-head)", textAlign: "right" }}>₹515 (~75%)</div>
                  </div>
                </div>
              </div>
              <div className="card-purple">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>🎯 Customer Acquisition Metrics</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    ["CAC (digital marketing)", "₹180–₹240"],
                    ["LTV (5yr, 2.4 bookings/yr)", "₹6,180+"],
                    ["LTV:CAC Ratio", "26:1", "var(--ok)"],
                    ["Payback Period", "4–5 months"],
                    ["Monthly Puja Frequency", "2.4x / customer"],
                  ].map(([label, val, color], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "var(--text2)" }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: color || "var(--purple3)" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 7 — FINANCIAL PROJECTIONS */}
        <section className="slide slide-gold" id="s7">
          <div className="slide-num">07 / 22</div>
          <div className="slide-tag">📈 Financial Projections</div>
          <div className="t-title" style={{ marginBottom: 8 }}>Path to <span className="grad">₹820 Crore ARR</span> by Year 5</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>Updated projections include 6 new feature verticals: Vedic Learning AI, Yoga, Astrology, Ayurveda, Temple Streams, Gurukul Education</div>

          <div className="card" style={{ marginBottom: 24, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", marginBottom: 16, fontFamily: "var(--font-ui)", textTransform: "uppercase", letterSpacing: 1 }}>Annual Revenue (₹ Crore)</div>
            <div className="rev-bar">
              <div className="rev-col"><div className="rev-val">2.4</div><div className="rev-bar-fill" style={{ height: 8, background: "linear-gradient(180deg,var(--purple2),var(--purple))" }}></div><div className="rev-yr">Y1</div></div>
              <div className="rev-col"><div className="rev-val">18</div><div className="rev-bar-fill" style={{ height: 24, background: "linear-gradient(180deg,var(--purple2),var(--purple))" }}></div><div className="rev-yr">Y2</div></div>
              <div className="rev-col"><div className="rev-val">95</div><div className="rev-bar-fill" style={{ height: 68 }}></div><div className="rev-yr">Y3</div></div>
              <div className="rev-col"><div className="rev-val">310</div><div className="rev-bar-fill" style={{ height: 118 }}></div><div className="rev-yr">Y4</div></div>
              <div className="rev-col"><div className="rev-val">820</div><div className="rev-bar-fill" style={{ height: 170 }}></div><div className="rev-yr">Y5</div></div>
            </div>
          </div>

          <table className="tbl" style={{ marginBottom: 24 }}>
            <thead><tr>
              <th>Metric</th><th>Year 1</th><th>Year 2</th><th>Year 3</th><th>Year 4</th><th>Year 5</th>
            </tr></thead>
            <tbody>
              <tr><td>Registered Users</td><td>50,000</td><td>3.5L</td><td>12L</td><td>35L</td><td>1.2 Crore</td></tr>
              <tr><td>Active Monthly Users</td><td>12,000</td><td>85,000</td><td>3.2L</td><td>9.8L</td><td>32L</td></tr>
              <tr><td>Verified Pandits</td><td>500</td><td>3,500</td><td>12,000</td><td>35,000</td><td>1.2L</td></tr>
              <tr><td>Monthly Bookings</td><td>2,000</td><td>18,000</td><td>72,000</td><td>2.1L</td><td>6.5L</td></tr>
              <tr><td>GMV (₹ Crore/yr)</td><td>10.8</td><td>97</td><td>480</td><td>1,450</td><td>5,200</td></tr>
              <tr><td style={{ color: "var(--gold)", fontWeight: 700 }}>Revenue (₹ Crore/yr)</td><td style={{ color: "var(--gold)", fontWeight: 700 }}>2.4</td><td style={{ color: "var(--gold)", fontWeight: 700 }}>18</td><td style={{ color: "var(--gold)", fontWeight: 700 }}>95</td><td style={{ color: "var(--gold)", fontWeight: 700 }}>310</td><td style={{ color: "var(--gold)", fontWeight: 700 }}>820</td></tr>
              <tr><td>EBITDA Margin</td><td style={{ color: "var(--red)" }}>-180%</td><td style={{ color: "var(--red)" }}>-45%</td><td style={{ color: "var(--text2)" }}>8%</td><td style={{ color: "var(--ok)" }}>22%</td><td style={{ color: "var(--ok)" }}>34%</td></tr>
              <tr><td style={{ color: "var(--ok)", fontWeight: 700 }}>EBITDA (₹ Crore)</td><td style={{ color: "var(--red)" }}>-4.3</td><td style={{ color: "var(--red)" }}>-8.1</td><td style={{ color: "var(--ok)" }}>5.8</td><td style={{ color: "var(--ok)" }}>46.2</td><td style={{ color: "var(--ok)" }}>176.8</td></tr>
              <tr><td>States Covered</td><td>5 states</td><td>15 states</td><td>28 states</td><td>All 36</td><td>All 36 + Global</td></tr>
            </tbody>
          </table>

          <div className="g3">
            <div className="card" style={{ textAlign: "center" }}><div className="t-num" style={{ fontSize: 30, color: "var(--ok)" }}>₹820Cr</div><div className="t-label" style={{ marginTop: 6 }}>Year 5 Revenue</div><div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "var(--font-ui)" }}>~$62M ARR</div></div>
            <div className="card" style={{ textAlign: "center" }}><div className="t-num" style={{ fontSize: 30 }}>1.2Cr</div><div className="t-label" style={{ marginTop: 6 }}>Registered Users Y5</div><div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "var(--font-ui)" }}>1.2% of 100Cr target</div></div>
            <div className="card" style={{ textAlign: "center" }}><div className="t-num" style={{ fontSize: 30, color: "var(--purple2)" }}>34%</div><div className="t-label" style={{ marginTop: 6 }}>EBITDA Margin Y5</div><div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Best-in-class marketplace</div></div>
          </div>
        </section>

        {/* SLIDE 8 — CAPEX / OPEX / TCO */}
        <section className="slide" style={{ background: "var(--bg1)" }} id="s8tco">
          <div className="slide-num">08 / 22</div>
          <div className="slide-tag">💼 CAPEX · OPEX · TCO</div>
          <div className="t-title" style={{ marginBottom: 8 }}>Total Cost of Ownership — <span className="grad">Capital Efficient Model</span></div>
          <div className="t-sub" style={{ marginBottom: 28 }}>Cloud-first, asset-light. 95% OPEX model — no physical infrastructure required.</div>

          <div className="g2" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", gap: 8 }}><span style={{ background: "rgba(201,167,77,.2)", border: "1px solid rgba(201,167,77,.3)", padding: "4px 10px", borderRadius: 8, fontSize: 10, letterSpacing: 1 }}>CAPEX</span> One-Time Build Costs</div>
              <table className="tbl">
                <thead><tr><th>Item</th><th>Est. Cost</th><th>Type</th></tr></thead>
                <tbody>
                  {[
                    ["iOS App Development (8 weeks)", "₹18–25L"],
                    ["Android App Development (8 weeks)", "₹18–25L"],
                    ["Web App (PWA + Admin Console)", "₹12–18L"],
                    ["Backend API + Database Setup", "₹15–20L"],
                    ["UI/UX Design System", "₹8–12L"],
                    ["Security Audit & Pen Testing", "₹5–8L"],
                    ["App Store + Play Store submission", "₹1.5L"],
                    ["IP / Patent Filing (Digital Neurones)", "₹3–5L"],
                  ].map(([item, cost], i) => (
                    <tr key={i}><td>{item}</td><td style={{ color: "var(--gold)" }}>{cost}</td><td><span className="pill pill-gold" style={{ fontSize: 9 }}>One-time</span></td></tr>
                  ))}
                  <tr style={{ background: "rgba(201,167,77,.05)" }}><td style={{ fontWeight: 700, color: "var(--text)" }}>Total CAPEX (Phase 1)</td><td style={{ fontWeight: 900, color: "var(--gold2)", fontSize: 15 }}>₹80L – ₹1.15Cr</td><td></td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", gap: 8 }}><span style={{ background: "rgba(124,77,206,.2)", border: "1px solid rgba(124,77,206,.3)", padding: "4px 10px", borderRadius: 8, fontSize: 10, letterSpacing: 1, color: "var(--purple3)" }}>OPEX</span> Monthly Running Costs</div>
              <table className="tbl">
                <thead><tr><th>Item</th><th>Y1 Monthly</th><th>Y3 Monthly</th></tr></thead>
                <tbody>
                  {[
                    ["AWS Infrastructure (EC2+RDS+S3+CF)", "₹1.2L", "₹5.5L"],
                    ["Agora WebRTC (video minutes)", "₹35K", "₹3.2L"],
                    ["Twilio WhatsApp API", "₹25K", "₹1.8L"],
                    ["Anthropic Claude AI API", "₹40K", "₹2.1L"],
                    ["Razorpay / Payment gateways", "₹85K", "₹8.5L"],
                    ["Firebase (Auth + FCM)", "₹15K", "₹85K"],
                    ["Engineering Team (7 devs)", "₹12.5L", "₹28L"],
                    ["Marketing & Growth", "₹8L", "₹35L"],
                  ].map(([item, y1, y3], i) => (
                    <tr key={i}><td>{item}</td><td style={{ color: "var(--purple3)" }}>{y1}</td><td style={{ color: "var(--purple3)" }}>{y3}</td></tr>
                  ))}
                  <tr style={{ background: "rgba(124,77,206,.05)" }}><td style={{ fontWeight: 700, color: "var(--text)" }}>Total Monthly OPEX</td><td style={{ fontWeight: 900, color: "var(--purple3)", fontSize: 14 }}>₹23L</td><td style={{ fontWeight: 900, color: "var(--purple3)", fontSize: 14 }}>₹85L</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-gold">
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)" }}>📊 3-Year Total Cost of Ownership Summary</div>
            <div className="g4">
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 900, color: "var(--gold)", fontFamily: "var(--font-head)" }}>₹1Cr</div><div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Total CAPEX</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 900, color: "var(--purple2)", fontFamily: "var(--font-head)" }}>₹8.5Cr</div><div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Y1–Y3 OPEX Total</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 900, color: "var(--gold2)", fontFamily: "var(--font-head)" }}>₹9.5Cr</div><div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Total 3-Yr TCO</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 900, color: "var(--ok)", fontFamily: "var(--font-head)" }}>₹90Cr</div><div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Y3 Revenue Target</div></div>
            </div>
          </div>
        </section>

        {/* SLIDE 9 — TEAM */}
        <section className="slide slide-dark" id="s8">
          <div className="glow-orb" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(201,167,77,.08),transparent)", right: 80, top: 80 }}></div>
          <div className="slide-num">09 / 22</div>
          <div className="slide-tag">👥 The Team</div>
          <div className="t-title" style={{ marginBottom: 8 }}><span className="grad">Digital Neurones India</span> — Built for Scale</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>A cross-functional team combining deep spiritual domain expertise with world-class engineering</div>

          <div className="g2" style={{ marginBottom: 24, gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, fontFamily: "var(--font-ui)" }}>Leadership</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: "👑", gradient: "linear-gradient(135deg,var(--gold),var(--gold2))", title: "Founder & CEO", sub: "Digital Neurones India Pvt Ltd", desc: "Vision, strategy, partnerships & fundraising. Deep roots in Sanatan Dharma culture & India tech ecosystem." },
                  { icon: "⚙️", gradient: "linear-gradient(135deg,var(--purple),var(--purple2))", title: "CTO / Head of Product", sub: "Platform Architecture & AI", desc: "Full-stack platform architecture, React Native, Node.js, AI integrations, Agora, AWS. Previously scaled 3 B2C apps." },
                  { icon: "📈", gradient: "linear-gradient(135deg,var(--ok),#7EC870)", title: "Chief Revenue Officer", sub: "Revenue, Growth & Partnerships", desc: "Pandit onboarding, temple trust partnerships, vendor acquisition. 10+ yr experience in India B2C growth." },
                ].map((m, i) => (
                  <div key={i} className="card" style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 48, height: 48, background: m.gradient, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{m.icon}</div>
                    <div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>{m.title}</div><div style={{ fontSize: 12, color: "var(--gold)", marginBottom: 4, fontFamily: "var(--font-ui)" }}>{m.sub}</div><div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{m.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 14, fontFamily: "var(--font-ui)" }}>Engineering Team</div>
              <div className="g2" style={{ gap: 10, marginBottom: 16 }}>
                {[
                  { av: "💻", name: "[Dev #1]", role: "Frontend Dev #1", desc: "Customer UI, Booking flow, Pandit Browse, iOS screens" },
                  { av: "🎨", name: "[Dev #2]", role: "Frontend Dev #2", desc: "Pandit Panel, Wallet, Products, Admin Panel UI" },
                  { av: "🔧", name: "[Dev #3]", role: "Node.js Dev", desc: "Video conf module, Agora integration, WebRTC" },
                  { av: "🐍", name: "[Dev #4]", role: "API Dev (Python)", desc: "AI/ML services, Claude API, analytics, automation" },
                ].map((p, i) => (
                  <div key={i} className="persona"><div className="persona-av">{p.av}</div><div className="persona-name">{p.name}</div><div className="persona-role">{p.role}</div><div className="persona-desc">{p.desc}</div></div>
                ))}
              </div>
              <div className="card-gold">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>🛕 Advisory Board</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    ["🕉️", "Dharma Advisor", "Senior Vedic scholar, establishes spiritual authenticity and ritual accuracy for all platform content"],
                    ["💰", "Finance Advisor", "CFO-level expertise in Series A–C fundraising, Indian startup compliance"],
                    ["📱", "Growth Advisor", "Previously led user growth at a top-3 Indian consumer app (1Cr+ MAU)"],
                    ["⚖️", "Legal Advisor", "IP & startup law, DPDP Act compliance, patent prosecution"],
                  ].map(([icon, title, desc], i) => (
                    <div key={i} style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{icon} <strong style={{ color: "var(--text)" }}>{title}</strong> — {desc}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 10 — ROADMAP */}
        <section className="slide slide-gold" id="s9">
          <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(201,167,77,.08),transparent)", right: -80, bottom: -80 }}></div>
          <div className="slide-num">10 / 22</div>
          <div className="slide-tag">🗺️ Product Roadmap</div>
          <div className="t-title" style={{ marginBottom: 8 }}>From <span className="grad">MVP to National Dominance</span> — 24-Month Plan</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>7-week sprint cadence aligned with engineering team (Satyajit, Lalatendu, Shaktiranjan, Arya)</div>

          <div className="g2" style={{ gap: 32 }}>
            <div className="timeline">
              {[
                { dot: "Q2", dotStyle: { background: "linear-gradient(135deg,var(--gold),var(--gold2))", borderColor: "var(--gold2)", color: "var(--bg)" }, q: "Apr – Jun 2026 (NOW)", title: "Phase 1 — Platform Launch", desc: "Customer UI, Pandit Portal, Booking system, Payment integration. iOS + Android soft launch in Hyderabad, Varanasi, Delhi. Target: 500 pandits, 10,000 users." },
                { dot: "Q3", q: "Jul – Sep 2026", title: "Phase 2 — Live Streaming + Antyesti", desc: "Agora live puja broadcast live. Antyesti module with all 8 venues. WhatsApp recording delivery. 5 major cities. Target: 3,500 pandits, 85K users." },
                { dot: "Q4", q: "Oct – Dec 2026", title: "Phase 3 — Marketplace + AI Scale", desc: "Full 26-category marketplace. Claude AI recommendations. Festival calendar for all 36 states. 15 cities. NRI international launch (USA, UK, UAE). Target: 3L users." },
                { dot: "Q1", q: "Jan – Mar 2027", title: "Phase 4 — National Scale", desc: "All 28 states. Regional language UI (22 languages). Temple trust partnerships (100+ trusts). B2B API for pilgrimage portals. Series A close. Target: 10L users." },
                { dot: "Y3+", dotStyle: { background: "linear-gradient(135deg,var(--purple),var(--purple2))", borderColor: "var(--purple2)", color: "white" }, q: "2027–2028", title: "Phase 5 — Unicorn Path", desc: "100+ cities. Spiritual tourism packages. Vedic education platform. White-label B2B (IRCTC pilgrimage, govt schemes). Global Hindi diaspora. Target: 1.2Cr users.", last: true },
              ].map((item, i) => (
                <div key={i} className="tl-item" style={item.last ? { border: "none" } : {}}>
                  <div className="tl-dot" style={item.dotStyle || {}}>{item.dot}</div>
                  <div className="tl-content">
                    <div className="tl-q">{item.q}</div>
                    <div className="tl-title">{item.title}</div>
                    <div className="tl-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="card-gold">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)" }}>🎯 30-Day Launch Milestones</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {["Web app + iOS + Android in App Stores", "100 verified pandits onboarded (Hyderabad + Varanasi)", "First 500 bookings processed", "Razorpay + UPI payments live", "PR coverage in 5 major Hindi media outlets"].map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "var(--ok)" }}>✓</span><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{m}</span></div>
                  ))}
                </div>
              </div>
              <div className="card-purple">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)" }}>🏆 Year 1 KPIs</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[["Registered users", "50,000", "var(--purple3)"], ["Verified pandits", "500", "var(--purple3)"], ["Monthly bookings", "2,000", "var(--purple3)"], ["GMV (annual)", "₹10.8Cr", "var(--gold)"], ["Revenue (annual)", "₹2.4Cr", "var(--gold)"], ["App rating (target)", "4.6+ ⭐", "var(--ok)"]].map(([label, val, color], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: "var(--text2)" }}>{label}</span><span style={{ fontSize: 13, fontWeight: 700, color }}>{val}</span></div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>🌍 Expansion Priority Markets</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span className="pill pill-gold" style={{ fontSize: 10 }}>Hyderabad</span>
                  <span className="pill pill-gold" style={{ fontSize: 10 }}>Varanasi</span>
                  <span className="pill pill-gold" style={{ fontSize: 10 }}>Delhi NCR</span>
                  <span className="pill pill-purple" style={{ fontSize: 10 }}>Mumbai</span>
                  <span className="pill pill-purple" style={{ fontSize: 10 }}>Bangalore</span>
                  <span className="pill pill-purple" style={{ fontSize: 10 }}>Chennai</span>
                  <span className="pill pill-ok" style={{ fontSize: 10 }}>USA 🇺🇸</span>
                  <span className="pill pill-ok" style={{ fontSize: 10 }}>UAE 🇦🇪</span>
                  <span className="pill" style={{ background: "rgba(77,168,207,.1)", border: "1px solid rgba(77,168,207,.25)", color: "var(--blue)", fontSize: 10 }}>UK 🇬🇧</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 11 — MARKETING */}
        <section className="slide slide-purple" id="s10">
          <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(124,77,206,.2),transparent)", left: -100, bottom: 0 }}></div>
          <div className="slide-num">11 / 22</div>
          <div className="slide-tag">📣 Marketing & Social Outreach</div>
          <div className="t-title" style={{ marginBottom: 8 }}>Reaching <span className="grad">100 Crore Hindus</span> — Multi-Channel Strategy</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>Faith-first marketing. Community-led growth. Trusted by temples, respected by pandits.</div>

          <div className="g2" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>📱 Digital Channels</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "📺", title: "YouTube & Shorts", desc: "Live puja recordings (free) as content marketing. 57Cr YouTube users in India watch religious content. Auto-publish pandit recordings = free virality. Target: 5L subscribers Y1." },
                  { icon: "📸", title: "Instagram & Facebook", desc: "Festival-led content calendar (36 states × 12 months = 432 campaigns/yr). AI-generated posts in 22 languages. Pandit profiles as influencer content. ₹2.5Cr/yr ad budget." },
                  { icon: "💬", title: "WhatsApp Communities", desc: "India has 53Cr WhatsApp users. Partner with temple trusts and pandit guilds for community broadcast lists. Festival reminders + puja tips = organic viral growth. Zero cost." },
                  { icon: "🔍", title: "SEO / ASO (22 Languages)", desc: "AI-generated content in Hindi, Tamil, Telugu, Kannada, Bengali — targeting 180M Hindi internet users. App Store Optimization in 22 languages = organic installs. Estimated 35% of downloads organic." },
                ].map((c, i) => (
                  <div key={i} className="card" style={{ padding: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 6 }}>{c.icon} {c.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>🛕 Offline & Community Channels</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "⛩️", title: "Temple Trust Partnerships", desc: "500+ temples as distribution partners. Install SanatanDiksha QR codes at temple entrance. Pilgrim kiosks for puja booking on-site. Revenue share with trusts = win-win. Target: 100 temple MoUs Y1." },
                  { icon: "🎪", title: "Festival Activations", desc: "Presence at Kumbh Mela, Navratri, Diwali, Ganesh Chaturthi, Rath Yatra. Free puja booking kiosks. Celebrity pandit streams. ₹1.5Cr events budget for Year 1. Expected 5L+ exposure/event." },
                  { icon: "📻", title: "Bhajan & Devotional Media", desc: "Sponsorship of Bhajan channels, Aastha TV, Sanskar channel, Divya Bhaskar, Navbharat Times, Dainik Jagran. 15–30 second ads in vernacular languages. 22Cr+ combined daily reach." },
                  { icon: "🌍", title: "NRI Outreach Programme", desc: "Partnerships with Hindu cultural societies in USA, UK, UAE, Australia, Canada. NRI WhatsApp groups (32M NRIs). Diwali sponsorships. Free Antyesti consultation → platform conversion." },
                ].map((c, i) => (
                  <div key={i} className="card-gold" style={{ padding: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 6 }}>{c.icon} {c.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="divider-full"></div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)" }}>📊 Annual Marketing Budget Allocation</div>
          <div className="g4">
            {[
              { pct: "35%", color: "var(--gold)", label: "Digital (Meta, YouTube, Google)" },
              { pct: "25%", color: "var(--purple2)", label: "Temple & Community Partnerships" },
              { pct: "25%", color: "var(--ok)", label: "Festival Activations & PR" },
              { pct: "15%", color: "var(--blue)", label: "NRI & International Outreach" },
            ].map((b, i) => (
              <div key={i} style={{ textAlign: "center", padding: 14, background: "var(--bg2)", borderRadius: 14, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: b.color, fontFamily: "var(--font-head)" }}>{b.pct}</div>
                <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4, fontFamily: "var(--font-ui)" }}>{b.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SLIDE 12 — COMPETITIVE */}
        <section className="slide" style={{ background: "var(--bg2)" }} id="s11">
          <div className="slide-num">12 / 22</div>
          <div className="slide-tag">⚔️ Competitive Advantage</div>
          <div className="t-title" style={{ marginBottom: 8 }}>We Are <span className="grad">Building the Category</span> — Not Fighting In It</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>No existing platform offers the complete sacred services stack. We are creating the market.</div>

          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table className="tbl" style={{ minWidth: 900 }}>
              <thead><tr>
                <th>Feature</th>
                <th style={{ color: "var(--gold)" }}>SanatanDiksha ✦</th>
                <th>Urban Company</th>
                <th>Amazon/Flipkart</th>
                <th>Astrotalk / Astroyogi</th>
                <th>99Pandit / PanditJi</th>
              </tr></thead>
              <tbody>
                {[
                  ["Verified Pandit Booking", "✓ Full", "✗", "✗", "✗", "Partial"],
                  ["Live Puja Streaming (WebRTC)", "✓ Agora HD", "✗", "✗", "✗", "✗"],
                  ["Antyesti / Funeral Services", "✓ Full + NRI", "✗", "✗", "✗", "✗"],
                  ["Sacred Products Marketplace", "✓ Verified", "✗", "Generic", "✗", "✗"],
                  ["22-Language Support", "✓ All 22", "✗", "Partial", "Few", "Hindi only"],
                  ["NRI Overseas Access", "✓ Full", "✗", "Shipping only", "Calls only", "✗"],
                  ["Pandit Calendar & Availability", "✓ Real-time", "✗", "✗", "✗", "Basic"],
                  ["AI-Powered Recommendations", "✓ Claude AI", "✗", "Generic", "Astro only", "✗"],
                  ["Post-Puja WhatsApp Recording", "✓ Auto", "✗", "✗", "✗", "✗"],
                  ["7 User Roles / Multi-persona", "✓ Full", "2 only", "2 only", "2 only", "3 only"],
                  ["Indian Patent Filed", "✓ Filed", "✗", "N/A", "✗", "✗"],
                ].map(([feat, sd, uc, amz, astro, pandit], i) => (
                  <tr key={i}>
                    <td>{feat}</td>
                    <td style={{ color: "var(--ok)" }}>{sd}</td>
                    <td style={{ color: uc === "✗" ? "var(--red)" : "var(--text2)" }}>{uc}</td>
                    <td style={{ color: amz === "✗" ? "var(--red)" : "var(--text2)" }}>{amz}</td>
                    <td style={{ color: astro === "✗" ? "var(--red)" : "var(--text2)" }}>{astro}</td>
                    <td style={{ color: pandit === "✗" ? "var(--red)" : "var(--text2)" }}>{pandit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="g3">
            {[
              { icon: "🏰", title: "Deep Moats", desc: "Pandit KYC database, ritual knowledge graph, sacred venue relationships, temple trust partnerships — all take years to build" },
              { icon: "📜", title: "IP Protection", desc: "Indian Patent Application filed for 5 core innovations. Trademark SanatanDiksha. Trade secrets for AI ranking weights & specialisation taxonomy" },
              { icon: "🌐", title: "Network Effects", desc: "More customers → more pandits → better match quality → more customers. Cross-side network effects compound with every transaction" },
            ].map((m, i) => (
              <div key={i} className="card-gold" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SLIDE 13 — EXPANSION */}
        <section className="slide slide-dark" id="s12">
          <div className="glow-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(201,167,77,.08),transparent)", right: -100, top: 0 }}></div>
          <div className="slide-num">13 / 22</div>
          <div className="slide-tag">🚀 Expansion & Rollout Plan</div>
          <div className="t-title" style={{ marginBottom: 8 }}>How We Reach <span className="grad">100 Crore Indians</span> — The Playbook</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>Hyper-local launch → State dominance → National scale → Global diaspora</div>

          <div className="g2" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>📍 Geographic Expansion Waves</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { border: "var(--gold)", title: "🌟 Wave 1 — Foundation Cities", pill: { cls: "pill-gold", text: "Apr–Sep 2026" }, desc: "Hyderabad · Varanasi · Delhi NCR · Mumbai · Bangalore\nTarget: 10,000 users · 500 pandits · 5 temple trust MoUs" },
                  { border: "var(--purple)", title: "🌟🌟 Wave 2 — State Capitals", pill: { cls: "pill-purple", text: "Oct 2026–Mar 2027" }, desc: "All 28 state capitals + Tier-2 cities (Lucknow, Patna, Bhubaneswar, Indore, Coimbatore, etc.)\nTarget: 3L users · 12,000 pandits · 100 temple trusts" },
                  { border: "var(--ok)", title: "🌟🌟🌟 Wave 3 — Tier 2/3 India", pill: { cls: "pill-ok", text: "2027" }, desc: "500+ cities. Village-level puja reminder SMS. Offline pandits onboarded via assisted onboarding.\nTarget: 35L users · 35,000 pandits · 500+ temple trusts" },
                  { border: "var(--blue)", title: "🌍 Wave 4 — Global Hindu Diaspora", pillCustom: { text: "2027–2028" }, desc: "USA · UK · UAE · Australia · Canada · Singapore · Southeast Asia\n32M NRIs. Antyesti + Festival bookings from abroad. Target: 50L NRI users" },
                ].map((w, i) => (
                  <div key={i} className="card" style={{ padding: 14, borderLeft: `3px solid ${w.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>{w.title}</div>
                      {w.pill && <span className={`pill ${w.pill.cls}`} style={{ fontSize: 10 }}>{w.pill.text}</span>}
                      {w.pillCustom && <span className="pill" style={{ background: "rgba(77,168,207,.1)", border: "1px solid rgba(77,168,207,.25)", color: "var(--blue)", fontSize: 10 }}>{w.pillCustom.text}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}>{w.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>📣 Growth Flywheel</div>
              <div style={{ position: "relative", height: 280, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg viewBox="0 0 280 280" style={{ width: 260, height: 260 }}>
                  <circle cx="140" cy="140" r="130" fill="none" stroke="rgba(201,167,77,.15)" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="140" cy="140" r="90" fill="none" stroke="rgba(201,167,77,.2)" strokeWidth="1" />
                  <circle cx="140" cy="140" r="40" fill="rgba(201,167,77,.15)" stroke="var(--gold)" strokeWidth="2" />
                  <text x="140" y="136" textAnchor="middle" fontFamily="serif" fontSize="22" fill="#C9A74D">ॐ</text>
                  <text x="140" y="153" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#C9A74D" fontWeight="700">PLATFORM</text>
                  <circle cx="140" cy="15" r="22" fill="rgba(201,167,77,.12)" stroke="rgba(201,167,77,.4)" strokeWidth="1.5" />
                  <text x="140" y="12" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#C9A74D" fontWeight="700">MORE</text>
                  <text x="140" y="21" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#E0D0F0">PANDITS</text>
                  <circle cx="255" cy="95" r="22" fill="rgba(201,167,77,.12)" stroke="rgba(201,167,77,.4)" strokeWidth="1.5" />
                  <text x="255" y="92" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#C9A74D" fontWeight="700">BETTER</text>
                  <text x="255" y="101" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#E0D0F0">MATCHES</text>
                  <circle cx="220" cy="240" r="22" fill="rgba(124,77,206,.15)" stroke="rgba(124,77,206,.4)" strokeWidth="1.5" />
                  <text x="220" y="237" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#9B72CF" fontWeight="700">MORE</text>
                  <text x="220" y="246" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#E0D0F0">REVIEWS</text>
                  <circle cx="60" cy="240" r="22" fill="rgba(76,175,121,.12)" stroke="rgba(76,175,121,.4)" strokeWidth="1.5" />
                  <text x="60" y="237" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#4CAF79" fontWeight="700">MORE</text>
                  <text x="60" y="246" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#E0D0F0">USERS</text>
                  <circle cx="25" cy="95" r="22" fill="rgba(77,168,207,.12)" stroke="rgba(77,168,207,.4)" strokeWidth="1.5" />
                  <text x="25" y="92" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#4DA8CF" fontWeight="700">LOWER</text>
                  <text x="25" y="101" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="7" fill="#E0D0F0">CAC</text>
                  <path d="M155 32 Q200 50 240 78" fill="none" stroke="rgba(201,167,77,.4)" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <path d="M254 118 Q258 160 240 218" fill="none" stroke="rgba(201,167,77,.4)" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <path d="M200 250 Q140 260 80 250" fill="none" stroke="rgba(124,77,206,.4)" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <path d="M42 220 Q30 160 30 118" fill="none" stroke="rgba(76,175,121,.4)" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <path d="M40 78 Q90 50 125 32" fill="none" stroke="rgba(77,168,207,.4)" strokeWidth="1.5" markerEnd="url(#arr)" />
                  <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(201,167,77,.6)" /></marker></defs>
                </svg>
              </div>
              <div className="card-gold" style={{ padding: 14 }}>
                <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)", textAlign: "center", lineHeight: 1.6 }}>The SanatanDiksha flywheel: <strong style={{ color: "var(--gold)" }}>More pandits → Better matches → More bookings → More reviews → Lower CAC → More users → More pandits</strong>. Each revolution compounds the moat.</div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 14 — FUNDING ASK */}
        <section className="slide slide-hero" id="s9funding">
          <div className="glow-orb" style={{ width: 600, height: 600, background: "radial-gradient(circle,rgba(201,167,77,.14),transparent)", right: -200, top: -100 }}></div>
          <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(124,77,206,.15),transparent)", left: -150, bottom: -100 }}></div>
          <div className="slide-num">14 / 22</div>
          <div className="slide-tag">💎 Funding Ask</div>

          <div className="g2" style={{ alignItems: "center", gap: 48 }}>
            <div>
              <div className="t-title" style={{ marginBottom: 12 }}>Seeking <span className="grad">₹25 Crore</span><br />Series A</div>
              <div className="t-sub" style={{ marginBottom: 28 }}>18-month runway to product-market fit, 10L users, and ₹50Cr ARR run-rate.</div>

              <div style={{ background: "linear-gradient(135deg,rgba(201,167,77,.12),rgba(124,77,206,.1))", border: "1px solid rgba(201,167,77,.3)", borderRadius: 24, padding: 28, marginBottom: 24 }}>
                <div style={{ fontFamily: "var(--font-head)", fontSize: 52, fontWeight: 900, background: "linear-gradient(135deg,var(--gold),var(--gold2),var(--gold3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1, marginBottom: 4 }}>₹25 Crore</div>
                <div style={{ fontSize: 14, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>~$3M USD · Series A · Equity</div>
                <div className="divider"></div>
                <div style={{ fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>Pre-money valuation: <strong style={{ color: "var(--gold)" }}>₹100 Crore</strong> (~$12M)</div>
                <div style={{ fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-ui)", marginTop: 4 }}>Equity offered: <strong style={{ color: "var(--gold)" }}>20% stake</strong></div>
                <div style={{ fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-ui)", marginTop: 4 }}>Runway: <strong style={{ color: "var(--gold)" }}>18 months to profitability milestone</strong></div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="pill pill-gold">Equity</span>
                <span className="pill pill-purple">Board Seat Offered</span>
                <span className="pill pill-ok">ESOP Pool: 10%</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16, fontFamily: "var(--font-ui)" }}>📊 Use of Funds — ₹25 Crore</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "👨‍💻", title: "Engineering & Product (iOS+Android+Web)", amt: "₹8Cr", amtColor: "var(--gold)", barW: "32%", note: "32% — 12-person eng team, 18 months, full-stack iOS/Android/backend" },
                  { icon: "📣", title: "Marketing, Growth & Pandit Acquisition", amt: "₹9Cr", amtColor: "var(--purple2)", barW: "36%", barStyle: { background: "linear-gradient(90deg,var(--purple),var(--purple2))" }, note: "36% — Digital campaigns, festival activations, pandit onboarding incentives, NRI outreach" },
                  { icon: "☁️", title: "Infrastructure (AWS, Agora, AI, APIs)", amt: "₹3.5Cr", amtColor: "var(--ok)", barW: "14%", barStyle: { background: "linear-gradient(90deg,var(--ok),#7EC870)" }, note: "14% — Cloud, video streaming, AI APIs, WhatsApp, payment gateway costs" },
                  { icon: "🏢", title: "Operations, Legal & Compliance", amt: "₹2.5Cr", amtColor: "var(--blue)", barW: "10%", barStyle: { background: "linear-gradient(90deg,var(--blue),#7EC8CF)" }, note: "10% — Office, KYC compliance, DPDP Act, GST, legal, IP" },
                  { icon: "🔒", title: "Working Capital Reserve", amt: "₹2Cr", amtColor: "var(--text2)", barW: "8%", barStyle: { background: "rgba(120,80,200,.5)" }, note: "8% — Buffer for 6 months of unexpected costs" },
                ].map((f, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 16 }}>{f.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>{f.title}</span></div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: f.amtColor, fontFamily: "var(--font-head)" }}>{f.amt}</span>
                    </div>
                    <div className="pbar"><div className="pbar-fill" style={{ width: f.barW, ...(f.barStyle || {}) }}></div></div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3, fontFamily: "var(--font-ui)" }}>{f.note}</div>
                  </div>
                ))}
              </div>

              <div className="divider-full" style={{ margin: "20px 0 14px" }}></div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 10 }}>🎯 Milestones This Funding Achieves</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["iOS & Android live on App Store + Play Store", "10 Lakh registered users in 18 months", "12,000 verified pandits on platform", "₹75Cr ARR run-rate at Month 18", "EBITDA breakeven at Month 16", "Series B ready: ₹100Cr raise at ₹800Cr valuation"].map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "var(--gold)" }}>◆</span><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{m}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 15 — WHY NOW */}
        <section className="slide" style={{ background: "var(--bg2)" }} id="s13">
          <div className="slide-num">15 / 22</div>
          <div className="slide-tag">⚡ Why Now</div>
          <div className="t-title" style={{ marginBottom: 8 }}>The <span className="grad">Perfect Moment</span> to Build This</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>Macro tailwinds, digital infrastructure, and cultural momentum have converged.</div>

          <div className="g3" style={{ marginBottom: 24 }}>
            {[
              { icon: "📱", title: "India's Digital Surge", desc: "75Cr smartphone users. 80Cr internet users. UPI at 18B transactions/month. India's digital infrastructure is now class-leading — small-town India is online for the first time." },
              { icon: "🛕", title: "Hindu Renaissance", desc: "Ram Mandir inauguration (Jan 2024) saw 72.6M+ Varanasi pilgrims in 2025 — 80% youth. Cultural pride at historic high. Government's PRASAD scheme investing ₹1,400Cr in pilgrimage infrastructure." },
              { icon: "🌍", title: "Post-COVID Digital Ritual", desc: "COVID normalised online puja. 40M+ Indians watched virtual darshan. Online spiritual content grew 300% during pandemic. Behaviour is permanently changed — digital ritual is mainstream." },
            ].map((c, i) => (
              <div key={i} className="card-gold">
                <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{c.desc}</div>
              </div>
            ))}
          </div>

          <div className="g2">
            <div className="card-purple">
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)" }}>🏆 Traction & Validation</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { color: "var(--ok)", text: "Full-featured web prototype live and demo-ready" },
                  { color: "var(--ok)", text: "iOS + Android production spec complete (7-week build plan)" },
                  { color: "var(--ok)", text: "Indian Patent Application filed (DN-IP-2026-SD-001)" },
                  { color: "var(--ok)", text: "Engineering team assembled and deployed (4 devs)" },
                  { color: "var(--gold)", text: "Temple trust partnership discussions initiated (Hyderabad)" },
                  { color: "var(--gold)", text: "LOIs from 3 pandit guilds for platform onboarding" },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }}></div><span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{t.text}</span></div>
                ))}
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-ui)" }}>📊 Key Risks & Mitigations</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { risk: "Risk: Pandit supply acquisition", mitigation: "Mitigation: 0% commission for first 6 months + assisted onboarding team" },
                  { risk: "Risk: Religious content sensitivity", mitigation: "Mitigation: Senior Dharma advisory board, pandit-led content policy" },
                  { risk: "Risk: Copycat competition", mitigation: "Mitigation: Patent protection + 12-month head start + network effects moat" },
                  { risk: "Risk: Payment gateway fraud", mitigation: "Mitigation: Razorpay Shield + AI fraud detection + escrow model" },
                ].map((r, i) => (
                  <div key={i} style={{ padding: 8, background: "var(--bg3)", borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", fontFamily: "var(--font-ui)" }}>{r.risk}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)", marginTop: 3 }}>{r.mitigation}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 16 — VISION */}
        <section className="slide" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%,rgba(124,77,206,.2) 0%,transparent 70%),var(--bg1)" }}>
          <div className="om-bg" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.04, fontSize: 600 }}>ॐ</div>
          <div className="slide-num">16 / 22</div>
          <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
            <div className="slide-tag" style={{ margin: "0 auto 24px" }}>🌟 The Vision</div>
            <div className="t-hero" style={{ marginBottom: 20, lineHeight: 1.1 }}>
              <span className="grad">100 Crore Hindus.</span><br />
              One Sacred Platform.
            </div>
            <div className="t-sub" style={{ marginBottom: 36, fontSize: 20 }}>SanatanDiksha will be the operating system of Sanatan Dharma — from the first aarti of a newborn to the last rites of a life well-lived.</div>
            <div className="g3" style={{ maxWidth: 700, margin: "0 auto 36px" }}>
              <div style={{ textAlign: "center", padding: 20, background: "rgba(201,167,77,.06)", border: "1px solid rgba(201,167,77,.15)", borderRadius: 16 }}>
                <div className="t-num" style={{ fontSize: 36 }}>₹8,200Cr</div>
                <div className="t-label" style={{ marginTop: 6 }}>ARR at 100Cr users</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "var(--font-ui)" }}>10× unicorn potential</div>
              </div>
              <div style={{ textAlign: "center", padding: 20, background: "rgba(124,77,206,.08)", border: "1px solid rgba(124,77,206,.2)", borderRadius: 16 }}>
                <div className="t-num" style={{ fontSize: 36, color: "var(--purple2)" }}>5L+</div>
                <div className="t-label" style={{ marginTop: 6 }}>Pandits Empowered</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "var(--font-ui)" }}>Formalising their livelihoods</div>
              </div>
              <div style={{ textAlign: "center", padding: 20, background: "rgba(76,175,121,.06)", border: "1px solid rgba(76,175,121,.15)", borderRadius: 16 }}>
                <div className="t-num" style={{ fontSize: 36, color: "var(--ok)" }}>Global</div>
                <div className="t-label" style={{ marginTop: 6 }}>Hindu Diaspora Connected</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "var(--font-ui)" }}>32M NRIs + India</div>
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 18, color: "var(--text2)", fontStyle: "italic", lineHeight: 1.6, marginBottom: 32 }}>"We are not just building an app. We are building the digital infrastructure for the world's oldest living civilisation. Every puja booked, every pandit empowered, every Shraddh remembered — is a thread in the fabric of Sanatan Dharma's future."</div>
            <div style={{ fontSize: 13, color: "var(--gold)", fontFamily: "var(--font-ui)", fontWeight: 700, letterSpacing: 1 }}>— Founders, Digital Neurones India Pvt Ltd</div>
          </div>
        </section>

        {/* SLIDE 17 — CONTACT */}
        <section className="slide" style={{ background: "var(--bg2)", textAlign: "center" }}>
          <div className="glow-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(201,167,77,.12),transparent)", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}></div>
          <div className="slide-num">17 / 22</div>
          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🕉️</div>
            <div className="t-title" style={{ marginBottom: 8 }}>Let's Build <span className="grad">Bharat's Sacred Future</span> Together</div>
            <div className="t-sub" style={{ marginBottom: 36 }}>We're ready. The market is ready. India is ready.</div>
            <div className="g2" style={{ marginBottom: 28, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
              <div className="card-gold" style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>📋 Next Steps</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {["1️⃣ Schedule a 60-min demo session", "2️⃣ Review detailed financial model", "3️⃣ Due diligence data room access", "4️⃣ Term sheet discussion", "5️⃣ Close & deploy capital"].map((s, i) => (
                    <div key={i} style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{s}</div>
                  ))}
                </div>
              </div>
              <div className="card-purple" style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>📞 Contact</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {["🏢 Digital Neurones India Pvt Ltd", "📧 invest@sanatandiksha.com", "🌐 sanatandiksha.com", "📍 Hyderabad, Telangana, India", "📱 Available on iOS & Android"].map((c, i) => (
                    <div key={i} style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{c}</div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: "var(--text3)", fontFamily: "var(--font-ui)" }}>Reference: DN-PITCH-2026-SD-001 · Confidential · © 2026 Digital Neurones India Pvt Ltd</div>
          </div>
        </section>

        {/* SLIDE 18 — PLATFORM EXPANSION */}
        <section className="slide slide-gold" id="sf0">
          <div className="glow-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(201,167,77,.12),transparent)", right: -100, top: -50 }}></div>
          <div className="slide-num">18 / 22</div>
          <div className="slide-tag">🌟 Platform Expansion</div>
          <div className="t-title" style={{ marginBottom: 8 }}>From Sacred Services to <span className="grad">Complete Spiritual OS</span></div>
          <div className="t-sub" style={{ marginBottom: 28 }}>6 new verticals transforming SanatanDiksha into the world's most comprehensive Sanatan Dharma platform — expanding TAM from $64B to $180B+</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { icon: "📚", title: "Vedic AI Library", desc: "Gita · Mahabharata · Ramayana · 4 Vedas — AI conversational learning in 22 languages", pill: { cls: "pill-gold", text: "$2.5B EdTech TAM" } },
              { icon: "🧘", title: "Yoga & Wellness Tracker", desc: "Daily practice tracking · AI pose guidance · Personalised asana plans by Dosha type", pill: { cls: "pill-ok", text: "$5.06B India Yoga TAM" } },
              { icon: "⭐", title: "Vedic Astrology", desc: "Personal Kundali · Dasha forecasts · Muhurta · Live astrologer consultations", pill: { cls: "pill-purple", text: "$1.79B India Astro TAM 2030" } },
              { icon: "🌿", title: "Ayurveda AI Lifestyle", desc: "Dosha profiling · Seasonal food plans · Herb recommendations · Regional cuisine AI", pillCustom: { text: "$20B Ayurveda TAM", bg: "rgba(76,175,121,.1)", border: "1px solid rgba(76,175,121,.25)", color: "var(--ok)" } },
              { icon: "🛕", title: "Temple Live Streams", desc: "51 Shaktipeethas · 12 Jyotirlingas · 4 Dhams · Regional temples — managed by SD", pillCustom: { text: "72.6M Pilgrims/yr", bg: "rgba(77,168,207,.1)", border: "1px solid rgba(77,168,207,.25)", color: "var(--blue)" } },
              { icon: "🎓", title: "Vedic Gurukul Platform", desc: "Online + offline Gurukul programs · 4,500+ gurukuls in India · Summer & part-time", pill: { cls: "pill-gold", text: "$180B India EdTech 2030" } },
            ].map((v, i) => (
              <div key={i} className="card-gold" style={{ textAlign: "center", padding: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)" }}>{v.desc}</div>
                <div style={{ marginTop: 10 }}>
                  {v.pill && <span className={`pill ${v.pill.cls}`} style={{ fontSize: 9 }}>{v.pill.text}</span>}
                  {v.pillCustom && <span className="pill" style={{ background: v.pillCustom.bg, border: v.pillCustom.border, color: v.pillCustom.color, fontSize: 9 }}>{v.pillCustom.text}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg,rgba(201,167,77,.08),rgba(124,77,206,.08))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: "var(--gold)", fontFamily: "var(--font-head)" }}>$180B+</div><div style={{ fontSize: 11, color: "var(--text2)" }}>Combined TAM (all verticals)</div></div>
              <div style={{ fontSize: 24, color: "var(--border)" }}>+</div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: "var(--purple2)", fontFamily: "var(--font-head)" }}>6</div><div style={{ fontSize: 11, color: "var(--text2)" }}>New revenue streams</div></div>
              <div style={{ fontSize: 24, color: "var(--border)" }}>+</div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: "var(--ok)", fontFamily: "var(--font-head)" }}>3×</div><div style={{ fontSize: 11, color: "var(--text2)" }}>Revenue multiplier vs. v1</div></div>
              <div style={{ fontSize: 24, color: "var(--border)" }}>=</div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 900, color: "var(--gold2)", fontFamily: "var(--font-head)" }}>₹820Cr ARR</div><div style={{ fontSize: 11, color: "var(--text2)" }}>Year 5 target (revised up)</div></div>
            </div>
          </div>
        </section>

        {/* SLIDE 19 — VEDIC AI LIBRARY */}
        <section className="slide slide-dark" id="sf1">
          <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(201,167,77,.1),transparent)", right: 0, bottom: 0 }}></div>
          <div className="slide-num">19 / 22</div>
          <div className="slide-tag">📚 Vedic AI Library</div>
          <div className="t-title" style={{ marginBottom: 8 }}><span className="grad">Ancient Wisdom. Modern AI.</span><br />Learn Sanatan Dharma Interactively</div>
          <div className="t-sub" style={{ marginBottom: 28 }}>The world's most comprehensive AI-powered Vedic scripture learning platform — Gita, Mahabharata, Ramayana, all 4 Vedas, Upanishads, Puranas and more.</div>

          <div className="g2" style={{ marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>📖 Sacred Text Library (Phase 1 → Ongoing)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "📿", title: "Bhagavad Gita (Phase 1)", desc: "18 chapters · 700 shlokas · AI-explained verse by verse · Audio in 22 languages · Quiz mode · Shloka memorisation tracker" },
                  { icon: "⚔️", title: "Mahabharata & Ramayana", desc: "Story-mode narration · Character explorer · Dharma lessons · Regional language versions · Children's simplified mode" },
                  { icon: "🕉️", title: "4 Vedas (Rig, Yajur, Sama, Atharva)", desc: "Mantra audio with pronunciation guide · Context & meaning AI explanation · Certified Vedic scholar content moderation" },
                  { icon: "📅", title: "Upcoming: Upanishads · 18 Puranas · Arthashastra · Yoga Sutras", desc: "Quarterly releases · Community curated · Gurukul scholar partnerships · UNESCO heritage content", border: "rgba(124,77,206,.3)" },
                ].map((t, i) => (
                  <div key={i} style={{ background: "var(--bg2)", border: `1px solid ${t.border || "var(--border)"}`, borderRadius: 12, padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 24 }}>{t.icon}</div>
                    <div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>{t.title}</div><div style={{ fontSize: 11, color: "var(--text2)" }}>{t.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-ui)" }}>🤖 AI Features — Claude-Powered</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <div className="feat"><div className="feat-icon">💬</div><div className="feat-text"><div className="feat-title">Ask the Gita — Conversational AI</div><div className="feat-desc">Natural language questions answered with shlokas. "What does the Gita say about fear?" → Relevant verses + contextual explanation in user's language.</div></div></div>
                <div className="feat"><div className="feat-icon">🎯</div><div className="feat-text"><div className="feat-title">Daily Shloka with Life Application</div><div className="feat-desc">Personalised daily verse based on user's mood, life situation, and reading history. Push notification with audio + meaning every morning.</div></div></div>
                <div className="feat"><div className="feat-icon">📊</div><div className="feat-text"><div className="feat-title">Learning Path & Progress Tracker</div><div className="feat-desc">Structured 30-day, 90-day, and 1-year learning journeys. Streaks, badges, and certificates on completion. Gurukul integration for school programs.</div></div></div>
              </div>
              <div className="card-purple">
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10, fontFamily: "var(--font-ui)" }}>📊 Vedic AI Revenue Model</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[["Free tier: Daily shloka + basic read", "₹0", "var(--text3)"], ["Premium: Full library + AI Q&A", "₹199/mo", "var(--purple3)"], ["Gurukul School Licence (per student)", "₹999/yr", "var(--gold)"], ["NRI Family Plan (5 members)", "₹2,499/yr", "var(--gold)"]].map(([label, val, color], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 12, color: "var(--text2)" }}>{label}</span><span style={{ fontSize: 13, fontWeight: 700, color }}>{val}</span></div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 7, marginTop: 4 }}><span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Y3 Target</span><span style={{ fontSize: 14, fontWeight: 900, color: "var(--ok)" }}>₹42Cr ARR</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 20 — YOGA + AYURVEDA + ASTROLOGY */}
        <section className="slide slide-gold" id="sf2">
          <div className="glow-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(76,175,121,.1),transparent)", left: -80, bottom: 0 }}></div>
          <div className="slide-num">20 / 22</div>
          <div className="slide-tag">🧘 Yoga · ⭐ Astrology · 🌿 Ayurveda</div>
          <div className="t-title" style={{ marginBottom: 8 }}>The <span className="grad">Complete Wellness Trinity</span> — All in One App</div>
          <div className="t-sub" style={{ marginBottom: 24 }}>Three explosive markets. One platform. Deep personalisation powered by AI and ancient wisdom.</div>

          <div className="g3" style={{ marginBottom: 20 }}>
            {[
              {
                icon: "🧘", title: "Yoga & Daily Practice", borderColor: "var(--border)",
                desc: "AI-personalised daily yoga routines based on Dosha type (Vata/Pitta/Kapha), age, health goals, and season. HD video asana library with AI posture correction. Pranayama timer. Meditation sessions. Track streaks and milestones.",
                stats: [["India yoga market:", "$5.06B (2025)", "var(--ok)"], ["CAGR:", "12.4% through 2034", "var(--ok)"], ["77% Indians show stress symptoms", "", "var(--text3)"]],
                rev: "₹149–499/mo subscription", revNote: "Free: 5 poses/day · Premium: Full library + live classes + AI coach", target: "₹28Cr ARR"
              },
              {
                icon: "⭐", title: "Vedic Astrology AI", borderColor: "rgba(201,167,77,.3)",
                desc: "Personal Kundali generation with AI analysis. Daily horoscope personalised by birth chart. Dasha/Bhukti period forecasts. Muhurta selection for events. Live video consultation with 500+ verified Vedic astrologers. Kundali matching for matrimonial. Gemstone recommendations with purchase link.",
                stats: [["India astro market:", "$163M (2024) → $1.79B (2030)", "var(--gold)"], ["CAGR:", "49.19% — fastest growing in India", "var(--gold)"], ["Astrotalk:", "₹70Cr/month revenue", "var(--text3)"]],
                rev: "₹150–1,999 per consultation", revNote: "AI Kundali: ₹99 · Live astrologer: ₹299–1,999 · Annual plan: ₹2,499", target: "₹35Cr ARR"
              },
              {
                icon: "🌿", title: "Ayurveda AI Lifestyle", borderColor: "rgba(76,175,121,.3)",
                desc: "Personalised Dosha assessment (Vata/Pitta/Kapha). Seasonal food & herb recommendations by region. Daily Dinacharya (routine) planner. Ayurvedic recipe suggestions with local ingredient mapping across all 28 states. AI bot for personal health queries. Herb & product purchase integration. Regional specialties by season and climate.",
                stats: [["India Ayush market:", "$43.3B (2024) → $200B (2030)", "var(--ok)"], ["Ayurveda products CAGR:", "15.52%", "var(--ok)"], ["Govt:", "20,000 AYUSH centres by 2025", "var(--text3)"]],
                rev: "Subscription + product sales", revNote: "Ayurveda AI plan: ₹299/mo · Herb products: 15% commission · Consultation: ₹499", target: "₹22Cr ARR"
              },
            ].map((v, i) => (
              <div key={i} className="card" style={{ padding: 18, borderColor: v.borderColor }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)", marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)", marginBottom: 10, lineHeight: 1.6 }}>{v.desc}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                  {v.stats.map(([label, val, color], j) => (
                    <div key={j} style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--font-ui)" }}>{label} <strong style={{ color }}>{val}</strong></div>
                  ))}
                </div>
                <div style={{ background: "var(--bg3)", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Revenue: {v.rev}</div>
                  <div style={{ fontSize: 10, color: "var(--text2)" }}>{v.revNote}</div>
                  <div style={{ fontSize: 11, color: "var(--ok)", fontWeight: 700, marginTop: 5 }}>Y3 target: {v.target}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card-gold" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: "var(--gold)", fontFamily: "var(--font-head)" }}>3 Verticals</div><div style={{ fontSize: 11, color: "var(--text2)" }}>Combined in one app</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: "var(--purple2)", fontFamily: "var(--font-head)" }}>$225B+</div><div style={{ fontSize: 11, color: "var(--text2)" }}>Combined global TAM</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: "var(--ok)", fontFamily: "var(--font-head)" }}>₹85Cr</div><div style={{ fontSize: 11, color: "var(--text2)" }}>Combined Y3 ARR target</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 900, color: "var(--gold2)", fontFamily: "var(--font-head)" }}>Cross-sell</div><div style={{ fontSize: 11, color: "var(--text2)" }}>Astrology → Puja booking → Products</div></div>
            </div>
          </div>
        </section>

        {/* SLIDE 21 — TEMPLE STREAMS + GURUKUL */}
        <section className="slide slide-purple" id="sf3">
          <div className="om-bg" style={{ fontSize: 300, opacity: 0.03, right: -40 }}>ॐ</div>
          <div className="slide-num">21 / 22</div>
          <div className="slide-tag">🛕 Temple Live Streams · 🎓 Gurukul Platform</div>
          <div className="t-title" style={{ marginBottom: 8 }}><span className="grad">Every Temple. Every Gurukul.</span><br />On SanatanDiksha</div>
          <div className="t-sub" style={{ marginBottom: 24 }}>India's first managed temple streaming network + the digital bridge connecting 4,500+ gurukuls to 100 Crore learners worldwide.</div>

          <div className="g2" style={{ gap: 24 }}>
            <div>
              <div className="card-gold" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>🛕 <strong style={{ color: "var(--gold)", fontFamily: "var(--font-ui)" }}>Temple Live Streaming Network</strong></div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)", marginBottom: 12, lineHeight: 1.6 }}>SanatanDiksha manages the complete live stream infrastructure — cameras, encoders, internet, and broadcast — installed and operated by the platform at each temple. Revenue shared with temple trusts.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: "🔴", title: "Phase 1: 12 Jyotirlingas + 4 Dhams", desc: "Somnath · Kashi Vishwanath · Kedarnath · Badrinath · Dwarka · Puri Jagannath + 10 more. 24/7 live darshan via app." },
                    { icon: "🌺", title: "Phase 2: 51 Shaktipeethas", desc: "Kamakhya · Vaishno Devi · Kolkata Kalighat · Hinglaj Mata + 47 more. Morning & evening aarti live." },
                    { icon: "🏛️", title: "Phase 3: Regional & Local Temples", desc: "District-level temple trust partnerships. SD installs + manages hardware. 5,000+ temples target by Year 3." },
                  ].map((p, i) => (
                    <div key={i} style={{ padding: 8, background: "var(--bg3)", borderRadius: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 16 }}>{p.icon}</span>
                      <div><div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>{p.title}</div><div style={{ fontSize: 11, color: "var(--text2)" }}>{p.desc}</div></div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, background: "var(--bg)", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>💰 Revenue Model</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {["Premium subscription: ₹199/mo for all-temple access", "Virtual Prasad delivery service: ₹299–999 per order", "Temple donations via app (5% platform fee)", "Festival special streaming (one-time ₹49–199)"].map((r, i) => <div key={i} style={{ fontSize: 11, color: "var(--text2)" }}>{r}</div>)}
                    <div style={{ fontSize: 11, color: "var(--ok)", fontWeight: 700, marginTop: 4 }}>Y3 target: ₹38Cr ARR</div>
                  </div>
                </div>
              </div>

              <div className="card-purple" style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-ui)" }}>📊 Temple Streaming Market Context</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["🎯 Varanasi alone: 72.6M pilgrims in 2025 — 80% youth", "🌍 32M NRIs desperate for live darshan from abroad", "📱 India has 800M+ internet users watching video daily", "💰 Tirupati: ₹7,000Cr+ annual donation receipts"].map((s, i) => (
                    <div key={i} style={{ fontSize: 11, color: "var(--text2)" }}>{s}</div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="card-gold" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>🎓 <strong style={{ color: "var(--gold)", fontFamily: "var(--font-ui)" }}>Vedic Gurukul Platform</strong></div>
                <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-ui)", marginBottom: 12, lineHeight: 1.6 }}>India has 4,500+ gurukuls with zero digital infrastructure. SanatanDiksha becomes their online arm — registration, scheduling, live classes, and content broadcast. Children and adults access Vedic education on any device, anywhere in the world.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { title: "🏫 Online Gurukul Programs", desc: "Live Agora-streamed classes with gurukul acharyas. Sanskrit · Vedic maths · Dharma shiksha · Yoga. Evening + weekend + summer programs. Certificate on completion." },
                    { title: "🏕️ Offline Gurukul Admissions", desc: "Search & register for residential gurukuls near you. Summer camps (8-16 years). Part-time/full-time programs. NRI children back in India for summer Vedic learning." },
                    { title: "🌍 NRI Gurukul Connect", desc: "Parents worldwide register their children in India gurukuls for summer. Online Gurukul classes for NRI children to learn their heritage from home in USA/UK/UAE/Australia." },
                  ].map((p, i) => (
                    <div key={i} style={{ padding: 8, background: "var(--bg3)", borderRadius: 10 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-ui)" }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text2)" }}>{p.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, background: "var(--bg)", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>💰 Revenue Model</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {["Online program fee: ₹2,000–15,000 per student/semester", "Gurukul partner SaaS fee: ₹999–4,999/month per gurukul", "Summer camp registration: ₹5,000–25,000", "Platform commission: 15% on all programs"].map((r, i) => <div key={i} style={{ fontSize: 11, color: "var(--text2)" }}>{r}</div>)}
                    <div style={{ fontSize: 11, color: "var(--ok)", fontWeight: 700, marginTop: 4 }}>Y3 target: ₹28Cr ARR</div>
                  </div>
                </div>
              </div>
              <div style={{ background: "linear-gradient(135deg,rgba(201,167,77,.08),rgba(124,77,206,.08))", border: "1px solid rgba(201,167,77,.2)", borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-ui)" }}>🎯 Gurukul Market Opportunity</div>
                <div style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-ui)", lineHeight: 1.6 }}>4,500+ gurukuls in India with <strong style={{ color: "var(--gold)" }}>zero digital platform</strong>. India's EdTech market: <strong style={{ color: "var(--gold)" }}>$7.5B (2025) → $30B (2030)</strong>. NRI parents pay premium for cultural education: average USD 3,000–8,000/year for heritage programs abroad. SanatanDiksha offers this at 1/10th the cost with Indian authenticity.</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}