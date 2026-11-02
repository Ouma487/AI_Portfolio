/**
 * Single source of truth for every piece of portfolio content.
 *
 * Rules for editing:
 * - Only write facts that appear in the CV (public/resume/oumaima-chater-cv.pdf)
 *   or that the owner has confirmed. No invented metrics.
 * - Components should never hard-code names, URLs, emails or image paths;
 *   import them from here instead.
 * - Keep this file free of React/JSX so it can be imported from server and
 *   client components alike. Map `SocialLink.kind` to an icon in the UI layer.
 */

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

/** A local image with its intrinsic pixel size (lets next/image reserve space and avoid layout shift). */
export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type SocialKind = 'github' | 'linkedin' | 'email';

export type SocialLink = {
  kind: SocialKind;
  label: string;
  /** Full URL, including `mailto:` for email. */
  url: string;
  /** Short human-readable form, e.g. "github.com/Ouma487". */
  handle: string;
};

export type SpokenLanguage = {
  name: string;
  level: string;
};

export type PersonalData = {
  name: string;
  initials: string;
  /** Job title as shown in the hero. */
  title: string;
  /** One-line positioning statement. */
  headline: string;
  /** Short hero paragraph. */
  bio: string;
  /** Longer "About" copy, one string per paragraph. */
  about: string[];
  location: string;
  /** Optional "open to…" line. Leave undefined unless the owner states it. */
  availability?: string;
  email: string;
  socials: SocialLink[];
  resumeUrl: string;
  heroImage: ImageAsset;
  heroImageAlt: string;
  portrait: ImageAsset;
  portraitAlt: string;
  /** Monogram logo used in the header and footer. */
  logo: ImageAsset;
  languages: SpokenLanguage[];
};

export type NavLink = {
  label: string;
  /** In-page anchor such as "#projects". */
  href: string;
};

/** A tool or language with an icon, shown in the "Skills" grid. */
export type Tool = {
  name: string;
  icon: string;
};

/** A named group of skills, mirroring the CV's "Technical skills" section. */
export type SkillGroup = {
  title: string;
  items: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
  kind: 'github' | 'demo' | 'paper' | 'other';
};

/** A real, measured number. Never put estimates or placeholders here. */
export type Highlight = {
  label: string;
  value: string;
};

export type Project = {
  /** URL segment: /projects/[slug]. Lowercase, hyphenated, ASCII only. */
  slug: string;
  /** Display order, zero-padded ("01"). */
  index: string;
  title: string;
  /** One sharp line: what it does, for whom. */
  tagline: string;
  /** 2–3 sentence overview used on cards and at the top of the case study. */
  summary: string;
  /** The problem and why it mattered. */
  context: string;
  /** What was built, step by step. */
  approach: string[];
  /** What came out of it. */
  results: string[];
  /** Headline numbers. Empty when the sources give none. */
  highlights: Highlight[];
  stack: string[];
  /** Short year label, e.g. "2024". */
  year?: string;
  /** Exact period from the CV, when known. */
  period?: string;
  /** Industrial or academic partner. */
  partner?: string;
  award?: string;
  links: ProjectLink[];
  image: ImageAsset;
  imageAlt: string;
  featured?: boolean;
};

export type Experience = {
  company: string;
  role: string;
  /** Display string, e.g. "Dec 2024 – Present". */
  period: string;
  start: string; // "YYYY-MM"
  end?: string; // "YYYY-MM"; undefined means current
  location?: string;
  employmentType?: 'Full-time' | 'Internship';
  summary: string;
  highlights: string[];
  stack?: string[];
  logo?: ImageAsset;
  logoAlt?: string;
};

export type Education = {
  institution: string;
  degree: string;
  period: string;
  location?: string;
  summary?: string;
  coursework?: string[];
  highlights?: string[];
};

/* -------------------------------------------------------------------------- */
/*                                  Personal                                  */
/* -------------------------------------------------------------------------- */

const GITHUB_URL = 'https://github.com/Ouma487';
const LINKEDIN_URL = 'https://www.linkedin.com/in/oumaima-chater/';
const EMAIL = 'chtr.oumaima@gmail.com';

