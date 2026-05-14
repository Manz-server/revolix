"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Pricing, type Package, packages } from "@/components/pricing"
import { Features } from "@/components/features"
import { FAQ } from "@/components/faq"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { OrderModal } from "@/components/order-modal"
import { SettingsModal, SettingsButton } from "@/components/settings-modal"

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [qrisImage, setQrisImage] = useState<string | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem("revolixhost-logo")
    const savedQris = localStorage.getItem("revolixhost-qris")
    if (savedLogo) setLogo(savedLogo)
    if (savedQris) setQrisImage(savedQris)
  }, [])

  // Save to localStorage when changed
  const handleLogoChange = (newLogo: string | null) => {
    setLogo(newLogo)
    if (newLogo) {
      localStorage.setItem("revolixhost-logo", newLogo)
    } else {
      localStorage.removeItem("revolixhost-logo")
    }
  }

  const handleQrisChange = (newQris: string | null) => {
    setQrisImage(newQris)
    if (newQris) {
      localStorage.setItem("revolixhost-qris", newQris)
    } else {
      localStorage.removeItem("revolixhost-qris")
    }
  }

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setIsOrderModalOpen(true)
  }

  const handleBuyNow = () => {
    // Default to the popular (medium) package
    const defaultPackage = packages.find(p => p.popular) || packages[0]
    setSelectedPackage(defaultPackage)
    setIsOrderModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar logo={logo} />
      <Hero onBuyNow={handleBuyNow} />
      <Pricing onSelectPackage={handleSelectPackage} />
      <Features />
      <FAQ />
      <Contact />
      <Footer logo={logo} />

      <SettingsButton onClick={() => setIsSettingsModalOpen(true)} />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedPackage={selectedPackage}
        qrisImage={qrisImage}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        logo={logo}
        qrisImage={qrisImage}
        onLogoChange={handleLogoChange}
        onQrisChange={handleQrisChange}
      />
    </main>
  )
}
