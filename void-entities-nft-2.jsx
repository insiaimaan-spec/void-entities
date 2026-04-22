import { useState, useEffect, useRef } from "react";

const CREATOR_WALLET = "0xb55ab0302Db8C8827fcBDE7F2CF33C40a7783784";
const MINT_PRICE_ETH = 0.001;
const MINT_PRICE_WEI = "0x" + (BigInt(Math.round(MINT_PRICE_ETH * 1e18))).toString(16);

// SVG generative art for each NFT
const NFT_ART = [
  // 1 - The Nebula Wraith
  `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g1" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#ff6ec7"/><stop offset="40%" stop-color="#7b2ff7"/><stop offset="100%" stop-color="#050514"/></radialGradient>
      <radialGradient id="g1b" cx="30%" cy="40%" r="50%"><stop offset="0%" stop-color="#00f0ff" stop-opacity="0.6"/><stop offset="100%" stop-color="transparent"/></radialGradient>
      <filter id="blur1"><feGaussianBlur stdDeviation="18"/></filter>
      <filter id="blur2"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <rect width="400" height="400" fill="#050514"/>
    <circle cx="200" cy="200" r="180" fill="url(#g1)" filter="url(#blur1)" opacity="0.9"/>
    <circle cx="140" cy="160" r="90" fill="url(#g1b)" filter="url(#blur2)"/>
    <ellipse cx="200" cy="200" rx="60" ry="80" fill="none" stroke="#ff6ec7" stroke-width="1.5" opacity="0.5" transform="rotate(30 200 200)"/>
    <ellipse cx="200" cy="200" rx="60" ry="80" fill="none" stroke="#00f0ff" stroke-width="1" opacity="0.4" transform="rotate(90 200 200)"/>
    <ellipse cx="200" cy="200" rx="60" ry="80" fill="none" stroke="#fff" stroke-width="0.5" opacity="0.2" transform="rotate(150 200 200)"/>
    <circle cx="200" cy="200" r="22" fill="#fff" opacity="0.1" filter="url(#blur2)"/>
    <circle cx="200" cy="200" r="8" fill="#fff" opacity="0.9"/>
    ${Array.from({length:40},(_,i)=>`<circle cx="${80+Math.sin(i*2.5)*260}" cy="${80+Math.cos(i*1.7)*260}" r="${Math.random()*1.5+0.5}" fill="white" opacity="${Math.random()*0.6+0.1}"/>`).join('')}
  </svg>`,

  // 2 - The Solar Phantom
  `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g2" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#ffb347"/><stop offset="50%" stop-color="#e05c00"/><stop offset="100%" stop-color="#0a0005"/></radialGradient>
      <filter id="b2"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="b2s"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <rect width="400" height="400" fill="#0a0005"/>
    <circle cx="200" cy="200" r="160" fill="url(#g2)" filter="url(#b2)" opacity="0.95"/>
    ${Array.from({length:12},(_,i)=>`<line x1="200" y1="200" x2="${200+Math.cos(i*Math.PI/6)*190}" y2="${200+Math.sin(i*Math.PI/6)*190}" stroke="#ffb347" stroke-width="${2-i*0.1}" opacity="${0.15+i*0.01}"/>`).join('')}
    <circle cx="200" cy="200" r="55" fill="#fff3" filter="url(#b2s)"/>
    <circle cx="200" cy="200" r="28" fill="#ffb347" opacity="0.95"/>
    <circle cx="200" cy="200" r="14" fill="#fff" opacity="0.9"/>
    <circle cx="260" cy="155" r="10" fill="#ff6600" opacity="0.7" filter="url(#b2s)"/>
    <circle cx="155" cy="250" r="7" fill="#ffaa00" opacity="0.5" filter="url(#b2s)"/>
  </svg>`,

  // 3 - The Abyss Guardian
  `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g3" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#00ff88"/><stop offset="50%" stop-color="#006644"/><stop offset="100%" stop-color="#000a06"/></radialGradient>
      <filter id="b3"><feGaussianBlur stdDeviation="20"/></filter>
      <filter id="b3s"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <rect width="400" height="400" fill="#000a06"/>
    <circle cx="200" cy="200" r="170" fill="url(#g3)" filter="url(#b3)" opacity="0.8"/>
    ${Array.from({length:6},(_,i)=>`<polygon points="${Array.from({length:6},(_,j)=>{ const a=j*60+i*10; const r=60+i*18; return `${200+Math.cos(a*Math.PI/180)*r},${200+Math.sin(a*Math.PI/180)*r}`;}).join(' ')}" fill="none" stroke="#00ff88" stroke-width="${0.8-i*0.1}" opacity="${0.5-i*0.06}"/>`).join('')}
    <circle cx="200" cy="200" r="20" fill="#00ff88" opacity="0.9" filter="url(#b3s)"/>
    <circle cx="200" cy="200" r="8" fill="#fff" opacity="0.95"/>
    <line x1="200" y1="60" x2="200" y2="340" stroke="#00ff88" stroke-width="0.5" opacity="0.15"/>
    <line x1="60" y1="200" x2="340" y2="200" stroke="#00ff88" stroke-width="0.5" opacity="0.15"/>
  </svg>`,

  // 4 - The Crimson Oracle
  `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g4" cx="50%" cy="40%" r="65%"><stop offset="0%" stop-color="#ff3366"/><stop offset="60%" stop-color="#660022"/><stop offset="100%" stop-color="#080006"/></radialGradient>
      <filter id="b4"><feGaussianBlur stdDeviation="16"/></filter>
      <filter id="b4s"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <rect width="400" height="400" fill="#080006"/>
    <circle cx="200" cy="180" r="155" fill="url(#g4)" filter="url(#b4)" opacity="0.9"/>
    ${Array.from({length:8},(_,i)=>`<ellipse cx="200" cy="200" rx="${30+i*22}" ry="${18+i*14}" fill="none" stroke="#ff3366" stroke-width="${1.5-i*0.15}" opacity="${0.6-i*0.06}" transform="rotate(${i*11} 200 200)"/>`).join('')}
    <circle cx="200" cy="200" r="25" fill="#ff3366" filter="url(#b4s)" opacity="0.9"/>
    <circle cx="200" cy="200" r="10" fill="#fff" opacity="1"/>
    <circle cx="200" cy="200" r="4" fill="#ff3366"/>
    ${Array.from({length:30},(_,i)=>`<circle cx="${200+Math.cos(i*12*Math.PI/180)*160}" cy="${200+Math.sin(i*12*Math.PI/180)*160}" r="${Math.random()*2+0.5}" fill="#ff3366" opacity="${Math.random()*0.5+0.1}"/>`).join('')}
  </svg>`,

  // 5 - The Celestial Drift
  `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g5" cx="40%" cy="50%" r="70%"><stop offset="0%" stop-color="#a0f0ff"/><stop offset="40%" stop-color="#0066cc"/><stop offset="100%" stop-color="#000510"/></radialGradient>
      <radialGradient id="g5b" cx="70%" cy="60%" r="40%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/><stop offset="100%" stop-color="transparent"/></radialGradient>
      <filter id="b5"><feGaussianBlur stdDeviation="18"/></filter>
      <filter id="b5s"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <rect width="400" height="400" fill="#000510"/>
    <circle cx="200" cy="200" r="175" fill="url(#g5)" filter="url(#b5)" opacity="0.85"/>
    <circle cx="260" cy="160" r="80" fill="url(#g5b)"/>
    ${Array.from({length:5},(_,i)=>`<ellipse cx="200" cy="200" rx="${50+i*30}" ry="${25+i*15}" fill="none" stroke="#a0f0ff" stroke-width="1" opacity="${0.4-i*0.07}" transform="rotate(${-20+i*8} 200 200)"/>`).join('')}
    <circle cx="200" cy="200" r="28" fill="#a0f0ff" filter="url(#b5s)" opacity="0.6"/>
    <circle cx="200" cy="200" r="12" fill="#fff" opacity="1"/>
    ${Array.from({length:50},(_,i)=>`<circle cx="${Math.random()*400}" cy="${Math.random()*400}" r="${Math.random()*1.2+0.2}" fill="white" opacity="${Math.random()*0.7+0.1}"/>`).join('')}
  </svg>`,
];

