import { Client, Databases, Account } from 'appwrite';
import { Client as NodeClient, Databases as NodeDatabases } from 'node-appwrite';

// Public Client (for frontend)
export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const databases = new Databases(client);

// Admin Client (for API routes / backend)
export const createAdminClient = () => {
    const nodeClient = new NodeClient()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
        .setKey(process.env.APPWRITE_API_KEY || '');

    return {
        get databases() {
            return new NodeDatabases(nodeClient);
        },
        get storage() {
            const { Storage } = require('node-appwrite');
            return new Storage(nodeClient);
        }
    };
};

// IDs from your Appwrite Dashboard
export const APPWRITE_DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const ADS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ADS_COLLECTION_ID || '';
export const ANALYTICS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ANALYTICS_COLLECTION_ID || '';
