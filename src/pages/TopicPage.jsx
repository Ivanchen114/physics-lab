import { useState } from 'react'
import ComicViewer from '../components/ComicViewer'

export default function TopicPage({ topic, onBack }) {
  const [tab, setTab] = useState('comic') // 'comic' | 'sim'
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
      <div className="bg-gradient-to-r from-gray-900 to-indigo-950/40 px-5 py-5 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black text-white mb-0.5">{title}</h1>
          <p className="text-indigo-300 text-sm mb-2">{subtitle}</p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{description}</p>
        </div>
      </div>

      {/* Tab 切換（漫畫 / 模擬） */}
      <div className="flex border-b border-gray-800 bg-gray-900">
        <TabBtn active={tab === 'comic'} onClick={() => setTab('comic')}>
          🖼 漫畫說明
        </TabBtn>
        <TabBtn active={tab === 'sim'} onClick={() => setTab('sim')}>
          🎮 互動模擬
        </TabBtn>
      </div>

      {/* 內容區 */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
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
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-semibold transition-colors
        ${active
          ? 'text-indigo-300 border-b-2 border-indigo-400 bg-gray-900'
          : 'text-gray-500 hover:text-gray-300'
        }`}
    >
      {children}
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
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center text-gray-500">
      互動模擬開發中…
    </div>
  )
}
