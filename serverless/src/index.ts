import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import bodyParser from 'body-parser';

import { withingsRouter } from './routes/platforms/withings';
import { stripeRouter } from './routes/platforms/stripe';
import { twilioRouter } from './routes/platforms/twilio';
import { asanaRouter } from './routes/platforms/asana';
import { appcenterRouter } from './routes/platforms/appcenter';
import { githubRouter } from './routes/platforms/github';
import { youtubeRouter } from './routes/platforms/youtube';

const app = express();

app.use(bodyParser.text({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/platforms/withings', withingsRouter);
app.use('/platforms/stripe', stripeRouter);
app.use('/platforms/twilio', twilioRouter);
app.use('/platforms/asana', asanaRouter);
app.use('/platforms/appcenter', appcenterRouter);
app.use('/platforms/github', githubRouter);
app.use('/platforms/youtube', youtubeRouter);

app.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Hello from root!',
  });
});

export const handler = serverlessExpress({ app });
