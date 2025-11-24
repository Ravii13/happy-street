import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

//app config
const app = express()
const port =process.env.PORT|| 3000

// middleware
app.use(express.json())
// Configure CORS: if a production/base URL is provided, restrict to it; otherwise allow all origins.
const publicUrl = process.env.BASE_URL || process.env.PRODUCTION_URL || process.env.PUBLIC_URL || null
if (publicUrl) {
    app.use(cors({ origin: publicUrl }))
} else {
    app.use(cors())
}

// db connection
connectDB()

//Api end Point
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// Serve admin static files (SPA) at /admin
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const adminPath = path.join(__dirname, '..', 'admin')

// Only mount local admin static files when the directory exists.
if (fs.existsSync(adminPath)) {
    app.use('/admin', express.static(adminPath))
    app.get('/admin/*', (req, res) => {
        const indexFile = path.join(adminPath, 'index.html')
            if (fs.existsSync(indexFile)) {
                res.sendFile(indexFile)
            } else {
                // Admin build missing — return 404 rather than redirecting.
                res.status(404).send('Admin build not found')
            }
    })
} else {
    // If admin directory is missing, respond with 404 so nginx or the client can handle it.
    app.use('/admin', (req, res) => {
        res.status(404).send('Admin build not found')
    })
}

// Serve frontend (Vite build) at root when present. Placed after API routes so
// `/api`, `/images`, and `/admin` keep precedence.
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist')
if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath))

    // SPA fallback for routes not starting with /api, /images, or /admin
    app.get('/*', (req, res, next) => {
        const url = req.path
        if (url.startsWith('/api') || url.startsWith('/images') || url.startsWith('/admin')) {
            return next()
        }
        res.sendFile(path.join(frontendPath, 'index.html'))
    })

    console.log('Frontend static serving enabled at / (from frontend/dist)')
} else {
    app.get("/", (req, res) => {
        res.send("Api working")
    })
    console.log('Frontend dist not found; root returns API text')
}

app.listen(port, () => {
    const displayUrl = publicUrl || `http://localhost:${port}`
    console.log(`Server Started on ${displayUrl}`)
})