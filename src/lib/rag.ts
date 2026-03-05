import { embedText } from "./embedding";
import { searchDocuments, SearchResult } from "./zilliz";
import { traceable } from "langsmith/traceable";

export interface RAGContext {
  content: string;
  source: string;
  score: number;
}

/**
 * Retrieve relevant context for a query
 */
export const retrieveContext = traceable(
  async function retrieveContext(
    query: string,
    topK: number = 5,
    scoreThreshold: number = 0.5
  ): Promise<RAGContext[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await embedText(query);

      // Search for similar documents in Zilliz vector DB
      const results = await searchDocuments(queryEmbedding, topK, scoreThreshold);

      return results.map((r) => ({
        content: r.content,
        source: r.source,
        score: r.score,
      }));
    } catch (error) {
      console.error("RAG retrieval error:", error);
      return [];
    }
  },
  { name: "retrieveContext", run_type: "retriever", tags: ["rag", "zilliz"] }
);

/**
 * Format retrieved context for LLM consumption
 */
export function formatContext(contexts: RAGContext[]): string {
  if (contexts.length === 0) {
    return "";
  }

  const formatted = contexts
    .map((ctx, i) => `[Nguồn ${i + 1}: ${ctx.source}]\n${ctx.content}`)
    .join("\n\n---\n\n");

  return `Thông tin từ tài liệu phòng khám:\n\n${formatted}`;
}

/**
 * Retrieve and format context in one call
 */
export const getRAGContext = traceable(
  async function getRAGContext(query: string, topK: number = 3): Promise<string> {
    const contexts = await retrieveContext(query, topK);
    return formatContext(contexts);
  },
  { name: "getRAGContext", run_type: "retriever", tags: ["rag", "pipeline"] }
);
