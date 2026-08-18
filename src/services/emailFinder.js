/**
 * Frontend Email Scraper Client
 * Calls /api/scrape-email to extract business emails from websites
 */

export async function scrapeWebsiteEmail(url) {
  if (!url) return null;
  try {
    const response = await fetch('/api/scrape-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        email: data.email || null,
        allEmails: data.allEmails || []
      };
    }
  } catch (err) {
    console.warn(`Email scraping failed for ${url}:`, err);
  }
  return { success: false, email: null, allEmails: [] };
}
