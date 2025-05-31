//src/app/quiz/[id]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      const { data } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setQuiz(data);
      setLoading(false);
    };

    loadQuiz();
  }, [id]);

  const handleChange = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const score = quiz?.questions.reduce((acc: number, q: any) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    await supabase.from('quiz_results').insert({
      user_id: user.id,
      quiz_id: id,
      score,
    });

    setSubmitted(true);
  };

  if (loading) return <p className="p-6 text-white">Loading quiz...</p>;
  if (!quiz) return <p className="p-6 text-red-500">Quiz not found.</p>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">{quiz.title}</h1>
      <p className="text-white/60">{quiz.description}</p>

      {quiz.questions?.map((q: any, idx: number) => (
        <div key={q.id} className="space-y-2">
          <p className="font-semibold">{idx + 1}. {q.text}</p>
          {q.options.map((opt: string) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleChange(q.id, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2 rounded-full font-medium"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="text-green-400 font-semibold">✅ Quiz submitted! Thank you.</p>
      )}
    </main>
  );
}

