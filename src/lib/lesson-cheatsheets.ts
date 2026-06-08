import type { CefrLevel } from "@/lib/schemas";

type Example = {
  french: string;
  english: string;
  note: string;
};

type GrammarSheet = {
  rule: string;
  patterns: string[];
  useWhen: string[];
  examples: Example[];
  avoid: string[];
  drill: string[];
};

export type VocabularyWord = {
  french: string;
  english: string;
  note?: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function defaultGrammarSheet(topic: string, level: CefrLevel): GrammarSheet {
  return {
    rule: `Use ${topic} to make your ${level} French more precise, natural, and exam-ready.`,
    patterns: [
      "Identify the function before choosing the form.",
      "Check agreement, tense, pronoun order, and register.",
      "Use the structure inside a complete sentence, not as an isolated word."
    ],
    useWhen: [
      "Grammar MCQ and fill-in-the-blank questions",
      "Sentence transformation and correction tasks",
      "Writing or speaking when you need clearer structure"
    ],
    examples: [
      {
        french: "Je dois améliorer cette phrase pour qu'elle soit plus claire.",
        english: "I must improve this sentence so that it is clearer.",
        note: "A safe exam sentence for structure and accuracy."
      },
      {
        french: "Cette solution est utile parce qu'elle répond au problème.",
        english: "This solution is useful because it responds to the problem.",
        note: "Connect grammar accuracy with an exam argument."
      }
    ],
    avoid: [
      "Translating word-for-word from English",
      "Forgetting agreement after changing the subject",
      "Using a complex structure when a clear simple sentence is safer"
    ],
    drill: [
      `Write 3 short sentences using ${topic}.`,
      "Change one sentence from present to past or future.",
      "Correct one intentional agreement, tense, or word-order mistake."
    ]
  };
}

export function buildGrammarCheatSheet(topic: string, level: CefrLevel): GrammarSheet {
  const value = normalize(topic);
  const sheet = defaultGrammarSheet(topic, level);

  if (value.includes("simple sentence")) {
    return {
      rule: "A strong French sentence usually follows subject + verb + complement, with agreement checked at the end.",
      patterns: [
        "basic: sujet + verbe + complément",
        "negative: sujet + ne + verbe + pas + complément",
        "question: est-ce que + sujet + verbe + complément"
      ],
      useWhen: [
        "Building reliable A1/A2 answers",
        "Avoiding English word order",
        "Writing clear short exam responses"
      ],
      examples: [
        {
          french: "Je cherche un appartement près du métro.",
          english: "I am looking for an apartment near the metro.",
          note: "Clear subject, verb, and complement."
        },
        {
          french: "Est-ce que vous acceptez les documents en ligne ?",
          english: "Do you accept documents online?",
          note: "Safe question structure."
        }
      ],
      avoid: [
        "Dropping the subject pronoun",
        "Putting adjectives or adverbs randomly",
        "Writing fragments when a complete sentence is required"
      ],
      drill: [
        "Write 5 subject + verb + complement sentences.",
        "Turn 2 into negative sentences.",
        "Turn 2 into est-ce que questions."
      ]
    };
  }

  if (value.includes("plural of nouns")) {
    return {
      rule: "Most French nouns become plural with -s, but the article and adjectives must change too.",
      patterns: [
        "un problème important -> des problèmes importants",
        "le service public -> les services publics",
        "words ending in -eau often take -x: un bureau -> des bureaux"
      ],
      useWhen: [
        "Describing groups, services, documents, or problems",
        "Correction and fill-in-the-blank questions",
        "Making writing more accurate"
      ],
      examples: [
        {
          french: "Les nouveaux formulaires sont disponibles.",
          english: "The new forms are available.",
          note: "Article, adjective, and noun are plural."
        },
        {
          french: "Plusieurs quartiers ont besoin de meilleurs services.",
          english: "Several neighbourhoods need better services.",
          note: "Plural agreement across the phrase."
        }
      ],
      avoid: [
        "Adding only noun -s and forgetting the adjective",
        "Using des after a quantity expression such as beaucoup de",
        "Forgetting irregular plurals such as travaux"
      ],
      drill: [
        "Make 10 noun phrases plural.",
        "Add one adjective to each phrase.",
        "Use 3 phrases in complete sentences."
      ]
    };
  }

  if (value.includes("c'est") || value.includes("ce sont") || value.includes("il est")) {
    return {
      rule: "Use c'est/ce sont to identify or present; use il est/elle est mostly before adjectives, professions, or time.",
      patterns: [
        "c'est + article/noun: c'est un problème",
        "ce sont + plural noun: ce sont des documents",
        "il/elle est + adjective/profession: elle est importante, il est médecin"
      ],
      useWhen: [
        "Introducing an idea in speaking",
        "Describing a person, object, or situation",
        "Avoiding awkward translations from English"
      ],
      examples: [
        {
          french: "C'est une solution pratique.",
          english: "It is a practical solution.",
          note: "C'est before article + noun."
        },
        {
          french: "Elle est responsable du dossier.",
          english: "She is responsible for the file.",
          note: "Elle est before adjective/professional role."
        }
      ],
      avoid: [
        "Writing il est un problème",
        "Using ce sont with singular nouns",
        "Forgetting agreement after il/elle est"
      ],
      drill: [
        "Write 3 c'est sentences with nouns.",
        "Write 3 il/elle est sentences with adjectives.",
        "Make 2 plural sentences with ce sont."
      ]
    };
  }

  if (value.includes("subjonctif passe")) {
    return {
      rule: "Use subjonctif passé for a completed action after a subjunctive trigger.",
      patterns: [
        "il faut que + sujet + ait/soit + participe passé",
        "je suis content que + sujet + ait/soit + participe passé",
        "avant que + sujet + ait/soit + participe passé"
      ],
      useWhen: [
        "B2 formal writing",
        "Reacting to completed actions",
        "Showing advanced tense control"
      ],
      examples: [
        {
          french: "Je suis content que vous ayez envoyé le dossier.",
          english: "I am happy that you sent the file.",
          note: "Completed action after emotion."
        },
        {
          french: "Il faut que la demande ait été vérifiée.",
          english: "The application must have been checked.",
          note: "Formal completed requirement."
        }
      ],
      avoid: [
        "Using indicative after a subjunctive trigger",
        "Forgetting the auxiliary ait/soit",
        "Overusing it when present subjunctive is enough"
      ],
      drill: [
        "Write 3 sentences with je suis content que.",
        "Write 2 formal requirements with il faut que.",
        "Use one être auxiliary verb."
      ]
    };
  }

  if (value.includes("passe compose vs imparfait")) {
    return {
      rule: "Passé composé reports completed events; imparfait gives background, habits, descriptions, or ongoing situations.",
      patterns: [
        "completed event: sujet + avoir/être + participe passé",
        "background/habit: sujet + radical nous-present + -ais/-ait/-ions",
        "exam clue: soudain, puis, hier = often passé composé; avant, souvent, quand j'étais = often imparfait"
      ],
      useWhen: [
        "Narrating past events in writing",
        "Choosing the correct past tense in MCQ/fill blanks",
        "Explaining background before a main event"
      ],
      examples: [
        {
          french: "Je regardais la télévision quand il a téléphoné.",
          english: "I was watching TV when he called.",
          note: "Imparfait for background; passé composé for the event."
        },
        {
          french: "Avant, je prenais le bus tous les jours.",
          english: "Before, I used to take the bus every day.",
          note: "Habit in the past."
        }
      ],
      avoid: [
        "Using passé composé for every past sentence",
        "Forgetting être agreement with movement/reflexive verbs",
        "Using imparfait for one completed action"
      ],
      drill: [
        "Write 2 background sentences with imparfait.",
        "Add 2 completed events with passé composé.",
        "Combine them with quand or pendant que."
      ]
    };
  }

  if (value.includes("subjonctif")) {
    return {
      rule: "Use the subjunctive after expressions of necessity, doubt, emotion, desire, or purpose when there is usually a new subject.",
      patterns: [
        "il faut que + sujet + subjonctif",
        "je veux que + sujet + subjonctif",
        "pour que / bien que + sujet + subjonctif"
      ],
      useWhen: [
        "B2 opinion and argument writing",
        "Formal recommendations",
        "Expressing doubt, necessity, emotion, or purpose"
      ],
      examples: [
        {
          french: "Il faut que le gouvernement agisse rapidement.",
          english: "The government must act quickly.",
          note: "Necessity triggers subjunctive."
        },
        {
          french: "Bien que cette solution soit coûteuse, elle est nécessaire.",
          english: "Although this solution is costly, it is necessary.",
          note: "Concession with bien que."
        }
      ],
      avoid: [
        "Using indicative after il faut que",
        "Forgetting irregular forms: soit, ait, fasse, puisse",
        "Using subjunctive after parce que or donc"
      ],
      drill: [
        "Write 3 recommendations with il faut que.",
        "Write 2 contrast sentences with bien que.",
        "Replace simple verbs with soit, ait, fasse, puisse."
      ]
    };
  }

  if (value.includes("conditionnel") || value.includes("conditional")) {
    return {
      rule: "Use the conditional to express polite requests, advice, hypothetical results, or unreal past outcomes.",
      patterns: [
        "present conditional: infinitive stem + -ais/-ait/-ions/-iez/-aient",
        "si + imparfait -> conditionnel présent",
        "si + plus-que-parfait -> conditionnel passé"
      ],
      useWhen: [
        "Giving polite advice in writing or speaking",
        "Discussing hypothetical solutions",
        "Defending an opinion with nuance"
      ],
      examples: [
        {
          french: "Je vous conseillerais de vérifier le formulaire.",
          english: "I would advise you to check the form.",
          note: "Polite advice."
        },
        {
          french: "Si la ville investissait davantage, les transports seraient meilleurs.",
          english: "If the city invested more, transportation would be better.",
          note: "Hypothesis with si + imparfait."
        }
      ],
      avoid: [
        "Using future after si + imparfait",
        "Writing serait été instead of aurait été",
        "Using conditional when a direct present tense is clearer"
      ],
      drill: [
        "Write 3 polite advice sentences.",
        "Write 2 si + imparfait + conditionnel sentences.",
        "Turn one direct request into a polite request."
      ]
    };
  }

  if (value.includes("imparfait")) {
    return {
      rule: "Use imparfait for habits, descriptions, background situations, and repeated past actions.",
      patterns: [
        "nous present stem + -ais/-ais/-ait/-ions/-iez/-aient",
        "être is irregular: j'étais, tu étais, il était",
        "common clues: avant, souvent, chaque jour, quand j'étais"
      ],
      useWhen: [
        "Describing a past situation",
        "Setting context before a past event",
        "Talking about old habits"
      ],
      examples: [
        {
          french: "Quand j'étais étudiant, je travaillais le soir.",
          english: "When I was a student, I used to work in the evening.",
          note: "Past habit and description."
        },
        {
          french: "Il faisait froid et les routes étaient dangereuses.",
          english: "It was cold and the roads were dangerous.",
          note: "Background description."
        }
      ],
      avoid: [
        "Using imparfait for a single completed action",
        "Forgetting the nous stem",
        "Mixing imparfait endings with present-tense stems"
      ],
      drill: [
        "Write 3 childhood habit sentences.",
        "Describe a past place with 3 adjectives.",
        "Add one completed event in passé composé."
      ]
    };
  }

  if (value.includes("passe compose")) {
    return {
      rule: "Use passé composé for completed past actions and sequences of events.",
      patterns: [
        "avoir/être in present + past participle",
        "most verbs use avoir; movement and reflexive verbs often use être",
        "with être, agree the past participle with the subject"
      ],
      useWhen: [
        "Telling what happened",
        "Writing a message about a completed event",
        "Answering past-experience questions"
      ],
      examples: [
        {
          french: "J'ai envoyé le document hier soir.",
          english: "I sent the document last night.",
          note: "Completed action with avoir."
        },
        {
          french: "Elle est arrivée en retard.",
          english: "She arrived late.",
          note: "Movement verb with être and agreement."
        }
      ],
      avoid: [
        "Forgetting the auxiliary",
        "Using être with every verb",
        "Forgetting agreement with être verbs"
      ],
      drill: [
        "Write 5 completed actions from yesterday.",
        "Include 2 movement verbs with être.",
        "Change one sentence from masculine to feminine."
      ]
    };
  }

  if (value.includes("futur anterieur")) {
    return {
      rule: "Use futur antérieur for an action that will be completed before another future moment.",
      patterns: [
        "quand + sujet + aura/sera + participe passé",
        "dès que + futur antérieur, futur simple",
        "après que + futur antérieur"
      ],
      useWhen: [
        "B2 sequencing in formal writing",
        "Showing one future action happens before another",
        "Writing precise plans or conditions"
      ],
      examples: [
        {
          french: "Quand j'aurai reçu la réponse, je vous contacterai.",
          english: "When I have received the answer, I will contact you.",
          note: "First future action completed before the second."
        },
        {
          french: "Dès que le projet sera terminé, nous publierons le rapport.",
          english: "As soon as the project is finished, we will publish the report.",
          note: "Être auxiliary with completed future action."
        }
      ],
      avoid: [
        "Using future simple for both actions when completion matters",
        "Forgetting être agreement where required",
        "Using futur antérieur in simple A1/A2 contexts"
      ],
      drill: [
        "Write 3 quand + futur antérieur sentences.",
        "Add the second action in futur simple.",
        "Use one sentence with dès que."
      ]
    };
  }

  if (value.includes("futur")) {
    return {
      rule: "Use futur proche for near plans and futur simple for predictions, promises, and formal future statements.",
      patterns: [
        "futur proche: aller + infinitive",
        "futur simple: infinitive stem + -ai/-as/-a/-ons/-ez/-ont",
        "common irregular stems: ser-, aur-, ir-, fer-, pourr-, voudr-, devr-"
      ],
      useWhen: [
        "Talking about plans",
        "Making predictions",
        "Writing formal future actions"
      ],
      examples: [
        {
          french: "Je vais préparer mon dossier ce soir.",
          english: "I am going to prepare my file tonight.",
          note: "Near future plan."
        },
        {
          french: "Cette mesure réduira les coûts.",
          english: "This measure will reduce costs.",
          note: "Formal prediction."
        }
      ],
      avoid: [
        "Using aller twice: je vais vais",
        "Forgetting irregular future stems",
        "Using futur proche in very formal writing when futur simple is stronger"
      ],
      drill: [
        "Write 3 near-future plans.",
        "Rewrite them in futur simple.",
        "Add one prediction about work, school, or transport."
      ]
    };
  }

  if (value.includes("preposition")) {
    return {
      rule: "Prepositions are fixed with many verbs and places; learn them in chunks instead of translating one word.",
      patterns: [
        "à = direction/place/recipient: aller à, parler à",
        "de = origin/topic/possession: venir de, avoir besoin de",
        "en = country/transport/material/time: en France, en bus, en bois"
      ],
      useWhen: [
        "Writing about travel, work, housing, and appointments",
        "MCQ questions with à/de/en/pour/par",
        "Improving idiomatic accuracy"
      ],
      examples: [
        {
          french: "J'ai besoin de parler à un conseiller.",
          english: "I need to speak to an advisor.",
          note: "Besoin de + infinitive; parler à someone."
        },
        {
          french: "Je vais au bureau en métro.",
          english: "I am going to the office by metro.",
          note: "À + place; en + transport."
        }
      ],
      avoid: [
        "Using pour for every English 'for'",
        "Forgetting contractions: à + le = au, de + les = des",
        "Changing a verb's required preposition"
      ],
      drill: [
        "Memorize 5 verb + preposition chunks.",
        "Write 3 travel sentences with à and en.",
        "Write 3 need/request sentences with de."
      ]
    };
  }

  if (value.includes("infinitive")) {
    return {
      rule: "Use infinitives after modal verbs, many prepositions, and fixed verb patterns.",
      patterns: [
        "modal + infinitive: je peux partir",
        "pour/avant de/sans + infinitive",
        "verb pattern: décider de, commencer à, aider à"
      ],
      useWhen: [
        "Giving reasons or goals",
        "Writing concise action plans",
        "Avoiding unnecessary conjugation"
      ],
      examples: [
        {
          french: "Je vous écris pour demander des renseignements.",
          english: "I am writing to ask for information.",
          note: "Purpose with pour + infinitive."
        },
        {
          french: "Nous avons décidé de changer de fournisseur.",
          english: "We decided to change supplier.",
          note: "Décider de + infinitive."
        }
      ],
      avoid: [
        "Conjugating the second verb after a modal",
        "Forgetting de after décider",
        "Using pour que when the subject does not change"
      ],
      drill: [
        "Write 3 modal + infinitive sentences.",
        "Write 3 pour + infinitive purpose sentences.",
        "Learn 5 verb + à/de + infinitive patterns."
      ]
    };
  }

  if (value.includes("adverb") || value.includes("bon vs bien") || value.includes("encore")) {
    return {
      rule: "Adverbs modify verbs, adjectives, or whole ideas; place short adverbs near the verb and longer ones where clarity is best.",
      patterns: [
        "short adverb: je comprends bien",
        "compound tense: j'ai déjà envoyé le document",
        "bon = adjective/noun quality; bien = adverb or general judgment"
      ],
      useWhen: [
        "Making descriptions more precise",
        "Improving writing flow",
        "Avoiding bon/bien and encore/toujours mistakes"
      ],
      examples: [
        {
          french: "Ce service fonctionne bien, mais il reste coûteux.",
          english: "This service works well, but it remains expensive.",
          note: "Bien modifies the verb."
        },
        {
          french: "J'ai déjà rempli le formulaire.",
          english: "I have already filled out the form.",
          note: "Déjà usually sits around the conjugated auxiliary."
        }
      ],
      avoid: [
        "Using bon to modify a verb",
        "Putting every adverb at the end of the sentence",
        "Confusing encore with toujours in time expressions"
      ],
      drill: [
        "Write 5 sentences with bien, déjà, souvent, encore, toujours.",
        "Rewrite 2 sentences in passé composé.",
        "Choose bon or bien in 5 examples."
      ]
    };
  }

  if (value.includes("pronoun")) {
    return {
      rule: "Pronouns replace repeated nouns; put them before the conjugated verb, except with affirmative imperatives.",
      patterns: [
        "direct object: le, la, l', les",
        "indirect object: lui, leur",
        "common order: me/te/se/nous/vous + le/la/les + lui/leur + y + en"
      ],
      useWhen: [
        "Avoiding repetition in writing",
        "MCQ questions about pronoun order",
        "Answering questions clearly and concisely"
      ],
      examples: [
        {
          french: "Je lui ai envoyé le formulaire.",
          english: "I sent the form to him/her.",
          note: "Indirect object pronoun before auxiliary."
        },
        {
          french: "Elle nous les a expliquées.",
          english: "She explained them to us.",
          note: "Double pronoun order."
        }
      ],
      avoid: [
        "Using lui for a thing",
        "Putting pronouns after a normal conjugated verb",
        "Changing the order in double-pronoun sentences"
      ],
      drill: [
        "Replace repeated nouns with le/la/les.",
        "Write 3 sentences with lui or leur.",
        "Try 2 double-pronoun sentences."
      ]
    };
  }

  if (value.includes("relative")) {
    return {
      rule: "Relative pronouns connect ideas and avoid short, repetitive sentences.",
      patterns: [
        "qui = subject of the next verb",
        "que = object before a new subject",
        "où = place/time; dont = de + noun/verb"
      ],
      useWhen: [
        "Combining two simple sentences",
        "Writing more natural B1/B2 paragraphs",
        "Describing people, places, problems, or solutions"
      ],
      examples: [
        {
          french: "C'est une solution qui aide les familles.",
          english: "It is a solution that helps families.",
          note: "Qui is the subject of aide."
        },
        {
          french: "Le document dont j'ai besoin est en ligne.",
          english: "The document that I need is online.",
          note: "Avoir besoin de -> dont."
        }
      ],
      avoid: [
        "Using que when the next word is a verb with no subject",
        "Forgetting dont after expressions with de",
        "Creating sentences that are too long to control"
      ],
      drill: [
        "Combine 3 pairs of short sentences.",
        "Use qui, que, and dont once each.",
        "Read the sentence aloud to check clarity."
      ]
    };
  }

  if (value.includes("connector") || value.includes("cause") || value.includes("consequence") || value.includes("opposition") || value.includes("concession") || value.includes("purpose")) {
    return {
      rule: "Connectors show logic: cause, consequence, contrast, concession, and purpose.",
      patterns: [
        "cause: parce que, car, puisque, étant donné que",
        "consequence: donc, ainsi, par conséquent, c'est pourquoi",
        "contrast/purpose: cependant, pourtant, bien que, pour que, afin que"
      ],
      useWhen: [
        "Structuring a paragraph",
        "Explaining reasons and results",
        "Making writing and speaking more coherent"
      ],
      examples: [
        {
          french: "Le coût est élevé; cependant, le projet reste nécessaire.",
          english: "The cost is high; however, the project remains necessary.",
          note: "Contrast with cependant."
        },
        {
          french: "Le service est fermé, par conséquent les usagers doivent attendre.",
          english: "The service is closed; consequently users must wait.",
          note: "Consequence with par conséquent."
        }
      ],
      avoid: [
        "Mixing cause and consequence connectors",
        "Using too many connectors in one sentence",
        "Using informal connectors in formal writing"
      ],
      drill: [
        "Write one cause sentence.",
        "Write one consequence sentence.",
        "Write one contrast sentence about the same topic."
      ]
    };
  }

  if (value.includes("article") || value.includes("partitive") || value.includes("quantity")) {
    return {
      rule: "Articles show whether a noun is specific, general, countable, or an unspecified quantity.",
      patterns: [
        "definite: le, la, l', les = specific/general category",
        "indefinite: un, une, des = one/some",
        "partitive/quantity: du, de la, de l', des; after quantity often de"
      ],
      useWhen: [
        "Describing people, food, work, housing, and services",
        "MCQ questions about noun phrases",
        "Writing precise sentences"
      ],
      examples: [
        {
          french: "J'ai acheté du pain et une bouteille d'eau.",
          english: "I bought some bread and a bottle of water.",
          note: "Partitive + quantity expression."
        },
        {
          french: "Les transports publics sont importants.",
          english: "Public transport is important.",
          note: "Definite plural for a general category."
        }
      ],
      avoid: [
        "Using des after beaucoup: beaucoup de",
        "Forgetting l' before a vowel sound",
        "Using English-style no article before French nouns"
      ],
      drill: [
        "List 5 nouns with le/la/les.",
        "Write 3 food sentences with du/de la/de l'.",
        "Add beaucoup de or assez de."
      ]
    };
  }

  if (value.includes("agreement") || value.includes("adjective")) {
    return {
      rule: "Agreement means adjectives and some participles change to match gender and number.",
      patterns: [
        "feminine often adds -e",
        "plural often adds -s",
        "adjectives usually follow the noun; common short adjectives often come before"
      ],
      useWhen: [
        "Describing people, places, documents, and problems",
        "Correction tasks",
        "Improving writing accuracy"
      ],
      examples: [
        {
          french: "Une décision importante peut changer la situation.",
          english: "An important decision can change the situation.",
          note: "Feminine adjective agreement."
        },
        {
          french: "Les informations sont utiles et précises.",
          english: "The information is useful and precise.",
          note: "Plural agreement."
        }
      ],
      avoid: [
        "Forgetting plural -s",
        "Using masculine form with feminine nouns",
        "Putting every adjective before the noun"
      ],
      drill: [
        "Change 5 noun phrases from masculine to feminine.",
        "Make 5 singular phrases plural.",
        "Write 3 descriptive exam sentences."
      ]
    };
  }

  if (value.includes("negation") || value.includes("question")) {
    return {
      rule: "Negation and questions control sentence meaning; keep word order clean and predictable.",
      patterns: [
        "negation: ne + verb + pas/jamais/plus/rien/personne",
        "question: est-ce que + statement",
        "formal question: inversion with hyphen"
      ],
      useWhen: [
        "Speaking interview questions",
        "Reading/listening question recognition",
        "Writing clear requests"
      ],
      examples: [
        {
          french: "Je ne comprends pas cette règle.",
          english: "I do not understand this rule.",
          note: "Basic negation around the verb."
        },
        {
          french: "Pourriez-vous m'expliquer la procédure ?",
          english: "Could you explain the procedure to me?",
          note: "Polite formal question."
        }
      ],
      avoid: [
        "Dropping pas in standard writing",
        "Using English word order for questions",
        "Forgetting the hyphen in formal inversion"
      ],
      drill: [
        "Turn 5 statements into negative sentences.",
        "Ask the same question with est-ce que and inversion.",
        "Write one polite request."
      ]
    };
  }

  if (value.includes("opinion") || value.includes("advice") || value.includes("paragraph") || value.includes("formal register")) {
    return {
      rule: "Use clear structures to present an opinion, give advice, organize paragraphs, or sound formal.",
      patterns: [
        "opinion: selon moi, je pense que, il me semble que",
        "advice: il faudrait, je vous conseille de, vous devriez",
        "paragraph: idea -> reason -> example -> result"
      ],
      useWhen: [
        "TEF/TCF writing tasks",
        "Speaking argument questions",
        "Formal emails and complaints"
      ],
      examples: [
        {
          french: "Selon moi, cette mesure est utile car elle protège les citoyens.",
          english: "In my opinion, this measure is useful because it protects citizens.",
          note: "Opinion + reason."
        },
        {
          french: "Je vous serais reconnaissant de bien vouloir examiner ma demande.",
          english: "I would be grateful if you would examine my request.",
          note: "Formal register."
        }
      ],
      avoid: [
        "Repeating je pense que in every sentence",
        "Giving an opinion without a reason",
        "Mixing informal and formal register"
      ],
      drill: [
        "Write one opinion with two reasons.",
        "Add one concrete example.",
        "Rewrite it in a more formal register."
      ]
    };
  }

  return sheet;
}

export function parseVocabularyWords(value: unknown): VocabularyWord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is VocabularyWord =>
      typeof item === "object" &&
      item !== null &&
      "french" in item &&
      typeof item.french === "string" &&
      "english" in item &&
      typeof item.english === "string"
  );
}

