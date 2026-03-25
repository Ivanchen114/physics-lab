import topics from '../topicsConfig'

export default function HomePage({ onSelectTopic }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── 頂部學校標識帶 ────────────────────────── */}
      <div className="bg-gray-950 border-b border-gray-800 px-6 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="bg-white rounded-full p-0.5 flex-shrink-0">
            <img
              src="./songshan-logo.svg"
              alt="松山高中校徽"
              className="h-6 w-auto"
            />
          </div>
          <span className="text-gray-400 text-sm tracking-wide">
            臺北市立松山高級中學
          </span>
        </div>
      </div>

      {/* ── Hero 標題區 ───────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 py-16 px-6 text-center">
        {/* 裝飾背景圓 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* 學校徽章 */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm
                          border border-white/20 rounded-full px-5 py-2 mb-7">
            <div className="bg-white rounded-full p-0.5 flex-shrink-0">
              <img
                src="./songshan-logo.svg"
                alt="松山高中校徽"
                className="h-4 w-auto"
              />
            </div>
            <span className="text-indigo-200 text-sm font-semibold tracking-widest">
              松山高中
            </span>
          </div>

          {/* 主標題 */}
          <p className="text-5xl mb-4">🔬</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            物理漫遊實驗室
          </h1>
          <p className="text-base text-indigo-300 font-medium mb-1 tracking-widest">
            Physics Exploration Lab
          </p>
          <p className="text-gray-400 mt-4 text-base max-w-xl mx-auto leading-relaxed">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} onClick={() => onSelectTopic(topic)} />
          ))}

          {/* 即將推出佔位卡 */}
          <ComingSoonCard />
        </div>
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 左：學校資訊 */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1 flex-shrink-0">
              <img
                src="./songshan-logo.svg"
                alt="松山高中校徽"
                className="h-8 w-auto"
              />
            </div>
            <div className="text-left">
              <p className="text-gray-300 text-sm font-semibold">臺北市立松山高級中學</p>
              <p className="text-gray-500 text-xs mt-0.5">物理漫遊實驗室 · Physics Exploration Lab</p>
            </div>
          </div>
          {/* 右：製作資訊 */}
          <p className="text-gray-600 text-xs text-center sm:text-right leading-relaxed">
            漫畫由 Gemini 生成<br className="hidden sm:block" /> 模擬由 Claude 開發
          </p>
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
      className="group text-left bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
                 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-900/30
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {/* 預覽圖（第一張漫畫） */}
      <div className="relative h-36 overflow-hidden bg-gray-800">
        {comics?.[0] && (
          <img
            src={comics[0].file}
            alt={title}
            className="w-full h-full object-cover object-top
                       group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {/* emoji 標籤 */}
        <div className="absolute top-2 left-2 text-2xl">{emoji}</div>
        {/* 標籤 */}
        <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white ${tagColor}`}>
          {tag}
        </span>
      </div>

      {/* 文字內容 */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mb-2">{subtitle}</p>
        <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">{description}</p>

        {/* 漫畫格數標示 */}
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
          <span>🖼</span>
          <span>{comics?.length || 0} 格漫畫</span>
          <span className="mx-1">·</span>
          <span>🎮 互動模擬</span>
        </div>
      </div>
    </button>
  )
}

// ── 即將推出佔位 ────────────────────────────────
function ComingSoonCard() {
  return (
    <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-2xl p-6
                    flex flex-col items-center justify-center text-center min-h-[200px]">
      <p className="text-3xl mb-3">✨</p>
      <p className="text-gray-400 font-medium">更多主題即將推出</p>
      <p className="text-gray-600 text-sm mt-1">光電效應、都卜勒效應…</p>
    </div>
  )
}
