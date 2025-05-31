// src/app/api/transcribe/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { assetId, userId } = await req.json();

  if (!assetId) {
    return NextResponse.json({ error: 'Missing assetId' }, { status: 400 });
  }

  // ⏬ Download the file from Supabase Storage
  const { data: fileData, error: downloadError } = await supabaseAdmin
    .storage
    .from('recordings')
    .download(assetId);

  if (downloadError || !fileData) {
    return NextResponse.json({ error: 'Download failed', details: downloadError?.message }, { status: 400 });
  }

  // 🧱 Convert fileData to Blob → File
  const buffer = await fileData.arrayBuffer();
  const blob = new Blob([buffer], { type: 'audio/webm' });
  const file = new File([blob], 'audio.webm', { type: 'audio/webm' });

  // 🧠 Transcribe with Whisper
  const form = new FormData();
  form.append('file', file);
  form.append('model', 'whisper-1');

  const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: form,
  });

  if (!whisperRes.ok) {
    const errText = await whisperRes.text();
    console.error('❌ Whisper API failed:', errText);
    return NextResponse.json({ error: 'Whisper failed', details: errText }, { status: 500 });
  }

  const result = await whisperRes.json();
  const transcript = result.text || '—';

  // 🧾 Update the existing row with the new transcript
  if (userId) {
    const { error: updateError } = await supabaseAdmin
      .from('recordings')
      .update({ transcript })
      .eq('user_id', userId)
      .eq('path', assetId);

    if (updateError) {
      console.error('❌ Failed to update recording:', updateError.message);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
  } else {
    console.warn('⚠️ No userId provided — skipping DB update');
  }

  return NextResponse.json({ text: transcript });
}
