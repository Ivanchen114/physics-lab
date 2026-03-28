import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── 物理常數 ───────────────────────────────────────────
const H_EV = 4.136e-15; // eV·s（普朗克常數）
const FREQ_UNIT = 1e14;  // 頻率單位：10^14 Hz

const METALS = {
  Na: { label: "鈉 (Na)", phi: 2.3,  color: "#D4AF37", story: "平價夜店" },
  Al: { label: "鋁 (Al)", phi: 4.1,  color: "#A8A8A8", story: "高檔酒吧" },
  Cu: { label: "銅 (Cu)", phi: 4.5,  color: "#B87333", story: "頂級俱樂部" },
  Au: { label: "金 (Au)", phi: 5.1,  color: "#FFD700", story: "黃金貴賓廳" },
};

function getFreqInfo(f) {
  if (f < 3.8) return { color: "#6B0000", bg: "#2a0000", name: "紅外線", storyName: "微弱低音" };
  if (f < 4.8) return { color: "#FF3300", bg: "#3a0000", name: "紅光",   storyName: "紅色保鑣" };
  if (f < 5.1) return { color: "#FF8800", bg: "#3a1500", name: "橙光",   storyName: "橙色保鑣" };
  if (f < 5.3) return { color: "#DDDD00", bg: "#2a2a00", name: "黃光",   storyName: "黃色保鑣" };
  if (f < 6.1) return { color: "#00CC44", bg: "#003010", name: "綠光",   storyName: "綠色保鑣" };
  if (f < 6.8) return { color: "#4488FF", bg: "#001030", name: "藍光",   storyName: "藍色保鑣" };
  if (f < 7.9) return { color: "#AA44FF", bg: "#1a0030", name: "紫光",   storyName: "紫色保鑣" };
  return        { color: "#DDCCFF", bg: "#1a0040", name: "紫外線",        storyName: "超強UV保鑣" };
}

// ─── 粒子工廠 ───────────────────────────────────────────
function makePhoton(canvasH, canvasW, color) {
  const speed = 3.5 + Math.random() * 1.5;
  const angle = Math.PI / 6; // 30 degrees down
  const METAL_X = Math.floor(canvasW * 0.75);
  const dy = METAL_X * Math.tan(angle); // drop amount
  const minY = 30 - dy;
  const maxY = canvasH - 30 - dy;
  const yStart = minY + Math.random() * (maxY - minY);

  return {
    x: 0,
    y: yStart,
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
    color,
    id: Math.random(),
  };
}

function makeElectron(startX, startY, keMax) {
  const speed = 1.0 + keMax * 0.8;
  const angle = Math.PI - (Math.random() - 0.5) * Math.PI * 0.6; // random left-facing angle
  return {
    x: startX,
    y: startY,
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
    life: 0,
    maxLife: 80 + Math.random() * 40,
    id: Math.random(),
  };
}

