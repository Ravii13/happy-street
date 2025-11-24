import { createContext, useEffect, useState, useRef } from "react";
import axios from 'axios'
export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:3000"
    const [token, setTokenState] = useState("")
    const [food_list, setFoodList] = useState([])
    const [authChecked, setAuthChecked] = useState(false)
    const logoutTimerRef = useRef(null)

    const getTotalCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item)
                totalAmount += itemInfo.price * cartItems[item]
            }
        }
        return totalAmount
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list")
        setFoodList(response.data.data)
    }


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })
        setCartItems(response.data.cartData)
    }

    // helper to clear scheduled logout
    const clearLogoutTimer = () => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current)
            logoutTimerRef.current = null
        }
    }

    const logout = () => {
        setTokenState("")
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiry')
        clearLogoutTimer()
    }

    const scheduleLogout = (expiryTs) => {
        clearLogoutTimer()
        const ms = expiryTs - Date.now()
        if (ms > 0) {
            logoutTimerRef.current = setTimeout(() => {
                logout()
            }, ms)
        } else {
            logout()
        }
    }

    // wrapper for setting token that also stores expiry and schedules auto-logout
    const setToken = (tok) => {
        if (tok) {
            setTokenState(tok)
            const expiry = Date.now() + 30 * 60 * 1000 // 30 minutes
            localStorage.setItem('token', tok)
            localStorage.setItem('tokenExpiry', String(expiry))
            scheduleLogout(expiry)
            // load cart now that we have token
            loadCartData(tok).catch(() => {})
        } else {
            logout()
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList()
            // try restore token from storage and its expiry
            const stored = localStorage.getItem('token')
            const expiry = Number(localStorage.getItem('tokenExpiry') || 0)
            if (stored && expiry && expiry > Date.now()) {
                // restore token without overwriting expiry
                setTokenState(stored)
                scheduleLogout(expiry)
                try { await loadCartData(stored) } catch (e) {}
            } else {
                // cleanup stale values
                localStorage.removeItem('token')
                localStorage.removeItem('tokenExpiry')
            }
            setAuthChecked(true)
        }
        loadData()
        // cleanup on unmount
        return () => clearLogoutTimer()
    }, [])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        authChecked,
        logout
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider