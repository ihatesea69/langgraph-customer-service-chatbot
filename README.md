<div align="center">

# 🦴 BONEDOC AI Chatbot

**Production-ready AI customer service chatbot for orthopedic clinics**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent-green?style=for-the-badge&logo=chainlink)](https://langchain-ai.github.io/langgraphjs/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai)](https://platform.openai.com/)
[![LangSmith](https://img.shields.io/badge/LangSmith-Tracing-orange?style=for-the-badge&logo=langchain)](https://smith.langchain.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

A full-stack AI chatbot built for **BONEDOC Orthopedic Clinic**, powered by **OpenAI GPT-4o-mini**, **LangGraph** agentic workflows, and **Retrieval-Augmented Generation (RAG)** with Zilliz Cloud vector database. Fully observable via **LangSmith** tracing.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **LangGraph Agent** | Multi-step agentic reasoning with 6 specialized tools |
| 🔍 **RAG Pipeline** | Semantic search over clinic documents via Zilliz Cloud (Milvus) |
| 🧠 **OpenAI Embeddings** | `text-embedding-3-small` for vector indexing and retrieval |
| 📊 **LangSmith Tracing** | Full observability — every LLM call, tool use, and RAG step traced |
| 🗂️ **Admin Dashboard** | Upload and manage knowledge base documents (`.txt`, `.pdf`, `.docx`) |
| 💬 **Conversation History** | Persistent multi-turn conversations stored in Upstash Redis |
| 🔐 **Session Auth** | Lightweight user authentication via encrypted session cookies |
| 🛡️ **Rate Limiting** | Per-user token quota (10,000 tokens/day) with IP protection |
| 🌏 **Vietnamese NLP** | Optimized prompts and responses for Vietnamese language |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **AI Orchestration** | LangGraph + LangChain.js |
| **LLM** | OpenAI GPT-4o-mini |
| **Embeddings** | OpenAI text-embedding-3-small |
| **Vector Database** | Zilliz Cloud (Milvus) |
| **Session / Cache** | Upstash Redis (KV) |
| **Observability** | LangSmith |
| **Styling** | TailwindCSS v4 |
| **Deployment** | Vercel |

---

## 🧩 Agent Tools

The LangGraph agent has access to 6 tools:

- **`search_knowledge`** — RAG search over uploaded clinic documents
- **`get_clinic_info`** — Returns clinic name, hours, contact, branches
- **`get_doctors`** — Lists doctors by specialty
- **`get_directions`** — Maps link + directions to clinic branches
- **`get_services`** — Lists treatments, searchable by symptom or service name
- **`book_appointment`** — Collects and formats patient appointment info

---

## 📊 LangSmith Trace Structure

Every chat request is fully traced end-to-end:

```
chat-request  (chain)
 └── bonedoc-agent  (LangGraph)
      ├── ChatOpenAI  (gpt-4o-mini)
      ├── tools node
      │    └── search_knowledge
      │         └── getRAGContext        (retriever)
      │              └── retrieveContext (retriever)
      │                   ├── embedText  (embedding · OpenAI)
      │                   └── Zilliz vector search
      └── ChatOpenAI  (final response)
```

Each trace carries `userId`, `conversationId`, and `messageLength` as metadata for easy filtering.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API Key — [platform.openai.com](https://platform.openai.com/)
- Zilliz Cloud account — [zilliz.com](https://zilliz.com/)
- Upstash Redis — [upstash.com](https://upstash.com/)
- LangSmith API Key — [smith.langchain.com](https://smith.langchain.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/ihatesea69/langgraph-customer-service-chatbot.git
cd langgraph-customer-service-chatbot

# Install dependencies
npm install

# Copy environment template and fill in your keys
cp .env.local.example .env.local

# Start development server
npm run dev
```

---

## 🔧 Environment Variables

```bash
# ── OpenAI ──────────────────────────────────────────
OPENAI_API_KEY=sk-...

# ── Zilliz Cloud (Vector DB) ────────────────────────
ZILLIZ_ENDPOINT=https://your-cluster.cloud.zilliz.com
ZILLIZ_API_KEY=your_zilliz_api_key
ZILLIZ_COLLECTION_NAME=bonedoc_knowledge

# ── Upstash Redis (Session & Rate Limiting) ─────────
KV_REST_API_URL=https://your-redis.upstash.io
KV_REST_API_TOKEN=your_kv_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_readonly_token

# ── Admin ────────────────────────────────────────────
ADMIN_PASSWORD=your_secure_password

# ── LangSmith Observability ──────────────────────────
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_API_KEY=lsv2_pt_...
LANGSMITH_PROJECT=your-project-name
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/               # Admin dashboard + document management
│   ├── api/
│   │   ├── admin/           # Upload & documents API
│   │   ├── auth/            # Login, logout, session API
│   │   ├── chat/            # Main chat endpoint
│   │   └── conversations/   # Conversation history API
│   ├── chat/                # Chat UI page
│   ├── login/               # User login page
│   └── page.tsx             # Landing page
├── components/              # React UI components
├── data/
│   └── clinic-data.json     # Static clinic info (branches, doctors, services)
└── lib/
    ├── auth.ts              # Session management
    ├── conversations.ts     # Conversation CRUD (Redis)
    ├── embedding.ts         # OpenAI embeddings (traceable)
    ├── rag.ts               # RAG retrieval pipeline (traceable)
    ├── token-usage.ts       # Per-user token quota
    ├── zilliz.ts            # Zilliz vector DB client
    └── langgraph/
        ├── agent.ts         # LangGraph agent + LangSmith metadata
        └── tools.ts         # 6 agent tools
```

---

## 🔒 Security

- **Prompt injection protection** — System prompt guards against role-switching attacks
- **Input validation** — Message length capped at 500 characters, history sanitized
- **Rate limiting** — 10,000 token/day quota per user stored in Redis
- **Session encryption** — Iron Session encrypted cookies, server-side only
- **Admin auth** — Password-protected admin routes

---

## 📖 Usage

### End User
1. Visit the landing page → click **Get Started**
2. Enter your name and phone number to log in
3. Chat with the AI assistant for orthopedic health advice

### Admin
1. Navigate to `/admin/login`
2. Enter the admin password
3. Upload clinic documents (`.txt`, `.pdf`, `.docx`)
4. Documents are automatically chunked and embedded into Zilliz Cloud

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using [OpenAI](https://openai.com/) · [LangGraph](https://langchain-ai.github.io/langgraphjs/) · [LangSmith](https://smith.langchain.com/) · [Next.js](https://nextjs.org/)

</div>
