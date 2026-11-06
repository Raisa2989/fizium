'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { HomeView } from '@/components/views/home-view';
import { StageView } from '@/components/views/stage-view';
import { TopicView } from '@/components/views/topic-view';
import { ProgressView } from '@/components/views/progress-view';
import { ReferenceView } from '@/components/views/reference-view';
import { FormulasView } from '@/components/views/formulas-view';
import { HelpView } from '@/components/views/help-view';
import { SearchDialog } from '@/components/search-dialog';
import { PwaManager } from '@/components/pwa-manager';
import { LogoMark } from '@/components/logo-mark';
import { cn } from '@/lib/utils';
import { stageTheme } from '@/lib/stage-theme';
import { useTheme } from 'next-themes';
import {
  Home,
  Layers,
  Sigma,
  Trophy,
  Atom,
  Orbit,
  CircleHelp,
  ExternalLink,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

export function AppShell() {
  const view = useAppStore((s) => s.view);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-5 sm:px-6 sm:py-8">
        {view.name === 'home' && <HomeView />}
        {view.name === 'stage' && <StageView stage={view.stage} />}
        {view.name === 'topic' && <TopicView topicId={view.topicId} />}
        {view.name === 'progress' && <ProgressView />}
        {view.name === 'reference' && <ReferenceView />}
        {view.name === 'formulas' && <FormulasView />}
        {view.name === 'help' && <HelpView />}
      </main>
      <Footer />
      <BottomNav />
      <SearchDialog />
      <PwaManager />
    </div>
  );
}

// ─── Шапка ────────────────────────────────────────────────────────────────

function Header() {
  const view = useAppStore((s) => s.view);
  const navigate = useAppStore((s) => s.navigate);
  const setStage = useAppStore((s) => s.setStage);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const items: {
    key: string;
    label: string;
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    stage?: 'main' | 'senior';
  }[] = [
    { key: 'main', label: '7–9 классы', stage: 'main', active: view.name === 'stage' && view.stage === 'main', onClick: () => setStage('main'), icon: <Atom className="h-4 w-4" /> },
    { key: 'senior', label: '10–11 классы', stage: 'senior', active: view.name === 'stage' && view.stage === 'senior', onClick: () => setStage('senior'), icon: <Orbit className="h-4 w-4" /> },
    { key: 'reference', label: 'Справочник', active: view.name === 'reference', onClick: () => navigate('reference'), icon: <Layers className="h-4 w-4" /> },
    { key: 'formulas', label: 'Формулы', active: view.name === 'formulas', onClick: () => navigate('formulas'), icon: <Sigma className="h-4 w-4" /> },
    { key: 'progress', label: 'Прогресс', active: view.name === 'progress', onClick: () => navigate('progress'), icon: <Trophy className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md safe-top">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-3 sm:h-16 sm:px-6">
        <button onClick={() => navigate('home')} className="flex items-center gap-2.5" aria-label="ФизиУм — на главную">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <LogoMark className="h-6 w-6" />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight sm:block">
            Физи<span className="text-primary">Ум</span>
          </span>
        </button>

        <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                item.active
                  ? item.stage
                    ? stageTheme(item.stage).navActive
                    : 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => navigate('help')}
            className={cn(
              'rounded-lg border bg-card p-2.5 transition-colors',
              view.name === 'help'
                ? 'border-primary/40 text-primary'
                : 'text-muted-foreground hover:border-primary/30 hover:text-foreground'
            )}
            aria-label="Справка — как устроено приложение"
            title="Справка — как устроено приложение"
          >
            <CircleHelp className="h-4 w-4" />
          </button>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg border bg-card p-2.5 text-muted-foreground transition hover:text-foreground"
              aria-label="Переключить тему"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <MobileMenu items={items} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  items,
}: {
  items: { key: string; label: string; active: boolean; onClick: () => void; icon: React.ReactNode; stage?: 'main' | 'senior' }[];
}) {
  const view = useAppStore((s) => s.view);
  const navigate = useAppStore((s) => s.navigate);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-lg border bg-card p-2.5 text-muted-foreground md:hidden" aria-label="Меню">
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle className="flex items-center gap-2 border-b pb-3 text-left">
          <LogoMark className="h-6 w-6" />
          ФизиУм
        </SheetTitle>
        <nav className="mt-4 flex flex-col gap-1" aria-label="Мобильная навигация">
          <SheetItem icon={<Home className="h-4 w-4" />} label="Главная" onClick={() => navigate('home')} />
          {items.map((item) => (
            <SheetItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={item.onClick}
              stage={item.stage}
            />
          ))}
          <SheetItem
            icon={<CircleHelp className="h-4 w-4" />}
            label="Справка"
            active={view.name === 'help'}
            onClick={() => navigate('help')}
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function SheetItem({
  icon,
  label,
  active,
  onClick,
  stage,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  stage?: 'main' | 'senior';
}) {
  const t = stage ? stageTheme(stage) : null;
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
        active
          ? t
            ? cn(t.bgSoft, t.textStrong)
            : 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {t ? (
        <span
          className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', active ? cn(t.bgSoft, t.textStrong) : t.iconBg)}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : (
        icon
      )}
      {label}
      {t && <span className={cn('ml-auto h-2 w-2 shrink-0 rounded-full', t.dot)} aria-hidden="true" />}
    </button>
  );
}

