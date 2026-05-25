"use client";

import React from "react";
import { motion } from "framer-motion";
import { IAbout } from "../../models/about.model";

interface AboutSectionProps {
  about?: IAbout | null;
}

export default function AboutSection({ about }: AboutSectionProps) {
  // Loading state
  if (!about) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-20 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Heading */}
        <div className="flex flex-col mb-2">
          <p className="text-sm dark:text-gray-400 text-gray-700">
            About
          </p>
          <h2 className="md:text-xl text-xl font-bold">Me</h2>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          <p className="md:text-lg text-sm opacity-80 leading-relaxed whitespace-pre-wrap">
            {about.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}