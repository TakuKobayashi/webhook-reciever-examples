import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import bodyParser from 'body-parser';

import { withingsRouter } from './routes/platforms/withings';
import { stripeRouter } from './routes/platforms/stripe';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/platforms/withings', withingsRouter);
app.use('/platforms/stripe', stripeRouter);

app.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Hello from root!',
  });
});

export const handler = serverlessExpress({ app });
