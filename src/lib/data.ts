import { Github, Linkedin, BrainCircuit, Bot, Database, Code } from 'lucide-react';

export const personalData = {
  name: 'Oumaima Chater',
  title: 'AI Engineer & Researcher',
  bio: 'I’m an AI Engineer with experience in predictive modeling, time series analysis, and deep learning systems, as well as LLM-based architectures. I’ve built interpretable diagnostic models in the automotive sector, designed predictive maintenance pipelines using generative approaches, and developed multi-agent simulations for complex environments.',
  initials: 'OC',
  contact: {
    email: 'chtr.oumaima@gmail.com',
    social: [
      { name: 'GitHub', url: 'https://github.com/Ouma487', icon: Github },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/oumaima-chater/', icon: Linkedin },
    ],
  },
  resumeUrl: '/pdfs/CV_Oumaima_Chater (2).pdf',
  details: "I’m an AI Engineer with a strong foundation from CentraleSupélec. Over the past years, I’ve worked on projects spanning predictive maintenance, interpretable defect classification, multimodal retrieval, and LLM-powered automation. My expertise covers deep learning, reinforcement learning, optimization, and data-driven decision-making, supported by strong engineering skills in Python, PyTorch, TensorFlow, SQL, and cloud platforms like GCP and AWS. I am passionate about turning complex technical challenges into scalable AI solutions that deliver real-world impact. Beyond my professional work, I enjoy sharing insights on AI and data-driven technologies."
};

export const skills = [
  { name: 'Python', icon: '/icons/python.svg' },
  { name: 'PyTorch', icon: '/icons/pytorch.svg' },
  { name: 'TensorFlow', icon: '/icons/tf.svg' },
  { name: 'SQL & NoSQL', icon: '/icons/db.svg' },
  { name: 'Git', icon: '/icons/git.svg' },
  { name: 'GCP', icon: '/icons/gcp.svg' },
  { name: 'C++', icon: '/icons/cplusplus.svg' },
  { name: 'Excel', icon: '/icons/sheets.svg' },
];

export const projects = [
  {
    id: '01',
    title: 'ML-Driven Predictive Maintenance',
    description:
      'In collaboration with Genvia (CEA, SLB, Vinci, Vicat, Occitanie), I built a predictive maintenance pipeline to forecast failures in electrolyzer layers from early voltage signals, removing the need for costly endurance tests. Using detrended multi-layer time-series, signals were encoded into 2D images (Gramian Angular Fields, Markov Transition Fields) and analyzed with a hybrid CNN-VAE model combining supervised anomaly detection, unsupervised reconstruction, and domain adaptation, reaching 90.8% accuracy across multi-site datasets. In parallel, I automated manufacturing traceability by converting Excel logs into structured JSON orders, enabling future knowledge graph integration. This project earned the “Prix de l’innovation Dzung Tran” as CentraleSupélec’s top computer science innovation of the year.',
    techStack: ['Python', 'PyTorch'],
    link: {
      label: 'GitHub',
      href: 'https://github.com/Ouma487/Anomaly_Prediction',
    },
    image: '/images/01.svg',
    keyFeatures:{
      left:[],
      right:[]
    }
  },
  {
    id: '02',
    title: 'Global News MoodMap',
    description:
      'Built an interactive AI-powered dashboard that transforms GDELT’s raw news streams into structured daily briefings and sentiment maps. Using semantic embeddings, LLM-based summarization, and blended sentiment scoring, the system enables decision-makers to search by meaning, compare historical analogs, and visualize global mood trends in real time.',
    techStack: ['BigQuery', 'Vertex AI', 'LLMs'],
    link: {
      label: 'GitHub',
      href: 'https://github.com/Ouma487/News_MoodMap',
    },
    image: '/images/02.svg',
    keyFeatures:{
      left:[],
      right:[]
    }
  },
  {
    id: '03',
    title: 'Reinforcement Learning for Urban Driving',
    description:
      'This project applies deep reinforcement learning to autonomous vehicle navigation in simulated urban environments, focusing on highways, parking lots, and roundabouts. Agents were trained using DQN, DDPG, and Hindsight Experience Replay (HER) to make safe and effective driving decisions. Performance was evaluated through reward progression and task completion, with fine-tuned hyperparameters for stability. The work provided hands-on insight into the challenges of training RL systems and how different algorithms adapt to diverse traffic scenarios.',
    techStack: ['DQN', 'DDPG', 'HER'],
    link: {
      label: 'GitHub',
      href: 'https://github.com/Ouma487/HighwayRLExplorer',
    },
    image: '/images/03.svg',
    keyFeatures:{
      left:[],
      right:[]
    }
  },
  {
    id: '04',
    title: 'Robot Waste Mission',
    description:
      'This project simulates a hazardous waste cleanup mission with autonomous robots operating in zones of varying radioactivity. Robots required multi-agent coordination to collect, transform, and dispose of waste. Two strategies were implemented: non-communicating agents with random exploration, and communication-enabled agents coordinated through leader-based message-passing. The latter achieved a 3.5× speedup, eliminated deadlocks, and scaled effectively with more agents. Key contributions include custom agent schedulers, a hierarchical chief system for centralized decision-making, and detailed visualizations tracking agent efficiency and waste reduction.',
    techStack: ['Multi-Agent RL', 'Simulation'],
    link: {
      label: 'GitHub',
      href: 'https://github.com/Ouma487/Robot_Mission',
    },
    image: '/images/04.svg',
    keyFeatures:{
      left:[],
      right:[]
    }
  },
];


export const experience = [
  {
    company: "Libertify",
    role: "AI Engineer",
    date: "Dec 2024 – Present",
    description:
      "Built production-grade AI pipelines combining LLM agents, multimodal retrieval, and dynamic prompt generation to automate financial and non-financial content. Enhanced a RAG pipeline with text/image embeddings, developed AI agents for news classification and video script generation, and implemented prompt evaluation frameworks to ensure factual integrity and scalability.",
    logo: "/logos/libertify.svg",
  },
  {
    company: "Renault",
    role: "AI & Data Mining Intern",
    date: "May 2024 – Oct 2024",
    description:
      "Worked on predictive modeling and document intelligence for quality control and procurement. Developed interpretable classification models for defect detection from diagnostic codes, and automated tender analysis pipelines using NLP and computer vision. Contributed to predictive maintenance efforts and dataset annotation for robust AI training.",
    logo: "/logos/renault.svg", 
  },
];


export const education = [
  {
      institution: "CentraleSupélec",
      degree: "Engineer’s Degree in Artificial Intelligence",
      date: "2021 - 2024",
      description: "Key studies: Statistics, Optimization, Deep Learning, NLP, Computer Vision, Reinforcement Learning, Machine Learning, Game Theory."
  },
  {
      institution: "Preparatory Classes (CPGE)",
      degree: "MPSI & MP* - Mathematics, Physics, Engineering",
      date: "2019 - 2021",
      description: "Ranked 7th nationwide in CNC (Concours National Commun). Intensive coursework in mathematics, physics, and algorithmic problem-solving."
  }
];

