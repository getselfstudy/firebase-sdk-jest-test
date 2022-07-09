import { Table } from '@google-cloud/bigquery';
import { LoggerFn } from '@nx-workspace/util-logger';
import { every, isArray, isObject, pickBy } from 'lodash';
import { getTable } from './common';

// Before any change to this schema consider if it will change
// see: https://github.com/getselfstudy/nx-workspace/issues/674
const name = 'user_bundles_update';
const schema = [];

const schemaFields = new Map(
  schema.map((item) => {
    const { name } = item;
    return [name, item];
  })
);

export async function insertAssignmentBundle(
  datasetId: string,
  data,
  log?: LoggerFn
) {
  // Create clean raw data structure.
  const row = [
    {
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
    const table = await getTable(datasetId, name, schema, false, log, false);
    // Try only once and do not ignore unknown values.
    await table.insert(row, { partialRetries: 1, raw: true });
  } catch (err) {
    try {
      // Force update of the schema.
      const table = await getTable(datasetId, name, schema, true, log, false);
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
