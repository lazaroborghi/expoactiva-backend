import { v4 as uuidv4 } from 'uuid';
import Config from '../models/Config.js';
import Ticket from '../models/Ticket.js';

export const purchaseTicket = async (req, res) => {
    try {
        const config = await Config.findById("654982d398a6c46a76b37e29");

        console.log('config', config);

        if (!config || !config.acceptPayments) {
            return res.status(200).json({ error: "Pagos deshabilitados", data: false });
        }

        const { email, quantity } = req.body;
        console.log('email', email);
        console.log('quantity', quantity);

        const tickets = [];

        for (let i = 0; i < quantity; i++) {
            let ticketId;

            //Verificamos si existe
            do {
                ticketId = uuidv4();
            } while (await Ticket.findOne({ id: ticketId }));

            const ticket = new Ticket({
                email: email,
                ticketId: ticketId,
                used: false,
                shared: false
            });

            await ticket.save();  // Guardamos en base

            tickets.push(ticket);
        }

        return res.status(200).json({ message: "Compra realizada con éxito", data: true, tickets });

    } catch (err) {
        console.error("Error handle purchase:", err);
        return res.status(500).json({ error: err.message });
    }
};


export const useTicket = async (req, res) => {
    try {
        const { ticketId } = req.body;

        const ticket = await Ticket.findOne({ ticketId: ticketId });

        if (!ticket) {
            return res.status(404).json({ error: "Entrada no válida" });
        }

        if (ticket.used) {
            return res.status(200).json({ message: "Entrada ya utilizada", data: false });
        }

        await Ticket.findOneAndUpdate({ ticketId: ticketId }, { used: true }, { new: true });

        return res.status(200).json({ message: "Entrada utilizada con éxito", data: true });
    } catch (err) {
        console.error("Error handle use ticket:", err);
        return res.status(500).json({ error: err.message });
    }
}

export const getTicketsByUser = async (req, res) => {
    try {
        const { email } = req.params;

        // Busca el ticket por el email y devuelve los tickets
        const tickets = await Ticket.find({ email: email });

        return res.status(200).json(tickets);

    } catch (err) {
        console.error("Error al obtener entradas:", err);
        return res.status(500).json({ error: err.message });
    }
};

export const getTicketsById = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // Busca el ticket por el email y devuelve los tickets
        const tickets = await Ticket.find({ ticketId: ticketId });

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: "Entrada no válida" });
        }
        return res.status(200).json(tickets);

    } catch (err) {
        console.error("Error al obtener entradas:", err);
        return res.status(500).json({ error: err.message });
    }
};

export const updateTicket = async function (req, res) {
    try {

        let ticket = await Ticket.findOne({ ticketId: req.params.ticketId });

        if (req.body.redeem && !ticket.shared) {
            return res.status(404).json({ error: "No se puede modificar el email de una entrada no compartida" });
        }

        req.body.redeem && delete req.body.redeem;

        ticket = await Ticket.findOneAndUpdate({ ticketId: req.params.ticketId }, req.body, { new: true });

        if (ticket) { res.status(200).json(ticket); }
        else { res.status(404).json({ error: "Entrada no encontrada" }); }

    } catch (err) { 
        console.log(err)
        res.status(500).json({ error: err.message }); 
    }
};
