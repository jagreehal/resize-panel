import type { Locator, Page } from '@playwright/test';

export interface ResizeDetail {
  width: string;
  height: string;
}

declare global {
  interface Window {
    __events: ResizeDetail[];
    __panel: HTMLElement & {
      width: string;
      height: string;
      resizeTo(width: string, height: string): void;
    };
  }
}

type Params = Record<string, string | number>;

export interface Panel {
  host: Locator;
  /** The resizable box inside the shadow root. */
  container: Locator;
  /** The floating "W × H" readout. */
  readout: Locator;
}

export async function openPanel(page: Page, params: Params = {}): Promise<Panel> {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  );
  await page.goto(`/test/pages/panel.html?${query}`);

  return {
    host: page.locator('resize-panel'),
    container: page.locator('resize-panel .panel-container'),
    readout: page.locator('resize-panel .resize-display'),
  };
}

/** Resizes the panel the way a user would: dragging the CSS resize corner. */
export async function dragCorner(page: Page, container: Locator, by: { x: number; y: number }) {
  const box = await container.boundingBox();
  if (!box) throw new Error('panel container is not visible');

  const corner = { x: box.x + box.width - 3, y: box.y + box.height - 3 };
  await page.mouse.move(corner.x, corner.y);
  await page.mouse.down();
  await page.mouse.move(corner.x + by.x, corner.y + by.y, { steps: 10 });
  await page.mouse.up();
}

export const boxSize = async (locator: Locator) => {
  const box = await locator.boundingBox();
  return { width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) };
};

export const events = (page: Page) => page.evaluate(() => window.__events);
