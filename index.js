require('dotenv').config();
const axios = require('axios');

const API_ENDPOINT = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function getChatbotResponse(conversationHistory) {
    try {
        const response = await axios.post(
            API_ENDPOINT,
            {
                prompt: conversationHistory,
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

async function main() {
    let conversationHistory = '';

    // Initial greeting and preloaded context
    const initialPrompt = `
        Welcome to the Business Growth Consultation Chatbot! I'm here to provide you with valuable advice on growing your business. Let's get started by discussing your business and its goals.
    `;

    conversationHistory += initialPrompt;

    try {
        while (true) {
            // Get user input from the terminal
            const userInput = await getUserInput();
            conversationHistory += `\nUser: ${userInput}`;

            // Get chatbot response based on updated conversation history
            const response = await getChatbotResponse(conversationHistory);
            console.log('Chatbot response:', response);

            // Append chatbot response to the conversation history
            conversationHistory += `\nAssistant: ${response}`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getUserInput() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => {
        readline.question('User: ', userInput => {
            readline.close();
            resolve(userInput);
        });
    });
}

main();
