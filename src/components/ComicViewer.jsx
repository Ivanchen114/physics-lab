import { useState, useRef, useCallback } from 'react'

export default function ComicViewer({ comics = [] }) {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 觸控滑動支援
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

  // 鍵盤操作
  const handleKey = useCallback((e) => {
    if (e.key === 'ArrowLeft')  goPrev()
    if (e.key === 'ArrowRight') goNext()
    if (e.key === 'Escape')     setIsFullscreen(false)
  }, [goPrev, goNext])

  if (!comics.length) return null
  const comic = comics[current]

  return (
    <div className="comic-viewer flex flex-col gap-3">
      {/* 主圖區 */}
      <div
        className={`relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800
          ${isFullscreen
            ? 'fixed inset-0 z-50 rounded-none bg-black flex items-center justify-center'
            : ''
          }`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={handleKey}
        tabIndex={0}
      >
        {/* 漫畫圖片 */}
        <img
          src={comic.file}
          alt={comic.title}
          className={`w-full object-contain transition-opacity duration-200
            ${isFullscreen ? 'max-h-screen max-w-full' : 'max-h-[55vh] md:max-h-[60vh]'}`}
          draggable={false}
        />

        {/* 左右箭頭（圖片上方覆蓋） */}
        {current > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2
                       bg-gray-900/80 hover:bg-gray-700 text-white rounded-full
                       w-10 h-10 flex items-center justify-center text-lg
                       transition-colors shadow-lg"
            aria-label="上一張"
          >
            ‹
          </button>
        )}
        {current < comics.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       bg-gray-900/80 hover:bg-gray-700 text-white rounded-full
                       w-10 h-10 flex items-center justify-center text-lg
                       transition-colors shadow-lg"
            aria-label="下一張"
          >
            ›
          </button>
        )}

        {/* 全螢幕按鈕 */}
        <button
          onClick={() => setIsFullscreen(f => !f)}
          className="absolute top-2 right-2 bg-gray-900/70 hover:bg-gray-700
                     text-gray-300 hover:text-white rounded-lg px-2 py-1
                     text-xs transition-colors"
        >
          {isFullscreen ? '✕ 關閉' : '⛶ 全螢幕'}
        </button>

        {/* 投影機模式提示（全螢幕時顯示） */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-500 text-xs">
            ← → 切換 · ESC 關閉
          </div>
        )}
      </div>

      {/* 幕次標題 + 頁數 */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-medium text-gray-300">{comic.title}</p>
        <p className="text-xs text-gray-500">{current + 1} / {comics.length}</p>
      </div>

      {/* 底部縮圖導覽 */}
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

      {/* 上一頁 / 下一頁 文字按鈕 */}
      <div className="flex gap-2">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="flex-1 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← 上一幕
        </button>
        <button
          onClick={goNext}
          disabled={current === comics.length - 1}
          className="flex-1 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          下一幕 →
        </button>
      </div>
    </div>
  )
}
