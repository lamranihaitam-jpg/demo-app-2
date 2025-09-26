'use client'
import React from 'react'
import { useState, useEffect } from 'react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phnumber: '',
    motif:'',
    Message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ''
    )
    setIsFormValid(isValid)
  }, [formData])
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const reset = () => {
    formData.firstname = ''
    formData.lastname = ''
    formData.email = ''
    formData.phnumber = ''
    formData.motif = ''
    formData.Message = ''
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoader(true)

    fetch('https://formsubmit.co/ajax/bhainirav772@gmail.com', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        Name: formData.firstname,
        LastName: formData.lastname,
        Email: formData.email,
        PhoneNo: formData.phnumber,
        Motif: formData.motif, 
        Message: formData.Message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSubmitted(true)
          setShowThanks(true)
          reset()

          setTimeout(() => {
            setShowThanks(false)
          }, 5000)
        }

        reset()
      })
      .catch((error) => {
        setLoader(false)
        console.log(error.message)
      })
  }
  return (
  <section id='contact' className='bg-deep-slate scroll-mt-12'>
      <div className='container'>
        <div className='relative'>
          <h2 className='mb-9 text-midnight_text'>Contactez-Nous</h2>
          <div className='relative border border-black px-6 py-2 rounded-2xl'>
            <form
              onSubmit={handleSubmit}
              className='flex flex-wrap w-full m-auto justify-between'>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='fname'
                    className='pb-3 inline-block text-base'>
                    Prénom *
                  </label>
                  <div className='border border-black rounded-2xl p-3 transition-colors duration-200 hover:border-primary focus-within:border-primary'>
                    <input
                      id='fname'
                      type='text'
                      name='firstname'
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder='Votre prénom'
                      className='w-full text-base px-4 py-0.8 bg-transparent rounded-lg border-0 focus:outline-0'
                    />
                  </div>
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='lname'
                    className='pb-3 inline-block text-base'>
                    Nom *
                  </label>
                  <div className='border border-black rounded-2xl p-3 transition-colors duration-200 hover:border-primary focus-within:border-primary'>
                    <input
                      id='lname'
                      type='text'
                      name='lastname'
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder='Votre nom'
                      className='w-full text-base px-4 py-0.8 bg-transparent rounded-lg border-0 focus:outline-0'
                    />
                  </div>
                </div>
              </div>
              <div className='sm:flex gap-6 w-full'>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='email'
                    className='pb-3 inline-block text-base'>
                    E-mail *
                  </label>
                  <div className='border border-black rounded-2xl p-3 transition-colors duration-200 hover:border-primary focus-within:border-primary'>
                    <input
                      id='email'
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Votre adresse e-mail'
                      className='w-full text-base px-4 py-0.8 bg-transparent rounded-lg border-0 focus:outline-0'
                    />
                  </div>
                </div>
                <div className='mx-0 my-2.5 flex-1'>
                  <label
                    htmlFor='Phnumber'
                    className='pb-3 inline-block text-base'>
                    N de téléphone *
                  </label>
                  <div className='border border-black rounded-2xl p-3 transition-colors duration-200 hover:border-primary focus-within:border-primary'>
                    <input
                      id='Phnumber'
                      type='tel'
                      name='phnumber'
                      placeholder='Votre N de téléphone'
                      value={formData.phnumber}
                      onChange={handleChange}
                      className='w-full text-base px-4 py-0.8 bg-transparent rounded-lg border-0 focus:outline-0'
                    />
                  </div>
                </div>
              </div>

              <div className='w-full mx-0 my-2.5'>
                <label htmlFor='motif' className='pb-3 inline-block text-base'>
                  Motif du contact *
                </label>
                <div className='border border-black rounded-2xl p-3 transition-colors duration-200 hover:border-primary focus-within:border-primary'>
                  <select
                    id='motif'
                    name='motif'
                    value={formData.motif}
                    onChange={handleChange}
                    className='w-full text-base px-4 py-0.8 bg-transparent rounded-lg border-0 focus:outline-0'>
                    <option value='Inscription'>Je souhaite m'inscrire à une formation</option>
                    <option value='Support technique'>J'aimerais des informations complémentaires</option>
                    <option value='Partenariat'>Je souhaite devenir partenaire</option>
                    <option value='Feedback'>Je souhaite donner mon avis</option>
                    <option value='Autre'>Autre</option>
                  </select>
                </div>
              </div>

              <div className='w-full mx-0 my-2.5 flex-1'>
                <label htmlFor='message' className='pb-3 inline-block text-base'>
                  Message *
                </label>
                <div className='border border-black rounded-2xl p-3 transition-colors duration-200 hover:border-primary focus-within:border-primary'>
                  <textarea
                    id='message'
                    name='Message'
                    value={formData.Message}
                    onChange={handleChange}
                    className='w-full mt-2 px-4 py-0.8 h-15 bg-transparent rounded-lg border-0 focus:outline-0'
                    placeholder='Votre message'></textarea>
                </div>
              </div>
              <div className='mx-0 my-2.5 w-full'>
                <button
                  type='submit'
                  disabled={!isFormValid || loader}
                  className={`border leading-none px-6 text-lg font-medium py-4 rounded-full 
                    ${
                      !isFormValid || loader
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary border-primary text-white hover:bg-transparent hover:text-primary cursor-pointer'
                    }`}>
                  Envoyer
                </button>
              </div>
            </form>
          </div>
          {showThanks && (
            <div className='text-white bg-primary rounded-full px-4 text-lg mb-4.5 mt-1 absolute flex items-center gap-2'>
              Thank you for contacting us! We will get back to you soon.
              <div className='w-3 h-3 rounded-full animate-spin border-2 border-solid border-white border-t-transparent'></div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactForm
