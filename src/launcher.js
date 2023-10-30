require('custom-env').env('main');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const Router = require('./routes/default');

module.exports = class Launcher {
  constructor() {
    this.port = process.env.PORT;
    app.use(express.json());
    app.use(helmet());
    app.use(cors());
    app.use(Router.initialize());
  }

  run() {
    app
      .listen(this.port, () => {
        console.info(`Listening at http://localhost:${this.port}`);
      })
      .on('error', (err) => {
        console.info(`Err: Error listen server: ${err}`);
      });
  }
};
