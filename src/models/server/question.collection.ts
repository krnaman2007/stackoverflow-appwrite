import { DatabasesIndexType, Permission } from "node-appwrite"

import {db, questionCollection} from "../name"
import {databases} from "./config"
import { OrderBy } from "node-appwrite"


export default async function createQuestionCollection(){
    //create collection
    await databases.createCollection(db,questionCollection,questionCollection,[
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log("Question collection is created")

    //creating attributes and indexes
    await Promise.all([
        databases.createStringAttribute(db,questionCollection,"title",100,true),
        databases.createStringAttribute(db,questionCollection,"content",10000,true),
        databases.createStringAttribute(db,questionCollection,"authorId",50,true),
        databases.createStringAttribute(db,questionCollection,"tags",50,true,undefined,true),
        databases.createStringAttribute(db,questionCollection,"attachmentId",50,false),
    ])
    console.log("Questions Attributed created")

    await new Promise(resolve => setTimeout(resolve, 2000))

    // create index
    await Promise.all([
        databases.createIndex(
            db,
            questionCollection,
            "title",
            DatabasesIndexType.Fulltext,
            ["title"],
            [OrderBy.Asc]
        ),
        databases.createIndex(
            db,
            questionCollection,
            "content",
            DatabasesIndexType.Fulltext,
            ["content"],
            [OrderBy.Asc]
        )
    ])
}