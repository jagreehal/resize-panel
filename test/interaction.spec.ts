import { expect, test } from '@playwright/test';
import { boxSize, dragCorner, events, openPanel } from './helpers';

test.describe('dragging the resize corner', () => {
  test('resizes the panel', async ({ page }) => {
    const panel = await openPanel(page, { w: '300px', h: '200px' });

    await dragCorner(page, panel.container, { x: 80, y: 60 });

    const size = await boxSize(panel.container);
    expect(size.width).toBeGreaterThan(340);
    expect(size.height).toBeGreaterThan(240);
  });

  test('reports the dragged size through the resize event', async ({ page }) => {
    const panel = await openPanel(page, { w: '300px', h: '200px' });

    await dragCorner(page, panel.container, { x: 60, y: 40 });

    await expect.poll(async () => (await events(page)).length).toBeGreaterThan(1);
  });

  test('stops at max-w and max-h however far you drag', async ({ page }) => {
    const panel = await openPanel(page, {
      w: '300px',
      h: '200px',
      'max-w': '360px',
      'max-h': '240px',
    });

    await dragCorner(page, panel.container, { x: 400, y: 400 });

    expect(await boxSize(panel.container)).toEqual({ width: 360, height: 240 });
  });
});

test.describe('the size readout', () => {
  test('shows the current size, then hides itself', async ({ page }) => {
    const panel = await openPanel(page, { w: '300px', h: '200px' });

    await expect(panel.readout).toHaveText('300px × 200px');

    // It hides itself a second after the last resize, with no further input.
    await expect(panel.readout).toBeHidden();
  });

  test('comes back on the next resize', async ({ page }) => {
    const panel = await openPanel(page, { w: '300px', h: '200px' });
    await expect(panel.readout).toBeHidden();

    await page.evaluate(() => window.__panel.resizeTo('420px', '260px'));

    await expect(panel.readout).toBeVisible();
    await expect(panel.readout).toHaveText('420px × 260px');
  });

  test('sits where data-display-position asks', async ({ page }) => {
    const panel = await openPanel(page, { 'data-display-position': 'bottom-left' });

    await expect(panel.readout).toHaveClass(/bottom-left/);
  });

  test('stays hidden when the position is none', async ({ page }) => {
    const panel = await openPanel(page, { 'data-display-position': 'none' });

    await expect(panel.readout).toBeHidden();

    await page.evaluate(() => window.__panel.resizeTo('420px', '260px'));

    await expect(panel.readout).toBeHidden();
  });
});

test.describe('theming', () => {
  test('uses the light palette by default', async ({ page }) => {
    const panel = await openPanel(page);

    await expect(panel.container).toHaveCSS('background-color', 'rgb(249, 250, 251)');
  });

  test('switches to the dark palette', async ({ page }) => {
    const panel = await openPanel(page, { 'data-theme': 'dark' });

    await expect(panel.container).toHaveCSS('background-color', 'rgb(17, 24, 39)');
  });

  test('re-themes an existing panel', async ({ page }) => {
    const panel = await openPanel(page);
    await expect(panel.container).toHaveCSS('background-color', 'rgb(249, 250, 251)');

    await page.evaluate(() => window.__panel.setAttribute('data-theme', 'dark'));

    await expect(panel.container).toHaveCSS('background-color', 'rgb(17, 24, 39)');
  });
});

test.describe('accessibility', () => {
  test('names the embedded frame', async ({ page }) => {
    const panel = await openPanel(page, {
      src: '/test/pages/embedded.html',
      'aria-label': 'Live preview',
    });

    await expect(panel.container.locator('iframe')).toHaveAttribute('title', 'Live preview');
  });
});
