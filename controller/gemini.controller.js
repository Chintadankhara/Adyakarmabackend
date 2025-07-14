import { GEMINI_API_KEY } from "../config/env.js";

export const aiInterviewQuestion = async (req, res) => {
  try {
    const { type, role, level, techstack, amount } = req.body;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Prepare questions for a job interview. The job role is ${role}. The job experience level is ${level}. The tech stack used in the job is: ${techstack}. The focus between behavioural and technical questions should lean towards: ${type}. The amount of questions required is: ${amount}. Please return only the questions, without any additional text. The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant. Return the questions formatted like this: ["Question 1", "Question 2", "Question 3"] Thank you! <3 `,
            },
          ],
        },
      ],
    };

    const apiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await apiResponse.json();
    res.status(200).json({
      status: true,
      message: "Questions generated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const aiPracticeQuestion = async (req, res) => {
  try {
    const { topic, level } = req.body;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Generate 10 aptitude test questions. The question type is ${topic}. The level is ${level}.
Each question should have four options (A, B, C, D), one correct answer, and an explanation.
Do not include any extra text or formatting—just return a JSON array in this format:

[
  {
    "question": "question text",
    "options": {
      "A": "option A",
      "B": "option B",
      "C": "option C",
      "D": "option D"
    },
    "correct": "correct option (A/B/C/D)",
    "explanation": "explanation text"
  }
]

Do not use special characters like '/' or '*' in the questions or answers.`,
            },
          ],
        },
      ],
    };

    const apiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await apiResponse.json();
    // Extract the text from Gemini's response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Remove code block formatting
    const jsonString = text.replace(/```json|```/g, '').trim();

    let questions = [];
    try {
      questions = JSON.parse(jsonString);
    } catch (e) {
      return res.status(500).json({
        status: false,
        message: "Failed to parse questions from Gemini response",
      });
    }

    // Return as { questions: [...] }
    res.status(200).json({ questions });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};