import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // Accept token either as `token` header or `Authorization: Bearer <token>`
    let token = req.headers.token
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            token = parts[1]
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" })
    }
    try {
        const secret = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || 'secret'
        const token_decode = jwt.verify(token, secret)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Not authorized, Invalid Token" })
    }
}

export default authMiddleware