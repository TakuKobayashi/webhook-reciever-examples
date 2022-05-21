import { NextFunction, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { stringify, stringifyUrl } from 'query-string';
import { createHmac } from 'crypto';
const { getCurrentInvoke } = require('@vendia/serverless-express');

const express = require('express');
const withingsRouter = express.Router();

withingsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.send('hello withings');
});

withingsRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  // See this: https://developer.withings.com/api-reference#operation/oauth2-authorize
  const authorizeQueryObj = {
    response_type: 'code',
    client_id: process.env.WITHINGS_API_CLIENT_ID,
    state: 'foobar',
    scope: ['user.activity', 'user.metrics'].join(','),
    redirect_uri: getCallbackUrl(req),
  };
  res.redirect(stringifyUrl({ url: 'https://account.withings.com/oauth2_user/authorize2', query: authorizeQueryObj }));
});

withingsRouter.get('/callback', async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.code) {
    res.send('callback error');
    return;
  }
  const oauthRes = await requestGetAccessToken(req);
  // このような形で返ってくる {"status":0,"body":{"userid":"...","access_token":"...","refresh_token":"...","scope":"user.activity,user.metrics","expires_in":10800,"token_type":"Bearer"}}
  res.json(oauthRes.data);
});

withingsRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  console.log(req.query);
  res.status(200);
});

interface RequestTokenSignatureBasic {
  action: string;
  client_id: string;
  nonce: string;
  signature: string;
}

async function requestGetAccessToken(req: Request): Promise<AxiosResponse<any, any>> {
  const basicSignature: RequestTokenSignatureBasic = await constructNonceSignature('requesttoken');
  const oauthCallbackCode: string = req.query.code.toString();
  const requestTokenObj = {
    grant_type: 'authorization_code',
    code: oauthCallbackCode,
    redirect_uri: getCallbackUrl(req),
    client_secret: process.env.WITHINGS_API_SECRET,
    ...basicSignature,
  };
  return axios.post('https://wbsapi.withings.net/v2/oauth2', stringify(requestTokenObj));
}

async function requestRefreshAccessToken(refresh_token: string): Promise<AxiosResponse<any, any>> {
  const basicSignature: RequestTokenSignatureBasic = await constructNonceSignature('requesttoken');
  const requestTokenObj = {
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
    client_secret: process.env.WITHINGS_API_SECRET,
    ...basicSignature,
  };
  return axios.post('https://wbsapi.withings.net/v2/oauth2', stringify(requestTokenObj));
}

async function constructNonceSignature(action: string): Promise<RequestTokenSignatureBasic> {
  const nonce = await requestNonse();
  // See this: https://developer.withings.com/developer-guide/v3/get-access/sign-your-requests/
  const signature = createHmac('sha256', process.env.WITHINGS_API_SECRET)
    .update([action, process.env.WITHINGS_API_CLIENT_ID, nonce].join(','), 'utf8')
    .digest('hex');
  return {
    action: action,
    client_id: process.env.WITHINGS_API_CLIENT_ID,
    nonce: nonce,
    signature: signature,
  };
}

async function requestNonse(): Promise<string> {
  // see this: https://developer.withings.com/api-reference/#tag/signature
  const signaturetimestamp = Math.floor(new Date().getTime() / 1000);
  const signatureObj = {
    action: 'getnonce',
    client_id: process.env.WITHINGS_API_CLIENT_ID,
    timestamp: signaturetimestamp,
    signature: createHmac('sha256', process.env.WITHINGS_API_SECRET)
      .update(['getnonce', process.env.WITHINGS_API_CLIENT_ID, signaturetimestamp].join(','), 'utf8')
      .digest('hex'),
  };
  const nonceRes = await axios.post('https://wbsapi.withings.net/v2/signature', stringify(signatureObj));
  return nonceRes.data.body.nonce.toString();
}

function getCallbackUrl(req: Request): string {
  const currentInvoke = getCurrentInvoke();
  const currentBaseUrl = [req.protocol + '://' + req.get('host'), currentInvoke.event.requestContext.stage].join('/');
  return currentBaseUrl + '/platforms/withings/callback';
}

function getWebhookUrl(req: Request): string {
  const currentInvoke = getCurrentInvoke();
  const currentBaseUrl = [req.protocol + '://' + req.get('host'), currentInvoke.event.requestContext.stage].join('/');
  return currentBaseUrl + '/platforms/withings/webhook';
}

export { withingsRouter };
