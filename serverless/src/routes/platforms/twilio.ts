import { NextFunction, Request, Response } from 'express';
import { parse } from 'query-string';
import axios from 'axios';

const tilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
  await axios.post(process.env.DEMO_SLACK_SEND_WEBHOOK_URL, {
    text: '電話暗号:' + payload.From.toString() + ' から電話がかかってきました!!',
  });
  res.send(`
    <Response>
      <Say language="ja-jp">起きろー！！</Say>
    </Response>
  `);
});

twilioRouter.post('/message_webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const payload = parse(req.body);
  await axios.post(process.env.DEMO_SLACK_SEND_WEBHOOK_URL, {
    text: '電話暗号:' + payload.From.toString() + ' から ' + payload.Body.toString() + ' というメッセージのSMSを受け取りました!!',
  });
  res.send(`
    <Response>
      <Say language="ja-jp">起きろー！！</Say>
    </Response>
  `);
});

export { twilioRouter };
