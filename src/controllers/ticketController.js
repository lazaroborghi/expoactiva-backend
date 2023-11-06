// import { v4 as uuidv4 } from 'uuid'; TODO @LAZARO VER ESTO
import Config from '../models/Config.js';
import User from '../models/User.js';

export const purchaseTicket = async (req, res) => {
    try {
        const config = await Config.findOne();
        if (!config || !config.acceptPayments) {
            return res.status(403).json({ error: "Pagos deshabilitados", data: false });
        }

        const ticketId = uuidv4();
        const user = await User.findOneAndUpdate({ email: req.params.email }, { $push: { tickets: ticketId } }, { new: true });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.status(200).json({ message: "Compra realizada con éxito", data: true, ticketId: ticketId });

    } catch (err) {
        console.error("Error handle purchase:", err);
        return res.status(500).json({ error: err.message });
    }

}