const COLLECTION = [
  { id: 1, name: "Nebula Wraith", desc: "A spectral entity born from the collision of twin nebulae, it drifts through galaxies leaving trails of stardust and forgotten dreams.", price: MINT_PRICE_ETH, supply: 200, rarity: "Legendary", trait: "Cosmic" },
  { id: 2, name: "Solar Phantom", desc: "Forged in the heart of a dying star, the Solar Phantom commands solar flares and bends light across dimensions.", price: MINT_PRICE_ETH, supply: 200, rarity: "Epic", trait: "Fire" },
  { id: 3, name: "Abyss Guardian", desc: "Ancient keeper of the deep void. It has witnessed the birth and death of 10,000 universes and remembers every one.", price: MINT_PRICE_ETH, supply: 200, rarity: "Rare", trait: "Nature" },
  { id: 4, name: "Crimson Oracle", desc: "It sees what was, what is, and what could be — all at once. Its crimson eye has never blinked in 4 billion years.", price: MINT_PRICE_ETH, supply: 200, rarity: "Mythic", trait: "Arcane" },
  { id: 5, name: "Celestial Drift", desc: "Adrift between galaxies, this entity carries entire civilizations in its memory — worlds that no longer exist.", price: MINT_PRICE_ETH, supply: 200, rarity: "Epic", trait: "Water" },
];

