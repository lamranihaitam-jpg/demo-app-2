"use client"

import { useState } from 'react'
import { Icon } from '@iconify/react'

const FAQ = () => {
  const faqs = [
    {
      id: 'q1',
      q: "Quels modes de paiement acceptez-vous ?",
      a: "Nous acceptons les cartes de crédit principales et PayPal. Les plans gratuits ne nécessitent pas de paiement.",
    },
    {
      id: 'q2',
      q: "Puis-je annuler mon abonnement à tout moment ?",
      a: "Oui — vous pouvez annuler votre abonnement à tout moment depuis votre profil. Aucune pénalité n'est appliquée.",
    },
    {
      id: 'q3',
      q: "Les certificats sont-ils reconnus par l'industrie ?",
      a: "Nos certificats sont conçus pour montrer des compétences pratiques ; certains sont reconnus par des employeurs partenaires.",
    },
    {
      id: 'q4',
      q: "Les certificats sont-ils reconnus par l'industrie ?",
      a: "Nos certificats sont conçus pour montrer des compétences pratiques ; certains sont reconnus par des employeurs partenaires.",
    },
    {
      id: 'q5',
      q: "Les certificats sont-ils reconnus par l'industrie ?",
      a: "Nos certificats sont conçus pour montrer des compétences pratiques ; certains sont reconnus par des employeurs partenaires.",
    },
  ]

  const [open, setOpen] = useState<string | null>(null)

  return (
  <section id="faq" className="py-16 bg-white scroll-mt-12">
      <div className="container">
        <h2 className="text-midnight_text mb-6">FAQ</h2>
        <p className="text-black/70 mb-8 max-w-2xl">Questions fréquemment posées par nos apprenants.</p>

        <div className="space-y-4 max-w-3xl">
          {faqs.map((f) => (
            <div key={f.id} className="bg-white border border-black/10 rounded-lg p-4 
             shadow-sm transition-all duration-300 
             hover:bg-[#E0E2FF]/25 hover:shadow-lg hover:border-primary hover:-translate-y-1">
              <button
                onClick={() => setOpen(open === f.id ? null : f.id)}
                className="flex justify-between items-center w-full text-left transition-colors duration-200 hover:text-primary">
                <div className="flex items-center gap-4">
                  <Icon icon="material-symbols:help-outline" width={24} height={24} />
                  <span className="font-medium">{f.q}</span>
                </div>
                <span>{open === f.id ? '-' : '+'}</span>
              </button>

              {open === f.id && <p className="mt-3 text-black/70">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
