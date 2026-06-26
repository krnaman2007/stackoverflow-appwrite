import env from "@/app/env"

import { Client, Account, Avatars, TablesDB, Storage } from "appwrite";


const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId); // Your project ID


const tablesDB=new TablesDB(client)
const account = new Account(client);
const avatars=new Avatars(client)
const storage=new Storage(client)

export {client, tablesDB , account, avatars, storage}

