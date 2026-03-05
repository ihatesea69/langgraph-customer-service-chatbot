import { MilvusClient } from "@zilliz/milvus2-sdk-node";

const COLLECTION_NAME = process.env.ZILLIZ_COLLECTION_NAME || "bonedoc_knowledge";
const VECTOR_DIM = 1536; // OpenAI text-embedding-3-small dimension

let milvusClient: MilvusClient | null = null;

/**
 * Get or create Milvus client connection
 */
export function getMilvusClient(): MilvusClient {
  if (milvusClient) return milvusClient;

  const endpoint = process.env.ZILLIZ_ENDPOINT;
  const token = process.env.ZILLIZ_API_KEY;

  if (!endpoint || !token) {
    throw new Error("ZILLIZ_ENDPOINT and ZILLIZ_API_KEY must be set");
  }

  milvusClient = new MilvusClient({
    address: endpoint,
    token: token,
  });

  return milvusClient;
}

/**
 * Initialize collection if it doesn't exist
 */
export async function initializeCollection(): Promise<void> {
  const client = getMilvusClient();

  // Check if collection exists
  const hasCollection = await client.hasCollection({
    collection_name: COLLECTION_NAME,
  });

  if (hasCollection.value) {
    console.log(`Collection ${COLLECTION_NAME} already exists`);
    return;
  }

  // Create collection with schema
  await client.createCollection({
    collection_name: COLLECTION_NAME,
    fields: [
      {
        name: "id",
        data_type: "VarChar",
        is_primary_key: true,
        max_length: 64,
      },
      {
        name: "content",
        data_type: "VarChar",
        max_length: 65535,
      },
      {
        name: "embedding",
        data_type: "FloatVector",
        dim: VECTOR_DIM,
      },
      {
        name: "source",
        data_type: "VarChar",
        max_length: 512,
      },
      {
        name: "chunk_index",
        data_type: "Int32",
      },
      {
        name: "created_at",
        data_type: "Int64",
      },
    ],
  });

  // Create index for vector field
  await client.createIndex({
    collection_name: COLLECTION_NAME,
    field_name: "embedding",
    index_type: "AUTOINDEX",
    metric_type: "COSINE",
  });

  // Load collection into memory
  await client.loadCollection({
    collection_name: COLLECTION_NAME,
  });

  console.log(`Collection ${COLLECTION_NAME} created and loaded`);
}

export interface DocumentChunk {
  id: string;
  content: string;
  embedding: number[];
  source: string;
  chunk_index: number;
  created_at: number;
}

/**
 * Insert document chunks into collection
 */
export async function insertDocuments(chunks: DocumentChunk[]): Promise<void> {
  const client = getMilvusClient();

  await client.insert({
    collection_name: COLLECTION_NAME,
    data: chunks.map((chunk) => ({
      id: chunk.id,
      content: chunk.content,
      embedding: chunk.embedding,
      source: chunk.source,
      chunk_index: chunk.chunk_index,
      created_at: chunk.created_at,
    })),
  });
}

export interface SearchResult {
  id: string;
  content: string;
  source: string;
  score: number;
}

/**
 * Search for similar documents
 */
export async function searchDocuments(
  queryEmbedding: number[],
  topK: number = 5,
  scoreThreshold: number = 0.5
): Promise<SearchResult[]> {
  const client = getMilvusClient();

  const results = await client.search({
    collection_name: COLLECTION_NAME,
    data: [queryEmbedding],
    limit: topK,
    output_fields: ["id", "content", "source"],
  });

  if (!results.results || results.results.length === 0) {
    return [];
  }

  return results.results
    .filter((r) => r.score >= scoreThreshold)
    .map((r) => ({
      id: r.id as string,
      content: r.content as string,
      source: r.source as string,
      score: r.score,
    }));
}

/**
 * Delete documents by source (filename)
 */
export async function deleteDocumentsBySource(source: string): Promise<number> {
  const client = getMilvusClient();

  const result = await client.delete({
    collection_name: COLLECTION_NAME,
    filter: `source == "${source}"`,
  });

  return Number(result.delete_cnt) || 0;
}

/**
 * Get all unique sources (documents)
 */
export async function listSources(): Promise<string[]> {
  const client = getMilvusClient();

  const results = await client.query({
    collection_name: COLLECTION_NAME,
    output_fields: ["source"],
    limit: 1000,
  });

  if (!results.data) {
    return [];
  }

  const sources = new Set<string>();
  results.data.forEach((row) => {
    if (row.source) {
      sources.add(row.source as string);
    }
  });

  return Array.from(sources);
}

/**
 * Get collection statistics
 */
export async function getCollectionStats(): Promise<{ count: number }> {
  const client = getMilvusClient();

  const stats = await client.getCollectionStatistics({
    collection_name: COLLECTION_NAME,
  });

  return {
    count: parseInt(stats.data?.row_count || "0", 10),
  };
}
