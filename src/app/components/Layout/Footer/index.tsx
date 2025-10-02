"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '../Header/Logo'
import { Icon } from '@iconify/react/dist/iconify.js'
import { FooterLinkType } from '@/app/types/footerlink'

const Footer = () => {
  
  const [footerlink, SetFooterlink] = useState<FooterLinkType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        SetFooterlink(data.FooterLinkData)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <footer className='bg-deep-slate pt-10'>
      <div className='container'>
        <div className='grid grid-cols-1 sm:grid-cols-6 lg:gap-20 md:gap-24 sm:gap-12 gap-12 pb-6'>
          <div className='col-span-2'>
            <div className='mb-6'>
              <Logo />
            </div>
            <div className='flex items-center gap-4'>
              <Link
                href='https://facebook.com'
                className='hover:text-primary text-black text-3xl'>
                <Icon icon='tabler:brand-facebook' />
              </Link>
              <Link
                href='https://twitter.com'
                className='hover:text-primary text-black text-3xl'>
                <Icon icon='tabler:brand-twitter' />
              </Link>
              <Link
                href='https://instagram.com'
                className='hover:text-primary text-black text-3xl'>
                <Icon icon='tabler:brand-instagram' />
              </Link>
            </div>
          </div>

          <div className='col-span-2'>
            <div className='flex gap-20'>
              {footerlink.map((product, i) => (
                <div key={product.section ?? `footer-${i}`} className='group relative col-span-2'>
                  <p className='text-black text-xl font-semibold mb-6'>
                    {product.section}
                  </p>
                  <ul>
                    {product.links.map((item, i) => (
                      <li key={item.label ?? `footer-link-${i}`} className='mb-3'>
                        <Link
                          href={item.href}
                          className='text-black/60 hover:text-primary text-base font-normal mb-6'>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className='col-span-2 sm:col-span-6 md:col-span-2'>
            <p className='text-black text-xl font-semibold mb-6'>
              Contact
            </p>
            <div className='flex flex-col gap-4'>
              <div className='flex item-center'>
                <Icon
                  icon='solar:point-on-map-perspective-bold'
                  className='text-primary text-3xl lg:text-2xl inline-block me-2'
                />
                <p className='text-black/60 hover:text-primary text-base'>
                  25 Rue de la Paix, 67000 Strasbourg
                </p>
              </div>
              <Link href='tel:+1(909) 235-9814' className='flex items-center w-fit'>
                <Icon
                  icon='solar:phone-bold'
                  className='text-primary text-3xl lg:text-2xl inline-block me-2'
                />
                <p className='text-black/60 hover:text-primary text-base'>
                  +33 5 12 34 56 78
                </p>
              </Link>
              <div className='flex item-center'>
                <Icon
                  icon='solar:clock-circle-bold'
                  className='text-primary text-3xl lg:text-2xl inline-block me-2'
                />
                <p className='text-black/60 hover:text-primary text-base'>
                  Lundi - Vendredi, 09:00 - 18:00 
                </p>
              </div>
              <Link href='/' className='flex items-center w-fit'>
                <Icon
                  icon='solar:mailbox-bold'
                  className='text-primary text-3xl lg:text-2xl inline-block me-2'
                />
                <p className='text-black/60 hover:text-primary text-base'>
                  info@groupeestformation.com
                </p>
              </Link>
              {/* Google Map 
              <div className='mt-4'>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9999999999995!2d7.750000000000001!3d48.58392000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4796c8e77f000001%3A0x123456789abcdef!2s25%20Rue%20de%20la%20Paix%2C%2067000%20Strasbourg!5e0!3m2!1sen!2sfr!4v1696250000000!5m2!1sen!2sfr"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              */}
            </div>
          </div>
        </div>

        <div className='mt-6 lg:flex items-center justify-between border-t border-black/10 py-3'>
          <p className='text-black/50 text-base text-center lg:text-start font-normal'>
            @2025 Agency. All Rights Reserved by{' '}
            <Link
              href='https://getnextjstemplates.com/'
              target='_blank'
              className='hover:text-primary hover:underline'>
              {' '}
              ID Protect
            </Link>
          </p>
          <div className='flex gap-5 mt-3 lg:mt-0 justify-center lg:justify-start'>
            <Link href='/' target='_blank'>
              <p className='text-black/50 text-base font-normal hover:text-primary hover:underline px-5 border-r border-grey/20'>
                Privacy policy
              </p>
            </Link>
            <Link href='/' target='_blank'>
              <p className='text-black/50 text-base font-normal hover:text-primary hover:underline'>
                Terms & conditions
              </p>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
