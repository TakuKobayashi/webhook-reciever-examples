import { NextFunction, Request, Response } from 'express';

const express = require('express');
const stripeRouter = express.Router();

stripeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'hello stripe' });
});

stripeRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query);
  console.log(req.body);
  console.log(req.headers);
  res.send('OK');
});

export { stripeRouter };
