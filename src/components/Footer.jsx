import { useLang } from '../context/LanguageContext'

const content = {
  copy: { en: '© 2026 Kana Kombucha. All rights reserved.', lt: '© 2026 Kana Kombucha. Visos teisės saugomos.' },
}

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <a href="#hero" className="footer-logo">
            Kana <span>Kombucha</span>
          </a>
          <p>{t(content.copy)}</p>
        </div>
      </div>
    </footer>
  )
}
