import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("renders the student directory with the onboarding roster", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /student directory/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("9 students")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Student directory" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Student network graph" }),
  ).toBeVisible();

  const directoryRows = page.getByRole("table").locator("tbody tr");

  await expect(directoryRows).toHaveCount(9);
  await expect(directoryRows.filter({ hasText: "Jason Yi" })).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Jason Yi on LinkedIn" }),
  ).toBeVisible();
  await expect(page.getByText("site")).toHaveCount(0);
});

test("navigates from the directory to a routed member page", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Jason Yi" }).first().click();

  await expect(page).toHaveURL(/\/members\/jason-yi$/);
  await expect(
    page.getByRole("heading", {
      name: "Jason Yi",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to directory" }),
  ).toHaveAttribute("href", "/");
});

test("supports direct navigation to valid and invalid member routes", async ({
  page,
}) => {
  await page.goto("/members/jay-khemchandani");

  await expect(
    page.getByRole("heading", {
      name: "Jay Khemchandani",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Student builder in the Codex Lab cohort at Stanford."),
  ).toBeVisible();

  await page.goto("/members/not-a-real-student");

  await expect(
    page.getByRole("heading", {
      name: "Member page not found",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to directory" }),
  ).toBeVisible();
});

test("keeps the directory readable on mobile without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.getByRole("region", { name: "Student directory" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Student network graph" }),
  ).toBeVisible();
  await expect(page.getByText("Jason Yi").first()).toBeVisible();
  await expect(page.getByText("UC Berkeley").first()).toBeVisible();
  await expect(page.getByText("site")).toHaveCount(0);

  const maxWidth = await page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
  );

  expect(maxWidth).toBeLessThanOrEqual(390);
});
