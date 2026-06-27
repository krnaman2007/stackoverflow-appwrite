import { db, questionCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const { title, content, tags, authorId, attachmentId } = await request.json();

    const response = await tablesDB.createRow(db, questionCollection, ID.unique(), {
      title,
      content,
      tags,
      authorId,
      ...(attachmentId ? { attachmentId } : {}),
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error creating question" },
      { status: error?.status || 500 }
    );
  }
}
