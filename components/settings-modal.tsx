"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Trash2, Image as ImageIcon, Settings } from "lucide-react"
import Image from "next/image"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  logo: string | null
  qrisImage: string | null
  onLogoChange: (logo: string | null) => void
  onQrisChange: (qris: string | null) => void
}

export function SettingsModal({
  isOpen,
  onClose,
  logo,
  qrisImage,
  onLogoChange,
  onQrisChange,
}: SettingsModalProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)
  const qrisInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onLogoChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onQrisChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md glass-card rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Logo Website
              </label>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
                  {logo ? (
                    <Image
                      src={logo}
                      alt="Logo"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload size={16} />
                    Upload Logo
                  </button>
                  {logo && (
                    <button
                      onClick={() => onLogoChange(null)}
                      className="w-full px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Support PNG transparan. Logo akan tampil di navbar dan footer.
              </p>
            </div>

            {/* QRIS Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                QRIS Payment
              </label>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-secondary border border-border flex items-center justify-center overflow-hidden">
                  {qrisImage ? (
                    <Image
                      src={qrisImage}
                      alt="QRIS"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">📱</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    ref={qrisInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQrisUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => qrisInputRef.current?.click()}
                    className="w-full px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload size={16} />
                    Upload QRIS
                  </button>
                  {qrisImage && (
                    <button
                      onClick={() => onQrisChange(null)}
                      className="w-full px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Upload gambar QRIS untuk pembayaran. Akan tampil saat user memilih metode QRIS.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Selesai
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Settings Button Component
export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all duration-300 hover:scale-110"
      title="Settings"
    >
      <Settings size={24} />
    </button>
  )
}
