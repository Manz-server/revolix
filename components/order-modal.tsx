"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, Check, Upload, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import type { Package } from "./pricing"

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPackage: Package | null
  qrisImage: string | null
}

type Step = "ram" | "game" | "egg" | "form" | "payment"

interface GameOption {
  id: string
  name: string
  icon: string
}

interface EggOption {
  id: string
  name: string
}

const games: GameOption[] = [
  { id: "minecraft", name: "Minecraft", icon: "🎮" },
  { id: "terraria", name: "Terraria", icon: "🌳" },
  { id: "gta", name: "GTA", icon: "🚗" },
]

const eggs: Record<string, EggOption[]> = {
  minecraft: [
    { id: "paper", name: "Paper" },
    { id: "purpur", name: "Purpur" },
    { id: "fabric", name: "Fabric" },
    { id: "forge", name: "Forge" },
    { id: "vanilla", name: "Vanilla" },
    { id: "vanilla-bedrock", name: "Vanilla Bedrock" },
    { id: "pocketmine", name: "PocketMine" },
    { id: "waterfall", name: "Waterfall" },
    { id: "velocity", name: "Velocity" },
  ],
  terraria: [
    { id: "vanilla-terraria", name: "Vanilla Terraria" },
    { id: "tshock", name: "TShock" },
  ],
  gta: [
    { id: "fivem", name: "FiveM" },
    { id: "samp", name: "SA-MP" },
  ],
}

const paymentMethods = [
  { id: "qris", name: "QRIS", icon: "📱" },
  { id: "dana", name: "DANA", icon: "💳", number: "085179514462" },
  { id: "gopay", name: "GoPay", icon: "💚", number: "085179514462" },
]

