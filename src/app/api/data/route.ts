import { CourseType } from '@/app/types/course'
import { FooterLinkType } from '@/app/types/footerlink'
import { MentorType } from '@/app/types/mentor'
import { HeaderType } from '@/app/types/menu'
import { TestimonialType } from '@/app/types/testimonial'
import { NextResponse } from 'next/server'

const HeaderData: HeaderType[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Formations', href: '/#courses' },
  { label: 'Mentors', href: '/#mentor' },
  { label: 'Calendrier', href: '/#calendar' }, 
  { label: 'Témoignages', href: '/#testimonial' },
  { label: 'Tarifs', href: '/#pricing' },
  //{ label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
]

const TechGaintsData: { imgSrc: string }[] = [
  {
    imgSrc: '/images/companies/airbnb.svg',
  },
  {
    imgSrc: '/images/companies/fedex.svg',
  },
  {
    imgSrc: '/images/companies/google.svg',
  },
  {
    imgSrc: '/images/companies/hubspot.svg',
  },
  {
    imgSrc: '/images/companies/microsoft.svg',
  },
  {
    imgSrc: '/images/companies/walmart.svg',
  },
  {
    imgSrc: '/images/companies/airbnb.svg',
  },
  {
    imgSrc: '/images/companies/fedex.svg',
  },
]

const CourseData: CourseType[] = [
  {
    heading: 'Formation 1',
    name: 'Formateur 1',
    imgSrc: '/images/courses/coursesOne.png',
    students: 150,
    classes: 12,
    price: 20,
    rating: 4.4,
  },
  {
    heading: 'Formation 2',
    name: 'Formateur 2',
    imgSrc: '/images/courses/coursesTwo.png',
    students: 130,
    classes: 12,
    price: 20,
    rating: 4.5,
  },
  {
    heading: 'Formation 3',
    name: 'Formateur 3',
    imgSrc: '/images/courses/coursesThree.png',
    students: 120,
    classes: 12,
    price: 20,
    rating: 5.0,
  },
  {
    heading: 'Formation 4',
    name: 'Formateur 4',
    imgSrc: '/images/courses/coursesFour.png',
    students: 150,
    classes: 12,
    price: 20,
    rating: 5.0,
  },
]

const MentorData: MentorType[] = [
  {
    profession: 'Spécialité X',
    name: 'John Doe',
    imgSrc: '/images/mentor/user1.webp',
  },
  {
    profession: 'Spécialité Y',
    name: 'John Doe',
    imgSrc: '/images/mentor/user2.webp',
  },
  {
    profession: 'Spécialité Z',
    name: 'John Doe',
    imgSrc: '/images/mentor/user3.webp',
  },
]

const TestimonialData: TestimonialType[] = [
  {
    name: 'Michelle Bennett',
    profession: 'CEO, Parkview International Ltd',
    comment:
      'Cette formation m’a permis d’acquérir de nouvelles compétences et de gagner en confiance dans mon travail de sécurité. Je la recommande vivement.',
    imgSrc: '/images/testimonial/user1.webp',
    rating: 5,
  },
  {
    name: 'Leslie Alexander',
    profession: 'Founder, TechWave Solutions',
    comment:
      'Cette formation m’a permis d’acquérir de nouvelles compétences et de gagner en confiance dans mon travail de sécurité. Je la recommande vivement.',
    imgSrc: '/images/testimonial/user2.webp',
    rating: 5,
  },
  {
    name: 'Cody Fisher',
    profession: 'Product Manager, InnovateX',
    comment:
      'Cette formation m’a permis d’acquérir de nouvelles compétences et de gagner en confiance dans mon travail de sécurité. Je la recommande vivement.',
    imgSrc: '/images/testimonial/user3.webp',
    rating: 5,
  },
]

const FooterLinkData: FooterLinkType[] = [
  {
    section: 'Navigation',
    links: [
      { label: 'Acceuil', href: '/' },
      { label: 'Formations', href: '/#courses' },
      { label: 'Mentor', href: '/#mentor' },
      { label: 'Calendrier', href: '/#calendar' },
      { label: 'Témoignages', href: '/#testimonial' },
      { label: 'Tarifs', href: '/#pricing' },
      //{ label: 'FAQ', href: '/#faq' },
      { label: 'Contact', href: '/#contact' },

    ],
  },
  {
    section: 'À propos',
    links: [
      { label: 'Our Team', href: '/' },
      { label: 'career', href: '/' },
      { label: 'Services', href: '/' },
      { label: 'Affiliates', href: '/' },
    ],
  },
]

export const GET = () => {
  return NextResponse.json({
    HeaderData,
    TechGaintsData,
    CourseData,
    MentorData,
    TestimonialData,
    FooterLinkData,
  })
}
