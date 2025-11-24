import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <hr />
            <div className="footer-content">
                <div className="footer-content-left">
                    <h1 className='logo'>
                        <img src={assets.logo} alt="" className="logo" />
                        Happy Street
                    </h1>
                    <p>
                        © 2023 Foodie. All rights reserved. <br />
                        Made with ❤️ by <a href="" target="_blank" rel="noopener noreferrer">Ravi Bhatiya</a>
                    </p>
                    <div className="footer-social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src={assets.facebook_icon} alt="Facebook" />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src={assets.twitter_icon} alt="twitter" />
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src={assets.linkedin_icon} alt="linkedin" />
                        </a>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#explore-menu">Delivery</a></li>
                        <li><a href="#food-display">Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>
                        GET IN TOUCH
                    </h2>
                    <li>
                        <a href="">
                            +91 1234567890
                        </a>
                    </li>
                    <li>
                        <a href="">
                            contact@HappyStreet.com
                        </a>
                    </li>
                </div>
            </div>
            <hr />
            <p>
                © 2023 Foodie. All rights reserved.
            </p>
        </div>
    )
}

export default Footer
