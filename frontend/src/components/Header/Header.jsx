import React from 'react'
import './Header.css'
import { assets } from '../../assets/assets'

const Header = () => {
  return (
    <div className="header" >
      <img src={assets.header_img} alt="" className="header-image" />
      <div className="header-contents">
        <h2>
          Order Your Favourite Food Here
        </h2>
        <p>
          Welcome to our food delivery service! We bring your favorite meals right to your doorstep.
          Browse our menu, place your order, and enjoy delicious food without leaving your home.
        </p>
        <button>
          <a href="#explore-menu">
          Veiw Menu</a>
        </button>
      </div>
    </div>
  )
}

export default Header