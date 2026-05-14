"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Clock, HardDrive, Wifi, HeadsetIcon } from "lucide-react"

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Anti DDoS Protection",
    description: "Perlindungan DDoS tingkat enterprise untuk menjaga server kamu tetap online dan aman.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Performa Tinggi",
    description: "Hardware server terbaru dengan prosesor kelas enterprise untuk performa maksimal.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Online 24/7",
    description: "Server online sepanjang waktu dengan uptime 99.9% dan monitoring real-time.",
  },
  {
    icon: <HardDrive className="w-6 h-6" />,
    title: "Auto Backup",
    description: "Backup otomatis harian untuk menjaga data server kamu tetap aman.",
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    title: "Low Latency",
    description: "Koneksi latency rendah dengan server lokasi strategis untuk ping optimal.",
  },
  {
    icon: <HeadsetIcon className="w-6 h-6" />,
    title: "Support 24/7",
    description: "Tim support profesional siap membantu kamu kapan saja via Discord dan WhatsApp.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">RevolixHost</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fitur-fitur unggulan yang membuat hosting game kamu lebih baik
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
