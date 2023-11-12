import { v4 as uuidv4 } from 'uuid';
import Config from '../models/Config.js';
import User from '../models/User.js';
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
        const { email, ticketId } = req.body;

        // Actualiza el estado 'used' de la entrada a usado
        const user = await User.findOneAndUpdate(
            { email: email, 'tickets.ticketId': ticketId },
            { $set: { 'tickets.$.used': true } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: "Usuario o entrada no encontrados" });
        }

        return res.status(200).json({ message: "Entrada utilizada con éxito" });

    } catch (err) {
        console.error("Error al utilizar la entrada:", err);
        return res.status(500).json({ error: err.message });
    }
}

export const getTicketsByUser = async (req, res) => {
    try {
        const { email } = req.params;

        // Busca el ticket por el email y devuelve los tickets
        const tickets = await Ticket.find({ email: email });

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ error: "No hay entradas para ese usuario" });
        }

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
        const ticket = await Ticket.findOneAndUpdate({ ticketId: req.params.ticketId }, req.body, { new: true });

        if (ticket) { res.status(200).json(ticket); }
        else { res.status(404).json({ error: "Entrada no encontrada" }); }

    } catch (err) { res.status(500).json({ error: err.message }); }
};