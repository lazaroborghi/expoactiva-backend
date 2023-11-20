import express from 'express'
import { getAllEvents } from '../controllers/eventController.js'

const eventRouter = express.Router()

eventRouter.get('/', getAllEvents)

export default eventRouter