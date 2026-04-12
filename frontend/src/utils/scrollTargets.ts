const VISUALISE_PROGRESS = 0.47;

function scrollToProgress(progress: number) {
  const root = document.documentElement;
  const scrollHeight = Math.max(root.scrollHeight, document.body.scrollHeight);
  const scrollableHeight = Math.max(0, scrollHeight - window.innerHeight);
  if (scrollableHeight <= 0) return;

  window.scrollTo({
    top: scrollableHeight * progress,
    behavior: 'smooth'
  });
}

export function scrollToVisualiseSection() {
  scrollToProgress(VISUALISE_PROGRESS);
}

export function scrollToSection(sectionId: string, fallbackProgress: number) {
  const target = document.getElementById(sectionId);
  if (target) {
    const position = window.getComputedStyle(target).position;
    if (position === 'fixed') {
      scrollToProgress(fallbackProgress);
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  scrollToProgress(fallbackProgress);
}