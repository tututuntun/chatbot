const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

async function callGemini(promptContent, systemContent, previousChat) {
    try {
      const messages = [];
  
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
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
