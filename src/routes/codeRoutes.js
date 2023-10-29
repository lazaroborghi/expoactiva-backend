import express from 'express'
import { saveCodeValidator, getCodeByEmail } from '../controllers/validatorController.js'

const validatorCodeRouter = express.Router()

validatorCodeRouter.post('/create', saveCodeValidator)
validatorCodeRouter.get('/:email', getCodeByEmail)


export default validatorCodeRouter;