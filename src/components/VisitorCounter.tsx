import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VISITOR_BASE_COUNT = 147;
const REFRESH_INTERVAL_MS = 3000;

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState<number>(VISITOR_BASE_COUNT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer: number | undefined;

    const fetchLatestCount = async () => {
      const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL || '').trim();
      const apiKey = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

      if (supabaseUrl && apiKey) {
        try {
          const res = await fetch(`${supabaseUrl}/functions/v1/get-visitor-stats`, {
            method: 'GET',
            headers: {
              apikey: apiKey,
            },
          });

          if (res.ok) {
            const body = (await res.json()) as { count?: number };
            if (typeof body.count === 'number') {
              setVisitorCount(body.count);
              return;
            }
          }
        } catch {
          // Fall through to invoke fallback.
        }
      }

      const { data, error } = await supabase.functions.invoke('get-visitor-stats', {
        method: 'GET',
      });
      if (!error && typeof data?.count === 'number') {
        setVisitorCount(data.count);
      }
    };

    const trackAndFetch = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('track-visitor', {
          method: 'POST',
        });

        if (error) {
          await fetchLatestCount();
          setIsLoading(false);
          return;
        }

        if (typeof data?.count === 'number') {
          setVisitorCount(data.count);
        } else {
          await fetchLatestCount();
        }
        setIsLoading(false);
      } catch {
        await fetchLatestCount();
        setIsLoading(false);
      }
    };

    trackAndFetch();

    // Keep UI updated when new unique visitors arrive.
    timer = window.setInterval(() => {
      void fetchLatestCount();
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="px-4 py-2 rounded-full bg-card/90 backdrop-blur-lg border border-primary/30 shadow-lg flex items-center gap-2">
        <Eye className="w-4 h-4 text-primary" />
        <p className="font-orbitron text-base font-bold text-primary leading-none">
          {isLoading ? <span className="animate-pulse">...</span> : visitorCount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default VisitorCounter;
