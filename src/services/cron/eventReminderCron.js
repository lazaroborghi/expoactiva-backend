import expo from "../../config/expoInstance.js";
import UserEvent from "../../models/UserEvent.js";
import { Expo } from 'expo-server-sdk';

export const checkForUpcomingEvents = async () => {
    try {
        console.log('Buscando eventos que comenzarán en 15 minutos');

        // Obtener la fecha actual en UTC
        let now = new Date();

        // Convertir a UTC-3, restar 3 horas (cada hora tiene 3600 segundos, por lo tanto 3 horas tienen 10800 segundos)
        let currentDate = new Date(now.getTime() - (3 * 3600 * 1000)); 

        // Calcular el tiempo de notificación (15 minutos después) en UTC-3
        let notificationTime = new Date(currentDate.getTime());
        notificationTime.setMinutes(currentDate.getMinutes() + 15);

        console.log('currentDate UTC-3: ', currentDate.toISOString());
        console.log('notificationTime UTC-3: ', notificationTime.toISOString());

        // Buscar eventos que comenzarán en 15 minutos
        const events = await UserEvent.find({
          eventStartTime: {
            $gte: currentDate.toISOString(),
            $lt: notificationTime.toISOString()
          }
        });

        console.log('Eventos encontrados: ', events);

        // Para cada evento, enviar una notificación push
        for (let event of events) {
          await sendPushNotification(event.expoPushToken);
        }
    } catch (error) {
        console.error('Error dentro de checkForUpcomingEvents', error);
    }
};

const sendPushNotification = async (token) => {
  try {
    // Crear el mensaje que se enviará
    let message = {
      to: token,
      sound: 'default',
      title: 'Evento por comenzar',
      body: 'El evento esta por comenzar en 15 minutos!',
      data: { someData: 'hola' },
    };

    console.log('ExpoToken: ', token);

    // Comprobar que todos los tokens de recepción sean válidos
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`);
      return;
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
    console.error(`Error in sending push notification: ${error}`);
  }
};