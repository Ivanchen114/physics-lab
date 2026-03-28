import React, { useState, useEffect, useRef } from 'react';

// =============================================
// 物理常數（正規化單位，方便教學展示）
// =============================================
const H = 1;        // 普朗克常數
const K = 1;        // 波茲曼常數
const MAX_FREQ = 50; // X 軸最大頻率 (從 25 加大到 50，避免高溫峰值被卡斷)
const MAX_T = 10000; // 滑桿最大溫度

// =============================================
// 純函式：物理計算（移到元件外，避免重複定義）
// =============================================
function planckIntensity(nu, kT) {
  if (nu <= 0) return 0;
  return Math.pow(nu, 3) / Math.expm1((H * nu) / kT);
}

function rayleighJeansIntensity(nu, kT) {
  return Math.pow(nu, 2) * kT / H;
}

function wienPeakNu(kT) {
  return 2.82 * kT / H; // Wien 位移定律
}

// =============================================
// 全域最大強度（用於 Y 軸正規化，固定不動）
// =============================================
const GLOBAL_MAX_KT = K * (MAX_T / 1000);
const GLOBAL_PEAK_NU = wienPeakNu(GLOBAL_MAX_KT);
const GLOBAL_MAX_I = planckIntensity(GLOBAL_PEAK_NU, GLOBAL_MAX_KT);

// =============================================
// 頻率區域定義（約略對應真實電磁波段）
// =============================================
const REGIONS = [
  {
    key: 'ir',
    label: '紅外線區', storyLabel: '便宜扭蛋',
    start: 0,    end: 0.14, // 0 到 7 (7/50 = 0.14)
    color: 'rgba(255, 80, 50, 0.07)',
    textColor: 'rgba(255, 120, 80, 0.6)',
  },
  {
    key: 'vis',
    label: '可見光', storyLabel: '精緻公仔',
    start: 0.14, end: 0.24, // 7 到 12 (12/50 = 0.24)
    color: 'rgba(80, 220, 100, 0.07)',
    textColor: 'rgba(80, 220, 100, 0.6)',
  },
  {
    key: 'uv',
    label: '紫外線區', storyLabel: '天價限量',
    start: 0.24, end: 1, // 12 以上
    color: 'rgba(160, 80, 255, 0.07)',
    textColor: 'rgba(160, 80, 255, 0.6)',
  },
];

