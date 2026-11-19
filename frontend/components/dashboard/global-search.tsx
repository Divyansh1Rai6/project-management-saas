'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FolderKanban, CheckSquare, Layers, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allProjects, allTasks, workspaces } from '@/lib/mock-data';

type ResultKind = 'project' | 'task' | 'workspace';

type SearchResult = {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle: string;
  href: string;
};

const kindMeta: Record<ResultKind, { icon: typeof FolderKanban; label: string; color: string }> = {
  project: { icon: FolderKanban, label: 'Project', color: 'bg-indigo-50 text-indigo-600' },
  task: { icon: CheckSquare, label: 'Task', color: 'bg-emerald-50 text-emerald-600' },
  workspace: { icon: Layers, label: 'Workspace', color: 'bg-amber-50 text-amber-600' },
};

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches: SearchResult[] = [];

    for (const p of allProjects) {
      if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        matches.push({
          id: p.id,
          kind: 'project',
          title: p.name,
          subtitle: p.workspace,
          href: `/projects/${p.id}`,
        });
      }
    }
    for (const t of allTasks) {
      if (t.title.toLowerCase().includes(q) || t.project.toLowerCase().includes(q)) {
        matches.push({
          id: t.id,
          kind: 'task',
          title: t.title,
          subtitle: t.project,
          href: `/tasks/${t.id}`,
        });
      }
    }
    for (const w of workspaces) {
      if (w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)) {
        matches.push({
          id: w.id,
          kind: 'workspace',
          title: w.name,
          subtitle: w.description,
          href: `/workspaces/${w.id}`,
        });
      }
    }
    return matches.slice(0, 8);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigate(results[activeIndex].href);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const grouped = useMemo(() => {
    const groups: Record<ResultKind, SearchResult[]> = { project: [], task: [], workspace: [] };
    for (const r of results) groups[r.kind].push(r);
    return groups;
  }, [results]);

  let runningIndex = -1;

  return (
    <div ref={containerRef} className="relative hidden flex-1 sm:block sm:max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setActiveIndex(0);
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search projects, tasks, workspaces..."
        className="h-9 w-full rounded-lg border border-input bg-muted/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
      />

      {open && query.trim() && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
          style={{ animation: 'scale-in 0.15s ease-out' }}
        >
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="mx-auto h-6 w-6 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-medium text-foreground">No results found</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Try searching for a project, task, or workspace
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto">
                {(Object.keys(grouped) as ResultKind[]).map((kind) => {
                  const group = grouped[kind];
                  if (group.length === 0) return null;
                  const meta = kindMeta[kind];
                  const Icon = meta.icon;
                  return (
                    <div key={kind}>
                      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-1.5">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {meta.label}s
                        </span>
                      </div>
                      {group.map((r) => {
                        runningIndex += 1;
                        const idx = runningIndex;
                        const ItemIcon = kindMeta[r.kind].icon;
                        return (
                          <button
                            key={`${r.kind}-${r.id}`}
                            onClick={() => navigate(r.href)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={cn(
                              'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                              activeIndex === idx ? 'bg-primary/10' : 'hover:bg-muted/50',
                            )}
                          >
                            <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', kindMeta[r.kind].color)}>
                              <ItemIcon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                              <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>
                            </div>
                            {activeIndex === idx && (
                              <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-2">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans text-[10px]">↑↓</kbd>
                  navigate
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans text-[10px]">↵</kbd>
                  select
                </span>
                <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
