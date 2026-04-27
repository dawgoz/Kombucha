import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'lt')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => {
    const next = lang === 'en' ? 'lt' : 'en'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  const t = (obj) => obj[lang] ?? obj['en']

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
