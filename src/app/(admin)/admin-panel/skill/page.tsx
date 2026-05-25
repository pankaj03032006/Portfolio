import React from "react";
import { Separator } from "@/components/ui/separator";
import SkillForm from "./_components/skillForm";
import { ConnectDB } from "../../../../../lib/db";
import Skill from "../../../../../models/skill.model";
import SortableSkillList from "./_components/SortableSkillList";

interface Skill {
  id: string;
  skillCategory: string;
  skillName: string;
  skillImage: string;
  skillImagePublicId: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

async function fetchSkills(): Promise<Skill[]> {
  await ConnectDB();

  // ✅ IMPORTANT FIX: use lean()
  const skills = await Skill.find()
    .sort({ priority: 1 })
    .lean();

  return skills.map((skill: any) => ({
    id: skill._id.toString(),
    skillCategory: skill.skillCategory,
    skillName: skill.skillName,
    skillImage: skill.skillImage,
    skillImagePublicId: skill.skillImagePublicId,
    priority: skill.priority,
    createdAt: skill.createdAt?.toString(),
    updatedAt: skill.updatedAt?.toString(),
    __v: skill.__v,
  }));
}

export default async function SkillPage() {
  const skills = await fetchSkills();

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Skill Section
          </h1>
          <p className="text-muted-foreground">
            Manage your skills, add new ones, and reorder them.
          </p>
        </div>

        <SkillForm />
      </div>

      <Separator />

      {/* ✅ Safe client component data */}
      <SortableSkillList initialSkills={skills} />
    </div>
  );
}