import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const LoginPopup = ({ setShowLogin, initialState }) => {

    const { url, setToken } = useContext(StoreContext)
    const navigate = useNavigate()
    const [currState, setCurrState] = useState(initialState || "Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault()
        let newUrl = url
        if (currState === "Login") {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data)

        if (response.data.success) {
            setToken(response.data.token)
            setShowLogin(false)
            navigate('/')
        } else {
            alert(response.data.message)
        }
    }

    useEffect(() => {
        // disable background scroll while popup is open
        document.body.classList.add('no-scroll')
        return () => {
            document.body.classList.remove('no-scroll')
        }
    }, [])

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container" aria-modal="true">
                <button type="button" className="login-close" onClick={() => setShowLogin(false)} aria-label="Close login">
                    <img src={assets.cross_icon} alt="close" />
                </button>

                <div className="login-popup-grid">
                    <div className="login-left">
                        <div className="login-hero">
                            <img src={assets.header_img} alt="delicious food" />
                        </div>
                        <div className="login-hero-text">
                            <h3>Welcome to MyFood</h3>
                            <p>Fast delivery · Favourite dishes · Secure payments</p>
                        </div>
                    </div>

                    <div className="login-right">
                        <div className="login-popup-title">
                            <h2>{currState}</h2>
                        </div>

                        <div className="login-popup-input">
                            {currState === "Login" ? <></> : <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Full Name' required />}
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required />
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                        </div>

                        <div className="login-popup-condition">
                            <input type="checkbox" required />
                            <p>
                                By signing up, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
                            </p>
                        </div>

                        <button type='submit' className="login-primary">{currState === "Sign-Up" ? "Create Account" : "Login"}</button>

                        <div className="login-popup-toggle-text">
                            {currState === "Login"
                                ? <p>Create a new account? <span onClick={() => setCurrState("Sign-Up")}>Click Here</span></p>
                                : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login Here</span></p>
                            }
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginPopup