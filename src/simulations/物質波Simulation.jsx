import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================================
// 畫布常數
// ============================================================
const CW = 680
const CH = 340
const SRC_X = 48
const BAR_X = Math.round(CW * 0.50)
const SCR_X = Math.round(CW * 0.87)
const CANVAS_CY = CH / 2
const SLIT_W = 10
const L_DIST = SCR_X - BAR_X

// ============================================================
// 粒子類型設定
// ============================================================
const PARTICLE_TYPES = {
  electron: {
    label: '電子',   tag: '量子粒子',
    λReal: '0.73 nm',
    λSim: 36,
    isQuantum: true,
    color: '#60a5fa',
    dotColor: 'rgba(96, 165, 250, 0.8)',
    glowColor: 'rgba(96, 165, 250, 0.18)',
    size: 3,
    storyNote: '電子輕如鴻毛，通過雙縫時根本無法確定走哪條——兩條同時！最後以機率決定落點，累積出神秘條紋。',
    physNote: 'λ = h/(mₑv) = 6.626×10⁻³⁴ / (9.11×10⁻³¹ × 10⁶) ≈ 0.73 nm。量子效應顯著，出現雙縫干涉條紋。',
  },
  proton: {
    label: '質子',   tag: '量子粒子',
    λReal: '0.04 nm',
    λSim: 10,
    isQuantum: true,
    color: '#34d399',
    dotColor: 'rgba(52, 211, 153, 0.8)',
    glowColor: 'rgba(52, 211, 153, 0.18)',
    size: 4,
    storyNote: '質子比電子重1836倍，但還是夠輕，依然有量子波動性——只是條紋更密、更難分辨。',
    physNote: 'λ = h/(mₚv) ≈ 0.04 nm，比電子波長短約18倍，干涉條紋間距隨之縮小 18 倍。',
  },
  baseball: {
    label: '棒球',   tag: '古典物體',
    λReal: '1.1×10⁻³⁴ m',
    λSim: 0,
    isQuantum: false,
    color: '#fbbf24',
    dotColor: 'rgba(251, 191, 36, 0.85)',
    glowColor: 'rgba(251, 191, 36, 0.1)',
    size: 6,
    storyNote: '棒球的波長比原子核還小 10²⁰ 倍，干涉條紋密到根本無法分辨——只看到兩條帶，每條對應一道縫。',
    physNote: 'λ = h/(mv) ≈ 1.1×10⁻³⁴ m，遠小於任何可測縫寬（~10⁻⁶ m），干涉效應完全消失。',
  },
  teacher: {
    label: '老師走路', tag: '古典物體',
    λReal: '8.5×10⁻³⁶ m',
    λSim: 0,
    isQuantum: false,
    color: '#f87171',
    dotColor: 'rgba(248, 113, 113, 0.85)',
    glowColor: 'rgba(248, 113, 113, 0.1)',
    size: 9,
    storyNote: '老師走路的波長比棒球還短 100 倍。量子效應？不存在。他只是從其中一道門走進去，僅此而已。',
    physNote: 'λ = h/(Mv) ≈ 8.5×10⁻³⁶ m（M=65 kg，v=1.2 m/s），完全古典行為，無任何可觀測量子效應。',
  },
}

// ============================================================
// 物理取樣函式
// ============================================================
function sampleQuantumY(d, λSim) {
  const halfRange = CH * 0.44
  for (let i = 0; i < 3000; i++) {
    const dy = (Math.random() * 2 - 1) * halfRange
    const prob = Math.cos((Math.PI * d * dy) / (λSim * L_DIST)) ** 2
    if (Math.random() < prob) return CANVAS_CY + dy
  }
  return CANVAS_CY
}

function sampleClassicalY(d) {
  const sign = Math.random() < 0.5 ? 1 : -1
  const slitCY = CANVAS_CY + sign * d / 2
  const u = Math.max(Math.random(), 1e-10)
  const gauss = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random())
  return Math.max(10, Math.min(CH - 10, slitCY + gauss * 11))
}

