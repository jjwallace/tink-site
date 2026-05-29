/**
 * Standalone disclosure route. Reached by clicking the "Disclosure" link
 * in the footer. Rendered by main.tsx when `?page=disclosure` is set.
 *
 * Just two lines of lore and a "coming soon" — the real document hasn't
 * been written yet.
 */
export function DisclosurePage() {
  const base = import.meta.env.BASE_URL;
  return (
    <div className="disclosure-page">
      <div className="bg-grain" aria-hidden="true" />
      <main className="disclosure-page-content">
        <a href={base} className="disclosure-page-back" aria-label="Back to home">
          ← back
        </a>
        <p className="disclosure-page-line">If only the youth knew.</p>
        <p className="disclosure-page-line">If only the elderly could.</p>
        <p className="disclosure-page-soon">coming soon</p>
      </main>
    </div>
  );
}
