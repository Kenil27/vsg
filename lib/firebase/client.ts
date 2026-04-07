import {
  type FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export type ClientFirebase = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let cached: ClientFirebase | null = null;

function assertConfig() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error(
      "Missing Firebase env vars. Copy .env.example to .env.local and fill values.",
    );
  }
}

/** Browser-only. Call from client components after mount or in event handlers. */
export function getClientFirebase(): ClientFirebase {
  if (typeof window === "undefined") {
    throw new Error("Firebase client SDK is only available in the browser.");
  }
  assertConfig();
  if (!cached) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    cached = { app, auth: getAuth(app), db: getFirestore(app) };
  }
  return cached;
}
