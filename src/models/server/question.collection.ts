import { Permission, Role, TablesDBIndexType } from "node-appwrite"

import {db, questionCollection} from "../name"
import {tablesDB} from "./config"
import { OrderBy } from "node-appwrite"


export default async function createQuestionCollection(){
    //create collection
    /*
        await tablesDB.createTable({
            databaseId: string,       // required
            tableId: string,          // required
            name: string,             // required
            permissions: Permission[], // optional
            rowSecurity: boolean,     // optional
            enabled: boolean,         // optional
            columns: [],              // optional
            indexes: []               // optional
        })
    */
    await tablesDB.createTable(
        db,
        questionCollection,
        questionCollection,
        [
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ]
    )
    console.log("Question collection is created")

    //creating attributes and indexes
    await Promise.all([
        /*
        createStringColumn(
            databaseId,      // db
            tableId,         // questionCollection  
            key,             // "tags"
            size,            // 50
            required,        // true  ← pehla true
            defaultValue,    // undefined
            array,           // true  ← dusra true
        )
        */

        tablesDB.createStringColumn(db,questionCollection,"title",100,true),
        tablesDB.createStringColumn(db,questionCollection,"content",10000,true),
        tablesDB.createStringColumn(db,questionCollection,"authorId",50,true),
        tablesDB.createStringColumn(db,questionCollection,"tags",50,true,undefined,true),
        tablesDB.createStringColumn(db,questionCollection,"attachmentId",50,false),
    ])
    console.log("Questions Attributed created")

    await new Promise(resolve => setTimeout(resolve, 2000))

    // create index
    await Promise.all([
        tablesDB.createIndex(
            db,                           // databaseId
            questionCollection,           // tableId
            "title",                      // key
            TablesDBIndexType.Fulltext,   // type
            ["title"],                    // attributes
            [OrderBy.Asc]                 // order
        ),
        tablesDB.createIndex(
            db,
            questionCollection,
            "content",
            TablesDBIndexType.Fulltext,
            ["content"],
            [OrderBy.Asc]
        )
    ])
}