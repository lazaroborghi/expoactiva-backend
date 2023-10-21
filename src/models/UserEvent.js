import mongoose from 'mongoose';

const UserEventSchema = new mongoose.Schema(
  {
    expoPushToken: {
      type: String,
      required: true,
      unique: true,
    },
    eventId: {
      type: Number,
      required: true,
    },
    eventStartTime: {
        type: Date,
        required: true,
    },
    notificationSent: {
        type: Boolean,
        default: false,
    },
    timeToSendNotification: {
        type: Date,
    },
  },
  {
    timestamps: true,
  }
);

UserEventSchema.pre('save', function(next) {
    if (!this.timeToSendNotification) {
      // Si eventStartTime está en UTC, convierte a UTC-3 restando 3 horas
      let eventTimeUTC3 = new Date(this.eventStartTime.getTime() - (3 * 3600 * 1000));
      
      // Establecer el tiempo de envío de la notificación 15 minutos antes del inicio del evento (en UTC-3)
      this.timeToSendNotification = new Date(eventTimeUTC3.getTime() - (15 * 60000));
    }
    next();
  });  

export default mongoose.model('UserEvent', UserEventSchema);
