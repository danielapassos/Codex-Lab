import { expect, test, type Page } from "@playwright/test";

async function getGraphNodePositions(page: Page) {
  return page
    .getByRole("region", { name: "Lab member network graph" })
    .locator("[data-graph-node='true']")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }),
    );
}

function getMaxMovement(
  before: { x: number; y: number }[],
  after: { x: number; y: number }[],
) {
  return before.reduce((maxMovement, position, index) => {
    const nextPosition = after[index];

    if (!nextPosition) {
      return maxMovement;
    }

    return Math.max(
      maxMovement,
      Math.hypot(nextPosition.x - position.x, nextPosition.y - position.y),
    );
  }, 0);
}

test("renders the Codex Lab network and syncs search with selection", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /directory-first network for the people building with the lab/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /fill out this form/i })).toBeVisible();
  await expect(page.getByText("12 members")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Lab member directory" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Lab member network graph" }),
  ).toBeVisible();

  await page.getByLabel("Search members").fill("Noor");

  const directoryRows = page.getByRole("table").locator("tbody tr");

  await expect(directoryRows).toHaveCount(1);
  await expect(directoryRows.first()).toContainText("Noor Akhtar");
  await expect(
    page
      .getByRole("region", { name: "Lab member network graph" })
      .locator("[data-graph-node='true']"),
  ).toHaveCount(1);

  await directoryRows.first().click();

  await expect(
    page.getByRole("heading", { name: "Noor Akhtar", level: 2 }),
  ).toBeVisible();
});

test("keeps graph nodes stable after the initial layout settles", async ({ page }) => {
  await page.goto("/");

  const nodes = page
    .getByRole("region", { name: "Lab member network graph" })
    .locator("[data-graph-node='true']");

  await expect(nodes).toHaveCount(12);

  const firstSnapshot = await getGraphNodePositions(page);

  await page.waitForTimeout(500);

  const secondSnapshot = await getGraphNodePositions(page);

  expect(getMaxMovement(firstSnapshot, secondSnapshot)).toBeLessThan(1.5);
});

test("keeps the join CTA and graph visible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("link", { name: /fill out this form/i })).toBeVisible();
  await expect(page.getByLabel("Search members")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Lab member network graph" }),
  ).toBeVisible();

  const maxWidth = await page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  );

  expect(maxWidth).toBeLessThanOrEqual(390);
});
