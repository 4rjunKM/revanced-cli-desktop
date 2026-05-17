"use client"

import React, { useState } from 'react'
import { Bot, Sparkles, Loader2, ArrowRight, Zap } from 'lucide-react'
import { suggestPatchStrategy, type AiPatchStrategyRecommendationOutput } from '@/ai/flows/ai-patch-strategy-recommendation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function AIAdvisor() {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<AiPatchStrategyRecommendationOutput | null>(null)
  const [version, setVersion] = useState("19.02.39")

  const getAdvice = async () => {
    setLoading(true)
    try {
      const result = await suggestPatchStrategy({ apkVersion: version })
      setRecommendations(result)
    } catch (error) {
      console.error("AI Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-accent animate-pulse-glow" />
        <h3 className="text-lg font-headline font-semibold">AI Strategy Tool</h3>
      </div>

      {!recommendations ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-accent/5 border border-accent/20 rounded-xl">
          <Sparkles className="w-10 h-10 text-accent/40 mb-3" />
          <p className="text-sm font-medium mb-1">Analyze APK version compatibility</p>
          <p className="text-xs text-muted-foreground mb-4">Powered by Gemini for stable patching strategies</p>
          <div className="flex items-center gap-2 w-full max-w-xs">
            <input 
              type="text" 
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="v18.0.0..."
              className="bg-background/50 border border-border rounded-lg px-3 py-1.5 text-xs flex-1 outline-none focus:border-accent"
            />
            <Button 
              size="sm" 
              onClick={getAdvice} 
              disabled={loading}
              className="bg-accent hover:bg-accent/80 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto pr-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Analysis for v{version}</span>
            <button 
              onClick={() => setRecommendations(null)}
              className="text-[10px] text-accent hover:underline"
            >
              Reset
            </button>
          </div>
          <div className="space-y-3">
            {recommendations.recommendedPatches.map((rec, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 rounded-lg p-3 group hover:border-accent/30 transition-colors">
                <div className="flex items-start justify-between mb-1.5">
                  <h4 className="text-sm font-medium text-accent">{rec.patchName}</h4>
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest h-4 px-1 border-accent/30 text-accent">
                    {rec.stability}
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed mb-2 text-foreground/90">{rec.recommendationReason}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic">
                  <ArrowRight className="w-3 h-3" />
                  Apply to maximize stability
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}