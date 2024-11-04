const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
const fileManager = new GoogleAIFileManager(apiKey);

async function callGemini(promptContent, systemContent, previousChat) {
    try {
      const messages = [];

      // https://stackoverflow.com/questions/78909501/gemini-api-error-400-invalid-or-unsupported-file-uri
      const listFilesResponse = await fileManager.listFiles();
      for (const file of listFilesResponse.files) {
        console.log(`name: ${file.uri} | display name: ${file.displayName}`);
      }

      const uploadResult = await fileManager.uploadFile(
        `files/Parafin Overview.pdf`,
        {
          mimeType: "application/pdf",
          displayName: "Test content",
        },
      );
  
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              { 
                // https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#request
                fileData: {
                  fileUri: uploadResult.file.uri,
                  mimeType: uploadResult.file.mimeType,
                } 
              }, 
              { 
                text: "You are NNRoad company customer service bot. \
                  NNRoad is a leading international Employer of Record (EOR) service provider. \
                  With our diverse remote workforce, we offer a technology-driven EOR platform that \
                  enables companies to hire talented individuals from anywhere in the world, \
                  without the hassle of setting up a local entity." 
              },
              { 
                text: "Do not answer customer questions that are not related to NNRoad or Parafin." 
              }
            ],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. How can I help you today?" }],
          },
        ],
      });

    //   const userPrompt = {
    //     role: "user",
    //     content: promptContent,
    //   };
    //   const systemPrompt = {
    //     role: "system",
    //     content: systemContent,
    //   };
    //   const assistantPrompt = {
    //     role: "assistant",
    //     content: previousChat,
    //   };
  
    //   messages.push(userPrompt);
    //   messages.push(systemPrompt);
    //   messages.push(assistantPrompt);
  
    //   const response = await model.generateContent(messages);

      let response = await chat.sendMessage(promptContent)
  
      console.log(2);
      console.log(response.response.text());
      return response.response.text();
    } catch (error) {
      console.error("Error:", error);
      return `An error occurred while processing the request: ${error}`;
    }
  }
  
  module.exports = { callGemini };
