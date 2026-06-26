import { answerCollection, db } from "@/models/name";
import { tablesDB, users} from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import {UserPrefs} from "@/store/Auth"

export async function POST(request: NextRequest){
    try {
        const {questionId, answer, authorId}=await request.json()

        /*
        await tablesDB.createRow({
            databaseId: string,        // required
            tableId: string,           // required
            rowId: string,             // required
            data: object,              // required — actual data
            permissions: Permission[], // optional
            transactionId: string,     // optional
        })
        */
        const response=await tablesDB.createRow(
            db,
            answerCollection,
            ID.unique(),
            {
                content: answer,
                authorId,
                questionId
            }
        )

        //Increase author reputation
        const prefs=await users.getPrefs<UserPrefs>(authorId)
        await users.updatePrefs(authorId,{
            reputation: Number(prefs.reputation)+1
        })

        return NextResponse.json(response,{
            status: 201
        })

    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error creating answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}

export async function DELETE(request: NextRequest){
    try {
        
        const {answerId}=await request.json()

        const answer=await tablesDB.getRow(db,answerCollection,answerId)

        const response=await tablesDB.deleteRow(db,answerCollection,answerId)

        //decrease the reputation
        const prefs=await users.getPrefs<UserPrefs>(answer.authorId)
        await users.updatePrefs(answer.authorId,{
            reputation: Number(prefs.reputation)-1
        })

        return NextResponse.json(
            {
                data: response
            },
            {
                status: 200
            }
        )

    } catch (error: any) {
        return NextResponse.json(
            {
                message: error?.message || "Error deleting answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
    }
}