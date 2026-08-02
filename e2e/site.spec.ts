import { test, expect } from '@playwright/test';

test.describe('Njaypro Site E2E Verification', () => {
  test('Route / (Builder) renders hero, identity graph, manifesto, thesis, proof, and footer', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    await expect(page.getByText('NJAY / MULTIDISCIPLINARY BUILDER')).toBeVisible();
    await expect(page.getByText('I WAS TRAINED')).toBeVisible();
    await expect(page.getByText('BY STEEL.')).toBeVisible();

    await expect(page.getByText('01 / FABRICATION')).toBeVisible();
    await expect(page.getByText('02 / VISUAL SYSTEMS')).toBeVisible();

    await expect(page.getByText('Call me a builder.')).toBeVisible();

    await expect(page.getByText('AI IS NOT MY NEW DISCIPLINE.')).toBeVisible();

    await expect(page.getByText('Hermes Archetype Router')).toBeVisible();

    const githubProofLink = page.locator('a[href="https://github.com/njay-pro/hermes-archetype-subagent"]');
    await expect(githubProofLink).toBeVisible();

    expect(consoleErrors).toHaveLength(0);

    const viewportSize = page.viewportSize();
    const mode = viewportSize && viewportSize.width < 500 ? 'mobile' : 'desktop';
    await page.screenshot({ path: `e2e-screenshots/builder-${mode}.png`, fullPage: true });
  });

  test('Route /archetype renders the five story beats and the GitHub CTA', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/archetype');

    // Beat 1 — The Moment
    await expect(page.getByText(/You watched one AI answer ten different questions/i)).toBeVisible();
    await expect(page.getByText(/We did too\. That is why we built five minds instead/i)).toBeVisible();

    // Beat 2 — The Gap
    await expect(page.getByText(/01 · THE GAP/i)).toBeVisible();
    await expect(page.getByText(/Each failure is a missing kind of mind/i)).toBeVisible();

    // Beat 3 — The System
    await expect(page.getByText(/02 · THE SYSTEM/i)).toBeVisible();
    await expect(page.getByText(/Five kinds of mind\./i)).toBeVisible();

    // Beat 4 — The Proof
    await expect(page.getByText(/03 · THE PROOF/i)).toBeVisible();
    await expect(page.getByText(/Same prompt\. Five minds\./i)).toBeVisible();

    // Beat 5 — The Door
    await expect(page.getByText(/04 · THE DOOR/i)).toBeVisible();
    await expect(page.getByText(/It is open source\. It ships today\./i)).toBeVisible();

    // Door CTA points at the real repo
    const doorCta = page.getByRole('link', { name: /open the repo · v1\.0\.0/i });
    await expect(doorCta).toBeVisible();
    await expect(doorCta).toHaveAttribute('href', 'https://github.com/njay-pro/hermes-archetype-subagent');

    // For Builders — quiet tail, still present
    await expect(page.getByText(/FOR BUILDERS · OPTIONAL/i)).toBeVisible();

    expect(consoleErrors).toHaveLength(0);

    const viewportSize = page.viewportSize();
    const mode = viewportSize && viewportSize.width < 500 ? 'mobile' : 'desktop';
    await page.screenshot({ path: `e2e-screenshots/archetype-${mode}.png`, fullPage: true });
  });

  test('/archetype tab switching and copy buttons work without runtime errors', async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') runtimeErrors.push(msg.text());
    });

    await page.goto('/archetype');

    const consultantTab = page.getByRole('tab', { name: /consultant/i });
    await consultantTab.click();
    await expect(consultantTab).toHaveAttribute('aria-selected', 'true');

    // Keyboard nav moves focus across tabs.
    await consultantTab.focus();
    await page.keyboard.press('ArrowRight');
    const longHorizonTab = page.getByRole('tab', { name: /long-horizon/i });
    await expect(longHorizonTab).toBeFocused();
    await expect(longHorizonTab).toHaveAttribute('aria-selected', 'true');

    // Builder copy button on the for-builders tail works.
    await page.getByRole('button', { name: /copy tool-call snippet/i }).click();
    await expect(page.getByText(/✓ Copied/i)).toBeVisible();

    expect(runtimeErrors).toEqual([]);
  });

  test('Check horizontal overflow at 390px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);

    await page.goto('/archetype');
    const archetypeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(archetypeOverflow).toBe(false);
  });
});