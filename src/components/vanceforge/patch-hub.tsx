"use client"

import React, { useState } from 'react'
import { 
  ArrowLeft, 
  MoreVertical, 
  Search, 
  Check, 
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

const OFFICIAL_PATCHES = [
  { id: 'pixel-unlimited-storage', name: 'Pixel Unlimited Storage', description: 'Unlock free unlimited original-quality cloud backups.', stability: 'stable' },
  { id: 'microg-support', name: 'MicroG Support', description: 'Core framework for Google Play Services redirection.', stability: 'stable' },
  { id: 'hide-ads', name: 'Ad Removal', description: 'Eliminate in-app marketing and interstitial trackers.', stability: 'stable' },
  { id: 'background-play', name: 'Background Audio', description: 'Keeps media playing when screen is locked.', stability: 'stable' },
  { id: 'return-dislike', name: 'Return Dislike', description: 'Restores public dislike counts via RYD API.', stability: 'beta' },
  { id: 'sponsorblock', name: 'SponsorBlock', description: 'Skip sponsors, intros, and filler segments.', stability: 'stable' },
  { id: 'client-spoof', name: 'Client Spoofing', description: 'Resolve playback and version mismatch errors.', stability: 'beta' },
  { id: 'custom-branding', name: 'Custom Iconography', description: 'Apply premium themed launcher icons.', stability: 'stable' },
  { id: 'enable-debugging', name: 'Enable Android Debugging', description: 'Enables Android debugging capabilities.', stability: 'stable' },
  { id: 'change-package-name', name: 'Change Package Name', description: 'Changes the package name.', stability: 'stable' },
  { id: 'export-all-activities', name: 'Export All Activities', description: 'Makes all app activities exportable.', stability: 'stable' },
]

const DEFAULT_PATCHES = ['hide-ads', 'background-play', 'microg-support', 'sponsorblock']

interface PatchHubProps {
  onPatchesChange: (patchIds: string[]) => void
  onBack: () => void
  onContinue: () => void
}

export function PatchHub({ onPatchesChange, onBack, onContinue }: PatchHubProps) {
  const [selected, setSelected] = useState<string[]>(DEFAULT_PATCHES)
  const [searchQuery, setSearchQuery] = useState('')

  const togglePatch = (id: string) => {
    const next = selected.includes(id) 
      ? selected.filter(p => p !== id) 
      : [...selected, id]
    setSelected(next)
    onPatchesChange(next)
  }

  const selectDefault = () => {
    const next = DEFAULT_PATCHES
    setSelected(next)
    onPatchesChange(next)
  }

  const selectNone = () => {
    setSelected([])
    onPatchesChange([])
  }

  const filteredPatches = OFFICIAL_PATCHES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-card rounded-[32px] border border-border shadow-2xl overflow-hidden max-w-5xl mx-auto w-full">
      {/* M3 Style Header */}
      <div className="px-8 pt-8 pb-4 shrink-0 bg-background/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-headline font-bold">Select Patches</h3>
          </div>
          <Badge variant="secondary" className="font-bold text-[10px] px-3">
            {selected.length} ACTIVE
          </Badge>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Filter patch library" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/50 border-none rounded-[16px] pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={selectDefault} className="h-7 text-[10px] font-bold uppercase tracking-wider rounded-full bg-secondary/30">
            Recommended
          </Button>
          <Button variant="ghost" size="sm" onClick={selectNone} className="h-7 text-[10px] font-bold uppercase tracking-wider rounded-full">
            Clear All
          </Button>
        </div>
      </div>

      {/* Scrollable List */}
      <ScrollArea className="flex-1 px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          {filteredPatches.map((patch) => (
            <div 
              key={patch.id}
              onClick={() => togglePatch(patch.id)}
              className={cn(
                "group p-6 rounded-[24px] border-2 transition-all cursor-pointer flex flex-col justify-between h-full",
                selected.includes(patch.id) 
                  ? "bg-primary/10 border-primary" 
                  : "bg-secondary/10 border-transparent hover:border-primary/20"
              )}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold tracking-tight">
                    {patch.name}
                  </span>
                  {selected.includes(patch.id) && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {patch.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <Badge variant="outline" className={cn(
                  "text-[8px] tracking-widest px-2 h-4",
                  patch.stability === 'beta' ? "border-orange-400 text-orange-500" : "border-primary/20 text-primary"
                )}>
                  {patch.stability.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-background/80 backdrop-blur-xl shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold">{selected.length} patches ready for injection</span>
        </div>
        <Button 
          onClick={onContinue}
          className="rounded-full bg-primary hover:bg-primary/90 px-8 h-10 text-xs font-bold flex items-center gap-2"
        >
          Confirm Bundle
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}