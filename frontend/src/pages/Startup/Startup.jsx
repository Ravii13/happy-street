import React from 'react'
import './Startup.css'
import { assets } from '../../assets/assets'

const Startup = ({ setShowLogin, setLoginMode }) => {

  const handleSignUp = () => {
    setLoginMode && setLoginMode('Sign-Up')
    setShowLogin(true)
  }

  const handleLogin = () => {
    setLoginMode && setLoginMode('Login')
    setShowLogin(true)
  }

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
