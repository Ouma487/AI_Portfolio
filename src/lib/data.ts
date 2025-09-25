import { Github, Linkedin, BrainCircuit, Bot, Database, Code } from 'lucide-react';

export const personalData = {
  name: 'Alex Doe',
  title: 'AI Engineer & Researcher',
  bio: 'A passionate AI Engineer with a knack for developing intelligent systems and a deep interest in machine learning, natural language processing, and computer vision. I thrive on solving complex problems and turning innovative ideas into reality.',
  initials: 'AD',
  contact: {
    email: 'alex.doe@email.com',
    social: [
      { name: 'GitHub', url: 'https://github.com', icon: Github },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
    ],
  },
  resumeUrl: '/resume.pdf',
};

export const skills = [
  { name: 'Python', icon: Code },
  { name: 'PyTorch', icon: BrainCircuit },
  { name: 'TensorFlow', icon: BrainCircuit },
  { name: 'Scikit-learn', icon: Bot },
  { name: 'SQL & NoSQL', icon: Database },
  { name: 'Docker', icon: Bot },
  { name: 'Kubernetes', icon: Bot },
  { name: 'GCP & AWS', icon: Code },
];

export const projects = [
  {
    id: 'project-1',
    title: 'Real-Time Object Detection',
    description: 'Developed a high-performance object detection system capable of processing real-time video streams. Integrated with a custom-trained YOLOv8 model to achieve 95% mAP on a proprietary dataset.',
    techStack: ['Python', 'PyTorch', 'OpenCV', 'Docker'],
    link: {
      label: 'github.com',
      href: '#',
    },
    imagePlaceholderId: '1',
  },
  {
    id: 'project-2',
    title: 'Sentiment Analysis API',
    description: 'Built a RESTful API for sentiment analysis using a fine-tuned BERT model. The API handles high-throughput requests and provides nuanced sentiment scores for text inputs.',
    techStack: ['FastAPI', 'Transformers', 'Kubernetes', 'GCP'],
    link: {
      label: 'github.com',
      href: '#',
    },
    imagePlaceholderId: '2',
  },
  {
    id: 'project-3',
    title: 'Generative Art Engine',
    description: 'Created a generative art engine using StyleGAN to produce unique, high-resolution images based on textual prompts. Implemented a web interface for users to interact with the model.',
    techStack: ['TensorFlow', 'Flask', 'React', 'AWS S3'],
    link: {
      label: 'github.com',
      href: '#',
    },
    imagePlaceholderId: '3',
  },
  {
    id: 'project-4',
    title: 'AI-Powered Chatbot for Customer Support',
    description: 'Designed and deployed a chatbot using retrieval-augmented generation (RAG) to answer customer queries from a knowledge base, reducing support tickets by 40%.',
    techStack: ['LangChain', 'Pinecone', 'OpenAI API', 'Next.js'],
    link: {
      label: 'github.com',
      href: '#',
    },
    imagePlaceholderId: '4',
  },
];

export const experience = [
    {
        company: "Innovate AI",
        role: "Senior AI Engineer",
        date: "2020 - Present",
        description: "Led the development of machine learning models for predictive analytics. Mentored junior engineers and contributed to the core ML infrastructure."
    },
    {
        company: "Data Solutions Inc.",
        role: "Machine Learning Engineer",
        date: "2018 - 2020",
        description: "Designed and implemented NLP models for text classification and summarization. Optimized data pipelines for large-scale data processing."
    },
    {
        company: "Tech Start LLC",
        role: "Software Engineer Intern",
        date: "Summer 2017",
        description: "Assisted in the development of a recommendation engine. Gained experience with collaborative filtering and matrix factorization techniques."
    }
];

export const education = [
    {
        institution: "State University",
        degree: "M.S. in Computer Science",
        date: "2016 - 2018",
        description: "Specialized in Artificial Intelligence and Machine Learning. Thesis on 'Efficient Neural Network Architectures'."
    },
    {
        institution: "Tech Institute",
        degree: "B.S. in Software Engineering",
        date: "2012 - 2016",
        description: "Graduated with honors. President of the Coding Club."
    }
];
