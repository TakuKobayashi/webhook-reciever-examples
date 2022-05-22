import { NextFunction, Request, Response } from 'express';

const express = require('express');
const stripeRouter = express.Router();

stripeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'hello stripe' });
});

stripeRouter.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  /*
{
  "id": "id",
  "object": "event",
  "api_version": "2020-08-27",
  "created": 1653195081,
  "data": {
    "object": {
      "id": "id",
      "object": "product",
      "active": true,
      "attributes": [

      ],
      "created": 1653195081,
      "default_price": null,
      "description": "無料",
      "images": [

      ],
      "livemode": false,
      "metadata": {
      },
      "name": "test",
      "package_dimensions": null,
      "shippable": null,
      "statement_descriptor": null,
      "tax_code": "txcd_10000000",
      "type": "service",
      "unit_label": null,
      "updated": 1653195081,
      "url": null
    }
  },
  "livemode": false,
  "pending_webhooks": 3,
  "request": {
    "id": "id",
    "idempotency_key": "key"
  },
  "type": "product.created"
}
  */
  // こんな感じのJSONが送られてくる
  // Stripeでやることなすことにwebhookが飛んできて"type": で判別される("product.created" は商品の作成)
  // その他のAPIはこちらを参照 https://stripe.com/docs/api
  const payload = JSON.parse(req.body);
  console.log(payload);
  res.send('OK');
});

export { stripeRouter };
