"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Settings, 
  LayoutDashboard, 
  Monitor,
  PackageCheck,
  RefreshCw,
  Box,
  Binary,
  Github,
  Linkedin,
  History as HistoryIcon,
  ArrowLeft,
  Palette,
  Languages,
  Moon,
  Check,
  ChevronRight,
  Search,
  Cpu,
  Sparkles,
  Zap
} from 'lucide-react'
import { Terminal } from '@/components/vanceforge/terminal'
import { WorkspaceAssets } from '@/components/vanceforge/workspace-assets'
import { type HistoryItem, PatchHistory } from '@/components/vanceforge/patch-history'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

import * as SelectPrimitive from "@radix-ui/react-select"

type ViewType = 'dashboard' | 'catalog' | 'settings'

interface SupportedApp {
  name: string
  version: string
  patches: string
  status: string
}

const M3Flower = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 0 C60 20 80 20 100 50 C80 80 60 80 50 100 C40 80 20 80 0 50 C20 20 40 20 50 0 Z" />
  </svg>
)

const M3Starburst = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 0 L61 35 L100 35 L68 57 L79 91 L50 70 L21 91 L32 57 L0 35 L39 35 Z" />
  </svg>
)

const M3Shapes = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
    <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full m3-shape-float" />
    <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent m3-shape-morph" />
    <M3Starburst className="absolute top-1/4 right-1/4 w-24 h-24 text-primary m3-shape-float" />
    <div className="absolute bottom-1/4 left-1/4 w-32 h-32 text-accent m3-shape-float" style={{ animationDelay: '-3s' }}>
      <svg viewBox="0 0 100 100" fill="currentColor">
        <rect x="20" y="20" width="60" height="60" rx="20" transform="rotate(45 50 50)" />
      </svg>
    </div>
    <M3Flower className="absolute top-1/2 left-1/2 w-40 h-40 text-primary m3-loading-symbol opacity-50" />
  </div>
)

