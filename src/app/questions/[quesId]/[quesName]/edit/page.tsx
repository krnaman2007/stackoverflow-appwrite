import { db, questionCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

const Page = async ({ params }: { params: { quesId: string; quesName: string } }) => {
    const question = await tablesDB.getRow(db, questionCollection, params.quesId);

    return <EditQues question={question} />;
};

export default Page;