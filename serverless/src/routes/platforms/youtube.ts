import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

const express = require('express');
const youtubeRouter = express.Router();

youtubeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'hello youtube' });
});

youtubeRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const payload = JSON.parse(req.body);
  console.log(payload);
  res.send('OK');
});

export { youtubeRouter };
