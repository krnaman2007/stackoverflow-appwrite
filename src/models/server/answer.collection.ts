import { DatabasesIndexType, Permission } from "node-appwrite";
import { answerCollection, db } from "../name";
import { tablesDB } from "./config";

export default async function createAnswerCollection() {
    // Creating Collection
    await tablesDB.createTable(
        db,
        answerCollection,
        answerCollection,
        [
            Permission.create("users"),
            Permission.read("any"),
            Permission.read("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]
    )
    console.log("Answer Collection Created");

    // Creating Attributes
    await Promise.all([
        tablesDB.createStringColumn(db, answerCollection, "content", 10000, true),
        tablesDB.createStringColumn(db, answerCollection, "questionId", 50, true),
        tablesDB.createStringColumn(db, answerCollection, "authorId", 50, true),
    ]);
    console.log("Answer Attributes Created");
}
