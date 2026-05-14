"use client"

import Link from "next/link"
import Image from "next/image"

interface FooterProps {
  logo: string | null
}

export function Footer({ logo }: FooterProps) {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {logo ? (
              <Image
                src={logo}
                alt="RevolixHost"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">R</span>
              </div>
            )}
            <span className="text-lg font-bold text-foreground">
              Revolix<span className="text-primary">Host</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#home" className="hover:text-primary transition-colors">Home</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 RevolixHost. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
