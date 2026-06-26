import { Permission, Role } from "node-appwrite";
import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket);
        console.log("Storage Connected");
    } catch (error) {
        try {
            /*
            await storage.createBucket({
                bucketId: string,                    // required
                name: string,                        // required
                permissions: Permission[],           // optional
                fileSecurity: boolean,               // optional
                enabled: boolean,                    // optional
                maximumFileSize: number,             // optional (bytes mein)
                allowedFileExtensions: string[],     // optional
                compression: Compression,            // optional
                encryption: boolean,                 // optional
                antivirus: boolean,                  // optional
                transformations: boolean             // optional
            })
            */
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.create(Role.users()),
                    Permission.read(Role.any()),
                    Permission.read(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ],
                false,
                undefined,
                undefined,
                ["jpg", "png", "gif", "jpeg", "webp", "heic"]
            );

            console.log("Storage Created");
            console.log("Storage Connected");
        } catch (error) {
            console.error("Error creating storage:", error);
        }
    }
}
