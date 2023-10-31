import expo from "../../config/expoInstance.js";
import UserEvent from "../../models/UserEvent.js";
import { Expo } from 'expo-server-sdk';
import axios from "axios";

async function getEventById(eventId) {
    try {
      const response = await axios.get(`https://expoactivawebbackend.uc.r.appspot.com/open/event/${eventId}`);
      
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al hacer una petición a la API: ', error);
      throw error; 
    }
}

export const cleanUpUserEvents = async () => {
    try {
        console.log('Limpiando eventos antiguos o con tokens inválidos');

        // Obtener la fecha y hora actual en UTC
        let nowUTC = new Date();

        // Convertir la fecha/hora actual a UTC-3
        let nowUTCMinus3 = new Date(nowUTC.getTime() - (3 * 60 * 60 * 1000)); // restas 3 horas

        // Redondear la fecha/hora al minuto más cercano
        nowUTCMinus3.setSeconds(0, 0); // restablece segundos y milisegundos a 0

        console.log('Fecha/Hora actual redondeada (UTC-3):', nowUTCMinus3.toISOString());

        // Eliminar eventos cuya fecha 'timeToSendNotification' haya pasado en UTC-3
        await UserEvent.deleteMany({
            $or: [
                { timeToSendNotification: { $lt: nowUTCMinus3 } },
                { notificationSent: true }
            ]
        });

        // Obtener todos los eventos
        const allEvents = await UserEvent.find({});

        // Filtrar los eventos con tokens inválidos
        const invalidTokenEvents = allEvents.filter(event => !Expo.isExpoPushToken(event.expoPushToken));

        // Si hay eventos con tokens inválidos, eliminarlos
        if (invalidTokenEvents.length > 0) {
            console.log(`Eliminando ${invalidTokenEvents.length} eventos con tokens inválidos`);
            for (const invalidEvent of invalidTokenEvents) {
                await UserEvent.deleteOne({ _id: invalidEvent._id });
            }
        }

        console.log('Limpieza completada');
    } catch (error) {
        console.error('Error en la limpieza de UserEvents', error);
    }
};

export const checkForUpcomingEvents = async () => {
    try {
        console.log('Buscando eventos próximos a comenzar');

        // Obtener la fecha y hora actual en UTC
        let now = new Date();

        // Convertir a UTC-3
        let currentDate = new Date(now.getTime() - (3 * 3600 * 1000)); 

        // Redondear currentDate al inicio del minuto actual (ignorando segundos y milisegundos)
        currentDate.setSeconds(0, 0); // Establece los segundos y milisegundos en 0

        console.log('currentDate UTC-3 (redondeada): ', currentDate.toISOString());

        // Buscar eventos cuyo timeToSendNotification sea en el minuto actual y aún no han sido notificados
        const events = await UserEvent.find({
          timeToSendNotification: {
            $gte: new Date(currentDate),
            $lt: new Date(currentDate.getTime() + 60000) // Agrega un minuto
          },
          notificationSent: false,
        });

        console.log('Eventos encontrados: ', events);

        // Para cada evento, enviar una notificación push y marcar como notificado
        for (let event of events) {
            await sendPushNotification(event.expoPushToken, event.eventId); // Asegúrate de pasar eventId también
            event.notificationSent = true;
            await event.save();
        }
    } catch (error) {
        console.error('Error dentro de checkForUpcomingEvents', error);
    }
};

const sendPushNotification = async (token, eventId) => {
  try {

    console.log('eventId', eventId);
    // Crear el mensaje que se enviará
    const event = await getEventById(eventId);

    const title = event.eventName !== '' ? event.eventName : 'Evento Expoactiva';
    const startDateTime = new Date(event.dateHourStart);
    const endDateTime = new Date(event.dateHourEnd);
    const startTimeFormatted = formatTime(startDateTime);
    const endTimeFormatted = formatTime(endDateTime);

    let message = {
      to: token,
      sound: 'default',
      title: title,
      body: `¡Comenzará en 10 minutos!\n${startTimeFormatted} - ${endTimeFormatted}`,
      data: { idEvent: eventId },
    };

    console.log('ExpoToken: ', token);

    // Comprobar que todos los tokens de recepción sean válidos
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      return false; 
    }

     // Enviar las notificaciones
     let chunks = expo.chunkPushNotifications([message]);
     let tickets = [];
     (async () => {
       for (let chunk of chunks) {
         try {
           let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
           tickets.push(...ticketChunk);
         } catch (error) {
           console.error(`Error sending push notification: ${error}`);
         }
       }
     })();
  } catch (error) {
    console.error(`Error sending push notification: ${error}`);
  }
};
