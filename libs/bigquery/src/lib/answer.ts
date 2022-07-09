import { Table } from '@google-cloud/bigquery';
import { LoggerFn } from '@nx-workspace/util-logger';
import { every, isArray, isObject, pickBy } from 'lodash';
import { getTable } from './common';

// Before any change to this schema consider if it will change
// see: https://github.com/getselfstudy/nx-workspace/issues/674
const name = 'raw_proxy';
// We now validate against this schema.
// Filter data by removing fields not in the schema and then causing an error
// if the remote schema doesn't match this one, but not when the app sends a field
// which is not in the schema. If we need to add a new field it has to be updated
// here first.
const schema = [];

const schemaFields = new Map(
  schema.map((item) => {
    const { name } = item;
    return [name, item];
  })
);

export async function insertAnswer(datasetId: string, data, log?: LoggerFn) {
  const { answerId: insertId } = data;
  // Create clean raw data structure.
  const row = [
    {
      insertId,
      json: Table.encodeValue_(
        pickBy(data, (val, key) => {
          const field = schemaFields.get(key);
          if (field != null && val != null) {
            const { type, mode } = field;
            if (mode === 'REPEATED') {
              if (type === 'RECORD') {
                return isArray(val) && every(val, (v) => isObject(v));
              } else {
                return isArray(val) && every(val, (v) => v != null);
              }
            }
            return true;
          }
          return false;
        })
      ),
    },
  ];
  if (log) {
    log.debug('Digested', row[0].json);
  }
  try {
    const table = await getTable(datasetId, name, schema, false, log, true);
    // Try only once and do not ignore unknown values.
    await table.insert(row, { partialRetries: 1, raw: true });
  } catch (err) {
    try {
      // Force update of the schema.
      const table = await getTable(datasetId, name, schema, true, log, true);
      // Try up to standard retry times, but at this point we know the schema.
      await table.insert(row, { partialRetries: 20, raw: true, schema });
    } catch (err) {
      if (log) {
        log.error('Insert Error %o', err);
      }
      throw err;
    }
  }
}
