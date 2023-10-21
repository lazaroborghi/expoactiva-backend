import expo from "../../config/expoInstance.js";
import UserEvent from "../../models/UserEvent.js";
import { Expo } from 'expo-server-sdk';

export const checkForUpcomingEvents = async () => {
    try {
        console.log('Buscando eventos que comenzarán en 15 minutos');

        // Obtener la fecha actual y el tiempo de notificación (15 minutos antes)
        let date = new Date();
        let notificationTime = date.setMinutes(date.getMinutes() + 15);

        console.log('date: ', date);
        console.log('notificationTime: ', notificationTime);

        // Buscar eventos que comenzarán en 15 minutos
        const events = await UserEvent.find({
          eventStartTime: {
            $gte: date,
            $lt: notificationTime
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