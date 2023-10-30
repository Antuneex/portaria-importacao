const { validationResult, buildCheckFunction } = require('express-validator');
const Boom = require('@hapi/boom');
const multer = require('multer');

const checkBody = buildCheckFunction(['body']);

module.exports = class UserRequiredFields {
  static validate() {
    return [
      checkBody('path')
        .optional()
        .trim()
        .custom(
          (item) =>
            (item.includes('/') || item.includes('\\')) &&
            !['/', '\\'].includes(item.slice(-1)[0])
        )
        .withMessage('Invalid Path'),
    ];
  }

  static isValidFields(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = errors.array({ onlyFirstError: true });
      res.status(400).json(Boom.badRequest(err[0].msg).output.payload);
    } else {
      next();
    }
  }

  static isNonFile(req, res, next) {
    const nonFile = multer().none();

    new Promise((resolve) => {
      nonFile(req, res, (err) => {
        resolve(!err);
      });
    }).then((isValid) => {
      if (!isValid) {
        res
          .status(400)
          .json(Boom.badRequest('File cannot be accepted').output.payload);
      } else {
        next();
      }
    });
  }

  static isValidFile(req, res, next) {
    const upload = multer().single('file');

    new Promise((resolve) => {
      upload(req, res, (err) => {
        resolve(!(err));
      });
    }).then((isValid) => {
      if (!isValid) {
        res
          .status(400)
          .json(
            Boom.badRequest('File cannot be empty').output
              .payload
          );
      } else {
        next();
      }
    });
  }
};
