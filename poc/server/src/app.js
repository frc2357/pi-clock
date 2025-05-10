import 'dotenv/config'

import express from 'express'
import cors from 'cors'

import { requireAuth } from './middleware/authenticate.js'
import userRoutes from './routes/user.routes.js'

const port = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())
app.use(requireAuth)

app.use('/api/users', userRoutes)

app.listen(port, () => {
    console.log(`ExpressJS server running on port ${port}`)
})