"use client";

import Link from "next/link";
import SocialSignUp from "../SocialSignUp";
import Logo from "@/app/components/Layout/Header/Logo";

const SignUp = () => {
  
  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <SocialSignUp />

      <span className="z-1 relative my-8 block text-center before:content-[''] before:absolute before:h-px before:w-[40%] before:bg-black/20 before:bg-opacity-60 before:left-0 before:top-3 after:content-[''] after:absolute after:h-px after:w-[40%] after:bg-black/20 after:bg-opacity-60 after:top-3 after:right-0">
        <span className='text-body-secondary relative z-10 inline-block px-3 text-base text-black'>
          OU 
        </span>
      </span>

      <form>
        <div className='mb-[22px]'>
          <input
            type='text'
            placeholder='Nom et prénom'
            name='name'
            required
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type='email'
            placeholder='E-mail'
            name='email'
            required
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            type='password'
            placeholder='Mot de passe'
            name='password'
            required
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-9'>
          <button
            type='submit'
            className='flex w-full items-center text-18 font-medium text-white justify-center rounded-md bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border hover:cursor-pointer'>
            S'inscrire
          </button>
        </div>
      </form>

      <p className='text-body-secondary mb-4 text-black/60 text-base'>
        En vous inscrivant, vous acceptez nos{' '}
        <a href='/' className='text-primary hover:underline'>
          Conditions d'utilisation
        </a>{' '}
        et notre{' '}
        <a href='/' className='text-primary hover:underline'>
          Politique de confidentialité.
        </a>
      </p>

      <p className='text-body-secondary text-black/60 text-base'>
        Vous avez déjà un compte ?
        <Link href='/' className='pl-2 text-primary hover:underline'>
          Connectez-vous
        </Link>
      </p>
    </>
  )
};

export default SignUp;
