import mongoose from 'mongoose';

const sceneObjectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    filename: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    storageType: {
      type: String,
      enum: ['local', 's3'],
      default: 'local'
    },
    cameraState: {
      position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 5 }
      },
      target: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
      }
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    lastViewedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const SceneObject = mongoose.model('SceneObject', sceneObjectSchema);

export default SceneObject;
