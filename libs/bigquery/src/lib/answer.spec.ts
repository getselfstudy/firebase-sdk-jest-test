import { insertAnswer } from './answer';
import mocked = jest.mocked;
import { getTable } from './common';
import { Table } from '@google-cloud/bigquery';

jest.mock('./common');
const mockTableInsert = jest.fn();
const mockGetTable = mocked(getTable);
const DATASET_ID = 'site_siteID';

describe('BQ insertAnswer', () => {
  const answerId = 'my-id';
  const answer = { answerId };
  const assertSchema = expect.arrayContaining([]);

  beforeEach(() => {
    mockTableInsert.mockImplementation(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 300);
      });
    });
    mockGetTable.mockResolvedValue({
      insert: mockTableInsert,
    } as unknown as Table);
  });
  const assertDatasetId = expect.stringMatching(DATASET_ID);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call getTable with params', async () => {
    await insertAnswer(DATASET_ID, answer);

    expect(mockGetTable).toHaveBeenCalledTimes(1);
    expect(mockGetTable).toHaveBeenCalledWith(
      assertDatasetId,
      'raw_proxy',
      assertSchema,
      false,
      undefined,
      true
    );
  });
});
