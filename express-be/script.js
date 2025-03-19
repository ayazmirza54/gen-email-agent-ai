const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

class GeminiInterface {
  constructor(apiKey, modelName = "gemini-2.0-flash-lite") {
    // Initialize Google Generative AI
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;

    // Generation configuration
    this.generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };
  }

  async getModel() {
    return this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: this.generationConfig,
    });
  }

  async generateEmail(promptData) {
    const model = await this.getModel();

    const promptTemplate = `Compose an email with the following characteristics:

    *   **Purpose:** ${promptData.purpose}
    *   **Recipient:** ${promptData.recipient_info}
    *   **Sender:** ${promptData.sender_name}
    *   **Tone:** ${promptData.tone}
    *   **Subject:** ${promptData.subject}
    *   **Key Points/Content:**
        ${promptData.key_points}
    *   **Optional Considerations (when applicable):**
        *   **Context:** ${promptData.context}
        *   **Actions Required:** ${promptData.actions}
        *   **Attachments:** ${promptData.attachments}
        *   **Desired Length:** ${promptData.length}

    Write the email including this information, with an appropriate greeting and closing, considering the desired tone.`;

    try {
      const result = await model.generateContent(promptTemplate);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating email:", error);
      return null;
    }
  }

  async paraphraseText(text, tone = "neutral") {
    const model = await this.getModel();

    const prompt = `Paraphrase the following text with a '${tone}' tone and return it in Markdown format:

${text}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error paraphrasing text:", error);
      return null;
    }
  }

  async summarizeEmail(emailContent) {
    const model = await this.getModel();

    const prompt = `Summarize the following email content concisely, extracting:
    - The main purpose/request
    - Any key deadlines or time-sensitive information
    - Important details or context
    - Any specific questions that need answers
    
    Format the summary as bullet points.
    
    Email content:
    ${emailContent}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error summarizing email:", error);
      return null;
    }
  }

  async generateReply(
    emailContent,
    summary,
    userTone = "professional",
    userName = "",
    additionalContext = ""
  ) {
    const model = await this.getModel();

    const prompt = `Generate a personalized reply to the following email.

    Original email:
    ${emailContent}
    
    Email summary:
    ${summary}
    
    Reply characteristics:
    - Tone: ${userTone}
    - Sender name: ${userName}
    - Additional context or information to include: ${additionalContext}
    
    Create a thoughtful reply that addresses the key points from the original email.
    Include an appropriate greeting and signature.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating reply:", error);
      return null;
    }
  }
}

// Initialize Gemini Interface
const geminiInterface = new GeminiInterface(process.env.GEMINI_API_KEY);

// API Status Route
app.get("/api/status", (req, res) => {
  res.json({ status: "API is running" });
});

// Email Generator Route
app.post("/api/generate-email", async (req, res) => {
  const promptData = req.body;

  // Validate required fields
  const requiredFields = [
    "purpose",
    "recipient_info",
    "sender_name",
    "tone",
    "subject",
    "key_points",
  ];
  const missingFields = requiredFields.filter((field) => !promptData[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missingFields,
    });
  }

  try {
    const emailContent = await geminiInterface.generateEmail(promptData);

    if (emailContent) {
      res.json({ success: true, emailContent });
    } else {
      res.status(500).json({
        success: false,
        error: "Email generation failed",
      });
    }
  } catch (error) {
    console.error("Error in email generation:", error);
    res.status(500).json({
      success: false,
      error: "Server error during email generation",
    });
  }
});

// Paraphrase Text Route
app.post("/api/paraphrase", async (req, res) => {
  const { text, tone } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "Text to paraphrase is required",
    });
  }

  try {
    const paraphrasedContent = await geminiInterface.paraphraseText(
      text,
      tone || "neutral"
    );

    if (paraphrasedContent) {
      res.json({ success: true, paraphrasedContent });
    } else {
      res.status(500).json({
        success: false,
        error: "Paraphrasing failed",
      });
    }
  } catch (error) {
    console.error("Error in paraphrasing:", error);
    res.status(500).json({
      success: false,
      error: "Server error during paraphrasing",
    });
  }
});

// Email Analysis and Reply Generation Route
app.post("/api/analyze-and-reply", async (req, res) => {
  const { original_email, tone, user_name, additional_context } = req.body;

  if (!original_email) {
    return res.status(400).json({
      error: "Original email content is required",
    });
  }

  try {
    // Step 1: Summarize the email
    const summary = await geminiInterface.summarizeEmail(original_email);

    // Step 2: Generate reply based on summary
    const reply = await geminiInterface.generateReply(
      original_email,
      summary,
      tone || "professional",
      user_name || "",
      additional_context || ""
    );

    if (summary && reply) {
      res.json({
        success: true,
        summary,
        reply,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Email analysis or reply generation failed",
      });
    }
  } catch (error) {
    console.error("Error in email analysis:", error);
    res.status(500).json({
      success: false,
      error: "Server error during email analysis",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Email API server running on port ${PORT}`);
});

module.exports = app; // For testing purposes
