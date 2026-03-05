import OpenAI from "openai";
import { traceable } from "langsmith/traceable";

const EMBEDDING_MODEL = "text-embedding-3-small";
const MAX_CHUNK_SIZE = 1000; // characters per chunk
const CHUNK_OVERLAP = 200; // overlap between chunks

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (openaiClient) return openaiClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY must be set");
  }

  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

/**
 * Generate embedding for a single text
 */
export const embedText = traceable(
  async function embedText(text: string): Promise<number[]> {
    const client = getOpenAIClient();

    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  },
  { name: "embedText", run_type: "embedding", tags: ["openai", "embedding"] }
);

/**
 * Generate embeddings for multiple texts (batch)
 */
export const embedTexts = traceable(
  async function embedTexts(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const client = getOpenAIClient();

    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });

    return response.data.map((d) => d.embedding);
  },
  { name: "embedTexts", run_type: "embedding", tags: ["openai", "embedding", "batch"] }
);

/**
 * Split text into overlapping chunks
 */
export function chunkText(
  text: string,
  maxSize: number = MAX_CHUNK_SIZE,
  overlap: number = CHUNK_OVERLAP
): string[] {
  const chunks: string[] = [];
  
  // Clean and normalize text
  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleanedText.length <= maxSize) {
    return [cleanedText];
  }

  // Try to split on paragraph boundaries first
  const paragraphs = cleanedText.split(/\n\n+/);
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 <= maxSize) {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      
      // If paragraph itself is too long, split by sentences
      if (paragraph.length > maxSize) {
        const sentences = paragraph.split(/(?<=[.!?])\s+/);
        currentChunk = "";
        
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length + 1 <= maxSize) {
            currentChunk += (currentChunk ? " " : "") + sentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk);
            }
            // If sentence is still too long, force split
            if (sentence.length > maxSize) {
              for (let i = 0; i < sentence.length; i += maxSize - overlap) {
                chunks.push(sentence.slice(i, i + maxSize));
              }
              currentChunk = "";
            } else {
              currentChunk = sentence;
            }
          }
        }
      } else {
        currentChunk = paragraph;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  // Add overlap between chunks if needed
  if (overlap > 0 && chunks.length > 1) {
    const overlappedChunks: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      if (i === 0) {
        overlappedChunks.push(chunks[i]);
      } else {
        // Get last N characters from previous chunk
        const prevChunk = chunks[i - 1];
        const overlapText = prevChunk.slice(-overlap);
        overlappedChunks.push(overlapText + " " + chunks[i]);
      }
    }
    return overlappedChunks;
  }

  return chunks;
}

export interface ProcessedDocument {
  chunks: string[];
  embeddings: number[][];
}

/**
 * Process a document: chunk and embed
 */
export const processDocument = traceable(
  async function processDocument(content: string): Promise<ProcessedDocument> {
    const chunks = chunkText(content);
    const embeddings = await embedTexts(chunks);
    return { chunks, embeddings };
  },
  { name: "processDocument", run_type: "chain", tags: ["document", "ingestion"] }
);
