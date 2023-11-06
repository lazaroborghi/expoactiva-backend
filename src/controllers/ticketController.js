import { v4 as uuidv4 } from 'uuid';
import Config from '../models/Config.js';
import User from '../models/User.js';

export const purchaseTicket = async (req, res) => {
    try {
        const config = await Config.findOne();
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

        return res.status(200).json({ message: "Compra realizada con éxito", data: true, tickets });

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