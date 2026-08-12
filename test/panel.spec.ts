import { expect, test } from '@playwright/test';
import { boxSize, events, openPanel } from './helpers';

test.describe('rendering and sizing', () => {
  test('renders slotted content', async ({ page }) => {
    await openPanel(page);

    await expect(page.locator('#slotted')).toBeVisible();
    await expect(page.locator('#slotted')).toHaveText('Panel content');
  });

  test('falls back to its default size', async ({ page }) => {
    const panel = await openPanel(page);

    // 19rem × 12.5rem at the default 16px root.
    expect(await boxSize(panel.container)).toEqual({ width: 304, height: 200 });
  });

  test('sizes to the w and h attributes', async ({ page }) => {
    const panel = await openPanel(page, { w: '400px', h: '250px' });

    expect(await boxSize(panel.container)).toEqual({ width: 400, height: 250 });
  });

  test('clamps to min-w and min-h', async ({ page }) => {
    const panel = await openPanel(page, {
      w: '50px',
      h: '50px',
      'min-w': '220px',
      'min-h': '160px',
    });

    expect(await boxSize(panel.container)).toEqual({ width: 220, height: 160 });
  });

  test('clamps to max-w and max-h', async ({ page }) => {
    const panel = await openPanel(page, {
      w: '900px',
      h: '900px',
      'max-w': '320px',
      'max-h': '240px',
    });

    expect(await boxSize(panel.container)).toEqual({ width: 320, height: 240 });
  });

  test('embeds a src as an iframe and clears the loading overlay', async ({ page }) => {
    const panel = await openPanel(page, { src: '/test/pages/embedded.html' });

    await expect(panel.container.locator('iframe')).toHaveAttribute(
      'src',
      '/test/pages/embedded.html'
    );
    await expect(page.frameLocator('resize-panel iframe').locator('#heading')).toHaveText(
      'Embedded page'
    );
    await expect(panel.container.locator('.loading')).toBeHidden();
  });
});

test.describe('programmatic API', () => {
  test('resizeTo changes the rendered size', async ({ page }) => {
    const panel = await openPanel(page);

    await page.evaluate(() => window.__panel.resizeTo('420px', '260px'));

    expect(await boxSize(panel.container)).toEqual({ width: 420, height: 260 });
  });

  test('the width and height setters resize the panel', async ({ page }) => {
    const panel = await openPanel(page);

    await page.evaluate(() => {
      window.__panel.width = '360px';
      window.__panel.height = '240px';
    });

    expect(await boxSize(panel.container)).toEqual({ width: 360, height: 240 });
    expect(await page.evaluate(() => window.__panel.width)).toBe('360px');
    expect(await page.evaluate(() => window.__panel.height)).toBe('240px');
  });

  test('setting the w and h attributes resizes the panel', async ({ page }) => {
    const panel = await openPanel(page);

    await page.evaluate(() => {
      window.__panel.setAttribute('w', '380px');
      window.__panel.setAttribute('h', '220px');
    });

    expect(await boxSize(panel.container)).toEqual({ width: 380, height: 220 });
  });

  test('emits a resize event carrying the new dimensions', async ({ page }) => {
    await openPanel(page);

    await page.evaluate(() => window.__panel.resizeTo('420px', '260px'));

    await expect
      .poll(async () => (await events(page)).at(-1))
      .toEqual({ width: '420px', height: '260px' });
  });
});