// =============================================
// 主元件
// =============================================
const BlackbodyAnimation = () => {
  const [temperature, setTemperature] = useState(5000);
  const [mode, setMode] = useState('story');
  const canvasRef = useRef(null);

  const kT = K * (temperature / 1000);
  const peakNu = wienPeakNu(kT);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H_canvas = canvas.height;
    const m = { top: 50, right: 30, bottom: 58, left: 68 };
    const plotW = W - m.left - m.right;
    const plotH = H_canvas - m.top - m.bottom;

    // 座標轉換
    const getX = (nu) => m.left + (nu / MAX_FREQ) * plotW;
    const getY = (i)  => m.top + plotH - (i / GLOBAL_MAX_I) * plotH * 0.88;

    ctx.clearRect(0, 0, W, H_canvas);

    // ------------------------------------------
    // 1. 背景頻率區域色帶
    // ------------------------------------------
    REGIONS.forEach(({ start, end, color, label, storyLabel, textColor }) => {
      const x1 = getX(start * MAX_FREQ);
      const x2 = getX(end * MAX_FREQ);
      ctx.fillStyle = color;
      ctx.fillRect(x1, m.top, x2 - x1, plotH);

      // 區域標籤（頂部）
      ctx.fillStyle = textColor;
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        mode === 'story' ? storyLabel : label,
        (x1 + x2) / 2,
        m.top + 16
      );
    });

    // ------------------------------------------
    // 2. 坐標軸
    // ------------------------------------------
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.left, m.top - 15);
    ctx.lineTo(m.left, m.top + plotH);
    ctx.lineTo(W - m.right + 15, m.top + plotH);
    ctx.stroke();

    // 箭頭
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.moveTo(W - m.right + 15, m.top + plotH);
    ctx.lineTo(W - m.right + 5,  m.top + plotH - 5);
    ctx.lineTo(W - m.right + 5,  m.top + plotH + 5);
    ctx.fill();

    // 軸標籤
    ctx.fillStyle = '#9ca3af';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      mode === 'story' ? '頻率 ν（扭蛋等級：便宜 → 天價）' : '電磁波頻率 ν',
      W / 2, H_canvas - 10
    );
    ctx.save();
    ctx.translate(16, H_canvas / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(
      mode === 'story' ? '各區總輻射強度（營業額）' : '輻射能量密度 I(ν)',
      0, 0
    );
    ctx.restore();

    // ------------------------------------------
    // 3. Rayleigh-Jeans 古典曲線（灰色虛線）
    // ------------------------------------------
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(180, 180, 180, 0.65)';
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 2.5;
    let rjStarted = false;
    for (let nu = 0.1; nu <= MAX_FREQ; nu += 0.2) {
      const intensity = rayleighJeansIntensity(nu, kT);
      const x = getX(nu);
      const y = getY(intensity);
      if (!rjStarted) { ctx.moveTo(x, y); rjStarted = true; }
      else ctx.lineTo(x, y);
      if (y < m.top - 5) break;
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 「紫外災難」標註
    const rjAnnotX = getX(MAX_FREQ * 0.19); // 50 * 0.19 = 9.5，維持與之前相同的視覺位置
    ctx.fillStyle = 'rgba(220, 150, 150, 0.85)';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      mode === 'story' ? '↑ 古典預測：無限暴衝！（紫外災難）' : '↑ Rayleigh-Jeans 發散（紫外災難）',
      rjAnnotX, m.top + 8
    );

    // ------------------------------------------
    // 4. 普朗克曲線（彩色漸層：紅→黃→紫）
    // ------------------------------------------
    const gradient = ctx.createLinearGradient(m.left, 0, m.left + plotW, 0);
    gradient.addColorStop(0,    '#ef4444');
    gradient.addColorStop(0.38, '#eab308');
    gradient.addColorStop(1,    '#a855f7');
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    let planckStarted = false;
    for (let nu = 0.05; nu <= MAX_FREQ; nu += 0.1) {
      const x = getX(nu);
      const y = getY(planckIntensity(nu, kT));
      if (!planckStarted) { ctx.moveTo(x, y); planckStarted = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // ------------------------------------------
    // 5. Wien 峰值標記（黃色虛線 + 圓點）
    // ------------------------------------------
    const peakX = getX(peakNu);
    const peakY = getY(planckIntensity(peakNu, kT));

    // 垂直虛線
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.moveTo(peakX, m.top + 22);
    ctx.lineTo(peakX, m.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // 峰值圓點
    ctx.beginPath();
    ctx.fillStyle = '#fbbf24';
    ctx.arc(peakX, peakY, 6, 0, Math.PI * 2);
    ctx.fill();

    // 峰值文字標籤（自動左右切換避免超出邊界）
    const labelOnRight = peakX < W * 0.6;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = labelOnRight ? 'left' : 'right';
    const lx = labelOnRight ? peakX + 9 : peakX - 9;
    ctx.fillText(
      mode === 'story' ? `峰值（T = ${temperature} K）` : `νmax ∝ T`,
      lx, peakY - 14
    );
    ctx.fillText(
      mode === 'story' ? '溫度↑ → 峰值右移' : 'Wien 位移定律',
      lx, peakY - 28
    );

    // ------------------------------------------
    // 6. 波茲曼壓制區：改為右側漸層遮罩 + 文字標註
    //    （不再用不同 Y 軸的曲線，避免混淆）
    // ------------------------------------------
    const suppressStart = getX(peakNu * 1.7);
    const suppressEnd   = m.left + plotW;
    const suppressGrad  = ctx.createLinearGradient(suppressStart, 0, suppressEnd, 0);
    suppressGrad.addColorStop(0, 'rgba(59, 130, 246, 0)');
    suppressGrad.addColorStop(1, 'rgba(59, 130, 246, 0.10)');
    ctx.fillStyle = suppressGrad;
    ctx.fillRect(suppressStart, m.top + 22, suppressEnd - suppressStart, plotH - 22);

    // 文字標註
    ctx.fillStyle = 'rgba(147, 197, 253, 0.75)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const annotX = (suppressStart + suppressEnd) / 2;
    const annotY = m.top + plotH * 0.45;
    ctx.fillText(
      mode === 'story' ? '量子門檻壓制' : 'e^(-hν/kT) → 0',
      annotX, annotY
    );
    ctx.fillText(
      mode === 'story' ? '（太貴，幾乎沒人買）' : '波茲曼因子抑制高頻激發',
      annotX, annotY + 16
    );

    // ------------------------------------------
    // 7. 圖例（左上角）
    // ------------------------------------------
    const items = mode === 'story'
      ? [
          { color: 'rgba(250,204,21,1)',   dash: false, label: '普朗克曲線（不找零，正確！）' },
          { color: 'rgba(180,180,180,0.9)', dash: true,  label: '古典預測（可切割 → 紫外災難）' },
        ]
      : [
          { color: 'rgba(250,204,21,1)',   dash: false, label: '普朗克輻射定律' },
          { color: 'rgba(180,180,180,0.9)', dash: true,  label: 'Rayleigh-Jeans（古典，發散）' },
        ];

    const lgX = m.left + 12;
    let lgY = m.top + 32;
    items.forEach(({ color, dash, label }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      if (dash) ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(lgX, lgY);
      ctx.lineTo(lgX + 22, lgY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(220,220,220,0.9)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(label, lgX + 30, lgY + 4);
      lgY += 22;
    });

    // 波茲曼圖例
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
    ctx.fillRect(lgX, lgY - 4, 22, 10);
    ctx.fillStyle = 'rgba(220,220,220,0.9)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      mode === 'story' ? '高頻量子壓制區（太貴沒人買）' : '波茲曼因子壓制區',
      lgX + 30, lgY + 4
    );

  }, [temperature, mode, kT, peakNu]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 min-h-screen text-white rounded-lg font-sans">
      {/* 標題列 */}
      <div className="w-full max-w-5xl flex flex-wrap justify-between items-end mb-4 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">
            {mode === 'story'
              ? '🎪 黑體園遊會：能量扭蛋機'
              : '🔭 黑體輻射光譜與普朗克定律'}
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            {mode === 'story'
              ? '熱能 = 零用錢（kT），光子能量 = 扭蛋價格（hν）'
              : '能量量子化 E = nhν，解決紫外災難'}
          </p>
        </div>

        {/* 模式切換 */}
        <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
          <button
            onClick={() => setMode('story')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
              mode === 'story'
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎪 故事模式
          </button>
          <button
            onClick={() => setMode('physics')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
              mode === 'physics'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🔭 物理模式
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-5xl">
        {/* 左側控制面板 */}
        <div className="w-full md:w-60 bg-gray-800 p-5 rounded-xl border border-gray-700 flex flex-col gap-4 shrink-0">
          <div>
            <h2 className="text-sm font-semibold mb-3 text-blue-300">
              {mode === 'story' ? '🌡️ 家長的慷慨度（溫度）' : '調整溫度 T'}
            </h2>
            <p className="text-sm mb-2">
              {mode === 'story' ? '平均零用錢：' : '目前溫度：'}
              <span className="text-xl font-bold text-red-400 ml-1">{temperature} K</span>
            </p>
            <input
              type="range"
              min="3000" max="10000" step="100"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{mode === 'story' ? '低溫（零用錢少）' : '3000 K'}</span>
              <span>{mode === 'story' ? '高溫（零用錢多）' : '10000 K'}</span>
            </div>
          </div>

          {/* 概念對照 */}
          <div className="text-xs bg-gray-900 p-3 rounded-lg border border-gray-700 space-y-2">
            <h3 className="font-bold text-yellow-500 border-b border-gray-700 pb-1 mb-2 text-sm">
              {mode === 'story' ? '🎯 園遊會對照' : '📐 物理概念'}
            </h3>
            {mode === 'story' ? (
              <>
                <p>🌡️ <span className="text-gray-400">kT：</span>平均零用錢，溫度越高越多</p>
                <p>⚠️ <span className="text-gray-400">古典失敗：</span>以為能量可無限切碎，高頻暴衝</p>
                <p>💙 <span className="text-blue-300">藍色區域：</span>高頻太貴，幾乎沒人買得起</p>
                <p>✨ <span className="text-yellow-400">普朗克：</span>不找零！一包一包交換，壓制高頻</p>
                <p>🟡 <span className="text-yellow-300">黃點：</span>峰值頻率，溫度高就往右移</p>
              </>
            ) : (
              <>
                <p>🌡️ <span className="text-gray-400">kT：</span>決定波茲曼分布的特徵能量</p>
                <p>⚠️ <span className="text-gray-400">古典失敗：</span>Rayleigh-Jeans 在高頻發散</p>
                <p>💙 <span className="text-blue-300">藍色區域：</span>e^(-hν/kT)→0，高頻模式難以激發</p>
                <p>✨ <span className="text-yellow-400">量子修正：</span>E=nhν 離散化能量，解決發散</p>
                <p>🟡 <span className="text-yellow-300">νmax：</span>Wien 位移定律，νmax ∝ T</p>
              </>
            )}
          </div>
        </div>

        {/* 右側 Canvas */}
        <div className="flex-1 bg-black p-3 rounded-xl border border-gray-700 shadow-2xl min-w-0">
          <canvas
            ref={canvasRef}
            width={650}
            height={420}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default BlackbodyAnimation;
