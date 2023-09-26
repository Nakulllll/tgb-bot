require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIO(
    server,
    {
        cors: {
            origin: '*',
        }
    }
);
const port = process.env.PORT || 3000;

// OpenAI API configuration
const API_ENDPOINT = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const conversationHistory = []; // Initialize conversation history

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('sendMessage', async (message) => {
        try {
            // Add the user message to the conversation history
            conversationHistory.push({ role: 'user', content: message });

            // Get chatbot response based on updated conversation history
            const response = await getChatbotResponse(conversationHistory);

            // Add the assistant's response to the conversation history
            conversationHistory.push({ role: 'assistant', content: response });

            socket.emit('message', response);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

async function getChatbotResponse(conversationHistonry) {
    try {

        const response = await axios.post(
            API_ENDPOINT,
            {
                prompt: conversationHistory.map((message) => `AI BEE: ${message.content}`).join('\n'),
                max_tokens: 1000, // Adjust to a high value as needed
                temperature: 0.8, // Adjust for desired randomness
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`,
                    'OpenAI-Organization': `org-5fLrV5Jif4du5TQsMj8qIEjG`
                },
            }
        );

        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        throw error;
    }
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
