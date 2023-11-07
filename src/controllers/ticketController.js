import { v4 as uuidv4 } from 'uuid';
import Config from '../models/Config.js';
import User from '../models/User.js';

export const purchaseTicket = async (req, res) => {
    try {
        const config = await Config.findById("654982d398a6c46a76b37e29");

        console.log('config', config);

        if (!config || !config.acceptPayments) {
            return res.status(403).json({ error: "Pagos deshabilitados", data: false });
        }

        const { email, quantity } = req.body;

        const tickets = [];
        
        for (let i = 0; i < quantity; i++) {
            const ticket = {
                ticketId: uuidv4(),
                used: false,
            }

            tickets.push(ticket);
        }

        // encontrar usuario con el email y agregarle los tickets
        const user = await User.findOneAndUpdate({ email: email }, { $push: { tickets: { $each: tickets } } }, { new: true });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.status(200).json({ message: "Compra realizada con éxito", data: true });

    } catch (err) {
        console.error("Error handle purchase:", err);
        return res.status(500).json({ error: err.message });
    }

}

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

export const getTickets = async (req, res) => {
    try {

        const { email } = req.params;

        // Busca el usuario por email y devuelve las entradas
        const user = await User.findOne({ email: email }, { tickets: 1 });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.status(200).json({ tickets: user.tickets });

    } catch (err) {
        console.error("Error al obtener entradas:", err);
        return res.status(500).json({ error: err.message });
    }
}