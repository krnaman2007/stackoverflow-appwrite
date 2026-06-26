import env from "@/app/env";

import {Avatars, Client, Databases, Storage, TablesDB, Users} from 'node-appwrite'

let client = new Client();

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apikey) // Your secret API key
;

const tablesDB=new TablesDB(client)
const avatars=new Avatars(client)
const storage=new Storage(client)
const users=new Users(client)


export {client, tablesDB ,users, avatars, storage}
