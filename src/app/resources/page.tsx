import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowUpRight, BookOpenText, Headphones, Languages, LibraryBig, Sparkles } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { getCurrentUser } from "@/lib/auth/session";

type Resource = {
  name: string;
  href: string;
  domain: string;
};

type ResourceSection = {
  title: string;
  description: string;
  icon: typeof Headphones;
  resources: Resource[];
};

const resourceSections: ResourceSection[] = [
  {
    title: "Listening",
    description: "French radio, slow news, audio stories, and current-events listening practice.",
    icon: Headphones,
    resources: [
      { name: "Radio France", href: "https://www.radiofrance.fr/", domain: "radiofrance.fr" },
      { name: "RFI Francais Facile", href: "https://francaisfacile.rfi.fr/fr/", domain: "francaisfacile.rfi.fr" },
      { name: "ARTE Radio", href: "https://www.arteradio.com/", domain: "arteradio.com" },
      { name: "TF1 Info", href: "https://www.tf1info.fr/", domain: "tf1info.fr" }
    ]
  },
  {
    title: "Reading",
    description: "Articles, culture, news, and general reading material for everyday French.",
    icon: BookOpenText,
    resources: [
      { name: "TV5MONDE", href: "https://www.tv5monde.com/", domain: "tv5monde.com" },
      { name: "Le Monde", href: "https://www.lemonde.fr/?preferred_lang=fr", domain: "lemonde.fr" },
      { name: "GEO France", href: "https://www.geo.fr/", domain: "geo.fr" }
    ]
  },
  {
    title: "Grammar",
    description: "Grammar review, vocabulary drills, conjugation help, and structured practice.",
    icon: LibraryBig,
    resources: [
      { name: "Clozemaster French", href: "https://www.clozemaster.com/l/fra-eng/", domain: "clozemaster.com" },
      { name: "Babadum", href: "https://babadum.com/", domain: "babadum.com" },
      { name: "French Today", href: "https://www.frenchtoday.com/", domain: "frenchtoday.com" },
      { name: "Knoword French", href: "https://knoword.com/packs?language=fr", domain: "knoword.com" },
      { name: "Le Point du FLE", href: "https://www.lepointdufle.net/p/francais-activites.htm", domain: "lepointdufle.net" },
      { name: "RFI Revision", href: "https://francaisfacile.rfi.fr/fr/r%C3%A9viser/", domain: "francaisfacile.rfi.fr" },
      { name: "WordDive French Grammar", href: "https://www.worddive.com/en/grammar/french-grammar/", domain: "worddive.com" }
    ]
  },
  {
    title: "Immersion",
    description: "Watch French content with tools that support subtitles and language study.",
    icon: Languages,
    resources: [
      { name: "Lingopie French", href: "https://lingopie.com/app/catalog/french", domain: "lingopie.com" },
      { name: "LingQ", href: "https://www.lingq.com/?referral=vrajpanchal", domain: "lingq.com" },
      { name: "Language Reactor", href: "https://www.languagereactor.com/", domain: "languagereactor.com" }
    ]
  },
  {
    title: "Extra",
    description: "Business French, longer courses, grammar books, and additional study platforms.",
    icon: Sparkles,
    resources: [
      { name: "Le Francais des Affaires", href: "https://www.lefrancaisdesaffaires.fr/", domain: "lefrancaisdesaffaires.fr" },
      { name: "The Perfect French Grammar", href: "https://theperfectfrench.com/french-courses-book/complete-french-grammar/", domain: "theperfectfrench.com" },
      { name: "Learn French with Clemence", href: "https://www.learnfrenchwithclemence.com/course-curriculum", domain: "learnfrenchwithclemence.com" }
    ]
  }
];

export const metadata: Metadata = {
  title: "Useful French Resources | French Test AI",
  description: "Curated French listening, reading, grammar, immersion, and extra study resources."
};

function logoUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export default async function ResourcesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-exam-50">
      <PublicHeader signedIn={Boolean(user)} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wide text-exam-700">
            Useful resources
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-950">
            Practice French with trusted outside resources
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Use these sites for listening, reading, grammar review, immersion, and
            extra study alongside your TEF/TCF practice.
          </p>
        </div>

        <div className="space-y-10">
          {resourceSections.map((section) => {
            const Icon = section.icon;

            return (
              <section key={section.title} aria-labelledby={`${section.title.toLowerCase()}-resources`}>
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-exam-700 shadow-panel ring-1 ring-exam-100">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h2
                      id={`${section.title.toLowerCase()}-resources`}
                      className="text-lg font-bold text-ink-950"
                    >
                      {section.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-ink-600">{section.description}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {section.resources.map((resource) => (
                    <a
                      key={`${section.title}-${resource.name}`}
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${resource.name}`}
                      className="group flex min-h-28 items-center gap-4 rounded-lg border border-exam-100 bg-white p-4 shadow-panel transition hover:-translate-y-0.5 hover:border-exam-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-exam-500 focus:ring-offset-2"
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-exam-100 bg-exam-50">
                        <Image
                          src={logoUrl(resource.domain)}
                          alt={`${resource.name} logo`}
                          width={40}
                          height={40}
                          unoptimized
                          className="h-10 w-10 rounded object-contain"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold leading-5 text-ink-950">
                          {resource.name}
                        </span>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-exam-700">
                          Open
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </span>
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
