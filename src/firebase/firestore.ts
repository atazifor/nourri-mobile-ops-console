import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseApp } from './config';

// Firestore service singleton bound to the shared FirebaseApp. Consume this
// from the service layer (src/services/*) rather than reaching into Firebase
// directly from pages or components, so query logic stays centralized and
// the rest of the app talks to typed service functions.
export const db: Firestore = getFirestore(firebaseApp);
