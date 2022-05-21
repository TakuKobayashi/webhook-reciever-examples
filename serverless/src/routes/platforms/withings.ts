import { NextFunction, Request, Response } from 'express';
import { stringifyUrl } from 'query-string';
const { getCurrentInvoke } = require('@vendia/serverless-express');

const express = require('express');
const withingsRouter = express.Router();

withingsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello withings');
});

withingsRouter.get('/login', (req: Request, res: Response, next: NextFunction) => {
  const currentInvoke = getCurrentInvoke();
  const currentBaseUrl = [req.protocol + '://' + req.get('host'), currentInvoke.event.requestContext.stage].join('/');
  // See this: https://developer.withings.com/api-reference#operation/oauth2-authorize
  const authorizeQueryObj = {
    response_type: 'code',
    client_id: process.env.WITHINGS_API_CLIENT_ID,
    state: 'foobar',
    scope: ['user.activity', 'user.metrics'].join(','),
    redirect_uri: currentBaseUrl + '/platforms/withings/callback',
  };
  console.log(authorizeQueryObj);
  res.redirect(stringifyUrl({ url: 'https://account.withings.com/oauth2_user/authorize2', query: authorizeQueryObj }));
});

withingsRouter.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello login');
});

export { withingsRouter };
