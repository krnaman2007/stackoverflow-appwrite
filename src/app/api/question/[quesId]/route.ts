import { db, questionCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ quesId: string }> }
) {
  try {
    const { quesId } = await params;
    const { title, content, tags, attachmentId } = await request.json();

    const response = await tablesDB.updateRow(db, questionCollection, quesId, {
      title,
      content,
      tags,
      ...(attachmentId ? { attachmentId } : {}),
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error updating question" },
      { status: error?.status || 500 }
    );
  }
}