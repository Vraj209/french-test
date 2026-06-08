import { PrismaClient } from "@prisma/client";
import {
  grammarTopics,
  lessons,
  levels,
  seedSources,
  vocabularySections
} from "../content/seeds/french-catalog";
import { skillFocusLabels, vocabularyThemes } from "../src/lib/exam-catalog";

const prisma = new PrismaClient();

async function main() {
  for (const level of levels) {
    await prisma.level.upsert({
      where: { code: level.code },
      update: level,
      create: level
    });
  }

  for (const source of seedSources) {
    await prisma.sourceReference.upsert({
      where: {
        kind_title: {
          kind: source.kind,
          title: source.title
        }
      },
      update: {
        url: source.url,
        citation: source.citation
      },
      create: {
        kind: source.kind,
        title: source.title,
        url: source.url,
        citation: source.citation
      }
    });
  }

  for (const theme of vocabularyThemes) {
    await prisma.vocabularyTheme.upsert({
      where: { slug: theme.slug },
      update: {
        name: theme.name,
        description: theme.description,
        terms: theme.terms
      },
      create: {
        name: theme.name,
        slug: theme.slug,
        description: theme.description,
        terms: theme.terms
      }
    });
  }

  for (const [slug, name] of Object.entries(skillFocusLabels)) {
    await prisma.skill.upsert({
      where: { slug: slug.toLowerCase() },
      update: {
        name,
        description: `${name} skill focus for TEF/TCF practice generation, evaluation, and progress tracking.`
      },
      create: {
        slug: slug.toLowerCase(),
        name,
        description: `${name} skill focus for TEF/TCF practice generation, evaluation, and progress tracking.`
      }
    });
  }

  for (const topic of grammarTopics) {
    await prisma.grammarTopic.upsert({
      where: {
        levelCode_slug: {
          levelCode: topic.levelCode,
          slug: topic.slug
        }
      },
      update: {
        name: topic.name,
        description: topic.description
      },
      create: topic
    });
  }

  for (const section of vocabularySections) {
    await prisma.vocabularySection.upsert({
      where: {
        levelCode_slug: {
          levelCode: section.levelCode,
          slug: section.slug
        }
      },
      update: {
        name: section.name,
        description: section.description,
        words: section.words
      },
      create: section
    });
  }

  for (const lesson of lessons) {
    const topic = await prisma.grammarTopic.findUnique({
      where: {
        levelCode_slug: {
          levelCode: lesson.levelCode,
          slug: lesson.topicSlug
        }
      }
    });

    await prisma.lesson.upsert({
      where: {
        levelCode_slug: {
          levelCode: lesson.levelCode,
          slug: lesson.slug
        }
      },
      update: {
        title: lesson.title,
        content: lesson.content,
        cefrCanDo: lesson.cefrCanDo,
        grammarTopicId: topic?.id
      },
      create: {
        levelCode: lesson.levelCode,
        title: lesson.title,
        slug: lesson.slug,
        content: lesson.content,
        cefrCanDo: lesson.cefrCanDo,
        grammarTopicId: topic?.id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
