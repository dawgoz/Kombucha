import { useLang } from '../context/LanguageContext'
import FadeIn from './FadeIn'

const aboutText = {
  title: { en: 'What is Kana Kombucha?', lt: 'Kas yra Kana Kombucha?' },
  p1: {
    en: 'Kana Kombucha is a small-batch, artisan kombucha brewed in Lithuania. We believe in the power of fermentation — a tradition thousands of years old — to create delicious, living beverages that nourish from the inside out.',
    lt: 'Kana Kombucha — tai mažomis partijomis gaminama amatininkiška kombuča, verdama Lietuvoje. Mes tikime fermentacijos galia — tūkstantmečių tradicija — kurti skanius, gyvus gėrimus, kurie maitina iš vidaus.',
  },
  p2: {
    en: 'Every bottle is brewed with organic tea, pure cane sugar, and a living SCOBY culture. We flavour our kombucha with real fruits, herbs, and botanicals — never artificial flavourings or concentrates.',
    lt: 'Kiekvienas butelis verdamas su ekologiška arbata, grynuoju cukranendrių cukrumi ir gyva SCOBY kultūra. Savo kombučą skoniname tikrais vaisiais, žolelėmis ir augaliniais priedais — niekada dirbtiniais aromatizatoriais ar koncentratais.',
  },
}

const features = [
  {
    icon: '🍃',
    title: { en: 'Organic Ingredients', lt: 'Ekologiški ingredientai' },
    desc: { en: 'Only the finest organic teas and real fruit', lt: 'Tik geriausios ekologiškos arbatos ir tikri vaisiai' },
  },
  {
    icon: '🫧',
    title: { en: 'Naturally Fizzy', lt: 'Natūraliai gazuota' },
    desc: { en: 'Carbonation from fermentation, not forced CO₂', lt: 'Gazavimas iš fermentacijos, ne iš priverstinio CO₂' },
  },
  {
    icon: '💚',
    title: { en: 'Gut-Friendly', lt: 'Draugiška virškinimui' },
    desc: { en: 'Packed with live probiotics and organic acids', lt: 'Pilna gyvų probiotikų ir organinių rūgščių' },
  },
  {
    icon: '🤲',
    title: { en: 'Small Batch', lt: 'Mažos partijos' },
    desc: { en: 'Every bottle is crafted with attention and love', lt: 'Kiekvienas butelis pagamintas su dėmesiu ir meile' },
  },
]

export default function About() {
  const { t } = useLang()

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t(aboutText.title)}</h2>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <FadeIn as="p">{t(aboutText.p1)}</FadeIn>
            <FadeIn as="p">{t(aboutText.p2)}</FadeIn>
          </div>
          <div className="about-features">
            {features.map((feature, i) => (
              <FadeIn key={i} className="feature">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{t(feature.title)}</h3>
                <p>{t(feature.desc)}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
