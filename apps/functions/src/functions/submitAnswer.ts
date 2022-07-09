// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';

import { insertAnswer } from '@nx-workspace/bigquery';
import sha1 = require('simple-sha1');
import log from '../loggerProxy'; // This cannot be shared outside of functions.

export function hashUid(uid: string): string {
  return sha1.sync(`uid|${uid}|${uid.length}`);
}

export async function getUserMetadata(
  uid: string,
  options: any
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Promise<any> {
  return {};
}
export const submitAnswer = functions.firestore
  .document('Users/{userId}/Bundles/{bundleId}/BundleAnswers/{answerId}')
  .onCreate(async (after, context) => {
    await insertAnswer('sample', {}, log);
  });