export function OrderModal({ isOpen, onClose, selectedPackage, qrisImage }: OrderModalProps) {
  const [step, setStep] = useState<Step>("ram")
  const [selectedRam, setSelectedRam] = useState<number>(1)
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [selectedEgg, setSelectedEgg] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    gmail: "",
    username: "",
    password: "",
  })

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("ram")
      setSelectedRam(1)
      setSelectedGame(null)
      setSelectedEgg(null)
      setSelectedPayment(null)
      setFormData({ gmail: "", username: "", password: "" })
    }
  }, [isOpen])

  const handleUsernameChange = (value: string) => {
    // Replace spaces with underscores
    const sanitized = value.replace(/\s/g, "_")
    setFormData({ ...formData, username: sanitized })
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return null
    if (password.length < 6) return { level: "weak", text: "Password lemah", color: "text-red-500" }
    if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { level: "medium", text: "Password cukup aman", color: "text-yellow-500" }
    }
    return { level: "strong", text: "Password sangat kuat", color: "text-green-500" }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const getTotalPrice = () => {
    if (!selectedPackage) return 0
    return selectedPackage.price * selectedRam
  }

  const handleSubmit = () => {
    if (!selectedPackage || !selectedGame || !selectedEgg || !selectedPayment) return
    
    setIsSubmitting(true)
    
    const gameName = games.find(g => g.id === selectedGame)?.name
    const eggName = eggs[selectedGame]?.find(e => e.id === selectedEgg)?.name
    const paymentName = paymentMethods.find(p => p.id === selectedPayment)?.name

    const message = `Halo RevolixHost, saya ingin membeli hosting.

Paket: ${selectedPackage.name}
RAM: ${selectedRam}GB
Game: ${gameName}
Egg: ${eggName}
CPU: ${selectedPackage.cpu}
Payment: ${paymentName}
Gmail: ${formData.gmail}
Username: ${formData.username}

Total: Rp ${getTotalPrice().toLocaleString()}`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/6287745935987?text=${encodedMessage}`, "_blank")
    
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  const canProceedToGame = selectedRam > 0
  const canProceedToEgg = selectedGame !== null
  const canProceedToForm = selectedEgg !== null
  const canProceedToPayment = formData.gmail && formData.username && formData.password
  const canSubmit = selectedPayment !== null

  const goBack = () => {
    switch (step) {
      case "game":
        setStep("ram")
        break
      case "egg":
        setStep("game")
        setSelectedEgg(null)
        break
      case "form":
        setStep("egg")
        break
      case "payment":
        setStep("form")
        break
    }
  }

  const goNext = () => {
    switch (step) {
      case "ram":
        if (canProceedToGame) setStep("game")
        break
      case "game":
        if (canProceedToEgg) setStep("egg")
        break
      case "egg":
        if (canProceedToForm) setStep("form")
        break
      case "form":
        if (canProceedToPayment) setStep("payment")
        break
      case "payment":
        if (canSubmit) handleSubmit()
        break
    }
  }

  if (!isOpen || !selectedPackage) return null

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
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 glass flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              {step !== "ram" && (
                <button
                  onClick={goBack}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold text-foreground">Order - {selectedPackage.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedPackage.cpu}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* RAM Selection */}
              {step === "ram" && (
                <motion.div
                  key="ram"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pilih RAM</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Geser slider atau pilih kapasitas RAM untuk server kamu
                  </p>

                  {/* RAM Slider */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-bold text-primary">{selectedRam} GB</span>
                      <span className="text-lg font-semibold text-foreground">
                        Rp {getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={16}
                      value={selectedRam}
                      onChange={(e) => setSelectedRam(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>1 GB</span>
                      <span>16 GB</span>
                    </div>
                  </div>

                  {/* Quick Select */}
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 4, 8, 12, 16].map((ram) => (
                      <button
                        key={ram}
                        onClick={() => setSelectedRam(ram)}
                        className={`py-3 rounded-xl font-medium transition-all duration-200 ${
                          selectedRam === ram
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        }`}
                      >
                        {ram} GB
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Game Selection */}
              {step === "game" && (
                <motion.div
                  key="game"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pilih Game</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Pilih game yang ingin kamu hosting
                  </p>

                  <div className="grid gap-4">
                    {games.map((game) => (
                      <button
                        key={game.id}
                        onClick={() => {
                          setSelectedGame(game.id)
                          setSelectedEgg(null)
                        }}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          selectedGame === game.id
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-secondary hover:bg-secondary/80 border-2 border-transparent"
                        }`}
                      >
                        <span className="text-4xl">{game.icon}</span>
                        <div className="text-left">
                          <h4 className="font-semibold text-foreground">{game.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {eggs[game.id]?.length} server types available
                          </p>
                        </div>
                        {selectedGame === game.id && (
                          <Check className="ml-auto text-primary" size={24} />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Egg Selection */}
              {step === "egg" && selectedGame && (
                <motion.div
                  key="egg"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">Pilih Server Software</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Pilih jenis server untuk {games.find(g => g.id === selectedGame)?.name}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {eggs[selectedGame]?.map((egg) => (
                      <button
                        key={egg.id}
                        onClick={() => setSelectedEgg(egg.id)}
                        className={`p-4 rounded-xl text-center transition-all duration-200 ${
                          selectedEgg === egg.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        }`}
                      >
                        <span className="font-medium">{egg.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Form */}
              {step === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">Data Akun</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Isi username dan Gmail bebas untuk login panel hosting. Pastikan Gmail aktif agar mudah menerima informasi akun hosting.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Gmail</label>
                      <input
                        type="email"
                        value={formData.gmail}
                        onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                        placeholder="contoh@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="Username_Kamu"
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Spasi akan otomatis diubah menjadi underscore (_)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {passwordStrength && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength.level === "weak"
                                  ? "w-1/3 bg-red-500"
                                  : passwordStrength.level === "medium"
                                  ? "w-2/3 bg-yellow-500"
                                  : "w-full bg-green-500"
                              }`}
                            />
                          </div>
                          <span className={`text-xs ${passwordStrength.color}`}>
                            {passwordStrength.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">Metode Pembayaran</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Pilih metode pembayaran yang kamu inginkan
                  </p>

                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          selectedPayment === method.id
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-secondary hover:bg-secondary/80 border-2 border-transparent"
                        }`}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <div className="text-left flex-1">
                          <h4 className="font-semibold text-foreground">{method.name}</h4>
                          {method.number && (
                            <p className="text-sm text-muted-foreground">{method.number}</p>
                          )}
                        </div>
                        {selectedPayment === method.id && (
                          <Check className="text-primary" size={24} />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* QRIS Preview */}
                  {selectedPayment === "qris" && qrisImage && (
                    <div className="mb-6 p-4 rounded-xl bg-secondary">
                      <p className="text-sm font-medium text-foreground mb-3 text-center">QRIS Payment</p>
                      <div className="flex justify-center">
                        <Image
                          src={qrisImage}
                          alt="QRIS"
                          width={200}
                          height={200}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="p-4 rounded-xl bg-secondary space-y-2">
                    <h4 className="font-semibold text-foreground mb-3">Ringkasan Pesanan</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Paket</span>
                      <span className="text-foreground">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">RAM</span>
                      <span className="text-foreground">{selectedRam} GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Game</span>
                      <span className="text-foreground">{games.find(g => g.id === selectedGame)?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Server Software</span>
                      <span className="text-foreground">{eggs[selectedGame!]?.find(e => e.id === selectedEgg)?.name}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-primary text-lg">
                          Rp {getTotalPrice().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 glass flex items-center justify-between px-6 py-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">Rp {getTotalPrice().toLocaleString()}</p>
            </div>
            <button
              onClick={goNext}
              disabled={
                (step === "ram" && !canProceedToGame) ||
                (step === "game" && !canProceedToEgg) ||
                (step === "egg" && !canProceedToForm) ||
                (step === "form" && !canProceedToPayment) ||
                (step === "payment" && !canSubmit) ||
                isSubmitting
              }
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : step === "payment" ? (
                "Order via WhatsApp"
              ) : (
                "Lanjutkan"
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
