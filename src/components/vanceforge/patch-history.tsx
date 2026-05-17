"use client"

import React from 'react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface HistoryItem {
  id: string
  timestamp: string
  target: string
  output: string
  status: 'success' | 'failed'
}

interface PatchHistoryProps {
  history: HistoryItem[]
}

export function PatchHistory({ history }: PatchHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full opacity-40">
        <Clock className="w-8 h-8 mb-2" />
        <p className="text-[10px] font-bold uppercase tracking-widest">No recent builds</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-white/5">
      {history.slice(0, 5).map((item) => (
        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              item.status === 'success' ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
            )}>
              {item.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-semibold">Build #{item.id.slice(0, 4)} {item.status}</p>
              <p className="text-[10px] opacity-40 font-mono">{item.target}</p>
            </div>
          </div>
          <span className="text-[10px] opacity-40 font-medium">{item.timestamp}</span>
        </div>
      ))}
      
      {/* Placeholder states to match screenshot style */}
      <div className="p-4 flex items-center justify-between opacity-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Clock className="w-4 h-4" /></div>
          <div><p className="text-xs font-semibold">CLI preview ready</p></div>
        </div>
        <span className="text-[10px] font-medium">Queued</span>
      </div>
      <div className="p-4 flex items-center justify-between opacity-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><div className="w-4 h-4 rounded-full border border-white/40" /></div>
          <div><p className="text-xs font-semibold">Import: module zip</p></div>
        </div>
        <span className="text-[10px] font-medium">Installed</span>
      </div>
    </div>
  )
}