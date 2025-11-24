import React, { useState, useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Startup from './pages/Startup/Startup'
import { StoreContext } from './context/StoreContext'
import { Navigate } from 'react-router-dom'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [loginMode, setLoginMode] = useState("Login")
  const { token, authChecked } = useContext(StoreContext)
  // console.log("setShowLogin", setShowLogin);
  // console.log("typeof setShowLogin", typeof setShowLogin);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} initialState={loginMode} /> : <></>}
      <div className="app">
        {/* wait until auth is checked to avoid redirecting on refresh */}
        {!authChecked ? null : (token && <Navbar setShowLogin={setShowLogin} setLoginMode={setLoginMode} />)}
        <Routes>
          <Route path="/startup" element={<Startup setShowLogin={setShowLogin} setLoginMode={setLoginMode} />} />
          <Route path="/" element={!authChecked ? null : (token ? <Home /> : <Navigate to="/startup" replace />)} />
          <Route path="/cart" element={!authChecked ? null : (token ? <Cart /> : <Navigate to="/startup" replace />)} />
          <Route path="/order" element={!authChecked ? null : (token ? <PlaceOrder /> : <Navigate to="/startup" replace />)} />
          <Route path="/verify" element={!authChecked ? null : (token ? <Verify /> : <Navigate to="/startup" replace />)} />
          <Route path="/myorders" element={!authChecked ? null : (token ? <MyOrders /> : <Navigate to="/startup" replace />)} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
