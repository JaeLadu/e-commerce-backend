import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const serviceAccount = process.env.FIREBASE_KEY;

if (!getApps().length) {
   initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
   });
}

export const firestoreDB = getFirestore();
