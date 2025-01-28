import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccount from "./service-account.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const messaging = admin.messaging();
export default messaging;
