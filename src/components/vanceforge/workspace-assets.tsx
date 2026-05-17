"use client"

import React, { useRef, useMemo } from 'react'
import { 
  Upload, 
  Download,
  X,
  FileText,
  CheckCircle2,
  Binary,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AssetFile {
  id: string
  name: string
  type: string
  icon: React.ReactNode
  color: string
  downloadUrl: string
  uploaded: boolean
}

const ASSET_GUIDE: AssetFile[] = [
  { 
    id: 'cli', 
    name: 'CLI Binary', 
    type: 'revanced-cli.jar', 
    icon: <Binary className="w-5 h-5" />, 
    color: 'text-primary',
    downloadUrl: 'https://github.com/ReVanced/revanced-cli/releases',
    uploaded: false
  },
  { 
    id: 'patches', 
    name: 'Patch Bundle', 
    type: 'patches.rvp', 
    icon: <Layers className="w-5 h-5" />, 
    color: 'text-accent',
    downloadUrl: 'https://github.com/ReVanced/revanced-patches/releases',
    uploaded: false
  },
  { 
    id: 'apk', 
    name: 'Target Input', 
    type: 'input.apk', 
    icon: <FileText className="w-5 h-5" />, 
    color: 'text-green-400',
    downloadUrl: 'https://www.apkmirror.com/',
    uploaded: false
  },
]

interface WorkspaceAssetsProps {
  onAssetsChange: (assets: string[]) => void
  currentAssets: string[]
  language?: string
}

const ASSET_TRANSLATIONS: Record<string, any> = {
  en: { batch: "Batch Import" },
  ru: { batch: "Массовый импорт" },
  es: { batch: "Importación por lotes" },
  zh: { batch: "批量导入" }
};

export function WorkspaceAssets({ onAssetsChange, currentAssets, language = 'en' }: WorkspaceAssetsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeSlot, setActiveSlot] = React.useState<string | null>(null)

  const t = useMemo(() => ASSET_TRANSLATIONS[language] || ASSET_TRANSLATIONS.en, [language]);

  const handleUploadClick = (id: string) => {
    setActiveSlot(id)
    if (fileInputRef.current) {
      fileInputRef.current.multiple = false
      fileInputRef.current.click()
    }
  }

  const handleBatchImport = () => {
    setActiveSlot(null) // Reset active slot for batch mode
    if (fileInputRef.current) {
      fileInputRef.current.multiple = true
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (activeSlot) {
      // Single upload logic
      if (!currentAssets.includes(activeSlot)) {
        onAssetsChange([...currentAssets, activeSlot])
      }
    } else {
      // Batch upload logic: Intelligent detection
      const detectedAssets = [...currentAssets]
      files.forEach(file => {
        const name = file.name.toLowerCase()
        if (name.includes('cli') || name.endsWith('.jar')) {
          if (!detectedAssets.includes('cli')) detectedAssets.push('cli')
        } else if (name.endsWith('.rvp') || name.includes('patch') || name.includes('bundle')) {
          if (!detectedAssets.includes('patches')) detectedAssets.push('patches')
        } else if (name.endsWith('.apk') || name.endsWith('.xapk')) {
          if (!detectedAssets.includes('apk')) detectedAssets.push('apk')
        }
      })
      onAssetsChange(detectedAssets)
    }
    
    // Reset input so the same files can be picked again if needed
    if (e.target) e.target.value = ''
    setActiveSlot(null)
  }

  const clearAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onAssetsChange(currentAssets.filter(a => a !== id))
  }

  const assets = ASSET_GUIDE.map(asset => ({
    ...asset,
    uploaded: currentAssets.includes(asset.id),
  }))

  return (
    <div className="flex flex-col h-full divide-y divide-border/10">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />
      
      {assets.map((file) => (
        <div 
          key={file.id} 
          onClick={() => !file.uploaded && handleUploadClick(file.id)}
          className={cn(
            "p-6 flex items-center justify-between hover:bg-primary/5 transition-colors cursor-pointer group",
            file.uploaded ? "bg-primary/[0.03]" : "opacity-60"
          )}
        >
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-12 h-12 rounded-[20px] flex items-center justify-center transition-all duration-300",
              file.uploaded ? "bg-primary/10 text-primary scale-105" : "bg-secondary/50 text-foreground/40"
            )}>
              {file.uploaded ? <CheckCircle2 className="w-6 h-6" /> : file.icon}
            </div>
            <div>
              <p className="text-sm font-bold">{file.name}</p>
              <p className="text-[10px] opacity-40 font-mono tracking-wider">{file.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {file.uploaded ? (
              <button 
                onClick={(e) => clearAsset(file.id, e)} 
                className="p-3 hover:bg-destructive/10 rounded-full transition-colors group-hover:opacity-100 opacity-0"
              >
                <X className="w-5 h-5 text-destructive" />
              </button>
            ) : (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={file.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => e.stopPropagation()} 
                  className="p-3 hover:bg-primary/10 rounded-full text-primary transition-colors"
                >
                  <Download className="w-5 h-5" />
                </a>
                <div className="p-3">
                  <Upload className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="p-6 mt-auto">
        <Button 
          onClick={handleBatchImport}
          variant="secondary" 
          className="w-full rounded-full bg-secondary hover:bg-primary/10 border border-border/10 text-xs font-bold h-12 transition-all active:scale-[0.98]"
        >
          {t.batch}
        </Button>
      </div>
    </div>
  )
}
