import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Message subject is required'],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    attachments: [
      {
        name: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for search
messageSchema.index({ subject: 1, content: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
