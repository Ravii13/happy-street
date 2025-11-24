import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" })
    }
    try {
        const token_decode = jwt.verify(token, "JWT_SECRET from process.env", process.env.STRIPE_SECRET_KEY)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Not authorized ,Invalid Token" })
    }
}

export default authMiddleware