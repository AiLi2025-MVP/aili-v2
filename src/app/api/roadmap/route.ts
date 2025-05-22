// src/app/api/roadmap/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const profile = await req.json();

  const prompt = `You are AiLi, the startup ally. Based on the following user profile, generate a personalized 4-step roadmap to help them build momentum and prepare for investor readiness:\n
Persona: ${profile.profileDNA?.persona}\n
Creator Style: ${profile.profileDNA?.creatorStyle}\n
Goal: ${profile.preferences?.goal}\n
Learning Style: ${profile.preferences?.learningStyle}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  const reply = response.choices[0]?.message?.content;
  return NextResponse.json({ reply });
}
