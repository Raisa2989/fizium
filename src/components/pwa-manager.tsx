'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

// Префикс задаётся только при публикации в подпапку (GitHub Pages);
// для корня домена (reg.ru, свой домен) — пустая строка.
const BASE_PATH = (process.env as Record<string, string | undefined>).NEXT_PUBLIC_BASE_PATH ?? '';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/** Регистрация Service Worker + кнопка установки PWA */
export function PwaManager() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker
          .register(`${BASE_PATH}/sw.js`)
          .catch(() => undefined /* тихо игнорируем в dev-среде */);
      };
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      // баннер показываем не сразу — через 6 секунд
      setTimeout(() => setShowBanner(true), 6000);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    const installed = () => {
      setShowBanner(false);
      setInstallEvent(null);
      toast({ title: 'ФизиУм установлен', description: 'Приложение доступно офлайн' });
    };
    window.addEventListener('appinstalled', installed);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const install = useCallback(async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setShowBanner(false);
    setInstallEvent(null);
  }, [installEvent]);

  return (
    <AnimatePresence>
      {showBanner && installEvent && (
        <motion.div
          initial={{ y: 16, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 16, opacity: 0, scale: 0.98 }}
          className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-md rounded-2xl border bg-card p-4 shadow-xl md:bottom-6 safe-bottom"
          role="dialog"
          aria-label="Установка приложения"
        >
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="pr-6 text-sm font-semibold">Установить ФизиУм?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Приложение будет работать офлайн — теория и тренажёр всегда под рукой.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={install} className="gap-1.5">
              <Download className="h-4 w-4" /> Установить
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowBanner(false)}>
              Позже
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
