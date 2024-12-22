import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { config } from '.';

interface ExtendedServiceAccount extends ServiceAccount {
    type?: string;
    privateKeyId?: string;
    clientId?: string;
    authUri?: string;
    tokenUri?: string;
    authProviderX509CertUrl?: string;
    clientC509CertUrl?: string;
    universeDomain?: string;
}


const serviceAccount: ExtendedServiceAccount = {
    type: config.firebase.type,
    projectId: config.firebase.projectId,
    clientEmail: config.firebase.clientEmail,
    privateKey: config.firebase.privateKey?.replace(/\\n/g, '\n'),
    privateKeyId: config.firebase.privateKeyId,
    clientId: config.firebase.clientId,
    authUri: config.firebase.authUri,
    tokenUri: config.firebase.tokenUri,
    authProviderX509CertUrl: config.firebase.authProviderCertUrl,
    clientC509CertUrl: config.firebase.clientCertUrl,
    universeDomain: config.firebase.universeDomain,
};


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const messaging = admin.messaging();
export default messaging;
