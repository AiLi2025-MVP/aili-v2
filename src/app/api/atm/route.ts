// src/app/api/atm/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { prompt, tone, profile } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });

    const systemPrompt = `
You are AiLi, a culturally fluent creative intelligence trained in storytelling, branding, and remix culture.
Speak in the tone of "${tone}".
The user is a "${profile?.creator_style}" who learns through "${profile?.learning_style}".
Remix: "${prompt}"
`;

    // 🔁 Stream response manually
    const chatStream = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of chatStream) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    // Log it to Supabase (non-blocking)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      supabase.from('chat_logs').insert({
        user_id: user.id,
        prompt,
        tone,
        asset_id: null,
      });
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (err: any) {
    console.error('🔥 ATM error:', err);
    return NextResponse.json({ error: 'Something went wrong', details: err.message }, { status: 500 });
  }
}
