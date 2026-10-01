import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export type Lang = 'ar' | 'en'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  /** Pick the Arabic or English string for the active language */
  t: (ar: string, en: string) => string
}

const Ctx = createContext<LangCtx>({ lang: 'ar', setLang: () => {}, t: (ar) => ar })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar')

  useEffect(() => {
    const saved = window.localStorage.getItem('aiids.lang')
    if (saved === 'en' || saved === 'ar') setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    window.localStorage.setItem('aiids.lang', l)
  }, [])

  const t = useCallback((ar: string, en: string) => (lang === 'ar' ? ar : en), [lang])

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
