import {
    ActionExample,
    Content,
    generateText,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    type Action,
} from "@elizaos/core";

export const perplexityAction: Action = {
    name: "PERPLEXITY_ANALYSIS",
    similes: ["ANALYZE", "RESEARCH", "SUMMARIZE"],
    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        const apiKey = process.env.PERPLEXITY_API_KEY;
        if (!apiKey) {
            throw new Error('PERPLEXITY_API_KEY environment variable is not set');
        }
        return true;
    },
    description: "Perform real-time analysis and research using Perplexity AI",
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown; },
        _callback: HandlerCallback,
    ): Promise<{ text: string }> => {
        async function getPerplexityAnalysis(query: string) {
            try {
                const response = await fetch(
                    'https://api.perplexity.ai/chat/completions',
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: "sonar-pro",
                            messages: [
                                {
                                    role: "system",
                                    content: "Be precise and provide sources"
                                },
                                {
                                    role: "user",
                                    content: query
                                }
                            ]
                        })
                    }
                );

                const data = await response.json();
                
                if (!response.ok) {
                    if(response.status === 429) {
                        throw new Error('Perplexity API rate limit exceeded');
                    }
                    throw new Error(`API error: ${data.message || response.status}`);
                }

                const content = data.choices[0].message.content;
                const citations = data.citations || [];

                // Format response with sources
                let formattedResponse = content;
                if (citations.length > 0) {
                    formattedResponse += "\n\nSources:\n" + 
                        citations.map((source: string, index: number) => 
                            `${index + 1}. ${source}`).join('\n');
                }

                return formattedResponse;

            } catch (error) {
                console.error('Perplexity API error:', error);
                return error.message.includes('rate limit') 
                    ? 'Please try again later, API rate limit reached'
                    : 'Sorry, there was an error processing your research request.';
            }
        }

        const context = `What specific analysis or research question does the user want to investigate? Extract ONLY the search query from this message: "${_message.content.text}". Return just the query with no additional text.`

        const searchQuery = await generateText({
            runtime: _runtime,
            context,
            modelClass: ModelClass.SMALL,
            stop: ["\n"],
        });

        console.log("Analysis query extracted:", searchQuery);

        if (!_message.content?.text) {
            return { text: "Whaddya want me to analyze? I ain't psychic!" };
        }

        const analysisResult = await getPerplexityAnalysis(_message.content.text);
        const responseText = `🔍 Analysis Results:\n\n${analysisResult}`;

        const newMemory: Memory = {
            userId: _message.agentId,
            agentId: _message.agentId,
            roomId: _message.roomId,
            content: {
                text: responseText,
                action: "PERPLEXITY_ANALYSIS_RESPONSE",
                source: _message.content?.source,
            } as Content,
        };

        await _runtime.messageManager.createMemory(newMemory);
        _callback(newMemory.content);
        return { text: responseText };
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { 
                    text: "Analyze the latest developments in <topic>",
                    source: "twitter"
                },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "", 
                    action: "PERPLEXITY_ANALYSIS",
                    source: "twitter"
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Research the current trends in <industry>" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "PERPLEXITY_ANALYSIS" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Summarize the key points about <event>" },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "PERPLEXITY_ANALYSIS" },
            },
        ],
    ] as ActionExample[][],
} as Action; 