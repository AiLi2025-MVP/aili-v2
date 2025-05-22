// src/app/api/chat/route.ts

import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
  });

  const reply = completion.choices[0]?.message?.content;

  return NextResponse.json({ reply });
}
