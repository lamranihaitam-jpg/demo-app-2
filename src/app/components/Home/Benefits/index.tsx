"use client"

import Image from 'next/image'

const Benefits = () => {
  const items = [
    {
      id: 'coaching',
      title: "Coaching d'Équipe",
      desc: "Apprenez auprès de leaders du secteur avec des cours conçus pour fournir des connaissances et compétences pratiques du monde réel.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="#6556FF" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'lifetime',
      title: 'Accès à Vie',
      desc: "Profitez d'un accès illimité à vos cours avec un paiement unique — apprenez à votre rythme, à tout moment.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="#6556FF" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'certificate',
      title: 'Certificat de Réussite',
      desc: "Mettez en valeur votre réussite avec un certificat reconnu, ajoutant de la valeur à votre CV et à votre évolution de carrière.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="#6556FF" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      id: 'community',
      title: 'Communauté Collaborative',
      desc: "Rejoignez une communauté dynamique d'apprenants et de professionnels, échangez des idées et développez votre réseau.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="#6556FF" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="benefits" className="py-20 bg-gray-50 scroll-mt-12">
      <div className="container">

        {/* Titres */}
        <h2 className="text-midnight_text mb-6">Apprenez, progressez, réussissez avec nous</h2>


        {/* Image principale */}
        <div className="mb-16">
          <div className="relative w-full h-155 rounded-2xl overflow-hidden">
            <Image 
              src="/images/testimonial/banner-img.png" 
              alt="Team working together" 
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Grid des avantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-start space-x-4">
              {/* Icône */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{backgroundColor: '#D5EFFA'}}>
                  {item.icon}
                </div>
              </div>
              
              {/* Contenu */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits