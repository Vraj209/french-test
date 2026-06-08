-- Expand the product from generic French tests into a TEF/TCF exam-prep platform.
ALTER TYPE "ExamType" ADD VALUE IF NOT EXISTS 'CEFR_PRACTICE';
ALTER TYPE "ExamType" ADD VALUE IF NOT EXISTS 'GENERAL_TEF';
ALTER TYPE "ExamType" ADD VALUE IF NOT EXISTS 'GENERAL_TCF';

CREATE TYPE "PreparationMode" AS ENUM (
  'CEFR_GRAMMAR',
  'TEF_CANADA_PRACTICE',
  'TCF_CANADA_PRACTICE',
  'WRITING_PRACTICE',
  'SPEAKING_PRACTICE',
  'MIXED_GRAMMAR_VOCABULARY',
  'FULL_MOCK_EXAM'
);

CREATE TYPE "SkillFocus" AS ENUM (
  'READING',
  'LISTENING',
  'WRITING',
  'SPEAKING',
  'GRAMMAR',
  'VOCABULARY',
  'MIXED'
);

CREATE TYPE "TargetScoreLevel" AS ENUM (
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'CLB_NCLC_TARGET'
);

CREATE TABLE "VocabularyTheme" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "terms" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VocabularyTheme_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VocabularyTheme_slug_key" ON "VocabularyTheme"("slug");

CREATE TABLE "Skill" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

CREATE TABLE "PracticeSet" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "title" TEXT NOT NULL,
  "examType" "ExamType" NOT NULL DEFAULT 'TEF_CANADA',
  "preparationMode" "PreparationMode" NOT NULL DEFAULT 'TEF_CANADA_PRACTICE',
  "skillFocus" "SkillFocus" NOT NULL DEFAULT 'MIXED',
  "level" "CefrLevel" NOT NULL,
  "targetScoreLevel" "TargetScoreLevel" NOT NULL DEFAULT 'CLB_NCLC_TARGET',
  "targetNclc" TEXT,
  "grammarTopics" JSONB NOT NULL DEFAULT '[]',
  "vocabularyThemes" JSONB NOT NULL DEFAULT '[]',
  "questionFocuses" JSONB NOT NULL DEFAULT '[]',
  "totalMarks" INTEGER NOT NULL,
  "numberOfQuestions" INTEGER NOT NULL,
  "timeLimitSeconds" INTEGER,
  "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
  "source" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PracticeSet_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PracticeSet_userId_createdAt_idx" ON "PracticeSet"("userId", "createdAt");
CREATE INDEX "PracticeSet_examType_preparationMode_idx" ON "PracticeSet"("examType", "preparationMode");

ALTER TABLE "Test"
  ADD COLUMN "practiceSetId" TEXT,
  ADD COLUMN "preparationMode" "PreparationMode" NOT NULL DEFAULT 'TEF_CANADA_PRACTICE',
  ADD COLUMN "targetScoreLevel" "TargetScoreLevel" NOT NULL DEFAULT 'CLB_NCLC_TARGET',
  ADD COLUMN "skillFocus" "SkillFocus" NOT NULL DEFAULT 'MIXED',
  ADD COLUMN "questionFocuses" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "timeLimitSeconds" INTEGER,
  ADD COLUMN "fullTest" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Test_examType_preparationMode_idx" ON "Test"("examType", "preparationMode");

ALTER TABLE "TestQuestion"
  ADD COLUMN "examType" "ExamType" NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN "skill" "SkillFocus" NOT NULL DEFAULT 'MIXED',
  ADD COLUMN "vocabularyTheme" TEXT,
  ADD COLUMN "questionTypeFocus" TEXT,
  ADD COLUMN "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
  ADD COLUMN "evaluationRubric" JSONB;

CREATE INDEX "TestQuestion_examType_examSection_idx" ON "TestQuestion"("examType", "examSection");
CREATE INDEX "TestQuestion_skill_idx" ON "TestQuestion"("skill");

ALTER TABLE "EvaluationFeedback"
  ADD COLUMN "estimatedLevel" TEXT,
  ADD COLUMN "modelAnswer" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "strongPoints" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "weakPoints" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "grammarTopicsToRevise" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "vocabularyToLearn" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "examStrategyTip" TEXT NOT NULL DEFAULT '';

CREATE TABLE "MockExam" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "testId" TEXT,
  "title" TEXT NOT NULL,
  "examType" "ExamType" NOT NULL,
  "level" "CefrLevel" NOT NULL,
  "targetNclc" TEXT,
  "totalMarks" INTEGER NOT NULL,
  "timeLimitSeconds" INTEGER NOT NULL,
  "status" "TestStatus" NOT NULL DEFAULT 'GENERATED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MockExam_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MockExam_testId_key" ON "MockExam"("testId");
CREATE INDEX "MockExam_userId_createdAt_idx" ON "MockExam"("userId", "createdAt");
CREATE INDEX "MockExam_examType_status_idx" ON "MockExam"("examType", "status");

