import { useState, useEffect } from 'react'
import ComicViewer from '../components/ComicViewer'
import topics from '../topicsConfig'

export default function TopicPage({ topic, onBack, onSelectTopic }) {
  const [tab, setTab] = useState('comic') // 'comic' | 'sim'
  
  // 讓元件在每次切換 Topic 時重新重置 tab 和滾動到頂部
  useEffect(() => {
    setTab('comic')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [topic])
  const { title, subtitle, emoji, tag, tagColor, description, comics, Simulation } = topic

  return (
    <div className="min-h-screen flex flex-col">
      {/* 頂部導航 */}
      <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
        >
          ← 返回
        </button>
        <div className="h-4 w-px bg-gray-700" />
        <span className="text-white font-bold">{emoji} {title}</span>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white ${tagColor}`}>
          {tag}
        </span>
      </nav>

      {/* 主題說明 */}
      <div className="relative border-b border-gray-800 bg-gray-900">
        {topic.cover ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src={topic.cover} 
              alt={title} 
              className="w-full h-full object-cover opacity-35 mix-blend-screen" 
              style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-900 to-indigo-950/40" />
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-5 py-8 md:py-12">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">{title}</h1>
          <p className="text-indigo-300 text-base mb-3 font-medium drop-shadow">{subtitle}</p>
          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl drop-shadow">{description}</p>
        </div>
      </div>

      {/* Tab 切換（漫畫 / 模擬） */}
      <div className="flex border-b border-gray-800 bg-gray-900 relative">
        <TabBtn active={tab === 'comic'} onClick={() => setTab('comic')}>
          🖼 漫畫說明
        </TabBtn>
        <TabBtn active={tab === 'sim'} onClick={() => setTab('sim')}>
          🎮 互動模擬
        </TabBtn>
      </div>

      {/* 內容區 - 加入進場特效 */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 animate-fade-in-up-delay-1">
        {tab === 'comic' && (
          <Section title="📖 漫畫說明">
            <ComicViewer comics={comics} />
          </Section>
        )}
        {tab === 'sim' && (
          <Section title="🎮 互動模擬">
            {Simulation ? <Simulation /> : <NoSim />}
          </Section>
        )}
      </div>

      {/* ── Binge-reading 追劇推播卡（下一集）── */}
      <NextTopicCard currentTopic={topic} onSelectTopic={onSelectTopic} />
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-1 py-4 text-sm font-semibold transition-all duration-300
        ${active ? 'text-indigo-300' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {children}
      {/* 底部平滑過渡的活動指示線 */}
      <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 transition-transform duration-300 ${active ? 'scale-x-100 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'scale-x-0'}`} />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  )
}

function NoSim() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center text-gray-500 animate-fade-in-up">
      互動模擬開發中…
    </div>
  )
}

// ── 下一集追劇推播卡 ────────────────────────────
function NextTopicCard({ currentTopic, onSelectTopic }) {
  const currentIndex = topics.findIndex(t => t.id === currentTopic.id)
  const nextTopic = topics[currentIndex + 1]

  if (!nextTopic) {
    // 已經是最後一集
    return (
      <div className="max-w-5xl mx-auto w-full px-4 pt-12 pb-24 text-center animate-fade-in-up-delay-2">
        <h3 className="text-gray-500 font-bold tracking-widest text-sm mb-4 uppercase">You have reached the end</h3>
        <button 
          onClick={() => onSelectTopic(null)}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-semibold transition-colors border border-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          ← 返回首頁 (Back to Lab)
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 pt-16 pb-24 animate-fade-in-up-delay-2">
      <h2 className="text-xs font-black text-indigo-500 tracking-[0.3em] uppercase mb-4 text-center">
        Next Episode · 下一課
      </h2>
      <button
        onClick={() => onSelectTopic(nextTopic)}
        className="group relative w-full rounded-2xl overflow-hidden border border-white/10 text-left hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.2)]"
      >
        <div className="absolute inset-0 z-0 bg-gray-950">
          <img 
            src={nextTopic.cover || (nextTopic.comics?.[0]?.file)} 
            alt={nextTopic.title}
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{nextTopic.emoji}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full text-white ${nextTopic.tagColor} opacity-90`}>
                {nextTopic.tag}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-indigo-200 transition-colors drop-shadow-md mb-2">
              {nextTopic.title}
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-light max-w-xl group-hover:text-gray-300 transition-colors">
              {nextTopic.subtitle}
            </p>
          </div>
          
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors border border-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 translate-x-0.5 group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  )
}
