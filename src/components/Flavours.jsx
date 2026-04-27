import { useState, useEffect, useRef } from 'react'
import { useLang } from '../context/LanguageContext'
import FadeIn from './FadeIn'
import flavoursData from '../data/flavours'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const content = {
  title: { en: 'Find Your Favourite', lt: 'Raskite savo mėgstamiausią' },
  desc: {
    en: 'Each flavour is carefully crafted to balance taste, health benefits, and refreshment.',
    lt: 'Kiekvienas skonis kruopščiai sukurtas subalansuoti skonį, naudą sveikatai ir gaivumą.',
  },
}

const TOTAL = flavoursData.length
const ITEM_GAP = 16

export default function Flavours() {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const [itemWidth, setItemWidth] = useState(110)
  const firstItemRef = useRef(null)
  const flavour = flavoursData[active]

  useEffect(() => {
    if (!firstItemRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setItemWidth(entry.contentRect.width)
      }
    })
    ro.observe(firstItemRef.current)
    return () => ro.disconnect()
  }, [])

  const prev = () => setActive((active - 1 + TOTAL) % TOTAL)
  const next = () => setActive((active + 1) % TOTAL)

  // Shift track so active item's center aligns with viewport center
  const offset = `calc(50% - ${active * (itemWidth + ITEM_GAP) + itemWidth / 2}px)`

  return (
    <section className="flavours" id="flavours">
      <div className="container">
        <FadeIn className="section-header">
          <h2 className="section-title">{t(content.title)}</h2>
          <p className="section-desc">{t(content.desc)}</p>
        </FadeIn>

        <div className="carousel-viewport">
          <div className="carousel-track" style={{ transform: `translateX(${offset})` }}>
            {flavoursData.map((f, i) => (
              <button
                key={i}
                ref={i === 0 ? firstItemRef : null}
                className={`carousel-item${i === active ? ' active' : ''}`}
                style={{ '--accent': f.accent }}
                onClick={() => setActive(i)}
                aria-label={t(f.name)}
              >
                <div className="carousel-bottle">
                  <img src="/images/image2.png" alt={t(f.name)} />
                </div>
                <span className="carousel-label">{t(f.name)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="carousel-controls">
          <button className="carousel-arrow" onClick={prev} aria-label="Previous"><FontAwesomeIcon icon={faChevronLeft} /></button>
          <div className="carousel-dots">
            {flavoursData.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Flavour ${i + 1}`}
              />
            ))}
          </div>
          <button className="carousel-arrow" onClick={next} aria-label="Next"><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>

        <div className="carousel-detail" key={active} style={{ '--accent': flavour.accent }}>
          <span className="carousel-badge">{t(flavour.badge)}</span>
          <h3 className="carousel-name">{t(flavour.name)}</h3>
          <p className="carousel-desc">{t(flavour.desc)}</p>
        </div>
      </div>
    </section>
  )
}