// ============================================================
// 繪製輔助：波包（量子粒子，過縫前，或古典粒子）
// ============================================================
function drawWavePacket(ctx, px, py, cfg, now) {
  const λ = Math.max(cfg.λSim, 12)  // 視覺波長
  const ww = 30                      // 波包半寬（px）
  const amp = cfg.size * 2.2
  const phase = now * 0.006          // 動態相位（讓波包看起來在振動）

  // 外發光
  ctx.save()
  ctx.shadowColor = cfg.color
  ctx.shadowBlur = 6

  ctx.beginPath()
  for (let i = 0; i <= 100; i++) {
    const dx = (i / 100) * 2 * ww - ww
    const envelope = Math.exp(-(dx * dx) / (ww * ww * 0.45))
    const dy = Math.sin((2 * Math.PI * dx / λ) - phase) * amp * envelope
    i === 0 ? ctx.moveTo(px + dx, py + dy) : ctx.lineTo(px + dx, py + dy)
  }
  ctx.strokeStyle = cfg.color
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()

  // 中心小點（強調「還是一個實體」）
  ctx.beginPath()
  ctx.arc(px, py, cfg.size * 0.6, 0, Math.PI * 2)
  ctx.fillStyle = cfg.color
  ctx.fill()
}

// ============================================================
// 繪製輔助：過縫後的雙弧波前（量子，波動樣態）
// ============================================================
function drawWavefronts(ctx, p, slitSep) {
  const r = p.x - BAR_X
  if (r < 3) return

  const s1y = CANVAS_CY - slitSep / 2
  const s2y = CANVAS_CY + slitSep / 2
  const fade = Math.max(0.08, 0.55 - (r / L_DIST) * 0.45)

  ctx.save()
  ctx.globalAlpha = fade
  ctx.strokeStyle = p.cfg.color
  ctx.lineWidth = 1.5

  for (const sy of [s1y, s2y]) {
    ctx.beginPath()
    // 半弧（只畫面向螢幕方向）
    ctx.arc(BAR_X, sy, r, -Math.PI * 0.62, Math.PI * 0.62)
    ctx.stroke()
  }
  ctx.restore()
}

