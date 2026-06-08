-- Add TEF/TCF exam metadata while keeping existing generic tests valid.
CREATE TYPE "ExamType" AS ENUM ('GENERAL', 'TEF_CANADA', 'TCF_CANADA');

CREATE TYPE "ExamSection" AS ENUM (
  'GENERAL_PRACTICE',
  'TEF_READING',
  'TEF_LISTENING',
  'TEF_WRITING_A',
  'TEF_WRITING_B',
  'TEF_SPEAKING_A',
  'TEF_SPEAKING_B',
  'TCF_LISTENING',
  'TCF_READING',
  'TCF_WRITING_1',
  'TCF_WRITING_2',
  'TCF_WRITING_3',
  'TCF_SPEAKING_1',
  'TCF_SPEAKING_2',
  'TCF_SPEAKING_3',
  'TCF_LANGUAGE_STRUCTURES'
);

ALTER TABLE "Test"
  ADD COLUMN "examType" "ExamType" NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN "examSections" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "targetNclc" TEXT;

ALTER TABLE "TestQuestion"
  ADD COLUMN "examSection" "ExamSection" NOT NULL DEFAULT 'GENERAL_PRACTICE',
  ADD COLUMN "instructions" TEXT,
  ADD COLUMN "options" JSONB,
  ADD COLUMN "timeLimitSeconds" INTEGER,
  ADD COLUMN "minWords" INTEGER;

ALTER TABLE "TestResult"
  ADD COLUMN "nclcEstimate" JSONB,
  ADD COLUMN "examFeedback" JSONB;
