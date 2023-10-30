const SharePointService = require('../services/sharepoint-service');
const EncodeUtils = require('../utils/encode-utils');
const { blacklist } = require('../enums/filter-enums');

module.exports = class DriveBusiness {
  constructor() {
    this.sharePointService = new SharePointService();
    this.rootFolder = process.env.SHAREPOINT_ROOT_FOLDER;
  }

  async list(token, path = '') {
    try {
      const url = path ? `${this.rootFolder}${path}` : this.rootFolder;
      const urlencode = EncodeUtils.fromAllChar(`${url}`);

      const itens = [];
      let array = [];
      array = await this.sharePointService
        .listDrive(token, urlencode)
        .catch(async () => {
          array = await this.sharePointService.listDrive(token, urlencode);
        });

      await new Promise((resolve) => setTimeout(resolve, 10000));

      if (array && array.length > 0) {
        await Promise.all(
          array.map(async (item) => {
            if (!blacklist.includes(item.FileLeafRef)) {
              const fileRef = item.FileRef.split(this.rootFolder).join('');
              itens.push({
                id: item.UniqueId.toLowerCase()
                  .slice(1, -1)
                  .split('-')
                  .join('%2D'),
                name: item.FileLeafRef,
                path: fileRef,
                children: await this.list(token, fileRef),
              });
            }
          })
        );
      }

      return itens;
    } catch (error) {
      throw error;
    }
  }

  async upload(token, file, path = '', xorhash) {
    try {
      const url = path ? `${this.rootFolder}${path}` : this.rootFolder;
      const { buffer, originalname: name } = file;

      let tempPath = '';
      for (const folder of path.split('/')) {
        if (folder) {
          tempPath += `/${folder}`;
          const teste = await this.sharePointService
            .createFolder(
              token,
              EncodeUtils.fromAllChar(`'${this.rootFolder}${tempPath}'`)
            )
            .catch(() => null);
            console.log(teste.status);
        }
      }

      const test2 = await this.sharePointService.uploadData(
        token,
        EncodeUtils.fromAllChar(`'${url}'`),
        EncodeUtils.fromAllChar(`'${name}'`),
        buffer,
        EncodeUtils.fromAllChar(`'${xorhash}'`),
      );

      return {
        statusCode: 200,
        message: 'File uploaded',
      };
    } catch (error) {
      throw error;
    }
  }
};
