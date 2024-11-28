import express from "express";
import { explorePopularRepos } from "../controllers/explore.controller.js";
import {ensureAutenticated} from '../middleware/ensureAutenticated.js'
const router = express.Router();

router.get("/repos/:language", ensureAutenticated, explorePopularRepos);

export default router;

