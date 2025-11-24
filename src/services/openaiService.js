import OpenAI from "openai";
import { agentConfig } from "../config/agent-config.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function openaiService(messages, sessionId) {
  const fullMessages = [
    { role: "system", content: agentConfig.systemPrompt },
    ...messages,
  ];

  const completion = await openai.chat.completions.create({
    model: agentConfig.model,
    messages: fullMessages,
    temperature: agentConfig.temperature,
    max_tokens: agentConfig.maxTokens,
  });

  return {
    success: true,
    message: completion.choices[0].message.content,
    usage: completion.usage,
    sessionId: sessionId ?? Date.now().toString(),
  };
}
