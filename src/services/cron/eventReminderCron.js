import cron from 'node-cron';
import { Expo } from 'expo-server-sdk';
import UserEvent from "../../models/UserEvent.js";

let expo = new Expo();

const startCronJob = () => {

    const task = cron.schedule('* * * * *', async () => {
        console.log('Running a task every minute');
        await checkForUpcomingEvents();
    });

    task.start();

};

const checkForUpcomingEvents = async () => {
  try {
    // Obtener la fecha actual y el tiempo de notificación (15 minutos antes)
    let notificationTime = new Date();
    notificationTime.setMinutes(notificationTime.getMinutes() + 15);

    // Buscar eventos que comenzarán en 15 minutos
    const events = await UserEvent.find({
      eventStartTime: {
        $gte: new Date(),
        $lt: notificationTime
      }
    });

    // Para cada evento, enviar una notificación push
    for (let event of events) {
      await sendPushNotification(event.expoPushToken);
    }
  } catch (error) {
    console.error("Error checking for upcoming events: ", error);
  }
};

const sendPushNotification = async (token) => {
  try {
    // Crear el mensaje que se enviará
    let message = {
      to: token,
      sound: 'default',
      body: 'El evento esta por comenzar en 15 minutos!',
      data: { someData: 'hola' },
    };

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

export default { startCronJob };