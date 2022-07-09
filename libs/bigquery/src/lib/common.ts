import { differenceBy } from 'lodash';
import { Table, BigQuery } from '@google-cloud/bigquery';
import { LoggerFn } from '@nx-workspace/util-logger';
import { cred } from './secrets';

const bigquery = new BigQuery(
  cred
    ? { credentials: cred, projectId: process.env.NX_FIREBASE_PROJECT_ID }
    : {}
);
interface Field {
  name: string;
  type: string;
  mode: string;
}

interface SchemaField extends Field {
  fields?: Field[];
}

function createOptions(schema: SchemaField[], partitionByTimestamp: boolean) {
  const options = {
    autoCreate: true,
    schema,
    location: 'US',
  };
  if (!partitionByTimestamp) {
    return options;
  }
  return {
    ...options,
    timePartitioning: {
      type: 'DAY',
      field: 'timestamp',
    },
  };
}

async function _getTable(
  datasetId: string,
  table_name: string,
  schema: SchemaField[],
  force: boolean,
  log: LoggerFn,
  partitionByTimestamp: boolean
) {
  try {
    const dataset = bigquery.dataset(datasetId);
    if (!force) {
      return dataset.table(table_name);
    }
    const [ds] = await dataset.get({
      autoCreate: true,
    });
    const dsTable = ds.table(table_name);
    const [table] = await dsTable.get(
      createOptions(schema, partitionByTimestamp)
    );
    const { metadata } = table;
    const { schema: currentSchema } = metadata;

    const missingFields = differenceBy(
      schema,
      currentSchema.fields,
      (field: { name: string }) => field.name
    );
    if (missingFields.length > 0) {
      if (log) {
        log.debug('Upserting Big Query Schema', missingFields);
      }
      // Revert changes to schema mod.
      // The reason I changed this, was because in some cases
      // modifying the internal metadata of the table caused
      // a partial failure error, but today it looks like
      // the reverse is true and the follow up insert is failing
      // with a partical failure if it's the first record with the new schema.
      // When we move this to a cloud function it won't be a big deal
      // either way but it's curious that either one of them would fail.
      // the docs suggest in place of modification of the schema.
      // Change this code to do the minimum mods (i.e. don't use concat,
      // to leave the existing fields in the same array structure)
      for (const field of missingFields) {
        currentSchema.fields.push(field);
      }
      const [result] = await table.setMetadata(metadata);
      if (log) {
        log.debug('Done upserting table', result);
      }
      return dataset.table(table_name);
    }
    return table;
  } catch (err) {
    if (log) {
      log.error('Unable to _getTable', err);
    }
    throw err;
  }
}

const _tables = new Map<string, Promise<Table>>();

export async function getTable(
  datasetId: string,
  name: string,
  schema: SchemaField[],
  force,
  log: LoggerFn,
  partitionByTimestamp: boolean
): Promise<Table> {
  const key = `${datasetId}/${name}`;
  const table = _tables.get(key);
  if (table && !force) {
    return await table;
  }
  const newTable = _getTable(
    datasetId,
    name,
    schema,
    force,
    log,
    partitionByTimestamp
  );
  _tables.set(key, newTable);
  return await newTable;
}
