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

// 電話がかかってきたときに呼ばれるもの
twilioRouter.post('/voice_webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  /*
  こんな感じの文字列が飛んでくる
  AccountSid=...&ApiVersion=2010-04-01&CallSid=...&CallStatus=ringing&CallToken=...&Called=...&CalledCity=&CalledCountry=US&CalledState=WV&CalledZip=&Caller=...&CallerCity=&CallerCountry=JP&CallerState=&CallerZip=&Direction=inbound&From=...&FromCity=&FromCountry=JP&FromState=&FromZip=&To=...&ToCity=&ToCountry=US&ToState=WV&ToZip=
  URL Queryの形で送られてくる以下がこれをparseしたもの
  {
    AccountSid: '...',
    ApiVersion: '2010-04-01',
    CallSid: '...',
    CallStatus: 'ringing',
    CallToken: '...',
    Called: '...',
    CalledCity: '',
    CalledCountry: 'US',
    CalledState: 'WV',
    CalledZip: '',
    Caller: '...',
    CallerCity: '',
    CallerCountry: 'JP',
    CallerState: '',
    CallerZip: '',
    Direction: 'inbound',
    From: '...',
    FromCity: '',
    FromCountry: 'JP',
    FromState: '',
    FromZip: '',
    To: '...',
    ToCity: '',
    ToCountry: 'US',
    ToState: 'WV',
    ToZip: ''
  }
  */
  const payload = parse(req.body);
  console.log(payload);
  /*
  await axios.post(process.env.DEMO_SLACK_SEND_WEBHOOK_URL, {
    text: '電話暗号:' + payload.From.toString() + ' から電話がかかってきました!!',
  });
  */
  res.send(`
    <Response>
      <Say language="ja-jp">起きろー！！</Say>
    </Response>
  `);
});

// SMSを受信したときにに呼ばれるもの
twilioRouter.post('/message_webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  /*
  こんな感じの文字列が飛んでくる
  ToCountry=US&ToState=WV&SmsMessageSid=...&NumMedia=0&ToCity=&FromZip=&SmsSid=...&FromState=&SmsStatus=received&FromCity=&Body=%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82%E3%81%82&FromCountry=JP&To=...&ToZip=&NumSegments=1&ReferralNumMedia=0&MessageSid=...&AccountSid=...&From=...&ApiVersion=2010-04-01
  URL Queryの形で送られてくる以下がこれをparseしたもの
  {
    AccountSid: '...',
    ApiVersion: '2010-04-01',
    Body: 'ああああああ',
    From: '+...',
    FromCity: '',
    FromCountry: 'JP',
    FromState: '',
    FromZip: '',
    MessageSid: '...',
    NumMedia: '0',
    NumSegments: '1',
    ReferralNumMedia: '0',
    SmsMessageSid: '...',
    SmsSid: '...',
    SmsStatus: 'received',
    To: '+...',
    ToCity: '',
    ToCountry: 'US',
    ToState: 'WV',
    ToZip: ''
  }
  */
  const payload = parse(req.body);
  /*
  await axios.post(process.env.DEMO_SLACK_SEND_WEBHOOK_URL, {
    text: '電話暗号:' + payload.From.toString() + ' から ' + payload.Body.toString() + ' というメッセージのSMSを受け取りました!!',
  });
  */
  res.send(`
    <Response>
      <Say language="ja-jp">起きろー！！</Say>
    </Response>
  `);
});

export { twilioRouter };
