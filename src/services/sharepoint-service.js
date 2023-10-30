const puppeteer = require('puppeteer');
const axios = require('axios');

class SharePointService {
  constructor() {
    this.linkUrl = process.env.SHAREPOINT_URL;
    this.listDataUrl = process.env.SHAREPOINT_LIST;
    this.uploadDataUrl = process.env.SHAREPOINT_UPLOAD;
    this.downloadDataUrl = process.env.SHAREPOINT_DOWNLOAD;
    this.createDataUrl = process.env.SHAREPOINT_CREATE_FOLDER;
  }

  async getFedAuth() {
    let token = null;

    await puppeteer
      .launch({
        headless: 'new',
        chromeWebSecurity: false,
        args: ['--no-sandbox'],
      })
      .then(async (browser) => {
        const page = await browser.newPage();
        const resp = await page.goto(this.linkUrl);
        const headers = resp.headers();
        [token] = headers['set-cookie'].split(';');
        browser.close();
      });
    return token;
  }

  async listDrive(token, path) {
    return (
      await axios.post(`${this.listDataUrl}&RootFolder=${path}`, null, {
        headers: {
          Cookie: token,
        },
        raxConfig: {
          retry: 10,
          retryDelay: 10000,
        },
      })
    ).data.Row;
  }

  async uploadData(token, path, name, data, xorhash) {
    return axios.post(`${this.uploadDataUrl}&@a1=${path}&@a2=${name}&@a4=${xorhash}`, data, {
      headers: {
        authorization: 'Bearer',
        cookie: token,
      },
      raxConfig: {
        retry: 10,
        retryDelay: 10000,
      },
    });
  }

  async downloadData(token, id) {
    return (
      await axios.get(`${this.downloadDataUrl}?UniqueId=${id}`, {
        headers: {
          authorization: 'Bearer',
          cookie: token,
        },
        raxConfig: {
          retry: 10,
          retryDelay: 10000,
        },
      })
    ).data;
  }

  async createFolder(token, path) {
    const teste = await axios.post(
      `${this.createDataUrl}&@a1=${path}`,
      {},
      {
        headers: {
          authorization: 'Bearer',
          cookie: token,
        },
        raxConfig: {
          retry: 10,
          retryDelay: 10000,
        },
      }
    );
    return teste;
  }
}

module.exports = SharePointService;
