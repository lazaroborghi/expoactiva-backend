import DevicesRequest from '../models/DevicesRequest.js';
import moment from 'moment'


export const put = async (req, res) => {
    const { uid } = req.params;

    if (!uid) {
        return res.status(400).json({ error: 'Se requiere el ID del dispositivo (uid).' });
    }

    // Obtener la hora actual en la zona horaria de Uruguay (UTC-3)

    const currentTime = moment().subtract(3, 'hours');
    const expirationTime = moment().subtract(3, 'hours').add(15, 'minutes')

    const session = await DevicesRequest.startSession();
    session.startTransaction();

    try {
        const filter = { uid: req.params.uid };

        // Buscar el dispositivo en la base de datos
        const device = await DevicesRequest.findOne(filter).session(session);

        if (!device) {
            // Si el dispositivo no existe, lo crea
            const newDevice = new DevicesRequest({
                uid,
                expireTime: expirationTime,
                counter: 1,
            });

            const savedDevice = await newDevice.save();
            if (savedDevice) {
                await session.commitTransaction();
                session.endSession();
                return res.json({ message: 'Solicitud permitida.' });
            }
        } else if (device.uid === uid && currentTime < device.expireTime) {
            // El dispositivo aún está dentro del tiempo límite y el uid no ha cambiado
            if (device.counter <= 5) {
                // Se permite la solicitud
                await DevicesRequest.findOneAndUpdate(
                    filter,
                    { $inc: { counter: 1 } },
                    { new: true, session }
                );

                await session.commitTransaction();
                session.endSession();

                return res.json({ message: 'Solicitud permitida.' });
            } else {
                // Se superó el límite de solicitudes
                await session.commitTransaction();
                session.endSession();
                return res.status(429).json({ error: 'Se superó el límite de solicitudes, espera hasta la próxima ventana de tiempo.', counter: device.counter });
            }
        } else {
            // El uid ha cambiado o el tiempo límite ha expirado
            const updatedDevice = await DevicesRequest.findOneAndUpdate(
                filter,
                { $set: { counter: 1, expireTime: expirationTime } },
                { new: true, session }
            );

            await session.commitTransaction();
            session.endSession();

            if (updatedDevice) {
                return res.json({ message: 'Solicitud permitida.' });
            }
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
