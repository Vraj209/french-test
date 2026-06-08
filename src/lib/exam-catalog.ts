export const preparationModeLabels = {
  CEFR_GRAMMAR: "CEFR grammar practice",
  TEF_CANADA_PRACTICE: "TEF Canada practice",
  TCF_CANADA_PRACTICE: "TCF Canada practice",
  WRITING_PRACTICE: "TEF/TCF writing practice",
  SPEAKING_PRACTICE: "TEF/TCF speaking practice",
  MIXED_GRAMMAR_VOCABULARY: "Mixed grammar + vocabulary",
  FULL_MOCK_EXAM: "Full mock exam"
} as const;

export const skillFocusLabels = {
  READING: "Reading",
  LISTENING: "Listening",
  WRITING: "Writing",
  SPEAKING: "Speaking",
  GRAMMAR: "Grammar",
  VOCABULARY: "Vocabulary",
  MIXED: "Mixed"
} as const;

export const targetScoreLevelLabels = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  CLB_NCLC_TARGET: "CLB/NCLC target"
} as const;

export type CatalogCefrLevel = "A1" | "A2" | "B1" | "B2";
export type ExamSkillFocus = keyof typeof skillFocusLabels;

export const grammarConceptsByLevel: Record<CatalogCefrLevel, string[]> = {
  A1: [
    "Simple sentence structure",
    "Subject pronouns",
    "Être and avoir",
    "Present tense of regular -ER, -IR, -RE verbs",
    "Common irregular verbs: aller, faire, venir, prendre, pouvoir, vouloir, devoir",
    "Definite articles: le, la, les, l'",
    "Indefinite articles: un, une, des",
    "Gender and number agreement",
    "Plural of nouns",
    "Adjective placement and agreement",
    "Basic negation: ne...pas",
    "Basic questions: est-ce que, inversion, intonation",
    "Question words: quand, comment, pourquoi, où, combien",
    "Possessive adjectives: mon, ma, mes, ton, ta, tes",
    "Demonstrative adjectives: ce, cet, cette, ces",
    "C'est, ce sont, and il est",
    "Elision and contractions",
    "Prepositions of place",
    "Numbers, dates, time",
    "Basic connectors: et, mais, parce que, aussi"
  ],
  A2: [
    "Passé composé with avoir",
    "Passé composé with être",
    "Reflexive verbs",
    "Impersonal expressions: il faut, il y a, il est",
    "Futur proche: aller + infinitive",
    "Recent past: venir de + infinitive",
    "Imperative",
    "Imperative with pronouns",
    "Partitive articles: du, de la, de l', des",
    "Quantity expressions",
    "When not to use an article",
    "Direct object pronouns: le, la, les",
    "Indirect object pronouns: lui, leur",
    "Pronouns y and en",
    "Emphatic pronouns: moi, toi, lui, elle, nous, vous, eux",
    "Possessive pronouns: le mien, la tienne, les leurs",
    "Demonstrative pronouns: celui, celle, ceux, celles",
    "Indefinite adjectives and pronouns",
    "Comparatives",
    "Superlatives",
    "Depuis, pendant, il y a",
    "Prepositions à, de, and en",
    "Prepositions of time",
    "Pour and par",
    "Same verb, different prepositions",
    "Jouer à/de and faire de",
    "Adverbs and adverb placement",
    "Bon vs bien",
    "Encore vs toujours",
    "Modal verbs: pouvoir, vouloir, devoir",
    "Basic relative pronouns: qui, que, où",
    "Infinitive verb patterns"
  ],
  B1: [
    "Imparfait",
    "Passé composé vs imparfait",
    "Passé composé agreement with avoir",
    "Passé composé of reflexive verbs",
    "Futur simple",
    "Conditional present",
    "Plus-que-parfait introduction",
    "Relative pronouns: qui, que, où, dont",
    "Ce qui, ce que, and ce dont",
    "Question pronouns: qui, que, quoi, quel, lequel",
    "Double object pronouns",
    "Reported speech",
    "Passive voice",
    "Present participle",
    "Gerund: en + participe présent",
    "Infinitive constructions after verbs and prepositions",
    "Cause and consequence connectors",
    "Opposition connectors",
    "Conjunctions for longer sentences",
    "Hypothesis with si + présent + futur",
    "Hypothesis with si + imparfait + conditionnel",
    "Expressing opinions",
    "Giving advice",
    "Narrating past events",
    "Structuring a paragraph"
  ],
  B2: [
    "Subjonctif présent",
    "Subjonctif vs indicatif",
    "Subjonctif passé",
    "Plus-que-parfait",
    "Futur antérieur",
    "Conditionnel passé",
    "Si + plus-que-parfait + conditionnel passé",
    "Advanced relative pronouns: lequel, auquel, duquel",
    "Advanced connectors",
    "Concession: bien que, quoique, même si, malgré",
    "Cause: puisque, étant donné que, grâce à, à cause de",
    "Consequence: donc, ainsi, par conséquent, c'est pourquoi",
    "Purpose: pour que, afin que",
    "Doubt and possibility: il est possible que, il semble que",
    "Necessity: il faut que, il est nécessaire que",
    "Opinion and argumentation structures",
    "Agreement of past participles",
    "Advanced participle and gerund control",
    "Complex pronoun order",
    "Nominalisation",
    "Formal register",
    "Nuanced sentence structure"
  ]
};