const TRANSLATIONS: Record<string, any> = {
  en: {
    dashboard: "Dashboard",
    apps: "Supported Apps",
    display: "Display Settings",
    wallpaperTitle: "Wallpaper & style",
    dynamicColor: "Dynamic Tonal Spot",
    extracted: "Colors extracted from workspace environment",
    wallpaperTab: "Wallpaper colors",
    basicTab: "Basic colors",
    intensity: "Color Intensity",
    themedIcons: "Themed icons",
    darkTheme: "Dark theme",
    language: "Display language",
    recentBuilds: "Recent Builds",
    activeSession: "Active Session",
    workspaceModules: "Workspace Modules",
    buildExecution: "Build Execution",
    searchPlaceholder: "Search binaries",
    cliActive: "CLI ACTIVE",
    environment: "Environment",
    targetPath: "Target Path",
    verifyApps: "Verify Supported Apps",
    forceSync: "Force Sync",
    syncing: "Syncing...",
    application: "Application",
    version: "Version",
    availablePatches: "Available Patches",
    stability: "Stability",
    catalogTitle: "Compatibility Catalog",
    catalogSub: "Live from ReVanced-Patch-Bundles",
    adaptive: "System adaptive",
    dynamicActive: "Dynamic Color Active",
    ready: "Ready for build session",
    profileTitle: "Lead Developer",
    batchImport: "Batch Import"
  },
  ru: {
    dashboard: "Панель",
    apps: "Приложения",
    display: "Экран",
    wallpaperTitle: "Обои и стиль",
    dynamicColor: "Динамический цвет",
    extracted: "Цвета извлечены из окружения",
    wallpaperTab: "Цвета обоев",
    basicTab: "Базовые цвета",
    intensity: "Интенсивность",
    themedIcons: "Тематические иконки",
    darkTheme: "Темная тема",
    language: "Язык интерфейса",
    recentBuilds: "Последние сборки",
    activeSession: "Активная сессия",
    workspaceModules: "Модули рабочей области",
    buildExecution: "Выполнение сборки",
    searchPlaceholder: "Поиск файлов",
    cliActive: "CLI АКТИВЕН",
    environment: "Окружение",
    targetPath: "Путь цели",
    verifyApps: "Проверить приложения",
    forceSync: "Синхронизировать",
    syncing: "Синхронизация...",
    application: "Приложение",
    version: "Версия",
    availablePatches: "Доступные патчи",
    stability: "Стабильность",
    catalogTitle: "Каталог совместимости",
    catalogSub: "Данные из ReVanced-Patch-Bundles",
    adaptive: "Адаптивно к системе",
    dynamicActive: "Динамический цвет активен",
    ready: "Готов к сборке",
    profileTitle: "Ведущий разработчик",
    batchImport: "Массовый импорт"
  },
  es: {
    dashboard: "Panel",
    apps: "Aplicaciones",
    display: "Pantalla",
    wallpaperTitle: "Fondo y estilo",
    dynamicColor: "Color dinámico",
    extracted: "Colores extraídos del entorno",
    wallpaperTab: "Colores del fondo",
    basicTab: "Colores básicos",
    intensity: "Color de intensidad",
    themedIcons: "Iconos temáticos",
    darkTheme: "Tema oscuro",
    language: "Idioma",
    recentBuilds: "Builds recientes",
    activeSession: "Sesión activa",
    workspaceModules: "Módulos de trabajo",
    buildExecution: "Ejecución de build",
    searchPlaceholder: "Buscar binarios",
    cliActive: "CLI ACTIVO",
    environment: "Entorno",
    targetPath: "Ruta de destino",
    verifyApps: "Verificar aplicaciones",
    forceSync: "Sincronizar",
    syncing: "Sincronizando...",
    application: "Aplicación",
    version: "Versión",
    availablePatches: "Parches disponibles",
    stability: "Estabilidad",
    catalogTitle: "Catálogo de compatibilidad",
    catalogSub: "En vivo desde ReVanced-Patch-Bundles",
    adaptive: "Adaptativo al sistema",
    dynamicActive: "Color dinámico activo",
    ready: "Listo para la sesión",
    profileTitle: "Desarrollador principal",
    batchImport: "Importación por lotes"
  },
  zh: {
    dashboard: "仪表板",
    apps: "支持的应用",
    display: "显示设置",
    wallpaperTitle: "壁纸与风格",
    dynamicColor: "动态色彩",
    extracted: "从工作区环境提取的颜色",
    wallpaperTab: "壁纸颜色",
    basicTab: "基础颜色",
    intensity: "颜色强度",
    themedIcons: "主题图标",
    darkTheme: "深色模式",
    language: "显示语言",
    recentBuilds: "最近构建",
    activeSession: "活动会话",
    workspaceModules: "工作区模块",
    buildExecution: "构建执行",
    searchPlaceholder: "搜索二进制文件",
    cliActive: "CLI 已激活",
    environment: "环境",
    targetPath: "目标路径",
    verifyApps: "验证支持的应用",
    forceSync: "强制同步",
    syncing: "正在同步...",
    application: "应用程序",
    version: "版本",
    availablePatches: "可用补丁",
    stability: "稳定性",
    catalogTitle: "兼容性目录",
    catalogSub: "来自 ReVanced-Patch-Bundles 的实时数据",
    adaptive: "系统自适应",
    dynamicActive: "动态色彩已激活",
    ready: "构建就绪",
    profileTitle: "首席开发人员",
    batchImport: "批量导入"
  }
};

const WALLPAPER_PALETTES = [
  ['#606c38', '#283618', '#fefae0', '#dda15e'], 
  ['#4a5d4e', '#2c362e', '#e3e8e4', '#a8b5a9'],
  ['#5a6b5d', '#3e4a41', '#f0f4f1', '#bcc9bf'],
  ['#6b7a6d', '#4d594f', '#f9fbf9', '#cbd6cd'],
  ['#7c8a7e', '#5c695e', '#ffffff', '#dae3dd'],
  ['#8d9a8f', '#6b796e', '#f4f7f5', '#e9f0eb'],
  ['#9ea9a0', '#7a897e', '#edf2ef', '#f8fbf9'],
  ['#afb9b1', '#89998e', '#e6ebe7', '#ffffff'],
];

