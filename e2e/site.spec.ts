import { test, expect } from '@playwright/test';

test.describe('Njaypro Site E2E Verification', () => {
  test('Route / (Builder) renders hero, identity graph, manifesto, thesis, proof, and footer', async ({ page }) => {
    // Collect console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Check Hero content
    await expect(page.getByText('NJAY / MULTIDISCIPLINARY BUILDER')).toBeVisible();
    await expect(page.getByText('I WAS TRAINED')).toBeVisible();
    await expect(page.getByText('BY STEEL.')).toBeVisible();

    // Check Identity Graph Nodes
    await expect(page.getByText('01 / FABRICATION')).toBeVisible();
    await expect(page.getByText('02 / VISUAL SYSTEMS')).toBeVisible();

    // Check Manifesto Frame
    await expect(page.getByText('Call me a builder.')).toBeVisible();

    // Check AI Thesis
    await expect(page.getByText('AI IS NOT MY NEW DISCIPLINE.')).toBeVisible();

    // Check Shipped Proof Output
    await expect(page.getByText('Hermes Archetype Router')).toBeVisible();

    // Check GitHub Links are accurate
    const githubProofLink = page.locator('a[href="https://github.com/njay-pro/hermes-archetype-subagent"]');
    await expect(githubProofLink).toBeVisible();

    // Verify zero uncaught console errors
    expect(consoleErrors).toHaveLength(0);

    // Capture screenshot for visual inspection
    const viewportSize = page.viewportSize();
    const mode = viewportSize && viewportSize.width < 500 ? 'mobile' : 'desktop';
    await page.screenshot({ path: `e2e-screenshots/builder-${mode}.png`, fullPage: true });
  });

  test('Route navigation to /archetype works and renders Archetype Router', async ({ page }) => {
    await page.goto('/');

    // Click secondary route link to Archetype Router
    await page.click('text="The first public node → Archetype Router"');

    // Verify route changed to /archetype
    await expect(page).toHaveURL('/archetype');
    await expect(page.getByText('ONE SUBAGENT IS NOT A SYSTEM.')).toBeVisible();
    await expect(page.getByText('Five Specialist Archetypes')).toBeVisible();
    await page.waitForTimeout(750);

    // Capture screenshot
    const viewportSize = page.viewportSize();
    const mode = viewportSize && viewportSize.width < 500 ? 'mobile' : 'desktop';
    await page.screenshot({ path: `e2e-screenshots/archetype-${mode}.png`, fullPage: true });
  });

  test('/archetype page tab switching and copy buttons work', async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') runtimeErrors.push(msg.text());
    });
    page.on('requestfailed', (request) => runtimeErrors.push(`request failed: ${request.url()}`));

    await page.goto('/archetype');

    // Select consultant tab
    const consultantTab = page.getByRole('tab', { name: /consultant/i });
    await consultantTab.click();

    await expect(consultantTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Raw nuance, architecture, intent distillation, near-completion synthesis.')).toBeVisible();

    // Click copy invocation button
    await page.click('button:has-text("Copy Invocation")');
    await expect(page.getByText('✓ Copied')).toBeVisible();

    // Click copy agent prompt button
    await page.click('button:has-text("Copy Agent Prompt")');
    await expect(page.getByText('✓ Prompt Copied')).toBeVisible();

    // Exercise keyboard focus movement and all route-local state surfaces.
    await consultantTab.focus();
    await page.keyboard.press('ArrowRight');
    const longHorizonTab = page.getByRole('tab', { name: /long-horizon/i });
    await expect(longHorizonTab).toBeFocused();
    await expect(longHorizonTab).toHaveAttribute('aria-selected', 'true');

    await page.getByRole('button', { name: /model/i }).click();
    await page.getByRole('button', { name: /horizon/i }).click();
    expect(runtimeErrors).toEqual([]);
  });

  test('Check horizontal overflow at 390px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(overflow).toBe(false);

    await page.goto('/archetype');
    const archetypeOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(archetypeOverflow).toBe(false);
  });
});
