import { Permission, Role } from "node-appwrite";
import { commentCollection, db } from "../name";
import { tablesDB } from "./config";

export default async function createCommentCollection() {
    // Creating Collection
    await tablesDB.createTable(db, commentCollection, commentCollection, [
        Permission.create(Role.users()),
        Permission.read(Role.any()),
        Permission.read(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
    ]);
    console.log("Comment Collection Created");

    // Creating Attributes
    await Promise.all([
        tablesDB.createStringColumn(db, commentCollection, "content", 10000, true),
        tablesDB.createEnumColumn(db, commentCollection, "type", ["answer", "question"], true),
        tablesDB.createStringColumn(db, commentCollection, "typeId", 50, true),
        tablesDB.createStringColumn(db, commentCollection, "authorId", 50, true),
    ]);
    console.log("Comment Attributes Created");
}
