"use client"

import { Icon } from '@iconify/react'
import Link from 'next/link'

const Pricing = () => {
  const plans = [
    {
      id: 'basic',
      title: 'Basique',
      desc: "Commencez et explorez vos intérêts, apprenez les compétences essentielles.",
      price: '0',
      period: 'par mois',
      icon: 'tabler:shield-check',
      features: [
        'Accès à 3 cours pour débutants',
        'Support communautaire',
        'Ressources téléchargeables',
        "Aucune carte de crédit requise",
      ],
    },
    {
      id: 'growth',
      title: 'Croissance',
      desc: "Construisez des compétences fondamentales avec 10 cours essentiels.",
      price: '19',
      period: 'par mois',
      icon: 'tabler:trending-up',
      features: [
        'Cours vidéo dirigés par des experts',
        'Ressources téléchargeables',
        'Support communautaire',
        "Certificat d'achèvement",
      ],
    },
    {
      id: 'scale',
      title: 'Évolution',
      desc: "Faites progresser votre carrière avec un contenu d'apprentissage en accès total.",
      price: '49',
      period: 'par mois',
      icon: 'tabler:arrows-maximize',
      features: [
        'Parcours d’apprentissage personnalisés',
        'Sessions Q&A en direct',
        "Accès premium à la communauté",
        "Certificats reconnus par l'industrie",
      ],
    },
  ]

  return (
  <section id="pricing" className="py-20 bg-deep-slate scroll-mt-12">
      <div className="container">
  <h2 className="text-midnight_text mb-6">Nos offres</h2>
  <p className="text-black/70 mb-10 max-w-2xl">Choisissez un plan adapté à votre rythme d'apprentissage et vos objectifs professionnels.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-2xl shadow-md border border-black/10 
             transition-all duration-300 hover:shadow-xl hover:border-primary 
             hover:-translate-y-2"> 
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 text-primary rounded-full p-3">
                  <Icon icon={plan.icon} width={28} height={28} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{plan.title}</h3>
                  <p className="text-black/70 text-sm">{plan.desc}</p>
                </div>
              </div>

              <div className="my-6">
                <p className="text-3xl font-bold">{plan.price} €</p>
                <p className="text-sm text-black/60">{plan.period}</p>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Icon icon="tabler:check" className="text-primary" />
                    <span className="text-black/70">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="#" className="inline-block">
                <button className="bg-primary text-white px-6 py-2 rounded-lg 
             transition-transform duration-300 hover:scale-105 hover:shadow-lg">Commencer</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
