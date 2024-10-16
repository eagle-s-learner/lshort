import express from 'express';
import {generateShortURL, redirectShortURL} from '../controllers/url.mjs'

const router = express.Router();

router.post('/', generateShortURL);

router.get('/:shortId', redirectShortURL)

export default router;