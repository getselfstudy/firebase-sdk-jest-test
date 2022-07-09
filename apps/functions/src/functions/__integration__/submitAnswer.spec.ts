/* eslint-disable @typescript-eslint/no-explicit-any */
import admin from 'firebase-admin';
import functionsTest from 'firebase-functions-test';

// Must be set, when running in ide, instead of script invocation from yarn
// This has to come before the includes since they internally use firestore
if (!process.env.GOOGLE_CLOUD_PROJECT) {
  process.env.GCLOUD_PROJECT = 'test';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.PUBSUB_EMULATOR_HOST = 'localhost:8085';
}
const db = admin.initializeApp().firestore();
db.settings({
  ignoreUndefinedProperties: true,
});

jest.mock('@nx-workspace/bigquery', () => ({
  insertAnswer: jest.fn(),
}));

import { submitAnswer } from '../submitAnswer';
import { insertAnswer } from '@nx-workspace/bigquery';

const test = functionsTest({
  projectId: process.env.GCLOUD_PROJECT,
  storageBucket: 'test-bucket',
});

const bundleId = 'bundle-1';
const answerId = 'answer-1';
const datasetId = 'sample';
const answerData = {};

describe('submitAnswer', () => {
  const testUser = 'user-2-answers';
  const users = admin.firestore().collection('Users');

  beforeEach(() => {
    jest.mocked(insertAnswer).mockReset();
  });

  it('should send an answer to bigquery - test user', async () => {
    await users.doc(testUser).set({
      email: 'sample@example.com',
    });

    await doSubmitAnswer({ userId: testUser, bundleId, answerId }, answerData);

    expect(insertAnswer).toBeCalledWith(
      datasetId,
      expect.objectContaining({}),
      expect.any(Function)
    );
  }, 120000);
});

async function doSubmitAnswer(
  {
    userId,
    bundleId,
    answerId,
  }: { userId: string; bundleId: string; answerId: string },
  data: any
) {
  const after = {
    data: () => {
      return data;
    },
    ref: {
      path: `/Users/${userId}/Bundles/${bundleId}/BundleAnswers/${answerId}`,
    },
  } as admin.firestore.QueryDocumentSnapshot;
  const wrapped = test.wrap(submitAnswer);
  await wrapped(after, {
    params: { userId, bundleId, answerId },
  });
}