const BASIC_PALETTES = [
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c'], 
  ['#006400', '#008000', '#32cd32', '#90ee90'], 
  ['#b5179e', '#7209b7', '#4cc9f0', '#4361ee'], 
  ['#f48c06', '#faa307', '#ffba08', '#ffca3a'], 
  ['#312e81', '#4338ca', '#4f46e5', '#6366f1'], 
  ['#be123c', '#e11d48', '#f43f5e', '#fb7185'], 
  ['#15803d', '#16a34a', '#22c55e', '#4ade80'], 
  ['#7c2d12', '#9a3412', '#c2410c', '#ea580c'],
  ['#3d405b', '#e07a5f', '#81b29a', '#f2cc8f'],
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261'],
  ['#6d597a', '#b56576', '#e56b6f', '#eaac8b'],
  ['#588157', '#3a5a40', '#a3b18a', '#dad7cd'],
  ['#003049', '#d62828', '#f77f00', '#fcbf49'],
  ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7'],
  ['#000814', '#001d3d', '#003566', '#ffc300'],
  ['#5f0f40', '#9a031e', '#fb8b24', '#e36414'],
  ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'],
  ['#2d6a4f', '#40916c', '#52b788', '#b7e4c7'],
  ['#5e548e', '#9f86c0', '#be95c4', '#e0b1cb'],
  ['#fb5607', '#ff006e', '#8338ec', '#3a86ff'],
  ['#3a0ca3', '#3f37c9', '#4361ee', '#4cc9f0'],
  ['#c1121f', '#780000', '#fdf0d5', '#003049'],
  ['#ff9f1c', '#ffbf69', '#ffffff', '#cbf3f0'],
  ['#011627', '#fdfffc', '#2ec4b6', '#e71d36'],
];

