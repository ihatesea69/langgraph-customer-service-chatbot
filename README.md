# BONEDOC Chatbot - Tư Vấn Xương Khớp

AI-powered chatbot tư vấn sức khỏe xương khớp cho Phòng khám BONEDOC, built with **Next.js 16**, **LangGraph**, **OpenAI GPT-4o-mini**, và **Zilliz Cloud RAG**.

## Tính Năng

- **LangGraph Agent** - AI agent có khả năng sử dụng tools tìm kiếm thông tin phòng khám
- **RAG với Zilliz Cloud** - Truy xuất thông tin từ tài liệu y tế được upload
- **Admin Dashboard** - Giao diện upload và quản lý tài liệu knowledge base
- **Session Auth** - Đăng nhập đơn giản bằng tên và số điện thoại
- **IP Rate Limiting** - Bảo vệ chống lạm dụng
- **Vietnamese NLP** - Tối ưu cho tiếng Việt

## Tech Stack

| Component | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 16 (App Router)        |
| AI        | LangGraph + OpenAI GPT-4o-mini |
| Vector DB | Zilliz Cloud (Milvus)          |
| Embedding | OpenAI text-embedding-3-small  |
| Storage   | Vercel KV                      |
| Styling   | TailwindCSS                    |
| Deploy    | Vercel                         |

## Cài Đặt

```bash
# Clone
git clone <repo-url>
cd bonedoc-chatbot

# Install
npm install

# Setup env
cp .env.local.example .env.local
# Điền các key vào file .env.local

# Run
npm run dev
```

## Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Zilliz Cloud
ZILLIZ_ENDPOINT=https://your-cluster.cloud.zilliz.com
ZILLIZ_API_KEY=your_zilliz_api_key
ZILLIZ_COLLECTION_NAME=bonedoc_knowledge

# Vercel KV (for sessions and rate limiting)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# Admin
ADMIN_PASSWORD=your_secure_admin_password
```

## Cấu Trúc

```
src/
├── app/
│   ├── admin/           # Admin dashboard
│   ├── api/
│   │   ├── admin/       # Upload, documents API
│   │   ├── auth/        # Login, logout, session API
│   │   └── chat/        # Chat API
│   ├── chat/            # Chat interface
│   ├── login/           # Login page
│   └── page.tsx         # Landing page
├── components/          # React components
├── data/
│   └── clinic-data.json # Thông tin phòng khám
└── lib/
    ├── auth.ts          # Session management
    ├── embedding.ts     # OpenAI embeddings
    ├── rag.ts           # RAG retrieval
    ├── zilliz.ts        # Zilliz client
    └── langgraph/
        ├── agent.ts     # LangGraph agent
        └── tools.ts     # Agent tools
```

## Sử Dụng

### User

1. Truy cập landing page
2. Nhập tên và số điện thoại để đăng nhập
3. Bắt đầu chat với AI để được tư vấn

### Admin

1. Truy cập `/admin/login`
2. Nhập mật khẩu admin
3. Upload tài liệu (.txt, .pdf, .docx)
4. Tài liệu sẽ được chunk và embed vào Zilliz Cloud

## Phòng Khám BONEDOC

- **Chuyên khoa**: Chấn Thương Chỉnh Hình - Phục Hồi Chức Năng - Vật Lý Trị Liệu
- **Phương châm**: "Thấu Hiểu - Chân Thành - Yêu Thương"
- **Website**: https://bonedoc.vn
- **Hotline**: (+84) 090-3931-868

## License

MIT
