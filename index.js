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
                max_tokens: 300, // Adjust as needed
                temperature: 0.7, // Adjust for desired randomness
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

    // Initial prompt
    const initialPrompt = `
        You are a helpful assistant that provides business growth advice. Please provide some basic details about your business to get started.
        It must do market research, competitors, industry analysis, and growth strategies.
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