export type VocabularyTheme = {
  name: string;
  slug: string;
  description: string;
  terms: string[];
};

export const vocabularyThemes: VocabularyTheme[] = [
  {
    name: "Personal Information",
    slug: "personal-information",
    description: "Name, age, nationality, address, contact details, introductions, family status, and daily habits.",
    terms: ["le nom", "l'âge", "la nationalité", "l'adresse", "les habitudes"]
  },
  {
    name: "Family and Relationships",
    slug: "family-relationships",
    description: "Family members, marriage, friendship, relationships, descriptions, personality, and emotions.",
    terms: ["la famille", "le mariage", "l'amitié", "la personnalité", "les émotions"]
  },
  {
    name: "Housing",
    slug: "housing",
    description: "Apartment, house, rent, furniture, neighbourhood, moving, and accommodation problems.",
    terms: ["un appartement", "le loyer", "les meubles", "le quartier", "un déménagement"]
  },
  {
    name: "Education",
    slug: "education",
    description: "School, university, subjects, exams, homework, teachers, online learning, and student life.",
    terms: ["l'école", "l'université", "un examen", "les devoirs", "l'apprentissage en ligne"]
  },
  {
    name: "Work and Career",
    slug: "work-career",
    description: "Jobs, CVs, interviews, salary, workplace communication, professional emails, remote work, and working conditions.",
    terms: ["un emploi", "un CV", "un entretien", "le salaire", "le télétravail"]
  },
  {
    name: "Immigration and Administration",
    slug: "immigration-administration",
    description: "Visa, permanent residence, citizenship, documents, forms, appointments, government services, and applications.",
    terms: ["un visa", "la résidence permanente", "la citoyenneté", "un formulaire", "un rendez-vous"]
  },
  {
    name: "Health",
    slug: "health",
    description: "Body parts, symptoms, doctor appointments, pharmacy, healthy lifestyle, and mental health.",
    terms: ["un symptôme", "un rendez-vous médical", "la pharmacie", "la santé mentale", "le mode de vie sain"]
  },
  {
    name: "Food and Restaurants",
    slug: "food-restaurants",
    description: "Groceries, ordering food, restaurant complaints, recipes, and nutrition.",
    terms: ["les courses", "commander", "une plainte", "une recette", "la nutrition"]
  },
  {
    name: "Transport and Travel",
    slug: "transport-travel",
    description: "Public transport, train, airport, bus, taxi, directions, travel problems, hotels, and tourism.",
    terms: ["les transports en commun", "un billet", "l'aéroport", "un itinéraire", "une réservation"]
  },
  {
    name: "Shopping and Services",
    slug: "shopping-services",
    description: "Clothes, prices, payment, refunds, customer service, and complaints.",
    terms: ["les vêtements", "le prix", "le paiement", "un remboursement", "le service client"]
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Internet, smartphones, social media, online safety, artificial intelligence, and digital education.",
    terms: ["Internet", "un téléphone intelligent", "les réseaux sociaux", "la sécurité en ligne", "l'intelligence artificielle"]
  },
  {
    name: "Environment",
    slug: "environment",
    description: "Pollution, climate change, recycling, public transport, energy, and sustainable lifestyle.",
    terms: ["la pollution", "le changement climatique", "le recyclage", "l'énergie", "un mode de vie durable"]
  },
  {
    name: "Society",
    slug: "society",
    description: "Social problems, equality, immigration, education systems, youth problems, and public services.",
    terms: ["les problèmes sociaux", "l'égalité", "l'immigration", "les jeunes", "les services publics"]
  },
  {
    name: "Media and News",
    slug: "media-news",
    description: "Newspapers, television, radio, online articles, fake news, and advertising.",
    terms: ["un journal", "la télévision", "la radio", "un article en ligne", "la publicité"]
  },
  {
    name: "Culture and Leisure",
    slug: "culture-leisure",
    description: "Music, cinema, sports, books, hobbies, festivals, and cultural activities.",
    terms: ["la musique", "le cinéma", "le sport", "un festival", "les loisirs"]
  },
  {
    name: "People and Personal Descriptions",
    slug: "people-personal-descriptions",
    description: "People, personality, physical descriptions, emotions, age, appearance, and character traits.",
    terms: ["une personne", "le caractère", "l'apparence", "souriant", "timide"]
  },
  {
    name: "Body, Face, and Hygiene",
    slug: "body-face-hygiene",
    description: "Body parts, face, hygiene routines, symptoms, personal care, and health descriptions.",
    terms: ["le visage", "les yeux", "les cheveux", "se laver", "une douleur"]
  },
  {
    name: "Clothing and Appearance",
    slug: "clothing-appearance",
    description: "Clothes, sizes, colors, style, appearance, shopping, and describing what someone is wearing.",
    terms: ["une chemise", "un pantalon", "une taille", "porter", "élégant"]
  },
  {
    name: "Sports and Physical Activities",
    slug: "sports-physical-activities",
    description: "Sports, exercise, competitions, hobbies, health benefits, and leisure activities.",
    terms: ["faire du sport", "une équipe", "un entraînement", "gagner", "s'inscrire"]
  },
  {
    name: "Animals and Nature",
    slug: "animals-nature",
    description: "Animals, nature, countryside, plants, biodiversity, outdoor activities, and environment links.",
    terms: ["un animal", "une forêt", "une plante", "la biodiversité", "protéger"]
  },
  {
    name: "City and Local Places",
    slug: "city-local-places",
    description: "Places in town, local services, directions, public buildings, neighbourhoods, and errands.",
    terms: ["la mairie", "une banque", "une boulangerie", "un carrefour", "se diriger"]
  },
  {
    name: "Kitchen and Household Objects",
    slug: "kitchen-household-objects",
    description: "Kitchen items, household objects, cleaning, cooking tools, rooms, and everyday home tasks.",
    terms: ["une cuisine", "une assiette", "une casserole", "nettoyer", "ranger"]
  },
  {
    name: "Weather, Time, and Measurements",
    slug: "weather-time-measurements",
    description: "Weather, seasons, dates, time expressions, quantities, distance, weight, and measurements.",
    terms: ["la météo", "une saison", "une heure", "un kilo", "une distance"]
  },
  {
    name: "Colors and Visual Description",
    slug: "colors-visual-description",
    description: "Colors, shapes, visual details, comparison, appearance, and precise object descriptions.",
    terms: ["rouge", "bleu", "clair", "foncé", "une forme"]
  },
  {
    name: "Word Building: Prefixes and Suffixes",
    slug: "word-building-prefixes-suffixes",
    description: "Common prefixes, suffixes, word families, noun/adjective formation, and guessing meaning from parts.",
    terms: ["re-", "in-", "-tion", "-ment", "-able"]
  },
  {
    name: "Homophones and Confusing Words",
    slug: "homophones-confusing-words",
    description: "Common sound-alike words, confusing pairs, spelling traps, and meaning differences.",
    terms: ["à/a", "et/est", "son/sont", "ou/où", "ces/ses"]
  },
  {
    name: "Everyday Expressions and Idioms",
    slug: "everyday-expressions-idioms",
    description: "Common expressions with avoir, être, aller, faire, prendre, filler words, greetings, thanks, and polite replies.",
    terms: ["avoir besoin de", "être en train de", "ça marche", "en fait", "de rien"]
  },
  {
    name: "Economy and Consumer Life",
    slug: "economy-consumer-life",
    description: "Budget, inflation, banking, saving money, employment, and business.",
    terms: ["un budget", "l'inflation", "la banque", "économiser", "une entreprise"]
  },
  {
    name: "Law and Public Life",
    slug: "law-public-life",
    description: "Rules, rights and responsibilities, public institutions, civic life, and citizenship.",
    terms: ["une règle", "les droits", "les responsabilités", "une institution publique", "la vie civique"]
  },
  {
    name: "Common Abstract Vocabulary",
    slug: "common-abstract-vocabulary",
    description: "Advantages, disadvantages, causes, consequences, problems, solutions, opinions, agreement, obligation, and possibility.",
    terms: ["un avantage", "un inconvénient", "une conséquence", "une solution", "une hypothèse"]
  }
];

