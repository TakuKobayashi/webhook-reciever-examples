import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import bodyParser from 'body-parser';

import { withingsRouter } from './routes/platforms/withings';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/platforms/withings', withingsRouter);

app.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Hello from root!',
  });
});

export const handler = serverlessExpress({ app });
