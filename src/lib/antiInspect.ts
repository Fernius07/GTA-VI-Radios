/**
 * Production-only deterrent against casual browser inspection (right-click,
 * image dragging, and common DevTools / View-Source keyboard shortcuts).
 */
export function initProductionGuard(): void {
  if (!import.meta.env.PROD || typeof window === 'undefined') return;

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  window.addEventListener(
    'keydown',
    (e) => {
      const key = e.key.toLowerCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      if (
        e.key === 'F12' ||
        (ctrlOrCmd && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (ctrlOrCmd && key === 'u') ||
        (e.metaKey && e.altKey && (key === 'i' || key === 'j' || key === 'u'))
      ) {
        e.preventDefault();
      }
    },
    true
  );
}
