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
    // Verifica si eventStartTime está definido y si el documento es nuevo o si eventStartTime ha sido modificado.
    if (this.isNew || this.isModified('eventStartTime')) {
        // eventStartTime está en UTC, convierte a UTC-3 restando 3 horas
        this.eventStartTime = new Date(this.eventStartTime.getTime() - (3 * 3600 * 1000));
    }

    if (!this.timeToSendNotification) {
        //resta 15 minutos
        this.timeToSendNotification = new Date(this.eventStartTime.getTime() - (15 * 60000));
    }

    next();
});
 

export default mongoose.model('UserEvent', UserEventSchema);
