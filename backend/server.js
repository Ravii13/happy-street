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
try {
    app.use("/api/food", foodRouter)
} catch (err) {
    console.error('Error mounting /api/food', err)
}

try {
    app.use("/images", express.static('uploads'))
} catch (err) {
    console.error('Error mounting /images static', err)
}

try {
    app.use("/api/user", userRouter)
} catch (err) {
    console.error('Error mounting /api/user', err)
}

try {
    app.use("/api/cart", cartRouter)
} catch (err) {
    console.error('Error mounting /api/cart', err)
}

try {
    app.use("/api/order", orderRouter)
} catch (err) {
    console.error('Error mounting /api/order', err)
}

// Serve admin static files (SPA) at /admin
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const adminPath = path.join(__dirname, '..', 'admin')

// Only mount local admin static files when the directory exists.
if (fs.existsSync(adminPath)) {
    try {
        app.use('/admin', express.static(adminPath))
    } catch (err) {
        console.error('Error mounting /admin static', err)
    }
    try {
        // SPA fallback for admin: if a request starts with /admin and wasn't handled
        // by the static middleware above, serve index.html so the admin SPA can handle routing.
        app.use((req, res, next) => {
            if (!req.path.startsWith('/admin')) return next()
            const indexFile = path.join(adminPath, 'index.html')
            if (fs.existsSync(indexFile)) {
                return res.sendFile(indexFile)
            }
            return res.status(404).send('Admin build not found')
        })
    } catch (err) {
        console.error('Error registering admin SPA fallback', err)
    }
} else {
    // If admin directory is missing, respond with 404 so nginx or the client can handle it.
    try {
        app.use('/admin', (req, res) => {
            res.status(404).send('Admin build not found')
        })
    } catch (err) {
        console.error('Error mounting fallback /admin', err)
    }
}

// Serve frontend (Vite build) at root when present. Placed after API routes so
// `/api`, `/images`, and `/admin` keep precedence.
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist')
if (fs.existsSync(frontendPath)) {
    try {
        app.use(express.static(frontendPath))
    } catch (err) {
        console.error('Error mounting frontend static', err)
    }

    // SPA fallback for routes not starting with /api, /images, or /admin
    try {
        // SPA fallback for frontend: serve index.html for any non-API/static/admin request
        app.use((req, res, next) => {
            const url = req.path
            if (url.startsWith('/api') || url.startsWith('/images') || url.startsWith('/admin')) {
                return next()
            }
            return res.sendFile(path.join(frontendPath, 'index.html'))
        })
    } catch (err) {
        console.error('Error registering frontend fallback route', err)
    }

    console.log('Frontend static serving enabled at / (from frontend/dist)')
} else {
    try {
        app.get("/", (req, res) => {
            res.send("Api working")
        })
    } catch (err) {
        console.error('Error registering root / route', err)
    }
    console.log('Frontend dist not found; root returns API text')
}

// Global uncaught exception handler to log any setup-time errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err && err.stack ? err.stack : err)
})

app.listen(port, () => {
    const displayUrl = publicUrl || `http://localhost:${port}`
    console.log(`Server Started on ${displayUrl}`)
})