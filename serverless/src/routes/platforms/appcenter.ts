import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

const express = require('express');
const appcenterRouter = express.Router();

appcenterRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'hello appcenter' });
});

appcenterRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const payload = JSON.parse(req.body);
  console.log(payload);
  res.send('OK');
});

export { appcenterRouter };
