import express from 'express'
import { getLikedProfiles, getLikes, getUserProfileAndRepos, likeProfile } from '../controllers/user.controller.js';
import {ensureAutenticated} from "../middleware/ensureAutenticated.js"
const router = express.Router();

router.get("/profile/:username", getUserProfileAndRepos);
router.get("/likes", ensureAutenticated, getLikes)
router.post("/like/:username", ensureAutenticated, likeProfile)

router.get('/liked-profiles', ensureAutenticated, getLikedProfiles);

export default router;