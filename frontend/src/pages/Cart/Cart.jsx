import React, { useEffect } from 'react'
import './Cart.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext)

  const navigate = useNavigate()

  const totalAmount = getTotalCartAmount()

  useEffect(() => {
    // when cart is empty show overlay and prevent background scroll
    if (totalAmount === 0) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => { document.body.classList.remove('no-scroll') }
  }, [totalAmount])

  if (totalAmount === 0) {
    return (
      <div className="cart-empty-overlay">
        <div className="cart-empty-card">
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any dishes yet. Browse our menu and add your favorites.</p>
          <button className="browse-btn" onClick={() => navigate('/#explore-menu')}>Browse Dishes</button>
        </div>
      </div>
    )
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          const qty = cartItems[item._id] || 0
          if (qty > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt="item-image" />
                  <p className="cart-item-title">{item.name}</p>
                  <p className="cart-price">₹{item.price}</p>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => removeFromCart(item._id)} aria-label={`Decrease ${item.name}`}>&minus;</button>
                    <span className="qty-value">{qty}</span>
                    <button className="qty-btn" onClick={() => addToCart(item._id)} aria-label={`Increase ${item.name}`}>&#43;</button>
                  </div>
                  <p className="cart-line-total">₹{item.price * qty}</p>
                  <p onClick={() => { while (cartItems[item._id] > 0) { removeFromCart(item._id) } }} className='cross' title="Remove item">X</p>
                </div>
                <hr />
              </div>
            )
          }
          return null
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>
            Cart Total
          </h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</p>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>
            Proceed To Checkout
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>
              If you have a Promo Code , Enter it here
            </p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Promo Code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart