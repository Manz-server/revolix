"use client"

import { motion } from "framer-motion"
import { Check, Cpu, Zap, Crown } from "lucide-react"

export interface Package {
  id: string
  name: string
  price: number
  cpu: string
  icon: React.ReactNode
  popular?: boolean
  features: string[]
}

interface PricingProps {
  onSelectPackage: (pkg: Package) => void
}

const packages: Package[] = [
  {
    id: "lite",
    name: "Lite Package",
    price: 6500,
    cpu: "Intel Platinum 8370C",
    icon: <Zap className="w-8 h-8" />,
    features: [
      "Anti Down",
      "Anti DDoS",
      "Free 1x Setup",
      "Online 24/7",
      "Auto Backup Harian",
      "Low Latency Connection",
    ],
  },
  {
    id: "medium",
    name: "Medium Package",
    price: 15000,
    cpu: "AMD EPYC 7433P",
    icon: <Cpu className="w-8 h-8" />,
    popular: true,
    features: [
      "Anti Down",
      "Anti DDoS",
      "Free 1x Setup",
      "Online 24/7",
      "Auto Backup Harian",
      "Low Latency Connection",
    ],
  },
  {
    id: "extreme",
    name: "Extreme Package",
    price: 25000,
    cpu: "Ryzen 7 3700X",
    icon: <Crown className="w-8 h-8" />,
    features: [
      "Anti Down",
      "Anti DDoS",
      "Free 1x Setup",
      "Online 24/7",
      "Auto Backup Harian",
      "Low Latency Connection",
    ],
  },
]

export function Pricing({ onSelectPackage }: PricingProps) {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pilih paket hosting yang sesuai dengan kebutuhan server game kamu
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative group ${pkg.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-primary-foreground text-sm font-medium z-10">
                  Most Popular
                </div>
              )}
              
              <div
                className={`h-full glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 cursor-pointer ${
                  pkg.popular ? "border-primary/30 shadow-lg shadow-primary/10" : ""
                }`}
                onClick={() => onSelectPackage(pkg)}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  pkg.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>
                  {pkg.icon}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pkg.cpu}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-sm text-muted-foreground">Rp</span>
                  <span className="text-4xl font-bold text-foreground">{pkg.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/GB</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check size={16} className="text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                    pkg.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                      : "bg-secondary border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  }`}
                >
                  Pilih Paket
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { packages }
