const VISUALISE_PROGRESS = 0.47;

export function scrollToVisualiseSection() {
  const root = document.documentElement;
  const scrollHeight = Math.max(root.scrollHeight, document.body.scrollHeight);
  const scrollableHeight = Math.max(0, scrollHeight - window.innerHeight);
  if (scrollableHeight <= 0) return;

  window.scrollTo({
    top: scrollableHeight * VISUALISE_PROGRESS,
    behavior: 'smooth'
  });
}