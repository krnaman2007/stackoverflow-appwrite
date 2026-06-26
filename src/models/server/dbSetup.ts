import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import {tablesDB} from "./config"

export default async function getOrCreateDB(){
    try {
        await tablesDB.get(db)
        console.log("Database connected")
    } catch (error) {
        try {
            await tablesDB.create(db,db)  //databaseId,name
            console.log("Database created")
            //create collections
            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection(),
            ])
            console.log("Collection created")
        } catch (error) {
            console.log("Error creating tablesDB or collection",error)
        }
    }
    return tablesDB
}

