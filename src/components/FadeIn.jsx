import { useEffect, useRef } from 'react'

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
)

export default function FadeIn({ children, className = '', as: Tag = 'div', style, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  return (
    <Tag ref={ref} className={`fade-in ${className}`} style={style} {...props}>
      {children}
    </Tag>
  )
}