export const personalData: PersonalData = {
  name: 'Oumaima Chater',
  initials: 'OC',
  title: 'AI Engineer',
  headline:
    'AI engineer building calibrated forecasting models, ML pipelines and LLM systems that hold up in production.',
  bio: 'I’m an AI engineer and data scientist working on probabilistic forecasting, time-series analysis, deep learning and LLM-based systems. I’ve built sports forecasting engines and quantitative models now running in production, interpretable diagnostic models for the automotive industry, and predictive maintenance pipelines using generative models.',
  about: [
    'I trained as an engineer at CentraleSupélec, specialising in computer vision and AI, with a grounding in statistics, optimization and machine learning.',
    'Since then I’ve worked on interpretable defect classification at Renault and on multimodal retrieval and LLM-driven content automation at Libertify. Since January 2026 I’ve been at Kairos Research AI, building calibrated forecasting models and taking them from backtest to live production. My toolkit is Python, PyTorch, LightGBM and SQL, deployed on AWS and GCP.',
    'I like taking a messy technical problem, finding the model that actually fits it, and shipping it as a pipeline other people can rely on. Outside work, I play story-driven video games, read, and keep learning about physics, mathematics and the universe, often through podcasts like StarTalk.',
  ],
  location: 'France',
  email: EMAIL,
  socials: [
    { kind: 'github', label: 'GitHub', url: GITHUB_URL, handle: 'github.com/Ouma487' },
    { kind: 'linkedin', label: 'LinkedIn', url: LINKEDIN_URL, handle: 'linkedin.com/in/oumaima-chater' },
    { kind: 'email', label: 'Email', url: `mailto:${EMAIL}`, handle: EMAIL },
  ],
  resumeUrl: '/resume/oumaima-chater-cv.pdf',
  heroImage: { src: '/images/hero-illustration.svg', width: 505, height: 562 },
  heroImageAlt: 'Line illustration of a woman sitting cross-legged with a laptop',
  portrait: { src: '/images/portrait.webp', width: 1000, height: 1255 },
  portraitAlt: 'Portrait of Oumaima Chater',
  logo: { src: '/logos/oc-monogram.webp', width: 256, height: 256 },
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'French', level: 'Bilingual' },
    { name: 'English', level: 'Full professional' },
  ],
};

/** Look up one social link by kind. */
export const getSocial = (kind: SocialKind): SocialLink | undefined =>
  personalData.socials.find((s) => s.kind === kind);

export const siteMetadata = {
  title: `${personalData.name} · ${personalData.title}`,
  description:
    'Portfolio of Oumaima Chater, AI engineer in France: predictive maintenance, interpretable models, RAG and LLM pipelines, reinforcement learning and multi-agent systems.',
};

/** In-page sections, in the order they appear on the home page. The UI numbers sections from this order. */
export const navigation: NavLink[] = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/* -------------------------------------------------------------------------- */
/*                                   Skills                                   */
/* -------------------------------------------------------------------------- */

/** Tools with icons (the "My Skills" grid). */
export const skills: Tool[] = [
  { name: 'Python', icon: '/icons/python.svg' },
  { name: 'PyTorch', icon: '/icons/pytorch.svg' },
  { name: 'TensorFlow', icon: '/icons/tf.svg' },
  { name: 'SQL & NoSQL', icon: '/icons/db.svg' },
  { name: 'Git', icon: '/icons/git.svg' },
  { name: 'GCP', icon: '/icons/gcp.svg' },
  { name: 'C++', icon: '/icons/cplusplus.svg' },
  { name: 'Excel', icon: '/icons/sheets.svg' },
];

/** Fields of AI and data science (the "AI & Data Science" grid). */
export const aiDomains: string[] = [
  'Machine Learning',
  'Deep Learning',
  'NLP',
  'Computer Vision',
  'Reinforcement Learning',
  'Probabilities',
  'Statistics',
  'LLMs',
];

