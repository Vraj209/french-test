import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { grammarConceptsByLevel, vocabularyThemes } from "@/lib/exam-catalog";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 86400;

type SitemapEntry = MetadataRoute.Sitemap[number];

const levels = ["A1", "A2", "B1", "B2"] as const;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function entry(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "weekly",
  lastModified = new Date()
): SitemapEntry {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority
  };
}

function fallbackLessonEntries(now: Date): SitemapEntry[] {
  const grammarEntries = Object.entries(grammarConceptsByLevel).flatMap(
    ([level, topics]) =>
      topics.map((topic) =>
        entry(
          `/lessons/grammar/${level.toLowerCase()}/${slugify(topic)}`,
          0.55,
          "monthly",
          now
        )
      )
  );

  const vocabularyEntries = levels.flatMap((level) =>
    vocabularyThemes.map((theme) =>
      entry(
        `/lessons/vocabulary/${level.toLowerCase()}/${theme.slug}`,
        0.5,
        "monthly",
        now
      )
    )
  );

  return [...grammarEntries, ...vocabularyEntries];
}

async function dynamicLessonEntries(now: Date): Promise<SitemapEntry[]> {
  try {
    const [grammarTopics, vocabularySections] = await Promise.all([
      prisma.grammarTopic.findMany({
        select: {
          levelCode: true,
          slug: true,
          updatedAt: true
        }
      }),
      prisma.vocabularySection.findMany({
        select: {
          levelCode: true,
          slug: true,
          updatedAt: true
        }
      })
    ]);

    if (grammarTopics.length + vocabularySections.length === 0) {
      return fallbackLessonEntries(now);
    }

    return [
      ...grammarTopics.map((topic) =>
        entry(
          `/lessons/grammar/${topic.levelCode.toLowerCase()}/${topic.slug}`,
          0.55,
          "monthly",
          topic.updatedAt
        )
      ),
      ...vocabularySections.map((section) =>
        entry(
          `/lessons/vocabulary/${section.levelCode.toLowerCase()}/${section.slug}`,
          0.5,
          "monthly",
          section.updatedAt
        )
      )
    ];
  } catch {
    return fallbackLessonEntries(now);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: SitemapEntry[] = [
    entry("/", 1, "weekly", now),
    entry("/tef-canada", 0.95, "weekly", now),
    entry("/tcf-canada", 0.95, "weekly", now),
    entry("/nclc-7-french", 0.95, "weekly", now),
    entry("/tef-preparation", 0.9, "weekly", now),
    entry("/learn-french", 0.85, "weekly", now),
    entry("/grammar", 0.85, "weekly", now),
    entry("/lessons", 0.8, "weekly", now),
    entry("/resources", 0.7, "monthly", now),
    entry("/quizlet", 0.6, "monthly", now)
  ];

  return [...staticEntries, ...(await dynamicLessonEntries(now))];
}
