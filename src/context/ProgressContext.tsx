//src/context/ProgressContext.tsx

'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ProgressContext = createContext<any>(null);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<Record<string, string[]>>({});

  const refreshProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_progress')
      .select('module_id, lesson_id')
      .eq('user_id', user.id);

    const mapped: Record<string, string[]> = {};
    data?.forEach((entry) => {
      if (!mapped[entry.module_id]) mapped[entry.module_id] = [];
      mapped[entry.module_id].push(entry.lesson_id);
    });

    setProgress(mapped);
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  return (
    <ProgressContext.Provider value={{ progressMap: progress, refreshProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
