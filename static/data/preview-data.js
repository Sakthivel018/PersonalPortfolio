window.portfolioPreviewData = {
  Profile: {
    name: 'Sakthivel Raja',
    designation: 'GenAI Engineer',
    location: 'Chennai, India',
    about_me: [
      'I build GenAI applications that turn complex documents and images into structured, validated business data. My work combines Python backends, agentic workflows, retrieval, deterministic checks, and human review.'
    ]
  },
  Projects: [
    {
      visible: true,
      href: 'insurance-document-extraction',
      header: 'Insurance document extraction & validation',
      sub_title: 'LangGraph · FastAPI · Structured outputs',
      description: 'Orchestrated stateful extraction, validation, enrichment, and post-processing workflows. Combined LLM reasoning with deterministic rules to find missing, duplicate, and incorrectly merged fields across complex insurance documents.',
      category: 'Agentic document AI',
      group: 'work'
    },
    {
      visible: true,
      href: 'violation-notice-intelligence',
      header: 'Violation notice intelligence modernization',
      sub_title: 'Azure AI · FastAPI · Evaluation',
      description: 'Reduced prompt size by 50% through Markdown-table conversion while preserving tabular relationships, with approximately 90% extraction accuracy during evaluation. Added authentication, structured logging, tracing, and CI/CD integration.',
      category: 'Document intelligence',
      group: 'work'
    },
    {
      visible: true,
      href: 'medical-document-rag',
      header: 'Medical document RAG platform',
      sub_title: 'Hybrid retrieval · Parent-child chunks · Azure',
      description: 'Combined semantic and keyword retrieval with citation grounding for long medical documents, reaching approximately 93% on evaluated samples. Built asynchronous ingestion and responsive streaming workflows around Azure storage, queues, functions, and FastAPI.',
      category: 'RAG systems',
      group: 'work'
    },
    {
      visible: true,
      href: 'etl-system-using-ai-chatbot',
      header: 'ETL system with an AI query layer',
      sub_title: 'Python · LLMs · MongoDB',
      description: 'Built a document workflow that turns unstructured files into structured MongoDB records, then added a chatbot for asking questions across the extracted information.',
      category: 'Personal project',
      group: 'personal'
    },
    {
      visible: true,
      href: 'data-extraction-system',
      header: 'PDF and image extraction workbench',
      sub_title: 'OCR · Python · CSV / Excel',
      description: 'Made a document extraction tool that turns PDFs and images into tabular output, with a review screen for checking and correcting OCR results before export.',
      category: 'Personal project',
      group: 'personal'
    },
    {
      visible: true,
      href: 'llm-powered-chatbots',
      header: 'Document-grounded chatbot experiments',
      sub_title: 'OpenAI · Claude · RAG',
      description: 'Explored multi-turn question answering over private documents, combining retrieval and conversation context to keep responses tied to the supplied knowledge.',
      category: 'Personal project',
      group: 'personal'
    },
    {
      visible: true,
      href: 'voice-based-email-system',
      header: 'Voice-to-draft assistant',
      sub_title: 'Speech-to-text · multilingual input · Gmail',
      description: 'Prototyped a voice-led workflow that transcribes spoken instructions, turns them into a message draft, and connects to Gmail for delivery.',
      category: 'Personal project',
      group: 'personal'
    }
  ],
  Experience: [
    {
      title: 'GenAI Developer / Senior Engineer · Aspire Systems',
      span: 'SEP 2025 — PRESENT · CHENNAI',
      description: 'Designing agentic AI and document-intelligence systems with LangGraph, FastAPI, structured extraction, deterministic validation, and evaluation.'
    },
    {
      title: 'Software Engineer · Clustrex Data',
      span: 'JUL 2022 — SEP 2025 · CHENNAI',
      description: 'Built Python backends, LLM extraction workflows, conversational applications, document processing, and RAG systems across medical, invoice, and banking use cases.'
    }
  ],
  Education: [
    {
      place: 'B.E. Computer Science and Engineering · Anna University Regional Campus, Coimbatore',
      span: 'AUG 2018 — JUL 2022',
      description: 'CGPA 8.71 / 10'
    }
  ],
  Skills: [
    { name: 'Python' }, { name: 'LangGraph' }, { name: 'LangChain' }, { name: 'FastAPI' },
    { name: 'RAG' }, { name: 'MCP' }, { name: 'OpenAI' }, { name: 'Azure OpenAI' },
    { name: 'MongoDB' }, { name: 'PostgreSQL' }, { name: 'Pinecone' }, { name: 'LangSmith' }
  ],
  Certifications: [
    { title: 'Microsoft Certified: Azure AI Apps and Agents Developer Associate', span: 'AUG 2026' },
    { title: 'Anthropic AI Fluency — Framework and Foundation', span: 'CERTIFICATION' }
  ],
  Blogs: [],
  SocialList: []
};
