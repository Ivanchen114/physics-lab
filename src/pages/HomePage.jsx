import topics from '../topicsConfig'

export default function HomePage({ onSelectTopic }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── 頂部學校標識帶 ────────────────────────── */}
      <div className="bg-gray-950/80 backdrop-blur-md border-b border-white/5 px-6 py-2.5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="p-1 rounded-lg transition-colors group-hover:bg-white/5">
              <img
                src="./songshan-logo.svg"
                alt="松山高中校徽"
                className="h-7 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <span className="text-gray-400 text-xs font-medium tracking-widest uppercase hidden sm:block">
              Taipei Municipal Songshan High School
            </span>
          </div>
          <div className="text-gray-500 text-[10px] font-bold tracking-tighter uppercase opacity-50">
            Est. 1958
          </div>
        </div>
      </div>

      {/* ── Hero 標題區 ───────────────────────────── */}
      <header className="relative overflow-hidden bg-[#0a0a0f] py-20 px-6 text-center border-b border-white/5">
        {/* 動態背景與光暈 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-40 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2 mb-4">
             <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
               物理漫遊<span className="text-indigo-400">實驗室</span>
             </h1>
          </div>
          
          <p className="text-lg text-indigo-300/80 font-light tracking-[0.4em] mb-10 uppercase">
            Physics Exploration Lab
          </p>
          
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            用漫畫和互動模擬，讓抽象的物理概念變得直觀好懂。<br />
            選擇一個主題，開始你的物理漫遊！
          </p>
        </div>
      </header>

      {/* ── 主題卡片牆 ───────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
          探索主題 · {topics.length} 個單元
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} onClick={() => onSelectTopic(topic)} />
          ))}

          {/* 即將推出佔位卡 */}
          <ComingSoonCard />
        </div>
      </main>

      {/* ── Production Credits Section ───────────────────── */}
      <section className="relative bg-[#05050A] border-t border-gray-800 py-20 px-6 overflow-hidden">
        {/* 背景光暈 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-32 bg-indigo-600/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-indigo-500 tracking-[0.3em] uppercase mb-2">
              Production Workflow
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              一個 AI 協作的科普教學實驗
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
            <CreditNode 
              step="01"
              role="Ivan · 艾文" 
              tasks="決定主題、策劃架構、最終審核與專案發佈" 
              icon="👨‍🏫"
              color="from-blue-500 to-cyan-400"
            />
            <CreditNode 
              step="02"
              role="NotebookLM" 
              tasks="將龐雜的文本與解說音檔，萃取為結構化切段腳本" 
              icon="📓"
              color="from-emerald-500 to-teal-400"
            />
            <CreditNode 
              step="03"
              role="GPTs" 
              tasks="導入《視覺規範》，將腳本精煉為 Gemini 專用提示詞" 
              icon="⚙️"
              color="from-amber-500 to-orange-400"
            />
            <CreditNode 
              step="04"
              role="Gemini" 
              tasks="依據分鏡提示詞，生成高品質日系風格漫畫原畫" 
              icon="🎨"
              color="from-purple-500 to-pink-400"
            />
            <CreditNode 
              step="05"
              role="Claude" 
              tasks="開發前台網頁、刻畫互動模擬器，與建置自動化腳本" 
              icon="💻"
              color="from-indigo-500 to-blue-400"
            />
          </div>
        </div>
      </section>

      {/* ── Final Footer ────────────────────────── */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-1.5 flex-shrink-0">
              <img
                src="./songshan-logo.svg"
                alt="松山高中校徽"
                className="h-9 w-auto"
              />
            </div>
            <div className="text-left">
              <p className="text-gray-200 text-sm font-bold tracking-wide">臺北市立松山高級中學</p>
              <p className="text-gray-500 text-xs mt-0.5">物理漫遊實驗室 · Physics Exploration Lab</p>
            </div>
          </div>
          
          <div className="text-gray-500 text-xs text-center sm:text-right">
            <p>© 2026 臺北市立松山高級中學 物理科</p>
            <p className="mt-1">Powered by Claude, Gemini & GPTs</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

// ── 主題卡片 ──────────────────────────────────
function TopicCard({ topic, onClick }) {
  const { title, subtitle, emoji, tag, tagColor, description, comics } = topic

  return (
    <button
      onClick={onClick}
      className="group text-left bg-gray-900/50 border border-white/5 rounded-xl overflow-hidden
                 hover:border-indigo-500/50 hover:bg-gray-800/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)]
                 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
    >
      {/* 預覽圖 (加上微光遮罩) */}
      <div className="relative aspect-square overflow-hidden bg-gray-950">
        <img
          src={topic.cover || (comics?.[0]?.file || '')}
          alt={title}
          className="w-full h-full object-cover object-top opacity-80
                     group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
        
        {/* emoji 標籤 */}
        <div className="absolute top-3 left-3 text-2xl filter drop-shadow-md group-hover:scale-110 transition-transform">{emoji}</div>
        
        {/* 標籤 */}
        <span className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white ${tagColor} shadow-lg shadow-black/20`}>
          {tag}
        </span>
      </div>

      {/* 文字內容 */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-indigo-400 font-bold tracking-[0.2em] uppercase mt-0.5">{subtitle}</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium mt-4">{description}</p>

        {/* 漫畫格數標示 */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span>🖼 {comics?.length || 0} PANELS</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-400/50 group-hover:text-indigo-400 transition-colors">
            <span>PLAY SIMULATION</span>
            <span className="text-sm">→</span>
          </div>
        </div>
      </div>
    </button>
  )
}

// ── 流程節點卡片 ────────────────────────────────
function CreditNode({ step, role, tasks, icon, color }) {
  return (
    <div className="relative group">
      {/* 步驟數字標記 */}
      <div className="absolute -top-3 left-4 bg-[#05050A] px-2 text-[10px] font-black tracking-widest text-gray-600 group-hover:text-gray-300 z-10 transition-colors">
        STEP {step}
      </div>
      
      {/* 卡片本體 */}
      <div className="relative h-full bg-gray-900/40 border border-white/5 rounded-xl p-6 pt-8 
                      hover:bg-gray-800/50 transition-all duration-300
                      hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]
                      flex flex-col">
        {/* 頂部漸層光暈邊界 (隱藏於預設狀態，hover 時顯示) */}
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl`} />
        
        <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{icon}</div>
        <h3 className="text-white font-bold text-sm mb-2">{role}</h3>
        <p className="text-gray-400 text-xs leading-relaxed font-light mt-auto">{tasks}</p>
      </div>
    </div>
  )
}

// ── 即將推出佔位 ────────────────────────────────
function ComingSoonCard() {
  return (
    <div className="bg-gray-950/30 border border-dashed border-white/10 rounded-xl p-6
                    flex flex-col items-center justify-center text-center min-h-[250px]
                    hover:border-white/20 transition-colors">
      <p className="text-3xl mb-4 opacity-50">✨</p>
      <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">More Topics Coming Soon</p>
      <p className="text-gray-700 text-[10px] mt-2 tracking-widest">都卜勒效應、狹義相對論…</p>
    </div>
  )
}