CREATE TABLE "MockExamSection" (
  "id" TEXT NOT NULL,
  "mockExamId" TEXT NOT NULL,
  "examSection" "ExamSection" NOT NULL,
  "skillFocus" "SkillFocus" NOT NULL,
  "questionCount" INTEGER NOT NULL,
  "marks" INTEGER NOT NULL,
  "timeLimitSeconds" INTEGER NOT NULL,
  "status" "TestStatus" NOT NULL DEFAULT 'GENERATED',
  "score" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MockExamSection_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MockExamSection_mockExamId_examSection_idx" ON "MockExamSection"("mockExamId", "examSection");

CREATE TABLE "WritingEvaluation" (
  "id" TEXT NOT NULL,
  "userAnswerId" TEXT NOT NULL,
  "taskCompletion" DOUBLE PRECISION,
  "relevance" DOUBLE PRECISION,
  "grammarAccuracy" DOUBLE PRECISION,
  "vocabularyRange" DOUBLE PRECISION,
  "coherenceCohesion" DOUBLE PRECISION,
  "registerControl" DOUBLE PRECISION,
  "correctedVersion" TEXT NOT NULL,
  "modelAnswer" TEXT NOT NULL,
  "estimatedCefr" TEXT,
  "estimatedClb" TEXT,
  "strategyTip" TEXT NOT NULL,
  "rubric" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WritingEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WritingEvaluation_userAnswerId_key" ON "WritingEvaluation"("userAnswerId");

CREATE TABLE "SpeakingEvaluation" (
  "id" TEXT NOT NULL,
  "userAnswerId" TEXT NOT NULL,
  "taskCompletion" DOUBLE PRECISION,
  "fluency" DOUBLE PRECISION,
  "grammarAccuracy" DOUBLE PRECISION,
  "vocabularyRange" DOUBLE PRECISION,
  "pronunciationNotes" TEXT,
  "interactionQuality" DOUBLE PRECISION,
  "argumentQuality" DOUBLE PRECISION,
  "improvedResponse" TEXT NOT NULL,
  "modelAnswer" TEXT NOT NULL,
  "estimatedCefr" TEXT,
  "estimatedClb" TEXT,
  "strategyTip" TEXT NOT NULL,
  "rubric" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SpeakingEvaluation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SpeakingEvaluation_userAnswerId_key" ON "SpeakingEvaluation"("userAnswerId");

CREATE TABLE "ScoreReport" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "testResultId" TEXT,
  "totalScore" DOUBLE PRECISION NOT NULL,
  "maxScore" INTEGER NOT NULL,
  "sectionScores" JSONB NOT NULL DEFAULT '{}',
  "estimatedCEFR" TEXT,
  "estimatedCLB" TEXT,
  "grammarWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "vocabularyWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "writingWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "speakingWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "recommendedLessons" JSONB NOT NULL DEFAULT '[]',
  "nextPracticeSet" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ScoreReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ScoreReport_testResultId_key" ON "ScoreReport"("testResultId");
CREATE INDEX "ScoreReport_userId_createdAt_idx" ON "ScoreReport"("userId", "createdAt");

CREATE TABLE "StudyPlan" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "testResultId" TEXT,
  "nextPracticeSetId" TEXT,
  "title" TEXT NOT NULL,
  "grammarWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "vocabularyWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "writingWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "speakingWeaknesses" JSONB NOT NULL DEFAULT '[]',
  "recommendedLessons" JSONB NOT NULL DEFAULT '[]',
  "strategyTips" JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StudyPlan_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StudyPlan_userId_createdAt_idx" ON "StudyPlan"("userId", "createdAt");

CREATE TABLE "UserProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "level" "CefrLevel" NOT NULL,
  "examType" "ExamType" NOT NULL DEFAULT 'TEF_CANADA',
  "skillFocus" "SkillFocus" NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "averagePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "strongestTopics" JSONB NOT NULL DEFAULT '[]',
  "weakestTopics" JSONB NOT NULL DEFAULT '[]',
  "vocabularyGaps" JSONB NOT NULL DEFAULT '[]',
  "lastPracticedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserProgress_userId_level_examType_skillFocus_key" ON "UserProgress"("userId", "level", "examType", "skillFocus");
CREATE INDEX "UserProgress_userId_updatedAt_idx" ON "UserProgress"("userId", "updatedAt");

CREATE TABLE "MistakeLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "testId" TEXT,
  "questionId" TEXT,
  "skillFocus" "SkillFocus" NOT NULL DEFAULT 'MIXED',
  "grammarTopic" TEXT,
  "vocabularyTheme" TEXT,
  "mistakeType" TEXT NOT NULL,
  "originalAnswer" TEXT NOT NULL,
  "correction" TEXT NOT NULL,
  "strategyTip" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MistakeLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MistakeLog_userId_createdAt_idx" ON "MistakeLog"("userId", "createdAt");
CREATE INDEX "MistakeLog_grammarTopic_idx" ON "MistakeLog"("grammarTopic");
CREATE INDEX "MistakeLog_vocabularyTheme_idx" ON "MistakeLog"("vocabularyTheme");

ALTER TABLE "PracticeSet" ADD CONSTRAINT "PracticeSet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Test" ADD CONSTRAINT "Test_practiceSetId_fkey" FOREIGN KEY ("practiceSetId") REFERENCES "PracticeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MockExam" ADD CONSTRAINT "MockExam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MockExam" ADD CONSTRAINT "MockExam_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MockExamSection" ADD CONSTRAINT "MockExamSection_mockExamId_fkey" FOREIGN KEY ("mockExamId") REFERENCES "MockExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WritingEvaluation" ADD CONSTRAINT "WritingEvaluation_userAnswerId_fkey" FOREIGN KEY ("userAnswerId") REFERENCES "UserAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SpeakingEvaluation" ADD CONSTRAINT "SpeakingEvaluation_userAnswerId_fkey" FOREIGN KEY ("userAnswerId") REFERENCES "UserAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScoreReport" ADD CONSTRAINT "ScoreReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScoreReport" ADD CONSTRAINT "ScoreReport_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "TestResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StudyPlan" ADD CONSTRAINT "StudyPlan_nextPracticeSetId_fkey" FOREIGN KEY ("nextPracticeSetId") REFERENCES "PracticeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MistakeLog" ADD CONSTRAINT "MistakeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MistakeLog" ADD CONSTRAINT "MistakeLog_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MistakeLog" ADD CONSTRAINT "MistakeLog_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TestQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
