import React, { useEffect } from 'react'
import './Startup.css'
import { assets } from '../../assets/assets'

const Startup = ({ setShowLogin, setLoginMode }) => {

  const handleSignUp = () => {
    setLoginMode && setLoginMode('Sign-Up')
    setShowLogin && setShowLogin(true)
    // also dispatch a global event so App can open the popup even if prop isn't passed
    window.dispatchEvent(new CustomEvent('openLogin', { detail: { mode: 'Sign-Up' } }))
  }

  const handleLogin = () => {
    setLoginMode && setLoginMode('Login')
    setShowLogin && setShowLogin(true)
    window.dispatchEvent(new CustomEvent('openLogin', { detail: { mode: 'Login' } }))
  }

  useEffect(() => {
    // Prevent background scroll on the startup landing page
    document.body.classList.add('no-scroll')
    return () => document.body.classList.remove('no-scroll')
  }, [])

  return (
    <div className="startup-page">
      <div className="startup-hero">
        <div className="startup-hero-left">
          <img src={assets.logo} alt="MyFood logo" className="startup-logo" />
          <h1>Welcome to MyFood</h1>
          <p>Create an account to explore top dishes, save favorites and place orders.</p>
          <div className="startup-actions">
            <button className="primary" onClick={handleSignUp}>Create Account</button>
            <button className="link" onClick={handleLogin}>I already have an account</button>
          </div>
        </div>
        <div className="startup-hero-right" aria-hidden="true">
          <div className="hero-card">
            <img src={assets.header_img} alt="Delicious food"/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Startup
