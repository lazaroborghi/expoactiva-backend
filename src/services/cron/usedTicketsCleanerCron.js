import Ticket from "../../models/Ticket.js";

export const deleteUsedTickets = async () => {
    try {
        await Ticket.deleteMany({ used: true });

    } catch (err) {
        console.error("Error al eliminar tickets usados:", err);
    }
}