import express from 'express';
import { 
  uploadObject, 
  getUserObjects, 
  getObjectById, 
  updateCameraState, 
  deleteObject 
} from '../controllers/objectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadGlb } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route('/')
  .get(getUserObjects);

router.route('/upload')
  .post(uploadGlb, uploadObject);

router.route('/:id')
  .get(getObjectById)
  .delete(deleteObject);

router.route('/:id/camera')
  .put(updateCameraState);

export default router;
