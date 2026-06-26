import { Permission, Role } from "node-appwrite";
import { db, voteCollection } from "../name";
import { tablesDB } from "./config";

export default async function createVoteCollection() {
    // Creating Collection
    await tablesDB.createTable(
        db,
        voteCollection,
        voteCollection,
        [
            Permission.create(Role.users()),
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
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
