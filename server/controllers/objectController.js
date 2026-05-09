import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SceneObject from '../models/SceneObject.js';
import { uploadFileToS3, deleteFileFromS3, generateSignedUrl } from '../utils/s3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to resolve the URL (local or S3 signed)
const resolveFileUrl = async (object) => {
  if (object.storageType === 's3') {
    try {
      const signedUrl = await generateSignedUrl(object.fileUrl);
      return signedUrl || object.fileUrl; // Fallback to raw key if signed url fails
    } catch (err) {
      console.error('Error generating signed URL:', err);
      return object.fileUrl;
    }
  }
  return object.fileUrl; // Local path
};

// @desc    Upload .glb file
// @route   POST /api/objects/upload
// @access  Private
export const uploadObject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    let fileUrl = `/uploads/${req.file.filename}`;
    let filePath = req.file.path;
    let storageType = 'local';
    const s3Filename = req.file.filename;

    if (process.env.USE_S3 === 'true') {
      try {
        await uploadFileToS3(filePath, s3Filename);
        
        // Remove local file after successful S3 upload
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        fileUrl = s3Filename; // Store the key instead of the path
        filePath = ''; // No local file path
        storageType = 's3';
      } catch (err) {
        console.error('S3 Upload Failed. Falling back to local storage:', err);
        // Fallback gracefully to local upload if S3 fails
      }
    }

    const newObject = await SceneObject.create({
      owner: req.user._id,
      filename: req.file.originalname,
      fileUrl,
      filePath,
      storageType,
      cameraState: {
        position: { x: 0, y: 0, z: 5 },
        target: { x: 0, y: 0, z: 0 }
      }
    });

    const finalPath = await resolveFileUrl(newObject);

    // Return the requested format
    res.status(201).json({
      success: true,
      file: req.file.originalname,
      path: finalPath,
      ...newObject.toObject()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
};

// @desc    Get all objects for logged in user
// @route   GET /api/objects/
// @access  Private
export const getUserObjects = async (req, res) => {
  try {
    const objects = await SceneObject.find({ owner: req.user._id }).sort({ createdAt: -1 });
    
    // Resolve URLs for all objects
    const resolvedObjects = await Promise.all(
      objects.map(async (obj) => {
        const path = await resolveFileUrl(obj);
        return { ...obj.toObject(), path };
      })
    );

    res.status(200).json(resolvedObjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching objects' });
  }
};

// @desc    Get single object metadata + signed S3 URL
// @route   GET /api/objects/:id
// @access  Private
export const getObjectById = async (req, res) => {
  try {
    const sceneObject = await SceneObject.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!sceneObject) {
      return res.status(404).json({ message: 'Object not found' });
    }

    // Update last viewed
    sceneObject.lastViewedAt = Date.now();
    await sceneObject.save();

    const finalPath = await resolveFileUrl(sceneObject);

    res.status(200).json({
      ...sceneObject.toObject(),
      path: finalPath 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching object' });
  }
};

// @desc    Save camera state
// @route   PUT /api/objects/:id/camera
// @access  Private
export const updateCameraState = async (req, res) => {
  try {
    const { position, target } = req.body;

    const sceneObject = await SceneObject.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!sceneObject) {
      return res.status(404).json({ message: 'Object not found' });
    }

    if (position) sceneObject.cameraState.position = position;
    if (target) sceneObject.cameraState.target = target;

    await sceneObject.save();

    res.status(200).json(sceneObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating camera state' });
  }
};

// @desc    Delete object from Local FS or S3 and MongoDB
// @route   DELETE /api/objects/:id
// @access  Private
export const deleteObject = async (req, res) => {
  try {
    const sceneObject = await SceneObject.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!sceneObject) {
      return res.status(404).json({ message: 'Object not found' });
    }

    if (sceneObject.storageType === 's3') {
      try {
        await deleteFileFromS3(sceneObject.fileUrl);
      } catch (err) {
        console.error('S3 Delete Error:', err);
      }
    } else {
      // Delete from Local File System
      if (sceneObject.filePath && fs.existsSync(sceneObject.filePath)) {
        fs.unlinkSync(sceneObject.filePath);
      }
    }

    // Delete from DB
    await sceneObject.deleteOne();

    res.status(200).json({ message: 'Object deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting object' });
  }
};