// ============================================================
// 主元件
// ============================================================
export default function 物質波Simulation() {
  const [ptKey, setPtKey]       = useState('electron')
  const [slitSep, setSlitSep]   = useState(60)
  const [fireRate, setFireRate] = useState(8)
  const [mode, setMode]         = useState('story')    // 故事 / 物理 說明文字
  const [viewMode, setViewMode] = useState('particle') // ← 新增：粒子 / 波動 樣態
  const [dotCount, setDotCount] = useState(0)

  const canvasRef      = useRef(null)
  const patternCanvasRef = useRef(null)
  const stRef          = useRef({ particles: [], lastFire: 0 })
  const animRef        = useRef(null)

  // viewMode 用 ref 傳入 animation loop，避免重啟動畫
  const viewModeRef = useRef(viewMode)
  useEffect(() => { viewModeRef.current = viewMode }, [viewMode])

  const pt = PARTICLE_TYPES[ptKey]

  // 初始化離屏畫布
  useEffect(() => {
    const pc = document.createElement('canvas')
    pc.width = CW
    pc.height = CH
    patternCanvasRef.current = pc
  }, [])

  // 重置
  const doReset = useCallback(() => {
    stRef.current.particles = []
    stRef.current.lastFire = 0
    setDotCount(0)
    const pc = patternCanvasRef.current
    if (pc) pc.getContext('2d').clearRect(0, 0, CW, CH)
  }, [])

  useEffect(() => { doReset() }, [ptKey, slitSep, doReset])

  // ---- 動畫主迴圈 ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let prevTime = performance.now()
    let running = true

    function spawnParticle() {
      const cfg = PARTICLE_TYPES[ptKey]
      let targetY
      if (cfg.isQuantum) {
        targetY = sampleQuantumY(slitSep, cfg.λSim)
      } else {
        targetY = sampleClassicalY(slitSep)
      }
      const slitY = cfg.isQuantum
        ? null
        : (targetY >= CANVAS_CY ? CANVAS_CY + slitSep / 2 : CANVAS_CY - slitSep / 2)

      stRef.current.particles.push({
        x: SRC_X + 8,
        y: CANVAS_CY,
        targetY,
        slitY,
        cfg,
        speed: 195 + Math.random() * 55,
      })
    }

    function frame(now) {
      const dt = Math.min((now - prevTime) / 1000, 0.05)
      prevTime = now
      const vm = viewModeRef.current  // 讀當前 viewMode

      // ── 背景 ──
      ctx.fillStyle = '#080f1e'
      ctx.fillRect(0, 0, CW, CH)

      // ── 中心輔助線 ──
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 8])
      ctx.beginPath()
      ctx.moveTo(SRC_X, CANVAS_CY)
      ctx.lineTo(BAR_X, CANVAS_CY)
      ctx.stroke()
      ctx.setLineDash([])

      // ── 粒子源 ──
      ctx.fillStyle = '#1e3a5f'
      ctx.beginPath()
      ctx.roundRect(SRC_X - 16, CANVAS_CY - 24, 16, 48, 4)
      ctx.fill()
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(SRC_X - 16, CANVAS_CY - 5, 16, 10)
      if (Math.floor(now / 180) % 2 === 0) {
        ctx.beginPath()
        ctx.arc(SRC_X, CANVAS_CY, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(147, 197, 253, 0.7)'
        ctx.fill()
      }

      // ── 雙縫隔板 ──
      const s1t = CANVAS_CY - slitSep / 2 - SLIT_W / 2
      const s1b = CANVAS_CY - slitSep / 2 + SLIT_W / 2
      const s2t = CANVAS_CY + slitSep / 2 - SLIT_W / 2
      const s2b = CANVAS_CY + slitSep / 2 + SLIT_W / 2
      ctx.fillStyle = '#374151'
      ctx.fillRect(BAR_X - 5, 0, 10, s1t)
      ctx.fillRect(BAR_X - 5, s1b, 10, s2t - s1b)
      ctx.fillRect(BAR_X - 5, s2b, 10, CH - s2b)
      ctx.fillStyle = 'rgba(148,163,184,0.12)'
      ctx.fillRect(BAR_X - 5, s1t, 10, SLIT_W)
      ctx.fillRect(BAR_X - 5, s2t, 10, SLIT_W)

      // ── 偵測螢幕 ──
      ctx.fillStyle = '#0d1b2e'
      ctx.fillRect(SCR_X, 0, CW - SCR_X, CH)
      ctx.fillStyle = '#2d4263'
      ctx.fillRect(SCR_X, 0, 3, CH)

      // ── 累積落點 ──
      const pc = patternCanvasRef.current
      if (pc) ctx.drawImage(pc, 0, 0)

      // ── 飛行粒子更新 & 繪製 ──
      const survive = []
      for (const p of stRef.current.particles) {
        p.x += p.speed * dt

        // 更新 y
        if (p.x < BAR_X) {
          p.y = CANVAS_CY
        } else {
          const prog = Math.min((p.x - BAR_X) / L_DIST, 1)
          if (p.cfg.isQuantum) {
            p.y = CANVAS_CY + (p.targetY - CANVAS_CY) * prog
          } else {
            if (prog < 0.18) {
              p.y = CANVAS_CY + (p.slitY - CANVAS_CY) * (prog / 0.18)
            } else {
              const sub = (prog - 0.18) / 0.82
              p.y = p.slitY + (p.targetY - p.slitY) * sub
            }
          }
        }

        if (p.x >= SCR_X) {
          // 到達螢幕，寫入累積圖
          const pctx = pc?.getContext('2d')
          if (pctx) {
            pctx.beginPath()
            pctx.arc(SCR_X + 6, p.targetY, 1.7, 0, Math.PI * 2)
            pctx.fillStyle = p.cfg.dotColor
            pctx.fill()
          }
          setDotCount(c => c + 1)
        } else {
          // ── 依 viewMode 決定畫法 ──
          if (vm === 'wave' && p.cfg.isQuantum) {
            if (p.x < BAR_X) {
              // 過縫前：畫波包
              drawWavePacket(ctx, p.x, CANVAS_CY, p.cfg, now)
            } else {
              // 過縫後：畫兩道展開弧形波前
              drawWavefronts(ctx, p, slitSep)
            }
          } else {
            // 粒子樣態（所有粒子）或古典粒子的波動樣態
            if (p.cfg.isQuantum && p.x > BAR_X) {
              const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.cfg.size + 10)
              grad.addColorStop(0, p.cfg.color)
              grad.addColorStop(0.35, p.cfg.glowColor)
              grad.addColorStop(1, 'rgba(0,0,0,0)')
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.cfg.size + 10, 0, Math.PI * 2)
              ctx.fillStyle = grad
              ctx.fill()
            }
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.cfg.size, 0, Math.PI * 2)
            ctx.fillStyle = p.cfg.color
            ctx.fill()
            if (!p.cfg.isQuantum) {
              ctx.strokeStyle = 'rgba(255,255,255,0.3)'
              ctx.lineWidth = 1.2
              ctx.stroke()
            }
          }
          survive.push(p)
        }
      }
      stRef.current.particles = survive

      // ── 射出新粒子 ──
      const interval = 1000 / Math.max(fireRate, 1)
      if (now - stRef.current.lastFire >= interval) {
        spawnParticle()
        stRef.current.lastFire = now
      }

      // ── 標籤 ──
      ctx.font = '10px sans-serif'
      ctx.fillStyle = 'rgba(71,85,105,0.9)'
      ctx.textAlign = 'center'
      ctx.fillText('粒子源', SRC_X - 4, CH - 6)
      ctx.fillText('雙縫板', BAR_X, CH - 6)
      ctx.fillText('偵測螢幕', SCR_X + (CW - SCR_X) / 2, CH - 6)
      ctx.textAlign = 'left'

      if (running) animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)
    return () => {
      running = false
      cancelAnimationFrame(animRef.current)
    }
  }, [ptKey, slitSep, fireRate])

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="bg-gray-900 rounded-xl p-4 space-y-3">

      {/* ── 頂列：說明模式 + 計數 ── */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          {[['story', '📖 故事'], ['physics', '🔬 物理']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                mode === m ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}>{label}</button>
          ))}
        </div>
        <span className="text-xs text-gray-500">
          已發射：<span className="text-indigo-400 font-bold">{dotCount}</span> 顆
        </span>
      </div>

      {/* ── 波粒樣態切換（主角按鈕）── */}
      <div className="flex gap-2 items-stretch">
        <button
          onClick={() => setViewMode('particle')}
          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-0.5 ${
            viewMode === 'particle'
              ? 'border-indigo-400 bg-indigo-950/70 text-white shadow-lg shadow-indigo-900/40'
              : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
          }`}
        >
          <span className="text-xl">●</span>
          <span>粒子樣態</span>
          <span className="text-xs font-normal opacity-60">看到一顆顆飛</span>
        </button>
        <div className="flex items-center text-gray-600 text-lg font-light">⇄</div>
        <button
          onClick={() => setViewMode('wave')}
          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-0.5 ${
            viewMode === 'wave'
              ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-lg shadow-cyan-900/40'
              : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
          }`}
        >
          <span className="text-xl">〜</span>
          <span>波動樣態</span>
          <span className="text-xs font-normal opacity-60">看到波包展開</span>
        </button>
      </div>

      {/* 古典粒子在波動樣態下的提示 */}
      {viewMode === 'wave' && !pt.isQuantum && (
        <div className="rounded-lg px-3 py-2 bg-amber-950/30 border border-amber-700/40 text-xs text-amber-300/80">
          ⚠️ 古典物體的物質波波長極短（{pt.λReal}），縮放後無法以波動方式呈現——仍顯示為粒子。
        </div>
      )}

      {/* 量子粒子在波動樣態下的提示 */}
      {viewMode === 'wave' && pt.isQuantum && (
        <div className="rounded-lg px-3 py-2 bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300/80 leading-relaxed">
          {mode === 'story'
            ? '🌊 過縫前：波包向前傳播　過縫後：從兩條縫各自展開弧形波前，兩波相疊產生干涉'
            : '📐 此為惠更斯原理的古典波動類比。電子的「波」實為機率振幅波函數 ψ，非實體振動——但兩者的干涉數學完全相同，結果都是 cos² 分佈。'}
        </div>
      )}

      {/* 粒子選擇器 */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(PARTICLE_TYPES).map(([key, cfg]) => (
          <button key={key} onClick={() => setPtKey(key)}
            className={`p-2 rounded-lg border text-center transition-all ${
              ptKey === key
                ? 'border-indigo-500 bg-indigo-950/60'
                : 'border-gray-700 bg-gray-800/40 hover:border-gray-500'
            }`}
          >
            <div className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</div>
            <div className={`text-xs mt-0.5 ${cfg.isQuantum ? 'text-blue-400' : 'text-amber-400'}`}>{cfg.tag}</div>
          </button>
        ))}
      </div>

      {/* 德布羅意波長資訊 */}
      <div className={`rounded-lg p-3 border ${
        pt.isQuantum ? 'border-blue-800/60 bg-blue-950/25' : 'border-amber-700/50 bg-amber-950/20'
      }`}>
        <div className="flex items-start gap-2.5">
          <span className="text-xl mt-0.5">{pt.isQuantum ? '🌊' : '🎱'}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white">
              德布羅意波長 λ = <span style={{ color: pt.color }}>{pt.λReal}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 leading-relaxed">
              {mode === 'story' ? pt.storyNote : pt.physNote}
            </div>
          </div>
        </div>
      </div>

      {/* 主畫布 */}
      <canvas ref={canvasRef} width={CW} height={CH}
        className="w-full rounded-lg border border-gray-700 block" />

      {/* 控制滑桿 */}
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <div className="text-xs text-gray-400">
            縫間距：<span className="text-white font-semibold">{slitSep} px</span>
            <span className="text-gray-600 ml-1">（越大，條紋越密）</span>
          </div>
          <input type="range" min="30" max="110" step="5" value={slitSep}
            onChange={e => setSlitSep(Number(e.target.value))}
            className="w-full accent-indigo-500" />
        </label>
        <label className="space-y-1.5">
          <div className="text-xs text-gray-400">
            射速：<span className="text-white font-semibold">{fireRate} 顆/秒</span>
          </div>
          <input type="range" min="1" max="20" value={fireRate}
            onChange={e => setFireRate(Number(e.target.value))}
            className="w-full accent-indigo-500" />
        </label>
      </div>

      {/* 重置 */}
      <button onClick={doReset}
        className="w-full py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors font-medium">
        🔄 清除螢幕，重新累積
      </button>

      {/* 動態提示 */}
      {dotCount >= 80 && (
        <p className="text-xs text-center text-gray-500 leading-relaxed">
          {pt.isQuantum
            ? '✨ 看到條紋了嗎？每顆粒子落點隨機，但累積後規律浮現——這就是量子機率的本質'
            : '🎯 兩條清晰的帶，分別對應兩道縫。沒有干涉，只有彈道——古典世界的樣子'}
        </p>
      )}

    </div>
  )
}
