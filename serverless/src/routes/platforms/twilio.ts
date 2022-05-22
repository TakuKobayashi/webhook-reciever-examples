import { NextFunction, Request, Response } from 'express';
import { parse } from 'query-string';

const express = require('express');
const twilioRouter = express.Router();

twilioRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'hello twilio' });
});

twilioRouter.post('/send_handler', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  res.send('ok');
});

twilioRouter.post('/voice_webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const payload = parse(req.body);
  console.log(payload);
  res.send(`
    <Response>
      <Say language="ja-jp">起きろー！！</Say>
    </Response>
  `);
});

twilioRouter.post('/message_webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const payload = parse(req.body);
  console.log(payload);
  res.send(`
    <Response>
      <Say language="ja-jp">起きろー！！</Say>
    </Response>
  `);
});

export { twilioRouter };
