const { Router } = require('express');
const Boom = require('@hapi/boom');

const SwaggerRoutes = require('../../docs');
const DriveRoutes = require('./routes/drive-routes');
const JobRoutes = require('./routes/job-routes');

const route = Router();

const defaultObject = () => ({
  core: 'portaria-importacao',
  version: 'v1',
  date: new Date(),
});

module.exports = class Routers {
  static initialize() {
    route.all(['/', '/api'], (_, res) => res.json(defaultObject()));

    SwaggerRoutes.ui(route);
    DriveRoutes.routes(route);
    JobRoutes.routes(route);

    route.use((_, res) =>
      res.status(404).json({
        ...Boom.badRequest('Not Found').output.payload,
        statusCode: 404,
      })
    );

    return route;
  }
};
