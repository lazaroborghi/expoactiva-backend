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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('UserEvent', UserEventSchema);
