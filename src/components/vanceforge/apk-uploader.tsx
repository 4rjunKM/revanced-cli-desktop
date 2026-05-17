"use client"

import React, { useState } from 'react'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ApkUploaderProps {
  onFileSelect: (file: File | null) => void
}

export function ApkUploader({ onFileSelect }: ApkUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.apk') || file.name.endsWith('.xapk'))) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    onFileSelect(file)
  }

  const clearFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-headline font-bold flex items-center gap-3">
          <Upload className="w-6 h-6 text-primary" />
          Target Input
        </h3>
        {selectedFile && (
          <button 
            onClick={clearFile}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 font-bold"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "h-48 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all cursor-pointer group",
            isDragging 
              ? "border-primary bg-primary/10" 
              : "border-secondary hover:border-primary/50 hover:bg-secondary/30"
          )}
          onClick={() => document.getElementById('apk-input')?.click()}
        >
          <input
            id="apk-input"
            type="file"
            className="hidden"
            accept=".apk,.xapk"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm font-bold mb-1">Set Input.apk</p>
          <p className="text-[11px] text-muted-foreground text-center">Script requires naming as Input.apk</p>
        </div>
      ) : (
        <div className="m3-card-filled p-6 flex items-center gap-5 bg-primary/10 border border-primary/20 rounded-[32px]">
          <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/10">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Input.apk</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • VERIFIED</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-accent-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}
