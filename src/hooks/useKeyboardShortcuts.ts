import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        if (event.key === 'Escape') {
          (event.target as HTMLElement).blur();
        }
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      action: () => {
        if (location.pathname.startsWith('/app/applications')) {
          navigate('/app/applications/new');
        }
      },
      description: 'New application',
    },
    {
      key: '/',
      action: () => {
        if (location.pathname.startsWith('/app/applications')) {
          const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }
      },
      description: 'Focus search',
    },
    {
      key: 'd',
      alt: true,
      action: () => {
        if (location.pathname.startsWith('/app')) {
          navigate('/app/dashboard');
        }
      },
      description: 'Go to dashboard',
    },
    {
      key: 'a',
      alt: true,
      action: () => {
        if (location.pathname.startsWith('/app')) {
          navigate('/app/applications');
        }
      },
      description: 'Go to applications',
    },
    {
      key: 's',
      alt: true,
      action: () => {
        if (location.pathname.startsWith('/app')) {
          navigate('/app/settings');
        }
      },
      description: 'Go to settings',
    },
  ];

  useKeyboardShortcuts(shortcuts);
  return { modKey };
}
