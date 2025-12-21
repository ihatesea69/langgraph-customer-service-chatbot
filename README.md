# LangGraph Customer Service Chatbot

AI-powered customer service chatbot for household goods e-commerce, built with **Next.js 16**, **LangGraph**, and **OpenAI GPT-4o-mini**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ihatesea69/langgraph-customer-service-chatbot)

## 🚀 Demo

**Live**: [https://live-demo-chatbot.vercel.app](https://live-demo-chatbot.vercel.app)

## Features

- **LangGraph Agent** - Tool-calling agent with product search capabilities
- **GitHub OAuth** - Secure authentication via NextAuth.js
- **Token Limiting** - 10,000 tokens/day per user (Vercel KV)
- **Rate Limiting** - Request throttling per IP
- **Vietnamese NLP** - Optimized for Vietnamese language
- **Modern UI** - Glassmorphism design with TailwindCSS

## Tech Stack

| Component | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 16 (App Router)        |
| Auth      | NextAuth.js + GitHub OAuth     |
| AI        | LangGraph + OpenAI GPT-4o-mini |
| Storage   | Vercel KV                      |
| Styling   | TailwindCSS                    |
| Deploy    | Vercel                         |

## Quick Start

```bash
# Clone
git clone https://github.com/ihatesea69/langgraph-customer-service-chatbot.git
cd langgraph-customer-service-chatbot

# Install
npm install

# Setup env
cp .env.local.example .env.local
# Fill in your keys

# Run
npm run dev
```

## Environment Variables

```bash
GITHUB_ID=           # GitHub OAuth App Client ID
GITHUB_SECRET=       # GitHub OAuth App Secret
AUTH_SECRET=         # openssl rand -base64 32
OPENAI_API_KEY=      # OpenAI API Key
KV_REST_API_URL=     # Vercel KV (auto-added)
KV_REST_API_TOKEN=   # Vercel KV (auto-added)
```

## Security Features

- ✅ GitHub OAuth authentication
- ✅ Token usage limiting (10K/day per user)
- ✅ Rate limiting per IP
- ✅ Input validation & sanitization
- ✅ Prompt injection protection
- ✅ Least-privilege API key permissions

## License

MIT
