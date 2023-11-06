import express from 'express';
import {purchaseTicket} from '../controllers/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/purchase', purchaseTicket);

export default ticketRouter;
