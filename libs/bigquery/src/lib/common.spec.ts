import { getTable } from './common';
import { extend, range } from 'lodash';

const mockTable = jest.fn();
const mockTableGet = jest.fn();
const mockGet = jest.fn();

jest.mock('@google-cloud/bigquery', () => ({
  BigQuery: jest.fn(() => ({
    dataset: jest.fn(() => {
      const table = mockTable;
      table['get'] = mockTableGet;
      return {
        get: mockGet,
        table,
      };
    }),
  })),
}));

const SITE_ID = 'siteID';

describe('getTable', () => {
  beforeEach(() => {
    mockTable.mockReset();
    mockGet.mockReset().mockImplementation(() =>
      Promise.resolve([
        {
          table: jest.fn(() => ({
            setMetaData: jest.fn(),
            get: mockTableGet,
          })),
        },
      ])
    );
    mockTableGet
      .mockReset()
      .mockImplementation(() =>
        Promise.resolve([
          extend(mockTable, { metadata: { schema: [] }, get: mockTableGet }),
        ])
      );
  });

  it('should use local cache', () => {
    const tableName = 'test-1';
    range(10).forEach(() =>
      getTable(SITE_ID, tableName, [], false, undefined, true)
    );
    expect(mockTable).toHaveBeenCalledTimes(1);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should get table by name', () => {
    const tableName = 'test-2';
    getTable(SITE_ID, tableName, [], false, undefined, true);
    expect(mockTable).toHaveBeenCalledWith(tableName);
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should not get table when force', () => {
    const tableName = 'test-3';
    getTable(SITE_ID, tableName, [], true, undefined, true);
    expect(mockTable).not.toHaveBeenCalledWith(tableName);
    expect(mockGet).toHaveBeenCalled();
  });
});
