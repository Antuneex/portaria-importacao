const DriveController = require('../../controllers/drive-controller');
const DriveRequiredFields = require('../middlewares/drive-required-fields');

module.exports = class DriveRoutes {
  static routes(route) {
    route.post(
      '/api/list-drive',
      DriveRequiredFields.isNonFile,
      DriveRequiredFields.validate(),
      DriveRequiredFields.isValidFields,
      DriveController.list
    );

    route.post(
      '/api/upload-file',
      DriveRequiredFields.isValidFile,
      DriveRequiredFields.validate(),
      DriveRequiredFields.isValidFields,
      DriveController.upload
    );
  }
};
