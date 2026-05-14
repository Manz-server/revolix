"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Apa itu RevolixHost?",
    answer: "RevolixHost adalah penyedia layanan hosting game profesional yang menyediakan server game berkualitas tinggi dengan performa cepat, perlindungan DDoS, dan setup instan.",
  },
  {
    question: "Game apa saja yang didukung?",
    answer: "Kami mendukung berbagai game populer seperti Minecraft, Terraria, dan GTA (FiveM/SA-MP). Setiap game memiliki pilihan egg/server software yang berbeda sesuai kebutuhan.",
  },
  {
    question: "Berapa lama proses setup server?",
    answer: "Proses setup server sangat cepat, hanya membutuhkan waktu beberapa menit setelah pembayaran dikonfirmasi. Kami menyediakan free 1x setup untuk semua paket.",
  },
  {
    question: "Apakah ada jaminan uptime?",
    answer: "Ya, kami menjamin uptime 99.9% untuk semua server. Server kami dilengkapi dengan sistem monitoring 24/7 dan perlindungan anti down.",
  },
  {
    question: "Bagaimana sistem backup bekerja?",
    answer: "Server akan melakukan backup otomatis setiap hari. Backup disimpan dengan aman dan dapat di-restore kapan saja jika diperlukan.",
  },
  {
    question: "Metode pembayaran apa yang tersedia?",
    answer: "Kami menerima pembayaran via QRIS, DANA, dan GoPay untuk kemudahan transaksi kamu.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pertanyaan yang sering ditanyakan tentang layanan kami
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
