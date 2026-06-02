require('dotenv').config();
const { Pinecone } = require('@pinecone-database/pinecone');

const testPinecone = async () => {
  try {
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const indexName = process.env.PINECONE_INDEX || 'crm-rag-index';
    const index = pinecone.index(indexName);

    console.log('Index:', indexName);

    const vectors = []; // Empty array to reproduce the error
    
    try {
      await index.upsert(vectors);
    } catch (e) {
      console.error('Error with empty array:', e.message);
    }

    const vectors2 = [{
      id: 'test-1',
      values: new Array(384).fill(0.1),
      metadata: { text: 'Test string' }
    }];

    console.log('Upserting valid vector...');
    await index.upsert(vectors2);
    console.log('Success!');

  } catch (error) {
    console.error('Test error:', error);
  }
};

testPinecone();
