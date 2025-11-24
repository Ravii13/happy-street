import React, { useEffect } from 'react'
import './Cart.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const { cartItems, food_list, removeFromCart, addToCart, setQuantity, getTotalCartAmount, url } = useContext(StoreContext)

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
        <table className="cart-table">
          <thead>
            <tr>
              <th>Items</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {food_list.map((item, index) => {
              const qty = cartItems[item._id] || 0
              if (qty > 0) {
                return (
                  <tr key={item._id}>
                    <td className="cart-img-cell">
                      <img src={url + "/images/" + item.image} alt="item-image" />
                    </td>
                    <td className="cart-title-cell">{item.name}</td>
                    <td className="cart-price-cell">₹{item.price}</td>
                    <td className="cart-qty-cell">
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => removeFromCart(item._id)} aria-label={`Decrease ${item.name}`}>&minus;</button>
                        <input type="number" className="qty-input" value={qty} min={0} onChange={(e) => setQuantity(item._id, Number(e.target.value))} />
                        <button className="qty-btn" onClick={() => addToCart(item._id)} aria-label={`Increase ${item.name}`}>&#43;</button>
                      </div>
                    </td>
                    <td className="cart-total-cell">₹{item.price * qty}</td>
                  </tr>
                )
              }
              return null
            })}
          </tbody>
        </table>
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