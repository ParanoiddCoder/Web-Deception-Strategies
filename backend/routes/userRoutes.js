import  express from 'express';
import { protect,admin } from '../middleware/authMiddleware.js';
const router = express.Router();
import {
    authUser,
    registerUser,
    updateUser,
    updateUserProfile,
    deleteUser,
    getUserProfile,
    getUsers,
    getUserById,
    logoutUser,
} from '../controllers/userControllers.js'


router.route('/').post(registerUser).get(protect,getUsers);
router.post('/logout',logoutUser);
router.post('/auth',authUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/:id').delete(protect,admin,deleteUser).get(protect,admin,getUserById).put(protect,admin,updateUser);

export default router;