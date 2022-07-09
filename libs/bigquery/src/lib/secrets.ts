import { config, parse } from 'dotenv';
import { statSync, readFileSync } from 'fs';
import * as firebase from 'firebase-admin';
import { Logger } from '@nx-workspace/util-logger';
import { resolve } from 'path';
const log = Logger('nx:secrets');

export let secrets: string;
try {
  const s = statSync('/run/secrets/.env');
  if (s.isFile()) {
    secrets = '/run/secrets/.env';
  }
} catch (err) {
  // Ignore
}
if (!secrets) {
  try {
    const s = statSync('.env');
    if (s.isFile()) {
      secrets = resolve('.env');
    }
  } catch (err) {
    // Ignore
  }
}

let _serve = !!process.env.NX_APP_PATH;
if (secrets) {
  log(`Processing production secrets`);
  _serve = true;
  // If this is a runtime config, we should use all .env variables
  const envConfig = parse(readFileSync(secrets));
  for (const k in envConfig) {
    if (process.env.NODE_ENV !== 'production') {
      if (!(k in process.env)) {
        process.env[k] = envConfig[k];
      }
      continue;
    }
    process.env[k] = envConfig[k];
  }
} else {
  log('Processing dev secrets %s', process.cwd());
  config({ path: './.env' });
}

// Important placement to make sure firebase app is initialized.
log(
  `Site=${process.env.NX_SITE_ID}\nProject=${process.env.NX_FIREBASE_PROJECT_ID}\nBucket=${process.env.NX_FIREBASE_STORAGE_BUCKET}`
);
let _credential;
let _cred = null;
if (process.env.NX_FIREBASE_SERVICE) {
  _cred = JSON.parse(process.env.NX_FIREBASE_SERVICE);
  _cred.private_key = _cred.private_key
    .split(/[ \n]/)
    .join('\n')
    .replace(
      /([-]+)([A-Z\n]+)([-]+\n)/g,
      (a, pre, tag, post) => `${pre}${tag.replace(/\n/g, ' ')}${post}`
    );
  _credential = firebase.credential.cert(_cred);
} else {
  _credential = firebase.credential.applicationDefault();
}

export const cred = _cred;
export const serve = _serve;
export const credential = _credential;
