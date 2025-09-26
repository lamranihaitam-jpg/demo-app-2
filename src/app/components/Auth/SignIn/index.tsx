'use client'

import Link from 'next/link'
import SocialSignIn from '../SocialSignIn'
import Logo from '@/app/components/Layout/Header/Logo'

const Signin = () => {
  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <SocialSignIn />

      <span className='z-1 relative my-8 block text-center  before:absolute before:h-px before:w-[40%] before:bg-black/20 before:left-0 before:top-3  after:absolute after:h-px after:w-[40%] after:bg-black/20 after:top-3 after:right-0'>
        <span className='text-body-secondary relative z-10 inline-block px-3 text-base text-black'>
          OU
        </span>
      </span>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className='mb-[22px]'>
          <input
            type='email'
            placeholder='E-mail'
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type='password'
            placeholder='Mot de passe'
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-9'>
          <button
            type='submit'
            className='bg-primary w-full py-3 rounded-lg text-18 font-medium border text-white border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'>
            Se connecter
          </button>
        </div>
      </form>

      <Link
        href='/'
        className='mb-2 inline-block text-base text-black hover:text-primary  hover:underline'>
        Mot de passe oublié ?
      </Link>
      <p className='text-black text-base'>
        Vous n'avez pas de compte ?{' '}
        <Link href='/' className='text-primary hover:underline'>
          Inscrivez-vous
        </Link>
      </p>
    </>
  )
}

export default Signin
