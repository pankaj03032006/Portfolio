import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import Skill from "../../../../../models/skill.model";

export async function PUT(req: NextRequest) {
  try {
    await ConnectDB();

    const body = await req.json();
    const { skillIds } = body;

    if (!Array.isArray(skillIds) || skillIds.length === 0) {
      return NextResponse.json(
        { message: "Invalid skillIds format" },
        { status: 400 }
      );
    }

    // validate all ids are strings
    if (!skillIds.every((id) => typeof id === "string")) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // 🔥 Better performance: bulk update instead of Promise.all
    const bulkOps = skillIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { priority: index } },
      },
    }));

    await Skill.bulkWrite(bulkOps);

    return NextResponse.json(
      { message: "Skills reordered successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error reordering skills:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}