"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Play, Square, Download, Activity, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface TerminalProps {
  isPatching: boolean
  onStart: () => void
  onStop: () => void
  onFinish: () => void
  canPatch: boolean
  language?: string
}

const TERMINAL_TRANSLATIONS: Record<string, any> = {
  en: { run: "Run Patch", abort: "Abort", ready: "# Ready for build session", download: "Download APK", executing: "Executing Patches..." },
  ru: { run: "Запуск", abort: "Прервать", ready: "# Готов к сборке", download: "Скачать APK", executing: "Выполнение патчей..." },
  es: { run: "Ejecutar", abort: "Abortar", ready: "# Listo para la sesión", download: "Descargar APK", executing: "Ejecutando parches..." },
  zh: { run: "运行补丁", abort: "中止", ready: "# 构建就绪", download: "下载 APK", executing: "正在执行补丁..." }
};

const M3LoadingIndicator = ({ language }: { language: string }) => (
  <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 animate-in fade-in zoom-in duration-500">
    <div className="flex gap-2">
      <svg className="w-5 h-5 text-accent m3-loading-symbol" viewBox="0 0 100 100">
        <path d="M50 0 L61 35 L100 35 L68 57 L79 91 L50 70 L21 91 L32 57 L0 35 L39 35 Z" fill="currentColor" />
      </svg>
      <div className="w-5 h-5 bg-primary rounded-full m3-shape-morph" />
      <svg className="w-5 h-5 text-accent m3-loading-symbol" style={{ animationDirection: 'reverse' }} viewBox="0 0 100 100">
        <rect x="25" y="25" width="50" height="50" rx="15" fill="currentColor" />
      </svg>
    </div>
    <span className="text-[10px] font-black tracking-widest uppercase text-accent">
      {TERMINAL_TRANSLATIONS[language]?.executing || TERMINAL_TRANSLATIONS.en.executing}
    </span>
  </div>
)

export function Terminal({ isPatching, onStart, onStop, onFinish, canPatch, language = 'en' }: TerminalProps) {
  const t = useMemo(() => TERMINAL_TRANSLATIONS[language] || TERMINAL_TRANSLATIONS.en, [language]);
  const [logs, setLogs] = useState<string[]>([t.ready])
  const scrollRef = useRef<HTMLDivElement>(null)
  const isPatchingRef = useRef(isPatching)

  useEffect(() => {
    isPatchingRef.current = isPatching
  }, [isPatching])

  const MOCK_CLI_SEQUENCE = [
    { text: "PS C:\\ReVanced\\Studio> set-executionpolicy bypass", color: "text-accent font-bold" },
    { text: "Starting ReVanced Studio Engine (CLI v4.2)...", color: "text-white/60" },
    { text: "revanced-cli patch -p patches.rvp -o Output.apk input.apk", color: "text-white/40 font-mono" },
    { text: "[INFO] Initializing JVM environment...", color: "text-white/40" },
    { text: "[INFO] Loading patch set: patches.rvp", color: "text-white/40" },
    { text: "[PATCH] Applying 'Hide Ads'...", color: "text-green-500/80" },
    { text: "[PATCH] Applying 'Background Play'...", color: "text-green-500/80" },
    { text: "[PATCH] Applying 'SponsorBlock'...", color: "text-green-500/80" },
    { text: "[PATCH] Applying 'MicroG Support'...", color: "text-green-500/80" },
    { text: "[INFO] Recompiling classes.dex...", color: "text-white/40" },
    { text: "[INFO] Signing Output.apk with internal key...", color: "text-white/40" },
    { text: "✅ Build session completed successfully!", color: "text-accent font-black uppercase tracking-widest mt-4" }
  ]

  useEffect(() => {
    if (isPatching) {
      setLogs([])
      let count = 0
      const interval = setInterval(() => {
        if (!isPatchingRef.current) {
          clearInterval(interval)
          return
        }
        if (count < MOCK_CLI_SEQUENCE.length) {
          setLogs(prev => [...prev, JSON.stringify(MOCK_CLI_SEQUENCE[count])])
          count++
        } else {
          clearInterval(interval)
          onFinish()
        }
      }, 150)
      return () => clearInterval(interval)
    }
  }, [isPatching, onFinish])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const finished = logs.some(l => l.includes('completed'))

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] relative overflow-hidden group rounded-[24px]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex-1 p-6 font-mono text-[10px] leading-relaxed terminal-scroll overflow-y-auto relative z-10" ref={scrollRef}>
        {logs.map((logStr, i) => {
          let log;
          try {
            log = logStr.startsWith('{') ? JSON.parse(logStr) : { text: logStr, color: "text-white/20" };
          } catch {
            log = { text: logStr, color: "text-white/20" };
          }
          return (
            <div key={i} className={cn("mb-1 flex gap-4 transition-all animate-in fade-in slide-in-from-left-2 duration-300", log.color)}>
              <span className="opacity-10 select-none w-6 font-bold">{(i + 1).toString().padStart(3, '0')}</span>
              <span className="flex-1 whitespace-pre-wrap">{log.text}</span>
            </div>
          )
        })}
        {isPatching && (
          <div className="mt-8">
            <M3LoadingIndicator language={language} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
        <div className="flex gap-2">
          {!isPatching ? (
            <Button 
              onClick={onStart} 
              disabled={!canPatch}
              className={cn(
                "h-10 px-6 rounded-full text-[9px] font-black uppercase tracking-widest gap-3 transition-all",
                canPatch ? "bg-accent hover:bg-accent/80 text-white shadow-lg shadow-accent/20" : "bg-white/5 text-white/20"
              )}
            >
              <Play className="w-3 h-3" /> {t.run}
            </Button>
          ) : (
            <Button onClick={onStop} variant="destructive" className="h-10 px-6 rounded-full text-[9px] font-black uppercase tracking-widest gap-3 shadow-lg shadow-destructive/20">
              <Square className="w-3 h-3" /> {t.abort}
            </Button>
          )}
        </div>
        {finished && (
          <button className="flex items-center gap-2 text-accent text-[9px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity animate-in zoom-in duration-300">
            <Download className="w-3 h-3" /> {t.download}
          </button>
        )}
        {!canPatch && !isPatching && !finished && (
           <div className="flex items-center gap-2 text-[8px] font-bold text-destructive/60 uppercase tracking-widest animate-pulse">
             <AlertCircle className="w-3 h-3" /> Assets Missing
           </div>
        )}
      </div>
    </div>
  )
}
