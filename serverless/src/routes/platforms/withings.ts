import { NextFunction, Request, Response } from 'express';

const express = require('express');
const withingsRouter = express.Router();

withingsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello withings');
});

withingsRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello login');
});

export { withingsRouter };
