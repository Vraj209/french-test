import { prisma } from "@/lib/db";
import type { AnswerSubmission } from "@/lib/schemas";

export async function saveAnswersForUserTest({
  userId,
  testId,
  submission,
  requireComplete = false
}: {
  userId: string;
  testId: string;
  submission: AnswerSubmission;
  requireComplete?: boolean;
}) {
  const test = await prisma.test.findFirst({
    where: {
      id: testId,
      userId
    },
    include: {
      questions: {
        select: { id: true }
      }
    }
  });

  if (!test) {
    throw new Error("Test not found.");
  }

  const validQuestionIds = new Set(test.questions.map((question) => question.id));
  const submittedAnswers = new Map(
    submission.answers.map((answer) => [answer.questionId, answer] as const)
  );

  for (const questionId of submittedAnswers.keys()) {
    if (!validQuestionIds.has(questionId)) {
      throw new Error("One or more answers reference an invalid question.");
    }
  }

  const answersToPersist = requireComplete
    ? test.questions.map((question) => submittedAnswers.get(question.id) ?? {
        questionId: question.id,
        answerText: ""
      })
    : Array.from(submittedAnswers.values());

  await prisma.$transaction(async (tx) => {
    for (const answer of answersToPersist) {
      if (answer.imageId) {
        const image = await tx.uploadedImage.findFirst({
          where: {
            id: answer.imageId,
            testId,
            userId
          }
        });

        if (!image) {
          throw new Error("One or more answer images are invalid.");
        }
      }

      await tx.userAnswer.upsert({
        where: {
          testId_questionId: {
            testId,
            questionId: answer.questionId
          }
        },
        update: {
          answerText: answer.answerText,
          extractedText: answer.extractedText,
          imageId: answer.imageId
        },
        create: {
          userId,
          testId,
          questionId: answer.questionId,
          answerText: answer.answerText,
          extractedText: answer.extractedText,
          imageId: answer.imageId
        }
      });
    }

    await tx.test.update({
      where: { id: test.id },
      data: { status: "IN_PROGRESS" }
    });
  });
}
