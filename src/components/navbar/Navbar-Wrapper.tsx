'use client'
import { useEffect } from 'react'
import Navbar from './Navbar'
import AOS from 'aos'

const NavbarWrapper = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    })
  }, [])

  return <Navbar />
}

export default NavbarWrapper