const RARITY_COLORS = { Legendary: "#f59e0b", Epic: "#a855f7", Rare: "#3b82f6", Mythic: "#ef4444" };

export default function VoidEntities() {
  const [wallet, setWallet] = useState(null);
  const [minted, setMinted] = useState({});
  const [mintCounts, setMintCounts] = useState({ 1:12, 2:7, 3:31, 4:3, 5:19 });
  const [loading, setLoading] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [txHash, setTxHash] = useState({});
  const [walletLoading, setWalletLoading] = useState(false);
  const [chainOk, setChainOk] = useState(true);
  const canvasRef = useRef({});

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      showToast("MetaMask not found! Please install it.", "error");
      return;
    }
    setWalletLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setChainOk(chainId === "0x1" || chainId === "0x2105" || chainId === "0x14a33");
      showToast("Wallet connected!");
    } catch (e) {
      showToast(e.message || "Connection failed", "error");
    }
    setWalletLoading(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (a) => setWallet(a[0] || null));
    }
  }, []);

  const handleMint = async (nft) => {
    if (!wallet) { showToast("Connect your wallet first!", "error"); return; }
    if (minted[nft.id]) { showToast("You already own this entity!", "error"); return; }
    setLoading(nft.id);
    try {
      const priceHex = "0x" + (BigInt(Math.round(nft.price * 1e18))).toString(16);
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: wallet,
          to: CREATOR_WALLET,
          value: priceHex,
          gas: "0x5208",
        }],
      });
      setTxHash(t => ({ ...t, [nft.id]: txHash }));
      setMinted(m => ({ ...m, [nft.id]: true }));
      setMintCounts(c => ({ ...c, [nft.id]: (c[nft.id] || 0) + 1 }));
      showToast(`🎉 ${nft.name} minted! Tx: ${txHash.slice(0, 18)}...`);
      setSelected(null);
    } catch (e) {
      if (e.code === 4001) showToast("Transaction cancelled.", "error");
      else showToast(e.message || "Minting failed", "error");
    }
    setLoading(null);
  };

  const shortWallet = (w) => w ? `${w.slice(0,6)}...${w.slice(-4)}` : "";

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isInMetaMask = !!(window.ethereum?.isMetaMask && isMobile);

  const openInMetaMask = () => {
    const currentUrl = window.location.href.replace(/^https?:\/\//, "");
    window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
  };

  return (
    <div style={{ minHeight:"100vh", background:"#04040f", color:"#e0e0f0", fontFamily:"'Outfit',sans-serif", position:"relative", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#222}
        .card{background:#07071a;border:1px solid #13133a;border-radius:20px;overflow:hidden;transition:all .3s cubic-bezier(.25,.8,.25,1);cursor:pointer;}
        .card:hover{transform:translateY(-6px) scale(1.01);border-color:#3a3a6a;box-shadow:0 20px 60px rgba(80,40,200,.2);}
        .mint-btn{background:linear-gradient(135deg,#6d28d9,#a855f7,#ec4899);border:none;color:#fff;padding:13px 28px;border-radius:12px;cursor:pointer;font-weight:700;font-size:15px;font-family:'Outfit',sans-serif;transition:all .25s;width:100%;letter-spacing:.3px;}
        .mint-btn:hover:not(:disabled){box-shadow:0 6px 30px rgba(168,85,247,.5);transform:translateY(-1px);}
        .mint-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
        .connect-btn{background:linear-gradient(135deg,#1e1e4a,#2a1a5e);border:1px solid #4a3080;color:#c4b5fd;padding:11px 24px;border-radius:100px;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;transition:all .2s;}
        .connect-btn:hover{background:linear-gradient(135deg,#2a1a5e,#3d1f80);border-color:#7c3aed;}
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);backdrop-filter:blur(12px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
        .modal{background:#07071a;border:1px solid #1a1a3a;border-radius:24px;max-width:480px;width:100%;overflow:hidden;animation:fadeUp .25s ease;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);padding:13px 26px;border-radius:100px;font-size:13px;font-weight:600;z-index:200;animation:fadeUp .3s;white-space:nowrap;max-width:90vw;text-align:center;}
        .toast.success{background:#0d1f2d;color:#34d399;border:1px solid #065f46;}
        .toast.error{background:#1a0a0a;color:#f87171;border:1px solid #7f1d1d;}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:8px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .rarity-tag{border-radius:6px;padding:3px 10px;font-size:11px;font-weight:700;letter-spacing:.5px;}
        .star{position:fixed;border-radius:50%;background:white;pointer-events:none;}
        .glow{position:fixed;border-radius:50%;filter:blur(140px);pointer-events:none;opacity:.05;}
        .progress-bar{height:3px;background:#0f0f2a;border-radius:2px;overflow:hidden;margin:10px 0 6px;}
        .progress-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#ec4899);border-radius:2px;}
        .trait-chip{background:#0f0f25;border:1px solid #1e1e40;border-radius:8px;padding:6px 12px;font-size:12px;color:#8888bb;}
      `}</style>

      {/* Stars background */}
      {Array.from({length:60},(_,i)=>(
        <div key={i} className="star" style={{ width:Math.random()*2+1, height:Math.random()*2+1, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, opacity:Math.random()*0.5+0.1 }} />
      ))}
      <div className="glow" style={{width:700,height:700,background:"#7c3aed",top:-200,right:-150}}/>
      <div className="glow" style={{width:500,height:500,background:"#ec4899",bottom:-100,left:-100}}/>

      {/* Mobile MetaMask Banner */}
      {isMobile && !isInMetaMask && (
        <div style={{background:"linear-gradient(135deg,#1a0d35,#0d1a35)",borderBottom:"1px solid #2a1a50",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"#f6851b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🦊</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#e0d0ff"}}>Open in MetaMask Browser</div>
              <div style={{fontSize:11,color:"#6a5a8a"}}>Required to connect wallet & mint on mobile</div>
            </div>
          </div>
          <button onClick={openInMetaMask} style={{background:"linear-gradient(135deg,#f6851b,#e2761b)",border:"none",color:"#fff",padding:"10px 20px",borderRadius:100,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(246,133,27,0.4)"}}>
            🦊 Open in MetaMask
          </button>
        </div>
      )}


      <header style={{padding:"18px 32px",borderBottom:"1px solid #0d0d25",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,background:"rgba(4,4,15,.9)",backdropFilter:"blur(16px)"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:3,background:"linear-gradient(135deg,#c084fc,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>VOID ENTITIES</div>
          <div style={{fontSize:11,color:"#444",letterSpacing:2,marginTop:-2}}>GENESIS COLLECTION</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          {wallet ? (
            <div style={{display:"flex",alignItems:"center",gap:10,background:"#0d0d25",border:"1px solid #1e1e45",borderRadius:100,padding:"8px 16px"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 8px #34d399"}}/>
              <span style={{fontSize:13,color:"#c4b5fd",fontWeight:500}}>{shortWallet(wallet)}</span>
            </div>
          ) : isMobile && !isInMetaMask ? (
            <button className="connect-btn" onClick={openInMetaMask} style={{background:"linear-gradient(135deg,#f6851b,#e2761b)",border:"none",color:"#fff",boxShadow:"0 4px 16px rgba(246,133,27,0.35)"}}>
              🦊 Open in MetaMask
            </button>
          ) : (
            <button className="connect-btn" onClick={connectWallet} disabled={walletLoading}>
              {walletLoading ? <><span className="spinner"/>Connecting...</> : "⬡ Connect Wallet"}
            </button>
          )}
        </div>
      </header>

      {/* Hero */}
      <section style={{textAlign:"center",padding:"70px 20px 50px",position:"relative"}}>
        <div style={{fontSize:12,color:"#6644aa",fontWeight:600,letterSpacing:3,textTransform:"uppercase",marginBottom:14}}>5 Unique Entities · 0.001 ETH Each</div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(52px,8vw,96px)",lineHeight:.95,letterSpacing:2,background:"linear-gradient(180deg,#ffffff 0%,#c084fc 50%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:20}}>
          COSMIC<br/>VOID ENTITIES
        </h1>
        <p style={{color:"#6a6a8a",fontSize:15,maxWidth:520,margin:"0 auto 30px",lineHeight:1.7}}>
          Five ancient cosmic beings, each one unique — born from the collapse of dying universes. Own a piece of the infinite void.
        </p>
        <div style={{display:"flex",justifyContent:"center",gap:30,flexWrap:"wrap"}}>
          {[["1,000","Total Supply"],["0.001 ETH","Mint Price"],["5%","Royalties"],["Base","Network"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#c084fc",letterSpacing:1}}>{v}</div>
              <div style={{fontSize:11,color:"#444",letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {!chainOk && wallet && (
        <div style={{background:"#1a0d00",border:"1px solid #7a3300",borderRadius:12,padding:"14px 20px",maxWidth:600,margin:"0 auto 20px",textAlign:"center",color:"#fb923c",fontSize:13}}>
          ⚠️ Switch to <strong>Base Network</strong> for real transactions (Chain ID: 8453)
        </div>
      )}

      {/* NFT Grid */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 80px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:24}}>
          {COLLECTION.map((nft,i) => (
            <div key={nft.id} className="card" onClick={() => setSelected(nft)}>
              {/* Art */}
              <div style={{height:260,position:"relative",overflow:"hidden"}}
                dangerouslySetInnerHTML={{__html:NFT_ART[i]}}
              />
              <div style={{padding:"18px 20px 20px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <h3 style={{fontSize:17,fontWeight:700,letterSpacing:.2}}>{nft.name}</h3>
                  <span className="rarity-tag" style={{background:`${RARITY_COLORS[nft.rarity]}22`,color:RARITY_COLORS[nft.rarity],border:`1px solid ${RARITY_COLORS[nft.rarity]}44`}}>{nft.rarity}</span>
                </div>
                <p style={{fontSize:12,color:"#5a5a7a",lineHeight:1.6,marginBottom:14,minHeight:48}}>{nft.desc}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width:`${(mintCounts[nft.id]/nft.supply)*100}%`}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#444",marginBottom:14}}>
                  <span>{mintCounts[nft.id]}/{nft.supply} minted</span>
                  <span>Trait: {nft.trait}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:11,color:"#444"}}>Price</div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#c084fc",letterSpacing:1}}>{nft.price} ETH</div>
                  </div>
                  {minted[nft.id] ? (
                    <div style={{background:"#0d2e1a",color:"#34d399",border:"1px solid #065f46",borderRadius:10,padding:"8px 16px",fontSize:12,fontWeight:700}}>✓ OWNED</div>
                  ) : (
                    <button className="mint-btn" style={{width:"auto",padding:"10px 22px",fontSize:13}}
                      disabled={loading===nft.id}
                      onClick={e=>{e.stopPropagation();wallet?handleMint(nft):connectWallet();}}>
                      {loading===nft.id?<><span className="spinner"/>Minting...</>:"Mint Now"}
                    </button>
                  )}
                </div>
                {txHash[nft.id] && (
                  <div style={{marginTop:10,fontSize:11,color:"#34d399",wordBreak:"break-all"}}>
                    ✓ Tx: {txHash[nft.id].slice(0,20)}...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{height:280,position:"relative",overflow:"hidden"}}
              dangerouslySetInnerHTML={{__html:NFT_ART[selected.id-1]}}
            />
            <div style={{padding:"24px 26px 28px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <span className="rarity-tag" style={{background:`${RARITY_COLORS[selected.rarity]}22`,color:RARITY_COLORS[selected.rarity],border:`1px solid ${RARITY_COLORS[selected.rarity]}44`,display:"inline-block",marginBottom:8}}>{selected.rarity}</span>
                  <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:1}}>{selected.name}</h2>
                </div>
                <button onClick={()=>setSelected(null)} style={{background:"#111",border:"none",color:"#666",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16}}>✕</button>
              </div>
              <p style={{color:"#6a6a8a",fontSize:13,lineHeight:1.7,marginBottom:18}}>{selected.desc}</p>
              <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
                {[["Trait",selected.trait],["Supply",selected.supply],["Royalty","5%"],["Chain","Base"]].map(([k,v])=>(
                  <div key={k} className="trait-chip"><span style={{color:"#444"}}>{k}: </span>{v}</div>
                ))}
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width:`${(mintCounts[selected.id]/selected.supply)*100}%`}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#444",marginBottom:20}}>
                <span>{mintCounts[selected.id]}/{selected.supply} minted</span>
                <span>{Math.round((mintCounts[selected.id]/selected.supply)*100)}% sold</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0a0a20",borderRadius:12,padding:"14px 18px",marginBottom:18}}>
                <div>
                  <div style={{fontSize:11,color:"#444"}}>Mint price</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#c084fc",letterSpacing:1}}>{selected.price} ETH</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:"#444"}}>Creator</div>
                  <div style={{fontSize:12,color:"#6a6a8a",fontFamily:"monospace"}}>{CREATOR_WALLET.slice(0,10)}...{CREATOR_WALLET.slice(-6)}</div>
                </div>
              </div>
              {minted[selected.id] ? (
                <div style={{background:"#0d2e1a",color:"#34d399",border:"1px solid #065f46",borderRadius:12,padding:"14px",textAlign:"center",fontWeight:700}}>
                  ✓ You own this Entity
                  {txHash[selected.id] && <div style={{fontSize:11,marginTop:6,opacity:.7,wordBreak:"break-all"}}>Tx: {txHash[selected.id]}</div>}
                </div>
              ) : isMobile && !isInMetaMask ? (
                <button className="mint-btn" onClick={openInMetaMask} style={{background:"linear-gradient(135deg,#f6851b,#e2761b)"}}>
                  🦊 Open in MetaMask to Mint
                </button>
              ) : (
                <button className="mint-btn" disabled={loading===selected.id}
                  onClick={()=>wallet?handleMint(selected):connectWallet()}>
                  {loading===selected.id?<><span className="spinner"/>Processing Transaction...</>
                    :wallet?`Mint for ${selected.price} ETH`:"Connect Wallet to Mint"}
                </button>
              )}
              {!wallet && !isMobile && <p style={{textAlign:"center",fontSize:12,color:"#444",marginTop:12}}>Requires MetaMask or compatible wallet</p>}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{borderTop:"1px solid #0d0d25",padding:"24px 32px",textAlign:"center",color:"#2a2a4a",fontSize:12}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"#3a3a6a",letterSpacing:2}}>VOID ENTITIES</span>
        <span style={{margin:"0 14px"}}>·</span>
        Mint fees paid to <span style={{fontFamily:"monospace",color:"#444"}}>{CREATOR_WALLET.slice(0,10)}...</span>
        <span style={{margin:"0 14px"}}>·</span>
        All rights reserved © 2026
      </footer>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
