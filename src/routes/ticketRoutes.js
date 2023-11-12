import express from 'express';
import { purchaseTicket, useTicket, getTicketsByUser, getTicketsById, updateTicket } from '../controllers/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/purchase', purchaseTicket);
ticketRouter.post('/use', useTicket);
ticketRouter.get('/:email', getTicketsByUser);
ticketRouter.get('/ticket/:ticketId', getTicketsById);
ticketRouter.put('/update/:ticketId', updateTicket);

export default ticketRouter;
