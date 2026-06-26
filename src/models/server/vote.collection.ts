import { Permission } from "node-appwrite";
import { db, voteCollection } from "../name";
import { tablesDB } from "./config";

export default async function createVoteCollection() {
    // Creating Collection
    await tablesDB.createTable(
        db,
        voteCollection,
        voteCollection,
        [
            Permission.create("users"),
            Permission.read("any"),
            Permission.read("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]
    )
    console.log("Vote Collection Created");

    // Creating Attributes
    await Promise.all([
        tablesDB.createEnumColumn(db, voteCollection, "type", ["question", "answer"], true),
        tablesDB.createStringColumn(db, voteCollection, "typeId", 50, true),
        tablesDB.createEnumColumn(
            db,
            voteCollection,
            "voteStatus",
            ["upvoted", "downvoted"],
            true
        ),
        tablesDB.createStringColumn(db, voteCollection, "votedById", 50, true),
    ]);
    console.log("Vote Attributes Created");
}
