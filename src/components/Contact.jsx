import { useLang } from '../context/LanguageContext'
import FadeIn from './FadeIn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

const content = {
  title: { en: 'Contact Us', lt: 'Susisiekite su mumis' },
  desc: {
    en: "Have questions, want to stock Kana Kombucha, or just want to say hello? We'd love to hear from you.",
    lt: 'Turite klausimų, norite prekiauti Kana Kombucha arba tiesiog norite pasisveikinti? Mielai išgirsime jus.',
  },
  email: { en: 'Email', lt: 'El. paštas' },
  phone: { en: 'Phone', lt: 'Telefonas' },
  phoneVal: { en: '+370 600 00000', lt: '+370 600 00000' },
  facebook: { en: 'Facebook', lt: 'Facebook' },
  instagram: { en: 'Instagram', lt: 'Instagram' },
}

export default function Contact() {
  const { t } = useLang()

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t(content.title)}</h2>
          <p className="section-desc">{t(content.desc)}</p>
        </div>
        <div className="contact-grid">
          <FadeIn as="a" className="contact-card" href="mailto:hello@kanakombucha.lt">
            <div className="contact-icon" style={{ color: '#4f9ef5' }}>
              <FontAwesomeIcon icon={faEnvelope} size="1x" />
            </div>
            <h3>{t(content.email)}</h3>
            <span>hello@kanakombucha.lt</span>
          </FadeIn>

          <FadeIn as="a" className="contact-card" href={`tel:${t(content.phoneVal).replace(/\s/g, '')}`}>
            <div className="contact-icon" style={{ color: '#3d6b4f' }}>
              <FontAwesomeIcon icon={faPhone} size="1x" />
            </div>
            <h3>{t(content.phone)}</h3>
            <span>{t(content.phoneVal)}</span>
          </FadeIn>

          <FadeIn as="a" className="contact-card" href="" target="_blank" rel="noopener noreferrer">
            <div className="contact-icon" style={{ color: '#1877f2' }}>
              <FontAwesomeIcon icon={faFacebook} size="1x" />
            </div>
            <h3>{t(content.facebook)}</h3>
            <span>kanakombucha</span>
          </FadeIn>

          <FadeIn as="a" className="contact-card" href="" target="_blank" rel="noopener noreferrer">
            <div className="contact-icon" style={{ color: '#e1306c' }}>
              <FontAwesomeIcon icon={faInstagram} size="1x" />
            </div>
            <h3>{t(content.instagram)}</h3>
            <span>@kanakombucha</span>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
