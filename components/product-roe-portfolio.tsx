"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { portfolioBrands, portfolioItems, type PortfolioItem } from "@/lib/portfolio"

const perPage = 40

export function ProductRoePortfolio() {
  const [active, setActive] = useState("all")
  const [page, setPage] = useState(1)
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const bookShadowRef = useRef<HTMLDivElement>(null)
  const pointerTargetRef = useRef({ x: 0, y: 0 })
  const pointerCurrentRef = useRef({ x: 0, y: 0 })

  const filtered = active === "all" ? portfolioItems : portfolioItems.filter((item) => item.brand === active)
  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  function handleHeroPointerMove(event: React.MouseEvent<HTMLElement>) {
    const bounds = heroRef.current?.getBoundingClientRect()
    if (!bounds) return

    pointerTargetRef.current = {
      x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
      y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
    }

    const cur = pointerCurrentRef.current
    const target = pointerTargetRef.current
    cur.x += (target.x - cur.x) * 0.18
    cur.y += (target.y - cur.y) * 0.18

    if (bookRef.current) {
      bookRef.current.style.transform = `translate3d(${cur.x * 18}px, ${cur.y * 12}px, 0) rotateX(${cur.y * -10}deg) rotateY(${cur.x * 14}deg)`
    }

    if (bookShadowRef.current) {
      bookShadowRef.current.style.transform = `translateX(${cur.x * 10}px) scale(${1 - Math.abs(cur.y) * 0.08})`
      bookShadowRef.current.style.opacity = (0.22 + Math.abs(cur.x) * 0.08 + Math.abs(cur.y) * 0.06).toFixed(3)
    }
  }

  function handleHeroPointerLeave() {
    pointerTargetRef.current = { x: 0, y: 0 }
    pointerCurrentRef.current = { x: 0, y: 0 }

    if (bookRef.current) {
      bookRef.current.style.transform = "translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)"
    }

    if (bookShadowRef.current) {
      bookShadowRef.current.style.transform = "translateX(0) scale(1)"
      bookShadowRef.current.style.opacity = "0.22"
    }
  }

  function scrollToGrid() {
    mainRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(245,230,231,0.95)_42%,_rgba(244,234,228,1)_100%)] text-[#2c2c2c]">
      <nav className="z-30 border-b border-[#ead9cf]/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-[18px] md:px-12 lg:px-20">
          <div className="flex items-center gap-4">
            <a href="https://onroe.space/" className="text-xs font-bold uppercase tracking-[0.2em] text-[#a48777] transition-colors hover:text-[#2c2c2c]">
              ProductRoe
            </a>
            <span className="h-4 w-px bg-[#ead9cf]" />
            <span className="font-skin-serif text-[24px] tracking-[0] text-[#2c2c2c]">Portfolio</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#6d5c58]">
            <a href="https://onroe.space/" className="rounded-full bg-[linear-gradient(135deg,#c89f92,#b98677)] px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_14px_28px_rgba(185,134,119,0.20)] transition-opacity hover:opacity-95">
              돌아가기
            </a>
          </div>
        </div>
      </nav>

      <section
        ref={heroRef}
        className="relative mx-auto max-w-5xl overflow-hidden px-6 pb-12 pt-0 md:px-12 lg:px-20"
        onMouseMove={handleHeroPointerMove}
        onMouseLeave={handleHeroPointerLeave}
      >
        <div className="absolute -right-12 -top-24 -z-10 h-64 w-64 rounded-full bg-[#e9d4cf]/60 blur-3xl" />
        <div className="flex items-center justify-between gap-8">
          <div className="min-w-0 flex-1">
            <div className="mb-3 mt-[10px] flex items-center gap-4">
              <span className="rounded-full border border-[#ead9cf] bg-[#f7ede7] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#9b7b68]">
                AI Product Visual
              </span>
            </div>
            <h1 className="font-skin-serif text-4xl leading-tight tracking-[0] text-[#2c2c2c] md:text-5xl">
              PRODUCT ROE
              <br />
              <span className="bg-gradient-to-r from-[#b98677] to-[#8f695d] bg-clip-text text-transparent">PORTFOLIO</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#6d5c58]">
              모든 이미지는 실제 브랜드 제품을 AI 합성한 샘플이며,
              <br />
              제품의 저작권은 해당 브랜드에 있습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Stat num={String(portfolioBrands.length)} label="Brands" />
              <Stat num={String(portfolioItems.length)} label="Images" />
            </div>
          </div>

          <div className="pointer-events-none mt-[45px] hidden flex-shrink-0 select-none md:block">
            <div className="book-float relative flex h-56 w-56 items-center justify-center lg:h-64 lg:w-64">
              <div
                ref={bookShadowRef}
                className="absolute left-1/2 top-[72%] h-10 w-28 -translate-x-1/2 rounded-full bg-[#b98677]/20 blur-2xl"
                style={{ willChange: "transform, opacity" }}
              />
              <div ref={bookRef} className="relative flex h-full w-full items-center justify-center" style={{ willChange: "transform" }}>
                <Image
                  src="/images/logo.png"
                  alt="Studio Roe logo"
                  fill
                  className="object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.12)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="z-20 border-b border-[#ead9cf]/80 bg-[#fbf4f0]/92 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
          <div className="flex flex-wrap items-center gap-1 py-3">
            {[{ id: "all", label: "ALL" }, ...portfolioBrands].map((brand) => {
              const count = brand.id === "all" ? portfolioItems.length : portfolioItems.filter((item) => item.brand === brand.id).length
              const isActive = active === brand.id

              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => {
                    setActive(brand.id)
                    setPage(1)
                  }}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all ${
                    isActive ? "border-[#d9b8a6] bg-[#f4e3df] text-[#8f695d]" : "border-[#ead9cf] bg-white text-[#7b675d] hover:bg-[#fbf4f0] hover:text-[#5d4c47]"
                  }`}
                >
                  {brand.label}
                  <span className={`ml-1.5 text-[10px] ${isActive ? "opacity-60" : "opacity-40"}`}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <main ref={mainRef} className="mx-auto max-w-5xl px-6 py-10 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {paged.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightbox(item)}
              className="group relative block w-full overflow-hidden rounded-[24px] border border-[#ead9cf] bg-white/92 shadow-[0_16px_32px_rgba(124,98,81,0.08)] focus:outline-none"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={600}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#4a332d]/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="mb-1 inline-block w-fit rounded-full bg-[#b98677] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  {item.tag}
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/65">{item.brandLabel}</p>
                <p className="mt-0.5 text-xs font-semibold leading-tight text-white">{item.alt}</p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && <div className="py-32 text-center text-sm text-[#b7a59e]">No items</div>}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1">
            <PageButton disabled={page === 1} onClick={() => { setPage((value) => Math.max(1, value - 1)); scrollToGrid() }}>
              Prev
            </PageButton>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => {
              const isActive = pageNumber === page
              const show = pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 2
              const showDotsBefore = pageNumber === page - 3 && page - 3 > 1
              const showDotsAfter = pageNumber === page + 3 && page + 3 < totalPages

              if (!show && !showDotsBefore && !showDotsAfter) return null
              if (showDotsBefore || showDotsAfter) return <span key={`dots-${pageNumber}`} className="px-1 text-sm text-[#c8b7b0]">...</span>

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => {
                    setPage(pageNumber)
                    scrollToGrid()
                  }}
                  className={`min-w-[36px] rounded-full border px-3 py-2 text-xs font-bold transition-all ${
                    isActive ? "border-[#d9b8a6] bg-[#f4e3df] text-[#8f695d]" : "border-[#ead9cf] bg-white text-[#7b675d] hover:bg-[#fbf4f0]"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            })}

            <PageButton disabled={page === totalPages} onClick={() => { setPage((value) => Math.min(totalPages, value + 1)); scrollToGrid() }}>
              Next
            </PageButton>
          </div>
        )}
      </main>

      <section className="border-t border-[#ead9cf]/80 px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[34px] border border-[#ead9cf] bg-white/92 px-10 py-5 shadow-[0_20px_60px_rgba(124,98,81,0.08)] md:px-16 md:py-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-lg">
                <h2 className="font-skin-serif text-[24px] leading-tight text-[#2c2c2c] md:text-[30px]">
                  브랜드 비주얼, <span className="bg-gradient-to-r from-[#b98677] to-[#8f695d] bg-clip-text text-transparent">AI로 설계합니다.</span>
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[#6d5c58]">제품 단독 컷부터 모델 합성, 캠페인 비주얼까지</p>
              </div>
              <div className="md:flex-shrink-0">
                <a href="https://onroe.space/" className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#c89f92,#b98677)] px-8 py-4 text-sm font-bold text-white shadow-xl shadow-[#b98677]/20 transition-opacity hover:opacity-95">
                  의뢰서 작성하기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 pb-10 text-center md:px-12 lg:px-20">
        <p className="text-xs text-[#a28e86]">
          © 2026{" "}
          <a href="mailto:onroeway@gmail.com" className="transition-colors hover:text-[#5d4c47]">
            ONROE
          </a>
          . All rights reserved.
        </p>
      </footer>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#4a332d]/68 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-[#6d5c58] shadow transition-colors hover:bg-white"
            onClick={() => setLightbox(null)}
          >
            X
          </button>
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-[#ead9cf] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <Image src={lightbox.src} alt={lightbox.alt} width={1200} height={1200} className="h-auto max-h-[80vh] w-full object-contain" />
            <div className="flex items-center gap-3 border-t border-[#efe2db] p-5">
              <span className="rounded-full bg-[#b98677] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">{lightbox.tag}</span>
              <span className="text-xs font-bold uppercase tracking-[0.1em] text-[#a28e86]">{lightbox.brandLabel}</span>
              <span className="truncate text-sm font-semibold text-[#5d4c47]">{lightbox.alt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black text-[#2c2c2c]">{num}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a28e86]">{label}</span>
    </div>
  )
}

function PageButton({ children, disabled, onClick }: { children: React.ReactNode; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full px-4 py-2 text-xs font-bold text-[#a28e86] transition-colors hover:text-[#5d4c47] disabled:opacity-30"
    >
      {children}
    </button>
  )
}
