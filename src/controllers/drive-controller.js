const Boom = require('@hapi/boom');
const DriveBusiness = require('../business/drive-business');
const JobBusiness = require('../business/job-business');

module.exports = class DriveController {
  static list(req, res) {
    const { path } = req.body;
    const jobBusiness = new JobBusiness();
    const driveBusiness = new DriveBusiness();

    return jobBusiness
      .auth()
      .then(({ token }) => driveBusiness.list(token, path))
      .then((data) => res.status(200).json(data))
      .catch(() =>
        res.status(400).json(Boom.badRequest('Invalid data').output.payload)
      );
  }

  static upload(req, res) {
    const { file } = req;
    const { path,xorhash } = req.body;
    const jobBusiness = new JobBusiness();
    const driveBusiness = new DriveBusiness();
    console.log(jobBusiness);
    console.log(driveBusiness);
    console.log(res.status);
    return jobBusiness
      .auth()
      .then(({ token }) => driveBusiness.upload(token, file, path, xorhash))
      .then((data) => res.status(200).json(data))
      .catch(() =>
        res.status(400).json(Boom.badRequest('Invalid data').output.payload)
      );
  }
};
