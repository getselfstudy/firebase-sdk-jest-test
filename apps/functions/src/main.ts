// The Firebase Admin SDK to access Firebase Features from within Cloud Functions.
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

// When this parameter is set, Cloud Firestore ignores undefined properties
// inside objects rather than rejecting the API call.
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export { submitAnswer } from './functions/submitAnswer';
