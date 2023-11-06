import express from 'express';
import {purchaseTicket, useTicket} from '../controllers/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/purchase', purchaseTicket);
ticketRouter.post('/use', useTicket);

export default ticketRouter;
