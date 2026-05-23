"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Trash2, Image as ImageIcon, Settings, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  logo: string | null
  qrisImage: string | null
  onLogoChange: (logo: string | null) => void
  onQrisChange: (qris: string | null) => void
}

interface StockSettings {
  lite: { [key: number]: boolean }
  medium: { [key: number]: boolean }
  extreme: { [key: number]: boolean }
}

const SETTINGS_KEY = "cmV2b2xpeDIwMjY="

export function SettingsModal({
  isOpen,
  onClose,
  logo,
  qrisImage,
  onLogoChange,
  onQrisChange,
}: SettingsModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [settingsTab, setSettingsTab] = useState<"general" | "stock">("general")
  const [stockSettings, setStockSettings] = useState<StockSettings>({ lite: {}, medium: {}, extreme: {} })
  const logoInputRef = useRef<HTMLInputElement>(null)
  const qrisInputRef = useRef<HTMLInputElement>(null)

  // Load stock settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("revolix_stock_settings")
    if (saved) {
      setStockSettings(JSON.parse(saved))
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const decoded = atob(SETTINGS_KEY)
    if (password === decoded) {
      setIsAuthenticated(true)
      setError("")
      setPassword("")
    } else {
      setError("Password salah! Silakan coba lagi.")
      setPassword("")
    }
  }

  const handleClose = () => {
    setIsAuthenticated(false)
    setPassword("")
    setError("")
    setSettingsTab("general")
    onClose()
  }

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

  const toggleStock = (packageId: "lite" | "medium" | "extreme", ram: number) => {
    const newSettings = { ...stockSettings }
    newSettings[packageId] = { ...newSettings[packageId] }
    newSettings[packageId][ram] = !newSettings[packageId][ram]
    setStockSettings(newSettings)
    localStorage.setItem("revolix_stock_settings", JSON.stringify(newSettings))
  }

  const togglePackageOutOfStock = (packageId: "lite" | "medium" | "extreme") => {
    const newSettings = { ...stockSettings }
    const isAllOutOfStock = Object.values(newSettings[packageId]).every(v => v === true)
    newSettings[packageId] = {}
    for (let i = 1; i <= 16; i++) {
      newSettings[packageId][i] = !isAllOutOfStock
    }
    setStockSettings(newSettings)
    localStorage.setItem("revolix_stock_settings", JSON.stringify(newSettings))
  }

  const isPackageOutOfStock = (packageId: "lite" | "medium" | "extreme") => {
    const ramSettings = stockSettings[packageId]
    return Object.values(ramSettings).length === 16 && Object.values(ramSettings).every(v => v === true)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 glass flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Settings className="w-5 h-5 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-primary" />
              )}
              <h2 className="text-lg font-bold text-foreground">
                {isAuthenticated ? "Admin Settings" : "Masukkan Password"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!isAuthenticated ? (
            /* Password Form */
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password Admin
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Masuk
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Hanya admin yang dapat mengakses pengaturan ini.
              </p>
            </form>
          ) : (
            /* Settings Content */
            <>
              {/* Tabs */}
              <div className="flex gap-2 px-6 py-4 border-b border-border">
                <button
                  onClick={() => setSettingsTab("general")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    settingsTab === "general"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  General
                </button>
                <button
                  onClick={() => setSettingsTab("stock")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    settingsTab === "stock"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-foreground"
                  }`}
                >
                  Stock Management
                </button>
              </div>

              <div className="p-6">
                {settingsTab === "general" ? (
                  /* General Settings */
                  <div className="space-y-6">
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
                ) : (
                  /* Stock Management */
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Kelola ketersediaan stock untuk setiap paket dan kapasitas RAM
                    </p>

                    {/* Lite Package */}
                    <div className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-foreground">Lite Package</h4>
                        <button
                          onClick={() => togglePackageOutOfStock("lite")}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            isPackageOutOfStock("lite")
                              ? "bg-destructive/20 text-destructive"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {isPackageOutOfStock("lite") ? "Habis" : "Tersedia"}
                        </button>
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: 16 }, (_, i) => i + 1).map((ram) => (
                          <button
                            key={ram}
                            onClick={() => toggleStock("lite", ram)}
                            className={`py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                              stockSettings.lite[ram]
                                ? "bg-destructive/20 text-destructive line-through"
                                : "bg-primary/20 text-primary hover:bg-primary/30"
                            }`}
                          >
                            {ram}GB
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Medium Package */}
                    <div className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-foreground">Medium Package</h4>
                        <button
                          onClick={() => togglePackageOutOfStock("medium")}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            isPackageOutOfStock("medium")
                              ? "bg-destructive/20 text-destructive"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {isPackageOutOfStock("medium") ? "Habis" : "Tersedia"}
                        </button>
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: 16 }, (_, i) => i + 1).map((ram) => (
                          <button
                            key={ram}
                            onClick={() => toggleStock("medium", ram)}
                            className={`py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                              stockSettings.medium[ram]
                                ? "bg-destructive/20 text-destructive line-through"
                                : "bg-primary/20 text-primary hover:bg-primary/30"
                            }`}
                          >
                            {ram}GB
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Extreme Package */}
                    <div className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-foreground">Extreme Package</h4>
                        <button
                          onClick={() => togglePackageOutOfStock("extreme")}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            isPackageOutOfStock("extreme")
                              ? "bg-destructive/20 text-destructive"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {isPackageOutOfStock("extreme") ? "Habis" : "Tersedia"}
                        </button>
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {Array.from({ length: 16 }, (_, i) => i + 1).map((ram) => (
                          <button
                            key={ram}
                            onClick={() => toggleStock("extreme", ram)}
                            className={`py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                              stockSettings.extreme[ram]
                                ? "bg-destructive/20 text-destructive line-through"
                                : "bg-primary/20 text-primary hover:bg-primary/30"
                            }`}
                          >
                            {ram}GB
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                      Klik RAM yang ingin diatur, atau klik status package untuk mengatur seluruh stock paket. Tombol berwarna merah berarti stock habis.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border">
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Selesai
                </button>
              </div>
            </>
          )}
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
