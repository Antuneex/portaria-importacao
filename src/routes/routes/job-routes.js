const JobController = require('../../controllers/job-controller');

module.exports = class JobRoutes {
  static routes(route) {
    route.get('/api/run-job', JobController.run);
  }
};