// ─── Нижняя навигация (мобильные) ─────────────────────────────────────────

function BottomNav() {
  const view = useAppStore((s) => s.view);
  const setStage = useAppStore((s) => s.setStage);
  const navigate = useAppStore((s) => s.navigate);
  const stage = useAppStore((s) => s.stage);
  const stageT = stageTheme(stage);

  const items = [
    { key: 'home', label: 'Главная', active: view.name === 'home', onClick: () => navigate('home'), icon: <Home className="h-5 w-5" /> },
    {
      key: 'program',
      label: 'Программа',
      active: view.name === 'stage' || view.name === 'topic',
      onClick: () => setStage(stage),
      icon: stage === 'senior' ? <Orbit className="h-5 w-5" /> : <Atom className="h-5 w-5" />,
    },
    { key: 'reference', label: 'Справка', active: view.name === 'reference' || view.name === 'formulas', onClick: () => navigate('reference'), icon: <Layers className="h-5 w-5" /> },
    { key: 'progress', label: 'Прогресс', active: view.name === 'progress', onClick: () => navigate('progress'), icon: <Trophy className="h-5 w-5" /> },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-md md:hidden safe-bottom"
      aria-label="Нижняя навигация"
    >
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={item.onClick}
            className={cn(
              'relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors',
              item.active ? (item.key === 'program' ? stageT.textStrong : 'text-primary') : 'text-muted-foreground'
            )}
          >
            {item.icon}
            {item.label}
            {item.key === 'program' && item.active && (
              <span className={cn('absolute bottom-0.5 h-1 w-8 rounded-full', stageT.bar)} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Футер ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8" />
            <div>
              <div className="text-sm font-extrabold">
                Физи<span className="text-primary">Ум</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Учебник-тренажёр школьного курса физики · 7–11 классы
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:text-right">
            <p>
              Содержание соответствует федеральным рабочим программам по физике
              (базовый и углублённый уровни, ФГОС ООО/СОО)
            </p>
            <p className="sm:text-right">Устанавливается как приложение · работает офлайн</p>
          </div>
        </div>

        {/* строка разработчика */}
        <div className="mt-5 flex flex-col gap-2.5 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-muted-foreground/80">
            © {new Date().getFullYear()} ФизиУм · учебный проект
          </p>
          <a
            href="https://ds-analytics.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 self-start text-[11px] text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
            aria-label="Разработчик — DSA, Data Source Analytics (opens in new tab)"
          >
            <span>Разработка —</span>
            <span className="font-extrabold tracking-wide text-foreground/85 transition-colors group-hover:text-primary">
              DSA
            </span>
            <span className="opacity-70">· Data Source Analytics</span>
            <ExternalLink className="h-3 w-3 opacity-40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── utils ────────────────────────────────────────────────────────────────

import { useSyncExternalStore } from 'react';
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
