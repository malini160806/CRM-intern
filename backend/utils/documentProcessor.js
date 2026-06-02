const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts text from PDF, DOCX, or TXT file
 */
const extractText = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } 
    
    if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } 
    
    if (mimetype === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8');
    }

    throw new Error('Unsupported file type');
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
};

/**
 * Chunks a large string of text into smaller pieces
 * @param {string} text 
 * @param {number} maxTokens Approximate max tokens (1 token ~ 4 chars)
 * @param {number} overlap Characters to overlap between chunks
 * @returns {string[]} Array of text chunks
 */
const chunkText = (text, maxTokens = 500, overlap = 200) => {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return [text];

  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + maxChars;
    
    // Don't cut a word in half if possible
    if (endIndex < text.length) {
      const lastSpaceIndex = text.lastIndexOf(' ', endIndex);
      if (lastSpaceIndex > startIndex) {
        endIndex = lastSpaceIndex;
      }
    }

    chunks.push(text.slice(startIndex, endIndex).trim());
    startIndex = endIndex - overlap;
  }

  return chunks;
};

module.exports = {
  extractText,
  chunkText
};
