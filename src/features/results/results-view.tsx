import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleAlert, FilePlus2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import type { SerializableResult } from "@/features/results/result-models";
import { formatPercent } from "@/lib/utils";

export function ResultsView({ result }: { result: SerializableResult }) {
  const answerByQuestion = new Map(
    result.test.answers.map((answer) => [answer.questionId, answer])
  );

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
                Evaluation result
              </p>
              <h1 className="mt-1 text-2xl font-bold text-ink-950">
                {result.test.title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
                {result.cefrFeedback}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge>{result.test.examType.replace("_", " ")}</Badge>
                <Badge>{result.test.preparationMode.replaceAll("_", " ")}</Badge>
                <Badge>{result.test.targetNclc || result.test.level}</Badge>
                <Badge>estimated practice score</Badge>
              </div>
            </div>
            <div className="rounded-md border border-exam-100 bg-exam-50 px-5 py-4 text-center">
              <p className="text-4xl font-bold text-exam-700">
                {formatPercent(result.percentage)}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-800">
                {result.awardedMarks}/{result.totalMarks} marks
              </p>
              <p className="mt-1 max-w-40 text-xs leading-5 text-ink-600">
                Not an official TEF/TCF score
              </p>
            </div>
          </div>
        </PanelHeader>
        <PanelBody>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-exam-100 bg-white px-4 text-sm font-semibold text-ink-800 hover:bg-exam-50"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Dashboard
            </Link>
            <Link
              href="/tests/create"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-exam-700 px-4 text-sm font-semibold text-white hover:bg-exam-500"
            >
              <FilePlus2 size={16} aria-hidden="true" />
              New test
            </Link>
          </div>
        </PanelBody>
      </Panel>

      <section className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">Strengths</h2>
          </PanelHeader>
          <PanelBody>
            <List items={result.strengths} empty="No strengths returned." />
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">Weaknesses</h2>
          </PanelHeader>
          <PanelBody>
            <List items={result.weaknesses} empty="No weaknesses returned." />
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">Study plan</h2>
          </PanelHeader>
          <PanelBody>
            <List
              items={result.personalizedStudyPlan}
              empty="No study plan returned."
            />
          </PanelBody>
        </Panel>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">NCLC estimate</h2>
          </PanelHeader>
          <PanelBody>
            {Object.keys(result.nclcEstimate).length ? (
              <dl className="grid gap-2 text-sm">
                {Object.entries(result.nclcEstimate).map(([skill, estimate]) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between rounded-md border border-exam-100 bg-exam-50 px-3 py-2"
                  >
                    <dt className="font-semibold text-ink-800">{skill}</dt>
                    <dd className="font-bold text-exam-700">{estimate}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-ink-600">No NCLC estimate returned.</p>
            )}
          </PanelBody>
        </Panel>
        <Panel>
          <PanelHeader>
            <h2 className="text-base font-bold text-ink-950">TEF/TCF exam advice</h2>
          </PanelHeader>
          <PanelBody>
            <List items={result.examFeedback} empty="No exam-specific advice returned." />
          </PanelBody>
        </Panel>
      </section>

      <Panel>
        <PanelHeader>
          <h2 className="text-base font-bold text-ink-950">Recommended review topics</h2>
        </PanelHeader>
        <PanelBody>
          <div className="flex flex-wrap gap-2">
            {result.recommendedTopics.length ? (
              result.recommendedTopics.map((topic) => <Badge key={topic}>{topic}</Badge>)
            ) : (
              <p className="text-sm text-ink-600">No review topics returned.</p>
            )}
          </div>
        </PanelBody>
      </Panel>

      <section className="space-y-4">
        {result.questionFeedback.map((feedback, index) => {
          const answer = answerByQuestion.get(feedback.questionId);

          return (
            <Panel key={feedback.id}>
              <PanelHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>Q{index + 1}</Badge>
                      <Badge>{feedback.question.topic}</Badge>
                      {feedback.question.vocabularyTheme ? (
                        <Badge>{feedback.question.vocabularyTheme}</Badge>
                      ) : null}
                      {feedback.estimatedLevel ? <Badge>{feedback.estimatedLevel}</Badge> : null}
                      <Badge>
                        {feedback.awardedMarks}/{feedback.maximumMarks} marks
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-base font-bold leading-6 text-ink-950">
                      {feedback.question.question}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-bold ${
                      feedback.isCorrect ? "text-verdict-700" : "text-caution-700"
                    }`}
                  >
                    {feedback.isCorrect ? (
                      <CheckCircle2 size={16} aria-hidden="true" />
                    ) : (
                      <CircleAlert size={16} aria-hidden="true" />
                    )}
                    {feedback.isCorrect ? "Correct" : "Needs work"}
                  </span>
                </div>
              </PanelHeader>
              <PanelBody>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold text-ink-950">Your answer</h4>
                    <p className="mt-2 whitespace-pre-wrap rounded-md border border-exam-100 bg-exam-50 p-3 text-sm leading-6 text-ink-950">
                      {answer?.answerText || "No answer saved."}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink-950">Correct answer</h4>
                    <p className="mt-2 whitespace-pre-wrap rounded-md border border-verdict-500/20 bg-green-50 p-3 text-sm leading-6 text-ink-950">
                      {feedback.correctAnswer}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <FeedbackBlock title="Why" text={feedback.mistakeExplanation} />
                  <FeedbackBlock title="Grammar" text={feedback.grammarExplanation} />
                  <FeedbackBlock title="Vocabulary" text={feedback.vocabularyCorrection} />
                  <FeedbackBlock title="Improved version" text={feedback.improvedVersion} />
                  <FeedbackBlock title="Model answer" text={feedback.modelAnswer} />
                  <FeedbackBlock title="Exam strategy" text={feedback.examStrategyTip} />
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <ListBlock title="Strong points" items={feedback.strongPoints} />
                  <ListBlock title="Weak points" items={feedback.weakPoints} />
                  <ListBlock title="Grammar to revise" items={feedback.grammarTopicsToRevise} />
                  <ListBlock title="Vocabulary to learn" items={feedback.vocabularyToLearn} />
                </div>
                <div className="mt-4 rounded-md border border-exam-100 bg-white p-3 text-sm leading-6 text-ink-800">
                  <span className="font-bold">Feedback: </span>
                  {feedback.simpleFeedback}
                </div>
              </PanelBody>
            </Panel>
          );
        })}
      </section>
    </div>
  );
}

function List({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) {
    return <p className="text-sm text-ink-600">{empty}</p>;
  }

  return (
    <ul className="space-y-2 text-sm leading-6 text-ink-600">
      {items.map((item) => (
        <li key={item}>- {item}</li>
      ))}
    </ul>
  );
}

function FeedbackBlock({ title, text }: { title: string; text: string }) {
  if (!text) {
    return null;
  }

  return (
    <div className="rounded-md border border-exam-100 bg-exam-50 p-3">
      <h4 className="text-sm font-bold text-ink-950">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-ink-600">{text}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-exam-100 bg-exam-50 p-3">
      <h4 className="text-sm font-bold text-ink-950">{title}</h4>
      <List items={items} empty="" />
    </div>
  );
}
