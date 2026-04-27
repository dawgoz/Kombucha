import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'

const navItems = [
  { href: '#about', en: 'About', lt: 'Apie mus' },
  { href: '#flavours', en: 'Flavours', lt: 'Skoniai' },
  { href: '#contact', en: 'Contact', lt: 'Kontaktai' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 50)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang, toggle } = useLang()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openMenu = () => {
    setMenuOpen(true)
    document.body.classList.add('no-scroll')
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.classList.remove('no-scroll')
  }

  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu())

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#hero" className="logo">
            Kana <span>Kombucha</span>
          </a>
          <button
            className={`mobile-menu-btn${menuOpen ? ' active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`nav-overlay${menuOpen ? ' open' : ''}${scrolled ? ' scrolled' : ''}`}>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={closeMenu}>
                {item[lang]}
              </a>
            </li>
          ))}
          <li>
            <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
              {lang === 'en' ? 'LT' : 'EN'}
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}
