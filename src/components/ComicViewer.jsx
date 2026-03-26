import { useState, useRef, useCallback, useEffect } from 'react'

export default function ComicViewer({ comics = [] }) {
  const [current, setCurrent] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)  // CSS 假全螢幕，手機通用
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : true
  )

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

  // 開啟全螢幕時鎖定背景捲動
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isExpanded])

  // ESC 鍵關閉
  useEffect(() => {
    const onKey = (e) => {
      if (!isExpanded) return
      if (e.key === 'Escape') setIsExpanded(false)
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded, current])  // eslint-disable-line

  // 觸控滑動
  const touchStartX = useRef(null)
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? goNext() : goPrev()
    touchStartX.current = null
  }

  const goPrev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const goNext = useCallback(() => setCurrent(c => Math.min(comics.length - 1, c + 1)), [comics.length])

  if (!comics.length) return null
  const comic = comics[current]

  // ── 放大疊層（CSS fixed，手機 & 桌機通用）──
  const Overlay = () => (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 漫畫圖片：自動填滿可視區域 */}
      <img
        src={comic.file}
        alt={comic.title}
        className="max-w-full max-h-full object-contain select-none"
        draggable={false}
        style={{ maxHeight: '100dvh', maxWidth: '100dvw' }}
      />

      {/* 左右箭頭 */}
      {current > 0 && (
        <button
          onClick={goPrev}
          className="fixed left-3 top-1/2 -translate-y-1/2
                     bg-black/60 hover:bg-black/80 text-white rounded-full
                     w-12 h-12 text-2xl flex items-center justify-center z-10
                     transition-colors shadow-xl"
        >‹</button>
      )}
      {current < comics.length - 1 && (
        <button
          onClick={goNext}
          className="fixed right-3 top-1/2 -translate-y-1/2
                     bg-black/60 hover:bg-black/80 text-white rounded-full
                     w-12 h-12 text-2xl flex items-center justify-center z-10
                     transition-colors shadow-xl"
        >›</button>
      )}

      {/* 關閉按鈕 */}
      <button
        onClick={() => setIsExpanded(false)}
        className="fixed top-4 right-4 bg-black/70 hover:bg-gray-800
                   text-white rounded-lg px-3 py-2 text-sm z-10 transition-colors"
      >
        ✕ 關閉
      </button>

      {/* 頁數 */}
      <div className="fixed top-4 left-4 bg-black/60 text-gray-300 text-xs
                      rounded-lg px-3 py-2 z-10">
        {current + 1} / {comics.length}
      </div>

      {/* 橫轉提示（直立模式才顯示） */}
      {isPortrait && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2
                        bg-black/70 text-gray-400 text-xs rounded-full
                        px-4 py-2 z-10 flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-base">↻</span>
          橫轉手機，圖片更大
        </div>
      )}

      {/* 操作提示（橫向 / 桌機） */}
      {!isPortrait && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2
                        text-gray-600 text-xs z-10">
          ← → 切換 · ESC 關閉
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* 全螢幕疊層 */}
      {isExpanded && <Overlay />}

      <div className="comic-viewer flex flex-col gap-3">
        {/* 主圖區 */}
        <div
          className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={comic.file}
            alt={comic.title}
            className="w-full object-contain max-h-[52vh] md:max-h-[60vh]"
            draggable={false}
          />

          {/* 左右箭頭（圖上） */}
          {current > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2
                         bg-gray-900/80 hover:bg-gray-700 text-white rounded-full
                         w-10 h-10 flex items-center justify-center text-xl
                         transition-colors shadow-lg"
            >‹</button>
          )}
          {current < comics.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         bg-gray-900/80 hover:bg-gray-700 text-white rounded-full
                         w-10 h-10 flex items-center justify-center text-xl
                         transition-colors shadow-lg"
            >›</button>
          )}

          {/* 全螢幕按鈕 */}
          <button
            onClick={() => setIsExpanded(true)}
            className="absolute top-2 right-2 bg-gray-900/75 hover:bg-gray-700
                       text-gray-300 hover:text-white rounded-lg px-2 py-1
                       text-xs transition-colors z-20 flex items-center gap-1"
          >
            <span className="text-sm">⛶</span>
            {isPortrait ? '放大' : '全螢幕'}
          </button>
        </div>

        {/* 幕次標題 + 頁數 */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-medium text-gray-300 leading-snug">{comic.title}</p>
          <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{current + 1} / {comics.length}</p>
        </div>

        {/* 縮圖導覽 */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {comics.map((c, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all
                ${i === current
                  ? 'border-indigo-400 opacity-100 scale-105'
                  : 'border-transparent opacity-40 hover:opacity-70'
                }`}
            >
              <img src={c.file} alt={c.title} className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </div>

        {/* 上一幕 / 下一幕 */}
        <div className="flex gap-2">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="flex-1 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >← 上一幕</button>
          <button
            onClick={goNext}
            disabled={current === comics.length - 1}
            className="flex-1 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >下一幕 →</button>
        </div>
      </div>
    </>
  )
}
