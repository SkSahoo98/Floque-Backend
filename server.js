const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Groq = require('groq-sdk');

const app = express();
const port = process.env.PORT

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Function to interact with Groq LLM
async function getGroqChatCompletion(query) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: query,  // Use the query dynamically
                },
            ],
            model: "llama3-8b-8192",
        });
        return chatCompletion.choices[0]?.message?.content || 'No response';
    } catch (error) {
        console.error('Error from Groq API:', error);
        return 'Error in LLM response';
    }
}

// Route to handle user queries
app.post('/api/ask', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const response = await getGroqChatCompletion(query);
        res.json({ answer: response });
    } catch (error) {
        res.status(500).json({ error: 'Error generating response' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
