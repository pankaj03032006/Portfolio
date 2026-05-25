import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/db";
import About from "../../../../models/about.model";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    await ConnectDB();

    const body = await req.json();
    const { desc } = body;

    // validate input
    if (!desc || desc.trim() === "") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // ensure only one About exists
    const existAbout = await About.findOne({});

    if (existAbout) {
      return NextResponse.json(
        { error: "About section already exists" },
        { status: 400 }
      );
    }

    // create new About
    const newAbout = await About.create({ desc });

    // refresh cache
    revalidatePath("/admin-panel/about");
    revalidatePath("/");

    return NextResponse.json(
      {
        message: "About section created successfully",
        data: newAbout,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/about:", error);

    return NextResponse.json(
      {
        error: "Failed to create about section",
      },
      { status: 500 }
    );
  }
}