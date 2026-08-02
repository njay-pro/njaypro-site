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

    // Capture screenshot
    const viewportSize = page.viewportSize();
    const mode = viewportSize && viewportSize.width < 500 ? 'mobile' : 'desktop';
    await page.screenshot({ path: `e2e-screenshots/archetype-${mode}.png`, fullPage: true });
  });

  test('/archetype page tab switching and copy buttons work', async ({ page }) => {
    await page.goto('/archetype');

    // Select consultant tab
    const consultantTab = page.getByRole('tab', { name: /consultant/i });
    await consultantTab.click();

    await expect(consultantTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Raw nuance, architecture, intent distillation, near-completion synthesis.')).toBeVisible();

    // Click copy config button
    await page.click('button:has-text("Copy Config")');
    await expect(page.getByText('✓ Copied').first()).toBeVisible();

    // Click copy command button
    await page.click('button:has-text("Copy Command")');
    await expect(page.getByText('✓ Copied').nth(1)).toBeVisible();
  });

  test('Check horizontal overflow at 390px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(overflow).toBe(false);
  });
});
