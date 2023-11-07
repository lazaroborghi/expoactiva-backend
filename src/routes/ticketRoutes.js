import express from 'express';
import {purchaseTicket, useTicket, getTickets} from '../controllers/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/purchase', purchaseTicket);
ticketRouter.post('/use', useTicket);
ticketRouter.get('/:email', getTickets);

export default ticketRouter;