/** Full skill inventory, grouped as in the CV. */
export const skillGroups: SkillGroup[] = [
  { title: 'Languages', items: ['Python', 'C++', 'SQL', 'MATLAB'] },
  {
    title: 'ML & Deep Learning',
    items: [
      'PyTorch',
      'TensorFlow',
      'Scikit-learn',
      'VAE',
      'LangChain',
      'RAG',
      'LSTM',
      'CNNs',
      'Multimodal models',
      'NLP',
      'Computer vision',
    ],
  },
  { title: 'Data & Storage', items: ['Pandas', 'NumPy', 'SciPy', 'PostgreSQL', 'MongoDB'] },
  {
    title: 'Cloud & MLOps',
    items: ['GCP', 'AWS Lambda', 'Vertex AI', 'FastAPI', 'GitHub Actions', 'Power BI'],
  },
  {
    title: 'AI Applications',
    items: [
      'RAG systems',
      'Document intelligence',
      'Generative models',
      'Counterfactual explanations',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Projects                                  */
/* -------------------------------------------------------------------------- */

const PROJECT_IMAGE_SIZE = { width: 1600, height: 900 };

export const projects: Project[] = [
  {
    slug: 'predictive-maintenance',
    index: '01',
    title: 'ML-Driven Predictive Maintenance',
    tagline: 'Predicting electrolyzer failures from early voltage signals, without waiting for endurance tests.',
    summary:
      'A predictive maintenance pipeline, built with Genvia, that forecasts failures in electrolyzer layers from their early voltage signals. Time series are turned into 2D images and read by a hybrid CNN–VAE that adapts across sites, reaching 90.8% accuracy. It won CentraleSupélec’s Prix de l’innovation Dzung Tran.',
    context:
      'Genvia, a consortium of CEA, SLB, Vinci, Vicat and the Occitanie region, needed to know which electrolyzer layers would fail. Finding out meant running costly endurance tests. The data came from several sites, so a model trained on one had to keep working on the others despite domain shift.',
    approach: [
      'Detrended the multi-layer voltage time series to isolate the signal that matters.',
      'Encoded each signal as 2D images using Gramian Angular Fields and Markov Transition Fields.',
      'Trained a hybrid CNN–VAE that combines supervised anomaly detection, unsupervised reconstruction and domain adaptation.',
      'Added counterfactual-based visualizations so engineers can see why a layer was flagged.',
      'Automated manufacturing traceability by converting Excel logs into structured JSON orders, ready for a future knowledge graph.',
    ],
    results: [
      '90.8% accuracy across multi-site datasets.',
      'Failures can be predicted from early voltage signals, removing the need for costly endurance tests.',
      'Awarded the Prix de l’innovation Dzung Tran, CentraleSupélec’s top computer science innovation of the year.',
    ],
    highlights: [{ label: 'Accuracy across sites', value: '90.8%' }],
    stack: ['Python', 'PyTorch', 'VAE', 'CNN', 'Domain adaptation', 'Time series'],
    year: '2024',
    period: 'Oct 2023 – Apr 2024',
    partner: 'Genvia (CEA, SLB, Vinci, Vicat, Occitanie)',
    award: 'Prix de l’innovation Dzung Tran, CentraleSupélec',
    links: [{ label: 'GitHub', href: 'https://github.com/Ouma487/Anomaly_Prediction', kind: 'github' }],
    image: { src: '/images/projects/predictive-maintenance.webp', ...PROJECT_IMAGE_SIZE },
    imageAlt: 'Rising green time-series chart on a dark grid with an energy icon',
    featured: true,
  },
  {
    slug: 'news-moodmap',
    index: '02',
    title: 'Global News MoodMap',
    tagline: 'Turning the GDELT news firehose into daily briefings and a map of global sentiment.',
    summary:
      'An AI dashboard that turns GDELT’s raw news streams into structured daily briefings and sentiment maps. Semantic embeddings, LLM summaries and blended sentiment scores let decision-makers search news by meaning and watch the global mood shift.',
    context:
      'GDELT publishes a constant stream of global news events, far too much for a person to read and too unstructured to query by keyword alone. Decision-makers need the gist of each day, a way to find coverage by meaning, and a sense of how today compares with the past.',
    approach: [
      'Ingested GDELT news streams into BigQuery.',
      'Embedded articles semantically so they can be searched by meaning, not just keywords.',
      'Generated structured daily briefings with LLM-based summarization on Vertex AI.',
      'Scored sentiment with a blended approach and plotted it on a world map.',
      'Matched current events to historical analogs for comparison.',
    ],
    results: [
      'An interactive dashboard with daily briefings, search by meaning and historical comparisons.',
      'Global mood trends visualized in real time.',
    ],
    highlights: [],
    stack: ['BigQuery', 'Vertex AI', 'LLMs', 'Semantic embeddings', 'Sentiment analysis'],
    links: [{ label: 'GitHub', href: 'https://github.com/Ouma487/News_MoodMap', kind: 'github' }],
    image: { src: '/images/projects/news-moodmap.webp', width: 1600, height: 918 },
    imageAlt: 'World map silhouette connected by glowing network lines',
    featured: true,
  },
  {
    slug: 'rl-urban-driving',
    index: '03',
    title: 'Reinforcement Learning for Urban Driving',
    tagline: 'Training driving agents for highways, parking lots and roundabouts with deep RL.',
    summary:
      'Deep reinforcement learning agents for autonomous driving in simulated urban scenes: highways, parking lots and roundabouts. DQN, DDPG and Hindsight Experience Replay were trained and compared on reward progression and task completion.',
    context:
      'Each driving scenario rewards different behaviour: keeping pace on a highway, precise low-speed control in a parking lot, yielding on a roundabout. The goal was to see how different RL algorithms cope with these tasks and what it takes to train them stably.',
    approach: [
      'Set up simulated highway, parking and roundabout environments.',
      'Trained agents with DQN, DDPG and Hindsight Experience Replay (HER).',
      'Tuned hyperparameters for training stability.',
      'Evaluated agents on reward progression and task completion.',
    ],
    results: [
      'Agents that make safe, effective driving decisions in each scenario.',
      'A side-by-side view of how each algorithm adapts to different traffic situations.',
      'Hands-on lessons in what makes RL systems hard to train.',
    ],
    highlights: [
      { label: 'Algorithms compared', value: '3' },
      { label: 'Driving scenarios', value: '3' },
    ],
    stack: ['Python', 'DQN', 'DDPG', 'HER'],
    links: [{ label: 'GitHub', href: 'https://github.com/Ouma487/HighwayRLExplorer', kind: 'github' }],
    image: { src: '/images/projects/rl-urban-driving.webp', ...PROJECT_IMAGE_SIZE },
    imageAlt: 'Wireframe car on a dark road emitting sensor waves toward other vehicles',
  },
  {
    slug: 'robot-waste-mission',
    index: '04',
    title: 'Robot Waste Mission',
    tagline: 'Coordinating robot teams to clear radioactive waste 3.5× faster.',
    summary:
      'A multi-agent simulation of robots cleaning up hazardous waste across zones of different radioactivity. Robots that coordinate through a leader finished 3.5× faster than robots exploring on their own, with no deadlocks, and kept scaling as more agents were added.',
    context:
      'Robots have to collect, transform and dispose of waste in zones with different radiation levels, which limits where each robot can go. Without coordination, robots duplicate work or block each other. The question was how much communication helps.',
    approach: [
      'Built the simulation with custom agent schedulers.',
      'Baseline: non-communicating agents exploring at random.',
      'Coordinated strategy: agents exchanging messages through a leader.',
      'Added a hierarchical “chief” for centralized decisions.',
      'Built visualizations tracking agent efficiency and waste reduction.',
    ],
    results: [
      '3.5× faster task completion with communication.',
      'Deadlocks eliminated.',
      'Performance scaled with the number of agents.',
    ],
    highlights: [
      { label: 'Faster with coordination', value: '3.5×' },
      { label: 'Deadlocks', value: '0' },
    ],
    stack: ['Python', 'Multi-agent systems', 'Simulation'],
    year: '2024',
    period: 'Mar 2024',
    links: [{ label: 'GitHub', href: 'https://github.com/Ouma487/Robot_Mission', kind: 'github' }],
    image: { src: '/images/projects/robot-waste-mission.webp', width: 1600, height: 903 },
    imageAlt: 'Green cartoon robot holding up a glowing light bulb',
    featured: true,
  },
];

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug.toLowerCase());

/* -------------------------------------------------------------------------- */
/*                                 Experience                                 */
/* -------------------------------------------------------------------------- */

export const experience: Experience[] = [
  {
    company: 'Kairos Research AI',
    role: 'AI Engineer / Data Scientist',
    period: 'Jan 2026 – Present',
    start: '2026-01',
    location: 'Paris, France (hybrid)',
    employmentType: 'Full-time',
    summary:
      'Probabilistic forecasting and quantitative sports models, from research and validation through to production deployment and live monitoring.',
    highlights: [
      'Built a production football forecasting engine from scratch: an Elo rating system with a literature-derived update rule, Poisson goal models and Dixon-Coles low-score correction for calibrated draw probabilities, covering tens of thousands of matches across dozens of leagues.',
      'Led the basketball player-props pipeline (NBA and EuroLeague): a two-stage model predicting minutes and then the stat, with edge measured against bookmaker-implied probabilities and validated on a strict tune / validation / single-use live temporal split with bootstrap confidence intervals.',
      'Took the first strategy from backtest to production as weeks of solo, end-to-end work, owning the ML, data engineering and software engineering: daily model runs and monitoring, a settlement system that records every candidate (not just placed bets) with ROI, CLV and bootstrap metrics, a venue-agnostic fills table, live odds ingestion into the lakehouse, and stop/kill thresholds fixed before launch.',
      'Built data ingestion pipelines for an S3 / Iceberg / Glue basketball lakehouse fed by league APIs, and provided technical oversight of a prediction-market strategy, identifying in-sample artifacts that inflated its early backtest returns.',
    ],
    stack: [
      'Python',
      'Machine learning',
      'LightGBM',
      'Statistics',
      'Optuna',
      'Isotonic calibration',
      'Bootstrap / Monte Carlo',
      'Pydantic',
      'Kafka',
      'AWS (Lambda, ECR, S3, Glue)',
      'Apache Iceberg',
      'Docker',
      'Terraform',
    ],
  },
  {
    company: 'Libertify',
    role: 'AI Engineer',
    period: 'Dec 2024 – Dec 2025',
    start: '2024-12',
    end: '2025-12',
    location: 'Paris, France (hybrid)',
    employmentType: 'Full-time',
    summary:
      'Building production AI pipelines that combine LLM agents, multimodal retrieval and dynamic prompt generation to automate financial and non-financial content.',
    highlights: [
      'Built RAG pipelines for documents and images on Vertex AI and AWS Lambda, adding text and image embeddings to retrieval.',
      'Developed AI agents for news classification and video script generation, speeding up editorial throughput.',
      'Built an end-to-end pipeline that turns scripts into production-ready visuals with generative image models.',
      'Set up prompt evaluation frameworks to keep generated content factually accurate at scale.',
    ],
    stack: ['Python', 'GCP', 'Vertex AI', 'AWS Lambda', 'RAG', 'LLM agents', 'Generative image models'],
    logo: { src: '/logos/libertify.webp', width: 73, height: 97 },
    logoAlt: 'Libertify logo',
  },
  {
    company: 'Renault',
    role: 'AI & Data Mining Intern',
    period: 'May 2024 – Oct 2024',
    start: '2024-05',
    end: '2024-10',
    location: 'Guyancourt, France',
    employmentType: 'Internship',
    summary:
      'Predictive modeling and document intelligence for quality control and procurement.',
    highlights: [
      'Designed interpretable models that detect vehicle faults from diagnostic codes, with resampling strategies tailored to class imbalance.',
      'Automated the comparison of tender (RFP) documents using multimodal LLMs and computer vision.',
      'Contributed to predictive maintenance work and annotated datasets for model training.',
      'Worked with risk and business teams to align analytics output with operational KPIs.',
    ],
    stack: ['Python', 'GCP', 'NLP', 'Computer vision', 'Multimodal LLMs'],
    logo: { src: '/logos/renault.webp', width: 98, height: 128 },
    logoAlt: 'Renault logo',
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Education                                 */
/* -------------------------------------------------------------------------- */

export const education: Education[] = [
  {
    institution: 'CentraleSupélec',
    degree: 'Engineering Degree (M.S. equiv.) in Computer Vision & AI',
    period: 'Aug 2021 – Dec 2024',
    location: 'Gif-sur-Yvette, France',
    coursework: [
      'Statistics',
      'Optimization',
      'Machine Learning',
      'Deep Learning',
      'NLP',
      'Computer Vision',
      'Reinforcement Learning',
      'Game Theory',
      'Particle Physics',
      'Cosmology',
      'Cryptography',
    ],
    highlights: [
      'Prix de l’innovation Dzung Tran for the Genvia predictive maintenance project.',
    ],
  },
  {
    institution: 'Preparatory Classes (CPGE)',
    degree: 'MPSI & MP* – Mathematics, Physics, Engineering',
    period: 'Sep 2019 – Jun 2021',
    location: 'Rabat, Morocco',
    summary: 'Intensive coursework in mathematics, physics and algorithmic problem-solving.',
    highlights: ['Ranked 7th nationwide in the CNC (Concours National Commun).'],
  },
];
