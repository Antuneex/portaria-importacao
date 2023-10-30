const JobBusiness = require('../../src/business/job-business');

jest.mock('child_process');
jest.mock('fs');

const jobBusiness = new JobBusiness();

jobBusiness.sharePointService.getFedAuth = jest.fn(() => null);
jobBusiness.sharePointService.downloadData = jest.fn(() => null);
jobBusiness.dataOldPath = '../../test/mocks/data_old-mocks';

describe('Job operation', () => {
  test('diff', async () => {
    jobBusiness.dataNewPath = '../../test/mocks/data_new-mocks';
    const result = await jobBusiness.run();
    expect(result.downloads).toHaveLength(1);
  });
  test('no diff', async () => {
    jobBusiness.dataNewPath = '../../test/mocks/data_old-mocks';
    const result = await jobBusiness.run();
    expect(result.downloads).toHaveLength(0);
  });
});