export const examQuestionFocuses: Record<ExamSkillFocus, string[]> = {
  READING: [
    "Identify the main idea",
    "Find specific information",
    "Understand the author's opinion",
    "Infer meaning from context",
    "Match headings to paragraphs",
    "Choose the correct summary",
    "Understand formal and informal messages",
    "Understand advertisements, notices, emails, articles, and reports",
    "Vocabulary in context",
    "Connector and logic questions"
  ],
  LISTENING: [
    "Understand short announcements",
    "Understand conversations",
    "Understand phone messages",
    "Understand interviews",
    "Identify speaker intention",
    "Identify emotional tone",
    "Select the correct answer from 4 options",
    "Understand professional situations",
    "Understand public information",
    "Understand opinions and arguments"
  ],
  GRAMMAR: [
    "Choose the correct verb tense",
    "Choose the correct pronoun",
    "Choose the correct connector",
    "Choose the correct preposition",
    "Choose the correct article",
    "Correct the sentence",
    "Fill in the blank",
    "Sentence transformation",
    "Verb conjugation",
    "Error detection",
    "Register transformation: informal to formal"
  ],
  VOCABULARY: [
    "Vocabulary in context",
    "Choose the precise word",
    "Theme-based vocabulary production",
    "Formal and informal register vocabulary",
    "Common abstract vocabulary"
  ],
  WRITING: [
    "Write an email",
    "Write a formal letter",
    "Write an informal message",
    "Continue a story or article",
    "Describe an event",
    "Give advice",
    "Make a complaint",
    "Request information",
    "Express an opinion",
    "Compare two points of view",
    "Defend an argument",
    "Write a conclusion",
    "Use connectors correctly"
  ],
  SPEAKING: [
    "Self-introduction",
    "Structured interview",
    "Ask for information",
    "Roleplay with examiner",
    "Convince someone",
    "Defend an opinion",
    "Compare advantages and disadvantages",
    "Speak about work, study, family, immigration, society, environment, or technology",
    "Give a clear argument with examples"
  ],
  MIXED: [
    "Identify the main idea",
    "Vocabulary in context",
    "Choose the correct verb tense",
    "Sentence transformation",
    "Express an opinion",
    "Ask for information"
  ]
};

export const writingSpeakingEvaluationCriteria = [
  "Task completion",
  "Relevance to the prompt",
  "Grammar accuracy",
  "Verb tense accuracy",
  "Agreement accuracy",
  "Pronoun usage",
  "Vocabulary range",
  "Vocabulary precision",
  "Sentence complexity",
  "Logical structure",
  "Use of connectors",
  "Coherence and cohesion",
  "Register: formal, informal, neutral",
  "Spelling",
  "Punctuation",
  "Fluency",
  "Ability to justify opinions",
  "Ability to compare ideas",
  "Ability to give examples",
  "CEFR appropriateness",
  "Estimated CEFR level",
  "Estimated CLB/NCLC level where possible"
];

export const mockExamModes = [
  "TEF Canada full mock exam",
  "TCF Canada full mock exam",
  "Reading-only mock test",
  "Listening-only mock test",
  "Writing-only mock test",
  "Speaking-only mock test",
  "Grammar and vocabulary diagnostic test"
];

export function questionFocusesForSkill(skill: ExamSkillFocus) {
  return examQuestionFocuses[skill] ?? examQuestionFocuses.MIXED;
}