export function vocabularyUseCases(name: string) {
  const value = normalize(name);

  if (value.includes("work")) {
    return ["Job interview", "Professional email", "Workplace problem or complaint"];
  }

  if (value.includes("immigration") || value.includes("administration")) {
    return ["Government form", "Appointment request", "Status or document explanation"];
  }

  if (value.includes("housing")) {
    return ["Rental search", "Neighbourhood description", "Repair or moving problem"];
  }

  if (value.includes("health")) {
    return ["Doctor appointment", "Symptoms explanation", "Advice about lifestyle"];
  }

  if (value.includes("environment")) {
    return ["Opinion essay", "Public policy argument", "Cause/consequence explanation"];
  }

  if (value.includes("technology")) {
    return ["Online service issue", "Digital learning", "Advantages and risks of technology"];
  }

  if (value.includes("body") || value.includes("hygiene")) {
    return ["Symptom description", "Daily routine", "Health appointment"];
  }

  if (value.includes("clothing") || value.includes("appearance") || value.includes("color")) {
    return ["Shopping situation", "Object/person description", "Customer service exchange"];
  }

  if (value.includes("sport")) {
    return ["Leisure interview", "Health argument", "Activity registration"];
  }

  if (value.includes("animal") || value.includes("nature")) {
    return ["Environment topic", "Outdoor activity", "Opinion about protection"];
  }

  if (value.includes("city") || value.includes("local")) {
    return ["Directions", "Neighbourhood description", "Public service request"];
  }

  if (value.includes("kitchen") || value.includes("household")) {
    return ["Home description", "Cooking instruction", "Repair or cleaning problem"];
  }

  if (value.includes("weather") || value.includes("measurement")) {
    return ["Travel planning", "Daily schedule", "Quantity or comparison question"];
  }

  if (value.includes("word building")) {
    return ["Guessing meaning in reading", "Expanding vocabulary families", "Spelling control"];
  }

  if (value.includes("homophone") || value.includes("confusing")) {
    return ["Dictation-style spelling", "Writing accuracy", "Grammar correction"];
  }

  if (value.includes("expression") || value.includes("idiom")) {
    return ["Natural speaking", "Informal messages", "Polite everyday replies"];
  }

  return ["Speaking interview", "Writing task", "Reading/listening vocabulary in context"];
}

export function vocabularyFrames(words: VocabularyWord[]) {
  const [first, second, third] = words;

  return [
    `${first?.french ?? "Ce sujet"} est important parce qu'il influence la vie quotidienne.`,
    `Il y a un lien entre ${second?.french ?? "ce problème"} et les besoins des citoyens.`,
    `Une solution possible serait d'améliorer ${third?.french ?? "ce service"}.`
  ];
}
