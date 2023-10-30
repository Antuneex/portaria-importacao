const { execFile } = require('child_process');
const fs = require('fs');
const SharePointService = require('../services/sharepoint-service');
const { getDiff, getOnlyFiles } = require('../utils/data-utils');

module.exports = class JobBusiness {
  constructor() {
    this.sharePointService = new SharePointService();
    this.dataOldPath = process.env.DATA_OLD_PATH;
    this.dataNewPath = process.env.DATA_NEW_PATH;
    this.importPath = process.env.IMPORT_PATH;
    this.failurePath = process.env.FAILURE_PATH;
    this.exePath = process.env.EXE_PATH;
  }

  async auth() {
    try {
      const token = await this.sharePointService.getFedAuth();

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async run(drive, token) {
    try {
      if (!fs.existsSync(this.dataOldPath)) {
        await fs.writeFileSync(this.dataOldPath, JSON.stringify(drive));
      }
      await fs.writeFileSync(this.dataNewPath, JSON.stringify(drive));

      const dataOld = require(this.dataOldPath);
      const dataNew = require(this.dataNewPath);

      const diff = await getDiff(dataNew, dataOld);
      const files = await getOnlyFiles(diff);

      setTimeout(async () => {
        for (const file of files) {
          const data = await this.sharePointService.downloadData(
            token,
            file.id
          );

          await fs.writeFileSync(`${this.importPath}${file.name}`, data);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          await execFile(this.exePath);
          await new Promise((resolve) => setTimeout(resolve, 10000));

          if (fs.existsSync(`${this.importPath}${file.name}`)) {
            await fs.unlinkSync(`${this.importPath}${file.name}`);
            await fs.writeFileSync(`${this.failurePath}${file.name}`, data);
          }
        }
      }, 1000);

      await fs.writeFileSync(this.dataOldPath, JSON.stringify(drive));
      await fs.unlinkSync(this.dataNewPath);

      return { downloads: files.map((file) => file.name) };
    } catch (error) {
      throw error;
    }
  }
};
