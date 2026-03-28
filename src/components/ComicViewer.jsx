import { useState, useRef, useCallback, useEffect } from 'react'

export default function ComicViewer({ comics = [] }) {
  const [current, setCurrent] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : true
  )

  const scrollRef = useRef(null)
  const itemRefs = useRef([])

  // 偵測螢幕方向
  useEffect(() => {
    const update = () => setIsPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  // 捲動同步頁碼 (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'))
            setCurrent(index)
          }
        })
      },
      {
        root: scrollRef.current,
        threshold: 0.5, // 過半時切換頁碼
      }
    )

    const items = itemRefs.current
    items.forEach((item) => item && observer.observe(item))

    return () => {
      items.forEach((item) => item && observer.unobserve(item))
    }
  }, [comics.length, isExpanded]) // 重新渲染時需重新綁定

  // 禁止背景捲動 (全螢幕時)
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isExpanded])

  // 按鍵導航
  useEffect(() => {
    const onKey = (e) => {
      if (!isExpanded) return
      if (e.key === 'Escape') setIsExpanded(false)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded, current]) // eslint-disable-line

  const scrollTo = (index) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const goPrev = useCallback(() => {
    const nextIdx = Math.max(0, current - 1)
    scrollTo(nextIdx)
  }, [current])

  const goNext = useCallback(() => {
    const nextIdx = Math.min(comics.length - 1, current + 1)
    scrollTo(nextIdx)
  }, [current, comics.length])

  if (!comics.length) return null

  // ── 放大疊層（全螢幕垂直捲動版）──
  const Overlay = () => (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* 頂部控制欄 */}
      <div className="absolute top-0 inset-x-0 h-14 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 z-30">
        <div className="text-gray-300 text-sm font-medium">
          {current + 1} / {comics.length} · {comics[current]?.title}
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-sm transition-colors"
        >
          ✕ 關閉
        </button>
      </div>

      {/* 垂直捲動容器 */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden pt-14 pb-20 scroll-smooth"
      >
        {comics.map((c, i) => (
          <div
            key={i}
            data-index={i}
            ref={el => itemRefs.current[i] = el}
            className="w-full flex justify-center"
          >
            <img
              src={c.file}
              alt={c.title}
              className="max-w-full h-auto block select-none"
              style={{ minHeight: '30vh' }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* 橫轉提示（全螢幕直立模式顯示） */}
      {isPortrait && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2
                        bg-white/10 backdrop-blur-md text-white/80 text-[10px] rounded-full
                        px-4 py-1.5 z-30 flex items-center gap-1.5">
          <span>↻</span> 橫轉手機，體驗更好
        </div>
      )}
    </div>
  )

  return (
    <>
      {isExpanded && <Overlay />}

      <div className="comic-viewer flex flex-col gap-4">
        {/* 主捲動區域 */}
        <div className="relative group">
          <div
            ref={scrollRef}
            className="relative bg-gray-950 rounded-xl overflow-y-auto max-h-[70vh] border border-white/5 scroll-smooth custom-scrollbar"
            style={{ scrollSnapType: 'y proximity' }}
          >
            <div className="flex flex-col">
              {comics.map((c, i) => (
                <div
                  key={i}
                  data-index={i}
                  ref={el => itemRefs.current[i] = el}
                  className="w-full flex flex-col items-center bg-gray-900"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <img
                    src={c.file}
                    alt={c.title}
                    className="w-full h-auto block"
                    loading={i < 2 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 右上角浮動頁碼 */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white/90 text-[10px] px-2.5 py-1 rounded-full border border-white/10 pointer-events-none">
            {current + 1} / {comics.length}
          </div>

          {/* 全螢幕按鈕 (懸浮器) */}
          <button
            onClick={() => setIsExpanded(true)}
            className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 bg-black/60 hover:bg-black/80
                       text-white rounded-lg px-2.5 py-1 text-[10px] transition-all duration-300 flex items-center gap-1.5"
          >
            <span className="text-base leading-none">⛶</span>
            進入無縫檢視
          </button>
        </div>

        {/* 幕次標題 */}
        <div className="flex flex-col px-1">
          <h3 className="text-base font-bold text-white tracking-tight">{comics[current]?.title}</h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1 opacity-80 italic">提示：向上滑動觀看下一幕</p>
        </div>

        {/* 縮圖導覽 (點擊跳轉) */}
        <div className="flex gap-2.5 overflow-x-auto py-1 px-1 no-scrollbar">
          {comics.map((c, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300
                ${i === current
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-105'
                  : 'border-white/5 opacity-40 hover:opacity-70 grayscale hover:grayscale-0'
                }`}
            >
              <img src={c.file} alt={c.title} className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </div>

        {/* 快速導航按鈕 (改為捲動) */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="flex-1 py-3 text-sm font-medium rounded-xl bg-gray-800/50 hover:bg-gray-700
                       disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/5 active:scale-95"
          >← 上一幕</button>
          <button
            onClick={goNext}
            disabled={current === comics.length - 1}
            className="flex-1 py-3 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500
                       disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-white"
          >下一幕 →</button>
        </div>
      </div>
    </>
  )
}
