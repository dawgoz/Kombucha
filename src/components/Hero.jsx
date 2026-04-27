import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

const content = {
  subtitle: {
    en: 'Live-cultured, naturally fermented kombucha made with organic ingredients. Good for your gut, great for your taste buds.',
    lt: 'Gyva kultūra, natūraliai fermentuota kombuča, pagaminta iš ekologiškų ingredientų. Gerai jūsų virškinimui, puiku jūsų skonio receptoriams.',
  },
  cta: { en: 'Explore Flavours', lt: 'Atraskite skonius' },
}

export default function Hero() {
  const { t } = useLang()
  const [spinning, setSpinning] = useState(false)

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-image" aria-hidden="true">
        <img src="/images/image.png" alt="" />
        <div className="hero-bg-overlay" />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Kana Kombucha</h1>
        <p className="hero-subtitle">{t(content.subtitle)}</p>
        <a href="#flavours" className="btn-primary">
          {t(content.cta)}
        </a>
      </div>
      {/* <div className="hero-visual">
        <img
          className={`hero-image${spinning ? ' spin' : ''}`}
          src="/images/image2.png"
          alt="Kana Kombucha Bottle"
          onClick={() => setSpinning(true)}
          onAnimationEnd={() => setSpinning(false)}
        />
      </div> */}
    </section>
  )
}
