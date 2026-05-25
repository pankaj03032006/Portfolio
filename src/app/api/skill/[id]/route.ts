import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/db";
import Skill from "../../../../../models/skill.model";
import { DeleteImage } from "../../../../../lib/delete-image";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ConnectDB();

    // 🔥 IMPORTANT FIX (await params)
    const { id } = await context.params;

    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      );
    }

    if (skill.skillImagePublicId) {
      await DeleteImage(skill.skillImagePublicId);
    }

    await Skill.findByIdAndDelete(id);

    revalidatePath("/admin-panel/skills");
    revalidatePath("/");

    return NextResponse.json(
      { message: "Skill deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}