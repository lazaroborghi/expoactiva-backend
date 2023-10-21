import expo from "../../config/expoInstance.js";
import UserEvent from "../../models/UserEvent.js";
import { Expo } from 'expo-server-sdk';

export const checkForUpcomingEvents = async () => {
    try {
        console.log('Buscando eventos que comenzarán en 15 minutos');

        // Obtener la fecha actual en UTC
        let now = new Date();

        // Convertir a UTC-3
        let currentDate = new Date(now.getTime() - (3 * 3600 * 1000)); 

        // Calcular el tiempo de notificación (15 minutos después) en UTC-3
        let notificationTime = new Date(currentDate.getTime());
        notificationTime.setMinutes(currentDate.getMinutes() + 15);

        console.log('currentDate UTC-3: ', currentDate.toISOString());
        console.log('notificationTime UTC-3: ', notificationTime.toISOString());

        // Buscar eventos que comenzarán en 15 minutos y aún no han sido notificados
        const events = await UserEvent.find({
          eventStartTime: {
            $gte: currentDate.toISOString(),
            $lt: notificationTime.toISOString()
          },
          notificationSent: false, // Solo busca eventos donde la notificación aún no ha sido enviada
        });

        console.log('Eventos encontrados: ', events);

        // Para cada evento, enviar una notificación push
        for (let event of events) {
          const success = await sendPushNotification(event.expoPushToken);
          if (success) {
            console.log(`Notificación enviada con éxito para el token: ${event.expoPushToken}`);
          } else {
            console.log(`No se pudo enviar la notificación después de varios intentos, marcando como enviada de todos modos para el token: ${event.expoPushToken}`);
          }
          event.notificationSent = true;
          await event.save();
        }
    } catch (error) {
        console.error('Error dentro de checkForUpcomingEvents', error);
    }
};

const sendPushNotification = async (token, retryCount = 0) => {
  const MAX_RETRIES = 3;
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
      return false; 
    }

    // Enviar las notificaciones
    let chunks = expo.chunkPushNotifications([message]);
    let tickets = [];
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
      
    }
    return true; 
  } catch (error) {
    console.error(`Error sending push notification: ${error}`);
    if (retryCount < MAX_RETRIES) {
      console.log(`Reintentando... Intento ${retryCount + 1} de ${MAX_RETRIES}`);
      await new Promise(r => setTimeout(r, 2000)); // Espera 2 segundos antes de reintentar
      return sendPushNotification(token, retryCount + 1);
    } else {
      console.log('Se alcanzó el número máximo de intentos. Marcando como enviada.');
      return false;
    }
  }
};