function hexToHsl(hex: string): { h: number, s: number, l: number } {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ReVancedStudio() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [isPatching, setIsPatching] = useState(false)
  const [uploadedAssets, setUploadedAssets] = useState<string[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [supportedApps, setSupportedApps] = useState<SupportedApp[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [language, setLanguage] = useState('en')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activePaletteIndex, setActivePaletteIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'basic'>('wallpaper')
  const [colorIntensity, setColorIntensity] = useState(35)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const syncCatalog = useCallback(async () => {
    if (isSyncing) return
    setIsSyncing(true)
    const timer = new Promise(resolve => setTimeout(resolve, 800))
    try {
      const response = await fetch('https://raw.githubusercontent.com/Jman-Github/ReVanced-Patch-Bundles/bundles/patch-bundles/PATCH-LIST-CATALOG.md')
      if (!response.ok) throw new Error('Failed to fetch catalog')
      const text = await response.text()
      const lines = text.split('\n')
      const parsedApps = lines
        .map(line => line.trim())
        .filter(line => line.startsWith('|') && line.endsWith('|'))
        .filter(line => !line.includes('---'))
        .filter(line => !line.toLowerCase().includes('app name'))
        .map(line => {
          const parts = line.split('|').map(p => p.trim()).filter(p => p !== '')
          if (parts.length >= 2) {
            return {
              name: parts[0],
              version: parts[1],
              patches: parts[2] || "N/A",
              status: parts[3]?.toLowerCase().replace(/[^a-z]/g, '') || 'stable'
            }
          }
          return null
        })
        .filter((app): app is SupportedApp => app !== null)
      await timer
      setSupportedApps(parsedApps)
    } catch (error) {
      console.error("Sync Error:", error)
      await timer
    } finally {
      setIsSyncing(false)
    }
  }, [isSyncing])

  useEffect(() => {
    setMounted(true)
    syncCatalog()
  }, [syncCatalog])

  const applyColors = useCallback((colors: string[], intensity: number) => {
    const root = document.documentElement;
    const p = hexToHsl(colors[0]);
    const s = hexToHsl(colors[1]);
    const a = hexToHsl(colors[2]);
    const adjustedL = Math.max(10, Math.min(90, intensity));
    root.style.setProperty('--primary', `${p.h} ${p.s}% ${adjustedL}%`);
    root.style.setProperty('--secondary', `${s.h} ${s.s}% ${Math.min(95, adjustedL + 20)}%`);
    root.style.setProperty('--accent', `${a.h} ${a.s}% ${adjustedL}%`);
    root.style.setProperty('--ring', `${p.h} ${p.s}% ${adjustedL}%`);
  }, []);

  const handlePaletteClick = (index: number, tab: 'wallpaper' | 'basic') => {
    setActivePaletteIndex(index)
    setActiveTab(tab)
    const palette = tab === 'wallpaper' ? WALLPAPER_PALETTES[index] : BASIC_PALETTES[index]
    applyColors(palette, colorIntensity)
  }

  const handleIntensityChange = (val: number[]) => {
    const intensity = val[0];
    setColorIntensity(intensity);
    const palette = activeTab === 'wallpaper' ? WALLPAPER_PALETTES[activePaletteIndex] : BASIC_PALETTES[activePaletteIndex]
    applyColors(palette, intensity);
  }

  const requiredAssets = useMemo(() => ['cli', 'patches', 'apk'], [])
  const canPatch = useMemo(() => requiredAssets.every(assetId => uploadedAssets.includes(assetId)), [uploadedAssets, requiredAssets])

  const handleAssetsChange = useCallback((assets: string[]) => {
    setUploadedAssets(assets)
  }, [])

  const handlePatchFinish = useCallback((success: boolean) => {
    setIsPatching(false)
    const newEntry: HistoryItem = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      target: "input.apk",
      output: success ? "Output.apk" : "N/A",
      status: success ? 'success' : 'failed'
    }
    setHistory(prev => [newEntry, ...prev])
  }, [])

  useEffect(() => {
    if (!api) return
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  const renderDashboard = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 transform-gpu relative">
      <M3Shapes />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="studio-card flex flex-col overflow-hidden min-h-[300px]">
          <div className="p-6 border-b border-border/10 flex items-center justify-between">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest">{t.recentBuilds}</h3>
            <HistoryIcon className="w-5 h-5 opacity-40" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <PatchHistory history={history} />
          </div>
        </div>

        <div className="studio-card p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest">{t.activeSession}</h3>
            <Box className="w-5 h-5 opacity-40" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border/10">
              <div className="space-y-1">
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{t.environment}</p>
                <p className="text-sm font-bold">revanced-cli v4.x</p>
              </div>
              <Badge variant="outline" className="h-6 text-[10px] border-primary/20 text-primary bg-primary/5 rounded-full">STABLE</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/50 border border-border/10">
              <div className="space-y-1">
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{t.targetPath}</p>
                <p className="text-sm font-bold truncate max-w-[150px]">/workspace/input.apk</p>
              </div>
              <RefreshCw className={cn("w-4 h-4 opacity-40", isPatching && "animate-spin text-primary opacity-100")} />
            </div>
            <Button 
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-bold h-12 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
              onClick={() => setActiveView('catalog')}
            >
              {t.verifyApps}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="studio-card flex flex-col overflow-hidden">
          <div className="p-6 border-b border-border/10 flex items-center justify-between">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest">{t.workspaceModules}</h3>
            <Box className="w-5 h-5 opacity-40" />
          </div>
          <div className="flex-1">
            <WorkspaceAssets 
              currentAssets={uploadedAssets} 
              onAssetsChange={handleAssetsChange} 
              language={language}
            />
          </div>
        </div>

        <div className="studio-card flex flex-col overflow-hidden min-h-[450px]">
          <div className="p-6 border-b border-border/10 flex items-center justify-between">
            <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest">{t.buildExecution}</h3>
            <Monitor className="w-5 h-5 opacity-40" />
          </div>
          <div className="flex-1">
            <Terminal 
              isPatching={isPatching} 
              onStart={() => setIsPatching(true)}
              onStop={() => setIsPatching(false)}
              onFinish={() => handlePatchFinish(true)}
              canPatch={canPatch}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderCatalog = () => (
    <div className="studio-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden transform-gpu relative">
      <M3Shapes />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 font-headline">
              <PackageCheck className="w-7 h-7 text-primary" />
              {t.catalogTitle}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{t.catalogSub}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={syncCatalog} 
            disabled={isSyncing}
            className="text-[10px] font-bold uppercase tracking-widest gap-2 rounded-full h-10 px-6 border-primary/20 text-primary hover:bg-primary/5"
          >
            <RefreshCw className={cn("w-4 h-4", isSyncing && "animate-spin")} />
            {isSyncing ? t.syncing : t.forceSync}
          </Button>
        </div>

        <div className="overflow-x-auto terminal-scroll">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/10">
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest opacity-40">{t.application}</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest opacity-40">{t.version}</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest opacity-40">{t.availablePatches}</th>
                <th className="p-4 text-[11px] font-bold uppercase tracking-widest opacity-40 text-center">{t.stability}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {supportedApps.map((app, idx) => (
                <tr key={idx} className="hover:bg-secondary/30 transition-colors group">
                  <td className="p-6 text-sm font-bold">{app.name}</td>
                  <td className="p-6">
                    <Badge variant="secondary" className="font-mono text-[10px] bg-primary/10 text-primary border-none rounded-md">
                      {app.version}
                    </Badge>
                  </td>
                  <td className="p-6 text-[12px] opacity-70 italic max-w-md truncate group-hover:whitespace-normal group-hover:opacity-100 transition-all">
                    {app.patches}
                  </td>
                  <td className="p-6 text-center">
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase tracking-widest h-6 px-4 rounded-full border-none",
                      app.status === 'stable' ? "bg-primary/20 text-primary" : "bg-destructive/10 text-destructive"
                    )}>
                      {app.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderPaletteCarousel = (palettes: string[][], tab: 'wallpaper' | 'basic') => {
    const itemsPerPage = 4;
    const totalPages = Math.ceil(palettes.length / itemsPerPage);

    return (
      <div className="w-full flex flex-col gap-6">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-4">
            {palettes.map((palette, i) => {
              const isActive = activePaletteIndex === i && activeTab === tab;
              return (
                <CarouselItem key={i} className="pl-4 basis-1/4">
                  <button 
                    onClick={() => handlePaletteClick(i, tab)}
                    className={cn(
                      "relative w-full aspect-square rounded-[24px] bg-secondary/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group",
                      isActive ? "ring-2 ring-primary ring-offset-4 bg-primary/10" : "hover:bg-secondary/50"
                    )}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden flex flex-wrap shadow-sm border-2 border-white/20">
                      <div className="w-1/2 h-1/2" style={{ backgroundColor: palette[0] }} />
                      <div className="w-1/2 h-1/2" style={{ backgroundColor: palette[1] }} />
                      <div className="w-1/2 h-1/2" style={{ backgroundColor: palette[2] }} />
                      <div className="w-1/2 h-1/2" style={{ backgroundColor: palette[3] }} />
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg animate-in zoom-in-50 duration-200">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </button>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>

        <div className="flex justify-center gap-2 py-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const isDotActive = Math.floor(current / itemsPerPage) === i;
            return (
              <button
                key={i}
                onClick={() => api?.scrollTo(i * itemsPerPage)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isDotActive ? "bg-primary w-4" : "bg-primary/20 hover:bg-primary/40"
                )}
              />
            )
          })}
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 transform-gpu pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => setActiveView('dashboard')} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold font-headline">{t.wallpaperTitle}</h2>
      </div>

      <div className="studio-card bg-secondary/30 rounded-[32px] overflow-hidden shadow-sm">
        <div className="aspect-video bg-[url('https://picsum.photos/seed/vance/800/450')] bg-cover bg-center flex items-center justify-center relative">
           <div className="absolute inset-0 bg-black/10" />
           <div className="w-20 h-20 rounded-[28px] bg-primary shadow-2xl rotate-12 transition-all duration-500 flex items-center justify-center relative">
             <Palette className="w-10 h-10 text-primary-foreground -rotate-12" />
             <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-bounce" />
           </div>
           <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] text-white font-mono flex items-center gap-2">
             <Sparkles className="w-3 h-3 text-primary" />
             {t.dynamicActive}
           </div>
        </div>
        <div className="p-6 relative z-10">
          <p className="font-bold text-lg">{t.dynamicColor}</p>
          <p className="text-sm opacity-60">{t.extracted}</p>
        </div>
        <M3Shapes />
      </div>

      <Tabs defaultValue="wallpaper" className="w-full relative" onValueChange={(val) => {
          setActiveTab(val as 'wallpaper' | 'basic');
          setActivePaletteIndex(0);
          handlePaletteClick(0, val as 'wallpaper' | 'basic');
      }}>
        <TabsList className="grid w-full grid-cols-2 rounded-full h-16 bg-secondary/30 p-1.5 mb-8 relative z-10 overflow-hidden">
          <TabsTrigger value="wallpaper" className="rounded-full font-bold text-sm h-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all relative">
            <span className="relative z-10">{t.wallpaperTab}</span>
            <div className="absolute inset-0 pointer-events-none data-[state=active]:opacity-100 opacity-0 transition-opacity">
               <M3Starburst className="w-12 h-12 absolute -top-4 -left-4 text-primary/10 m3-shape-float" />
            </div>
          </TabsTrigger>
          <TabsTrigger value="basic" className="rounded-full font-bold text-sm h-full data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all relative">
            <span className="relative z-10">{t.basicTab}</span>
            <div className="absolute inset-0 pointer-events-none data-[state=active]:opacity-100 opacity-0 transition-opacity">
               <M3Flower className="w-12 h-12 absolute -bottom-4 -right-4 text-primary/10 m3-loading-symbol" />
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallpaper" className="mt-0 focus-visible:ring-0">
          {renderPaletteCarousel(WALLPAPER_PALETTES, 'wallpaper')}
        </TabsContent>
        <TabsContent value="basic" className="mt-0 focus-visible:ring-0">
          {renderPaletteCarousel(BASIC_PALETTES, 'basic')}
        </TabsContent>
      </Tabs>

      <div className="w-full space-y-4 px-4">
         <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-40">
           <span>{t.intensity}</span>
           <span>{colorIntensity}%</span>
         </div>
         <Slider 
           value={[colorIntensity]} 
           onValueChange={handleIntensityChange}
           max={90} 
           min={10} 
           step={1} 
           className="cursor-pointer"
         />
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between py-4 group cursor-pointer">
           <div className="flex items-center gap-6">
             <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center relative overflow-hidden">
               <Palette className="w-6 h-6 opacity-60 z-10" />
               <M3Starburst className="w-10 h-10 absolute -bottom-2 -right-2 text-primary/5 m3-shape-float" />
             </div>
             <div>
               <p className="font-bold">{t.themedIcons}</p>
               <p className="text-sm opacity-60">Apply dynamic colors to app icons</p>
             </div>
           </div>
           <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between py-4 group cursor-pointer">
           <div className="flex items-center gap-6">
             <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center relative overflow-hidden">
               <Moon className="w-6 h-6 opacity-60 z-10" />
               <div className="w-10 h-10 absolute -top-2 -left-2 bg-primary/5 rounded-full m3-shape-morph" />
             </div>
             <div>
               <p className="font-bold">{t.darkTheme}</p>
               <p className="text-sm opacity-60">{t.adaptive}</p>
             </div>
           </div>
           <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
        </div>

        <div className="flex items-center justify-between py-4 group cursor-pointer">
           <div className="flex items-center gap-6">
             <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center relative">
               <Languages className="w-6 h-6 opacity-60 z-10" />
               <M3Flower className="w-8 h-8 absolute -top-1 -right-1 text-primary m3-loading-symbol" />
             </div>
             <div>
               <p className="font-bold">{t.language}</p>
               <p className="text-sm opacity-60">{language === 'en' ? 'English' : language === 'ru' ? 'Русский' : language === 'es' ? 'Español' : '中文'}</p>
             </div>
           </div>
           
           <SelectPrimitive.Root value={language} onValueChange={(val) => setLanguage(val)}>
             <SelectPrimitive.Trigger className="w-[160px] bg-secondary/50 border-none h-12 rounded-full px-6 text-sm font-bold opacity-80 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary transition-all flex items-center justify-between">
               <SelectPrimitive.Value>
                 {language === 'en' ? 'English' : language === 'ru' ? 'Русский' : language === 'es' ? 'Español' : '中文'}
               </SelectPrimitive.Value>
               <ChevronRight className="w-4 h-4 opacity-40 rotate-90" />
             </SelectPrimitive.Trigger>
             <SelectPrimitive.Portal>
               <SelectPrimitive.Content className="z-[100] rounded-[24px] border border-border/10 bg-background/95 backdrop-blur-md p-2 shadow-2xl animate-in zoom-in-95 duration-200">
                 <SelectPrimitive.Viewport>
                   <SelectPrimitive.Item value="en" className="rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:bg-primary/10 outline-none data-[state=checked]:text-primary">
                     <SelectPrimitive.ItemText>English</SelectPrimitive.ItemText>
                   </SelectPrimitive.Item>
                   <SelectPrimitive.Item value="ru" className="rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:bg-primary/10 outline-none data-[state=checked]:text-primary">
                     <SelectPrimitive.ItemText>Русский</SelectPrimitive.ItemText>
                   </SelectPrimitive.Item>
                   <SelectPrimitive.Item value="es" className="rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:bg-primary/10 outline-none data-[state=checked]:text-primary">
                     <SelectPrimitive.ItemText>Español</SelectPrimitive.ItemText>
                   </SelectPrimitive.Item>
                   <SelectPrimitive.Item value="zh" className="rounded-xl px-4 py-2 text-sm font-bold cursor-pointer hover:bg-primary/10 outline-none data-[state=checked]:text-primary">
                     <SelectPrimitive.ItemText>中文</SelectPrimitive.ItemText>
                   </SelectPrimitive.Item>
                 </SelectPrimitive.Viewport>
               </SelectPrimitive.Content>
             </SelectPrimitive.Portal>
           </SelectPrimitive.Root>
        </div>
      </div>
    </div>
  )

  if (!mounted) return null

  const NavItem = ({ view, icon: Icon, label }: { view: ViewType | string, icon: any, label: string }) => {
    const isActive = activeView === view;
    return (
      <button 
        onClick={() => typeof view === 'string' && setActiveView(view as ViewType)}
        className={cn(
          "relative flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300 group overflow-hidden w-full",
          isActive ? "text-primary font-black" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        )}
      >
        {isActive && (
          <div className="absolute inset-y-2 left-2 right-2 bg-primary/10 rounded-full animate-in fade-in zoom-in-95 duration-300" />
        )}
        <div className="relative z-10 flex items-center gap-4 w-full">
          <Icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-110")} />
          <span className="text-sm tracking-tight">{label}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex overflow-hidden font-body">
      <aside className="w-72 border-r border-border/10 bg-background/50 backdrop-blur-xl flex flex-col shrink-0 z-20">
        <div className="p-8 flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-[20px] bg-primary flex items-center justify-center shadow-lg shadow-primary/20 relative overflow-hidden group cursor-pointer transition-transform active:scale-95">
            <M3Flower className="absolute inset-0 text-white/10 m3-loading-symbol w-full h-full scale-150 origin-center group-hover:animate-[m3-spin_1s_linear_infinite]" />
            <Cpu className="w-6 h-6 text-primary-foreground relative z-10" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background" />
          </div>
          <h1 className="font-bold text-xl tracking-tight font-headline">ReVanced CLI</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem view="dashboard" icon={LayoutDashboard} label={t.dashboard} />
          <NavItem view="catalog" icon={PackageCheck} label={t.apps} />
          <NavItem view="settings" icon={Settings} label={t.display} />
        </nav>

        <div className="p-6">
           <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary/10 rounded-full blur-xl" />
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/10">
                  <Box className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">Arjun KM</p>
                  <p className="text-[10px] opacity-40 truncate">{t.profileTitle}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href="https://github.com/4rjunKM" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center h-10 rounded-full bg-white shadow-sm hover:bg-primary/5 transition-colors">
                  <Github className="w-4 h-4 opacity-60" />
                </a>
                <a href="https://www.linkedin.com/in/arjunkm2005" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center h-10 rounded-full bg-white shadow-sm hover:bg-primary/5 transition-colors">
                  <Linkedin className="w-4 h-4 opacity-60" />
                </a>
              </div>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        <M3Shapes />
        <header className="h-20 px-10 flex items-center justify-between shrink-0 bg-background/50 backdrop-blur-md z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
            <Input 
              placeholder={t.searchPlaceholder}
              className="bg-secondary/50 border-none pl-12 h-12 rounded-full text-sm placeholder:opacity-40 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 group cursor-pointer hover:bg-primary/20 transition-all overflow-hidden relative">
               <M3Starburst className="absolute -right-2 -bottom-2 w-8 h-8 text-primary/10 m3-shape-float" />
               <Binary className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform relative z-10" />
               <Badge variant="outline" className="h-4 text-[9px] border-none text-primary font-bold relative z-10">{t.cliActive}</Badge>
             </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto terminal-scroll relative z-10">
          <div className="max-w-[1400px] mx-auto">
            {activeView === 'dashboard' ? renderDashboard() : 
             activeView === 'catalog' ? renderCatalog() : 
             activeView === 'settings' ? renderSettings() : null}
          </div>
        </div>
      </main>
    </div>
  )
}