// ─── 主元件 ─────────────────────────────────────────────
export default function PhotoelectricSimulation() {
  const canvasRef    = useRef(null);
  const graphRef     = useRef(null);
  const containerRef = useRef(null);
  const animRef      = useRef(null);
  const photonsRef   = useRef([]);
  const electronsRef = useRef([]);
  const flashRef     = useRef([]);
  const frameRef     = useRef(0);
  const metalFlashRef = useRef(0); // 金屬切換閃光計時器

  // 📦 快取 canvas 尺寸，避免每幀查 DOM
  const canvasSizeRef = useRef({ W: 480, H: 240 });

  const [storyMode, setStoryMode]   = useState(true);
  const [modeTooltip, setModeTooltip] = useState(false); // 切換模式時顯示 tooltip
  const [freq,      setFreq]        = useState(7.5);   // 10^14 Hz
  const [intensity, setIntensity]   = useState(50);    // 1~100
  const [metalKey,  setMetalKey]    = useState("Na");
  const [canvasW,   setCanvasW]     = useState(480);   // 響應式寬度

  // ── 衍生物理量 ──
  const phi          = METALS[metalKey].phi;
  const photonEnergy = H_EV * freq * FREQ_UNIT;       // eV
  const canEmit      = photonEnergy > phi;
  const keMax        = canEmit ? +(photonEnergy - phi).toFixed(3) : 0;
  const v0           = +keMax.toFixed(3);              // 停止電壓 (V)
  const nu0          = +(phi / (H_EV * FREQ_UNIT)).toFixed(2); // 截止頻率
  const freqInfo     = useMemo(() => getFreqInfo(freq), [freq]);

  // ─── ResizeObserver：讓 canvas 跟容器寬度自適應 ─────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.floor(Math.min(entry.contentRect.width, 720));
        if (w > 240) setCanvasW(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ─── 金屬切換並觸發閃光 ────────────────────────────
  const handleMetalChange = useCallback((key) => {
    setMetalKey(key);
    metalFlashRef.current = 18; // 持續 18 幀的閃光
  }, []);

  // ─── 模式切換並顯示 tooltip ────────────────────────
  const handleModeSwitch = useCallback((isStory) => {
    setStoryMode(isStory);
    setModeTooltip(true);
    setTimeout(() => setModeTooltip(false), 2200);
  }, []);

  // ─── Canvas 動畫 ──────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    photonsRef.current   = [];
    electronsRef.current = [];
    flashRef.current     = [];
    frameRef.current     = 0;

    const W = canvas.width;
    const H = canvas.height;
    canvasSizeRef.current = { W, H };

    const METAL_X = Math.floor(W * 0.75);
    const METAL_W = 18;

    // ── 🔴 優化 1：預先建立固定漸層，避免每幀重建 ──
    // 背景漸層依 freqInfo.bg 變，只在 freqInfo 改變時重建（由 useEffect deps 控制）
    const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
    bgGrad.addColorStop(0,    freqInfo.bg);
    bgGrad.addColorStop(0.48, "#0a0a18");
    bgGrad.addColorStop(1,    "#040410");

    const mGrad = ctx.createLinearGradient(METAL_X - METAL_W / 2, 0, METAL_X + METAL_W / 2, 0);
    mGrad.addColorStop(0,   "#000");
    mGrad.addColorStop(0.3, METALS[metalKey].color + "CC");
    mGrad.addColorStop(0.7, METALS[metalKey].color);
    mGrad.addColorStop(1,   "#000");

    function drawBackground() {
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 光束斜向背景
      ctx.fillStyle = freqInfo.color + "15"; // 非常淡的顏色
      ctx.beginPath();
      const angle = Math.PI / 6;
      const dy = METAL_X * Math.tan(angle);
      ctx.moveTo(0, 30 - dy);
      ctx.lineTo(METAL_X, 30);
      ctx.lineTo(METAL_X, H - 30);
      ctx.lineTo(0, H - 30 - dy);
      ctx.fill();

      // 金屬閃光效果（切換時）
      if (metalFlashRef.current > 0) {
        const alpha = metalFlashRef.current / 18;
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.25})`;
        ctx.fillRect(METAL_X - METAL_W / 2 - 10, 20, METAL_W + 20, H - 40);
        metalFlashRef.current--;
      }

      ctx.fillStyle = mGrad;
      ctx.fillRect(METAL_X - METAL_W / 2, 30, METAL_W, H - 60);

      // 金屬標籤
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      const metalLabel = storyMode ? METALS[metalKey].story : `φ=${phi}eV`;
      ctx.fillText(metalLabel, METAL_X, 22);

      // 🔴 優化 3：在主動畫畫布上標示截止頻率 ν₀
      const nu0X_ratio = (nu0 / 12); // 以 canvas 寬度比例估算位置
      // 在金屬板右側顯示 ν₀ 和功函數標籤
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#FFD080";
      ctx.textAlign = "left";
      ctx.fillText(
        storyMode ? `門檻：${phi} eV` : `φ=${phi}eV | ν₀=${nu0}×10¹⁴`,
        METAL_X + METAL_W + 4,
        H / 2
      );
      // 截止頻率標示線（在金屬板旁）
      ctx.font = "9px sans-serif";
      ctx.fillStyle = "#FFD08088";
      ctx.fillText(
        storyMode ? `截止頻率 ν₀=${nu0}×10¹⁴Hz` : `ν₀=${nu0}×10¹⁴Hz`,
        METAL_X + METAL_W + 4,
        H / 2 + 14
      );
    }

    function drawHUD() {
      ctx.textAlign = "left";
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = freqInfo.color;
      ctx.fillText(storyMode ? freqInfo.storyName : freqInfo.name, 8, 18);
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#ccc";
      ctx.fillText(`E = ${photonEnergy.toFixed(2)} eV`, 8, 32);

      // 🔴 優化 2：故事模式下強調強度的影響
      if (storyMode && canEmit) {
        ctx.font = "9px sans-serif";
        ctx.fillStyle = "#aaa";
        ctx.fillText(`保鑣數量（強度）↑ → 飛出電子數↑，速度不變`, 8, 46);
      }

      const msg = canEmit
        ? (storyMode ? `✓ 保鑣帶走舞客！KE = ${keMax} eV` : `✓ 光電效應！KE_max = ${keMax} eV`)
        : (storyMode ? `✗ 保鑣力氣不夠（需要 ${phi} eV）` : `✗ hν < φ，無光電效應`);
      ctx.font = "bold 12px sans-serif";
      ctx.fillStyle = canEmit ? "#66ffaa" : "#ff6666";
      ctx.textAlign = "center";
      ctx.fillText(msg, W / 2, H - 10);
    }

    function addFlash(y) {
      flashRef.current.push({ x: METAL_X, y, r: 0, maxR: 16, life: 0 });
    }

    function animate() {
      frameRef.current++;
      const f = frameRef.current;
      ctx.clearRect(0, 0, W, H);
      drawBackground();

      const interval = Math.max(4, Math.floor(50 / (intensity / 20)));
      if (f % interval === 0) {
        photonsRef.current.push(makePhoton(H, W, freqInfo.color));
      }

      // ── 繪製光子 ──
      photonsRef.current = photonsRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x >= METAL_X - METAL_W / 2 || p.y > H || p.y < -100) {
          if (p.x >= METAL_X - METAL_W / 2 && p.y > 20 && p.y < H - 20) {
            addFlash(p.y);
            if (canEmit) {
              const e = makeElectron(METAL_X - METAL_W / 2, p.y, keMax);
              electronsRef.current.push(e);
            }
          }
          return false;
        }
        // 光子特徵：帶有方向性的線段(波包)
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // ── 閃光（碰撞特效） ──
      flashRef.current = flashRef.current.filter(fl => {
        fl.r += 2;
        fl.life++;
        const alpha = Math.max(0, 1 - fl.life / 10);
        ctx.beginPath();
        ctx.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
        ctx.strokeStyle = canEmit
          ? `rgba(180,255,150,${alpha})`
          : `rgba(255,100,100,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return fl.r < fl.maxR;
      });

      // ── 繪製電子 ──
      electronsRef.current = electronsRef.current.filter(e => {
        e.x   += e.vx;
        e.y   += e.vy;
        e.life++;
        if (e.x < -20 || e.life > e.maxLife) return false;
        const alpha = Math.max(0, 1 - e.life / e.maxLife);
        const eg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, 7);
        eg.addColorStop(0, `rgba(50, 150, 255, ${alpha})`);
        eg.addColorStop(1, "transparent");
        ctx.fillStyle = eg;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 7, 0, Math.PI * 2);
        ctx.fill();
        
        // 實體核心加負號 (-) 以區別光子
        ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(0, 50, 150, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(e.x - 1.5, e.y);
        ctx.lineTo(e.x + 1.5, e.y);
        ctx.stroke();

        return true;
      });

      drawHUD();
      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [freq, intensity, metalKey, canEmit, keMax, phi, photonEnergy,
      freqInfo, storyMode, canvasW]);

  // ─── 圖表繪製 ────────────────────────────────────────
  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const PAD = { l: 48, r: 20, t: 24, b: 36 };
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;

    const MAX_FREQ = 12;
    const MIN_KE   = -0.5;
    const MAX_KE   = 6;
    const toX = f  => PAD.l + (f / MAX_FREQ) * plotW;
    const toY = ke => PAD.t + plotH - ((ke - MIN_KE) / (MAX_KE - MIN_KE)) * plotH;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, W, H);

    // 無光電效應區
    const x0 = toX(nu0);
    ctx.fillStyle = "rgba(255,80,80,0.08)";
    ctx.fillRect(PAD.l, PAD.t, Math.min(x0 - PAD.l, plotW), plotH);

    // 有光電效應區
    if (x0 < PAD.l + plotW) {
      ctx.fillStyle = "rgba(100,255,150,0.06)";
      ctx.fillRect(x0, PAD.t, PAD.l + plotW - x0, plotH);
    }

    // 🟢 優化 8：KE=0 水平線加強顯示（明確的零基準線）
    const y0line = toY(0);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(PAD.l, y0line);
    ctx.lineTo(PAD.l + plotW, y0line);
    ctx.stroke();
    ctx.setLineDash([]);
    // KE=0 標籤
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("KE=0", PAD.l - 2, y0line + 3);

    // 截止頻率垂直虛線
    ctx.strokeStyle = "rgba(255,200,100,0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, PAD.t);
    ctx.lineTo(x0, PAD.t + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#FFD080";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`ν₀=${nu0}`, x0, PAD.t - 8);

    // KE_max 直線
    ctx.beginPath();
    ctx.strokeStyle = "#66aaff";
    ctx.lineWidth = 2;
    for (let f = nu0; f <= MAX_FREQ; f += 0.1) {
      const ke = H_EV * f * FREQ_UNIT - phi;
      const px = toX(f);
      const py = toY(ke);
      if (f === nu0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 座標軸
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD.l, PAD.t);
    ctx.lineTo(PAD.l, PAD.t + plotH);
    ctx.lineTo(PAD.l + plotW, PAD.t + plotH);
    ctx.stroke();

    // X 軸刻度
    ctx.fillStyle = "#888";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    for (let f = 0; f <= MAX_FREQ; f += 2) {
      const px = toX(f);
      ctx.beginPath();
      ctx.moveTo(px, PAD.t + plotH);
      ctx.lineTo(px, PAD.t + plotH + 4);
      ctx.strokeStyle = "#555";
      ctx.stroke();
      ctx.fillText(f, px, PAD.t + plotH + 14);
    }
    ctx.fillStyle = "#aaa";
    ctx.font = "10px sans-serif";
    ctx.fillText("頻率 ν (×10¹⁴ Hz)", PAD.l + plotW / 2, H - 4);

    // Y 軸刻度
    ctx.textAlign = "right";
    for (let ke = 0; ke <= MAX_KE; ke++) {
      const py = toY(ke);
      ctx.beginPath();
      ctx.moveTo(PAD.l, py);
      ctx.lineTo(PAD.l - 4, py);
      ctx.strokeStyle = "#555";
      ctx.stroke();
      ctx.fillStyle = "#888";
      ctx.font = "9px sans-serif";
      ctx.fillText(ke, PAD.l - 6, py + 3);
    }
    ctx.save();
    ctx.translate(12, PAD.t + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#aaa";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("KE_max (eV)", 0, 0);
    ctx.restore();

    // 當前頻率標記（大點）
    const curX = toX(freq);
    const curY = toY(keMax);
    // 光暈效果
    const ptGlow = ctx.createRadialGradient(curX, curY, 0, curX, curY, 16);
    ptGlow.addColorStop(0, canEmit ? "rgba(0,255,170,0.4)" : "rgba(255,68,68,0.4)");
    ptGlow.addColorStop(1, "transparent");
    ctx.fillStyle = ptGlow;
    ctx.beginPath();
    ctx.arc(curX, curY, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(curX, curY, 7, 0, Math.PI * 2);
    ctx.fillStyle = canEmit ? "#00ffaa" : "#ff4444";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 🟡 優化 6：當前點標籤同時顯示 KE 和 V₀
    const labelAlign = curX > W - 100 ? "right" : "left";
    const labelX = curX + (curX > W - 100 ? -12 : 12);
    ctx.fillStyle = canEmit ? "#00ffaa" : "#ff4444";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = labelAlign;
    if (canEmit) {
      ctx.fillText(`KE=${keMax}eV`, labelX, curY - 14);
      ctx.fillStyle = "#88ddff";
      ctx.fillText(`V₀=${v0}V`, labelX, curY - 2);
    } else {
      ctx.fillText(`(${freq.toFixed(1)}, 無逸出)`, labelX, curY - 8);
    }

  }, [freq, metalKey, canEmit, keMax, phi, nu0, v0, canvasW]);

  // ─── UI ─────────────────────────────────────────────
  const cardStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "12px 14px",
  };
  const valueStyle = {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  };
  const labelStyle = { fontSize: 10, color: "#888", marginBottom: 2 };

  // tooltip 文字
  const tooltipText = storyMode
    ? "切換到故事模式：光子 = 保鑣 / 金屬 = 夜店 / 功函數 = 門檻"
    : "切換到物理模式：顯示標準物理術語與公式";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0d0d2b 0%,#0a0a18 100%)",
      color: "#fff",
      fontFamily: "system-ui, sans-serif",
      padding: "16px",
      boxSizing: "border-box",
    }}>
      {/* 標題 */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 2 }}>
          ⚡ 光電效應互動模擬
        </div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
          Photoelectric Effect Simulation
        </div>
      </div>

      {/* 🟢 優化 7：模式切換 + tooltip */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4, position: "relative" }}>
        {["故事模式", "物理模式"].map((label, i) => (
          <button
            key={i}
            onClick={() => handleModeSwitch(i === 0)}
            style={{
              padding: "6px 20px",
              margin: "0 4px",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.2)",
              background: storyMode === (i === 0) ? "rgba(100,160,255,0.3)" : "transparent",
              color: storyMode === (i === 0) ? "#fff" : "#888",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: storyMode === (i === 0) ? "bold" : "normal",
              transition: "all 0.2s",
            }}
          >{label}</button>
        ))}
      </div>
      {modeTooltip && (
        <div style={{
          textAlign: "center", fontSize: 10, color: "#aaa",
          marginBottom: 8, transition: "opacity 0.3s",
          opacity: modeTooltip ? 1 : 0,
        }}>
          💡 {tooltipText}
        </div>
      )}

      {/* 主體 */}
      {/* 🟡 優化 4：外層用 ref 監聽寬度 */}
      <div ref={containerRef} style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>

        {/* ─ 左側控制面板 ─ */}
        <div style={{ ...cardStyle, minWidth: 190, maxWidth: 220, flexShrink: 0 }}>
          <div style={{ fontWeight: "bold", marginBottom: 12, fontSize: 13 }}>⚙ 控制面板</div>

          {/* 金屬選擇 */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>金屬材料</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.entries(METALS).map(([k, m]) => (
                <button
                  key={k}
                  onClick={() => handleMetalChange(k)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 6,
                    border: `1px solid ${metalKey === k ? m.color : "rgba(255,255,255,0.15)"}`,
                    background: metalKey === k ? m.color + "33" : "transparent",
                    color: metalKey === k ? m.color : "#aaa",
                    cursor: "pointer",
                    fontSize: 12,
                    textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  {m.label}
                  <span style={{ float: "right", fontSize: 10, color: "#888" }}>φ={m.phi}eV</span>
                </button>
              ))}
            </div>
          </div>

          {/* 頻率滑桿 */}
          <div style={{ marginBottom: 14 }}>
            <div style={labelStyle}>
              光的頻率
              <span style={{ float: "right", color: freqInfo.color, fontWeight: "bold" }}>
                {freqInfo.name}
              </span>
            </div>
            <div style={{
              height: 8, borderRadius: 4,
              background: `linear-gradient(to right,
                #6B0000 0%,#FF3300 25%,#DDDD00 42%,#00CC44 55%,#4488FF 65%,#AA44FF 78%,#DDCCFF 100%)`,
              marginBottom: 6,
            }}/>
            <input
              type="range" min="3" max="12" step="0.1"
              value={freq}
              onChange={e => setFreq(+e.target.value)}
              style={{ width: "100%", accentColor: freqInfo.color }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#666" }}>
              <span>3×10¹⁴Hz</span>
              <span style={{ ...valueStyle, fontSize: 12 }}>{freq.toFixed(1)} ×10¹⁴Hz</span>
              <span>12×10¹⁴Hz</span>
            </div>
          </div>

          {/* 強度滑桿 */}
          <div>
            <div style={labelStyle}>
              光的強度
              <span style={{ float: "right", color: "#ccc" }}>{intensity}%</span>
            </div>
            {/* 🔴 優化 2：強調強度影響的說明 */}
            <div style={{ ...labelStyle, color: canEmit ? "#88ffcc" : "#aaa", marginBottom: 6 }}>
              {canEmit
                ? "↑ 強度 → 飛出的電子數↑（速度不變）"
                : "強度不影響結果（頻率未達截止頻率）"}
            </div>
            <input
              type="range" min="10" max="100" step="5"
              value={intensity}
              onChange={e => setIntensity(+e.target.value)}
              style={{ width: "100%", accentColor: "#aaa" }}
            />
          </div>
        </div>

        {/* ─ 中間動畫 + 圖表 ─ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 280 }}>
          {/* 🟡 優化 4：canvas 寬度隨容器自適應 */}
          <canvas
            ref={canvasRef}
            width={canvasW}
            height={Math.round(canvasW * 0.5)}
            style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", width: "100%" }}
          />

          {/* 圖表 */}
          <div style={cardStyle}>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>
              📈 KE_max vs 頻率 — 斜率 = h（普朗克常數）
            </div>
            <canvas
              ref={graphRef}
              width={canvasW}
              height={Math.round(canvasW * 0.375)}
              style={{ borderRadius: 6, width: "100%" }}
            />
            <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 10, color: "#888" }}>
              <span style={{ color: "#ff6666" }}>■ 無光電效應區（hν &lt; φ）</span>
              <span style={{ color: "#66ffaa" }}>■ 有光電效應區（hν &gt; φ）</span>
              <span style={{ color: "#66aaff" }}>── KE = hν − φ</span>
            </div>
          </div>
        </div>

        {/* ─ 右側數值面板 ─ */}
        <div style={{ ...cardStyle, minWidth: 190, maxWidth: 220, flexShrink: 0 }}>
          <div style={{ fontWeight: "bold", marginBottom: 12, fontSize: 13 }}>📊 即時數值</div>

          {/* 光子能量 */}
          <div style={{ marginBottom: 10, padding: "8px 10px", borderRadius: 8,
            background: `${freqInfo.color}22`, border: `1px solid ${freqInfo.color}55` }}>
            <div style={{ ...labelStyle, color: freqInfo.color }}>光子能量 E = hν</div>
            <div style={{ ...valueStyle, color: freqInfo.color }}>
              {photonEnergy.toFixed(3)} eV
            </div>
          </div>

          {/* 功函數 */}
          <div style={{ marginBottom: 10, padding: "8px 10px", borderRadius: 8,
            background: "rgba(255,200,80,0.1)", border: "1px solid rgba(255,200,80,0.3)" }}>
            <div style={{ ...labelStyle, color: "#FFD080" }}>功函數 φ（{METALS[metalKey].label}）</div>
            <div style={{ ...valueStyle, color: "#FFD080" }}>{phi.toFixed(1)} eV</div>
          </div>

          {/* 截止頻率 */}
          <div style={{ marginBottom: 10, padding: "8px 10px", borderRadius: 8,
            background: "rgba(255,200,80,0.05)", border: "1px solid rgba(255,200,80,0.2)" }}>
            <div style={labelStyle}>截止頻率 ν₀ = φ/h</div>
            <div style={valueStyle}>{nu0.toFixed(2)} ×10¹⁴Hz</div>
          </div>

          {/* KE_max */}
          <div style={{ marginBottom: 10, padding: "8px 10px", borderRadius: 8,
            background: canEmit ? "rgba(100,255,150,0.1)" : "rgba(255,100,100,0.1)",
            border: `1px solid ${canEmit ? "rgba(100,255,150,0.3)" : "rgba(255,100,100,0.3)"}` }}>
            <div style={{ ...labelStyle, color: canEmit ? "#66ffaa" : "#ff6666" }}>
              KE_max = hν − φ
            </div>
            <div style={{ ...valueStyle, color: canEmit ? "#66ffaa" : "#ff6666" }}>
              {canEmit ? `${keMax.toFixed(3)} eV` : "無法逸出"}
            </div>
          </div>

          {/* 停止電壓 */}
          <div style={{ marginBottom: 14, padding: "8px 10px", borderRadius: 8,
            background: canEmit ? "rgba(100,200,255,0.1)" : "rgba(255,100,100,0.1)",
            border: `1px solid ${canEmit ? "rgba(100,200,255,0.3)" : "rgba(255,100,100,0.3)"}` }}>
            <div style={{ ...labelStyle, color: canEmit ? "#88ddff" : "#ff6666" }}>
              停止電壓 V₀ = KE/e
            </div>
            <div style={{ ...valueStyle, color: canEmit ? "#88ddff" : "#ff6666" }}>
              {canEmit ? `${v0.toFixed(3)} V` : "—"}
            </div>
          </div>

          {/* 愛因斯坦方程 */}
          <div style={{ padding: "8px 10px", borderRadius: 8,
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            fontSize: 11, color: "#ccc", lineHeight: 1.8 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4, color: "#fff" }}>愛因斯坦光電方程</div>
            <div>hν = φ + KE_max</div>
            <div style={{ color: "#888", fontSize: 10, marginTop: 4 }}>
              h = 4.136×10⁻¹⁵ eV·s
            </div>
          </div>

          {/* 故事模式說明 */}
          {storyMode && (
            <div style={{ marginTop: 12, padding: "8px 10px", borderRadius: 8,
              background: "rgba(150,100,255,0.1)", border: "1px solid rgba(150,100,255,0.3)",
              fontSize: 10, color: "#cc99ff", lineHeight: 1.7 }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>🌃 夜店類比</div>
              <div>光子 = {freqInfo.storyName}</div>
              <div>金屬 = {METALS[metalKey].story}</div>
              <div>門檻 = {phi} eV</div>
              <div>{canEmit ? "✓ 保鑣力氣足夠！" : "✗ 保鑣力氣不夠"}</div>
            </div>
          )}
        </div>

      </div>

      {/* 底部公式說明 */}
      <div style={{ ...cardStyle, marginTop: 14, maxWidth: 900, margin: "14px auto 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center",
          fontSize: 11, color: "#aaa", textAlign: "center" }}>
          <div>
            <div style={{ color: "#66aaff", fontWeight: "bold", marginBottom: 4 }}>光子能量</div>
            <div>E = hν = hc/λ</div>
          </div>
          <div>
            <div style={{ color: "#FFD080", fontWeight: "bold", marginBottom: 4 }}>截止頻率</div>
            <div>ν₀ = φ/h</div>
          </div>
          <div>
            <div style={{ color: "#66ffaa", fontWeight: "bold", marginBottom: 4 }}>最大動能</div>
            <div>KE_max = hν − φ</div>
          </div>
          <div>
            <div style={{ color: "#88ddff", fontWeight: "bold", marginBottom: 4 }}>停止電壓</div>
            <div>eV₀ = KE_max</div>
          </div>
          <div>
            <div style={{ color: "#aaa", fontWeight: "bold", marginBottom: 4 }}>Millikan 1916</div>
            <div>V₀ vs ν → 斜率 = h/e</div>
          </div>
        </div>
      </div>
    </div>
  );
}
