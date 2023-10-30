const Boom = require('@hapi/boom');
const DriveBusiness = require('../business/drive-business');
const JobBusiness = require('../business/job-business');

module.exports = class JobController {
  static run(_req, res) {
    const jobBusiness = new JobBusiness();
    const driveBusiness = new DriveBusiness();

    return jobBusiness
      .auth()
      .then(async ({ token }) => [await driveBusiness.list(token), token])
      .then(([drive, token]) => jobBusiness.run(drive, token))
      .then((data) => res.status(200).json(data))
      .catch(() =>
        res.status(400).json(Boom.badRequest('Invalid data').output.payload)
      );
  }
};
