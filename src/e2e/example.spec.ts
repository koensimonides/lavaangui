import { test, expect } from "@playwright/test";

//File menu

test("new model", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "File" }).click();
  await page.getByRole("link", { name: "New Model" }).click();
  await page.getByText("OK").click();
  const numberOfNodes = await page.evaluate(() => window.cy.nodes().length);

  // Asserttions
  expect(numberOfNodes).toBe(0);
  await expect(page.getByTestId("result-text")).toContainText("Command");
});

test("Download Model", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "File" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download Model", exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("diagram.json");
});

test("Remove Data", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "File" }).click();
  await page.getByRole("link", { name: "Remove Data" }).click();
  await expect(page.getByTestId("data-info")).toContainText("No Data loaded");
});

test("Download Model Data", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "File" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("link", { name: "Download Model and Data", exact: true })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^lavaangui.*\.zip$/);
});

test("Export PNG", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "File" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "PNG", exact: false }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("model.png");
});

test("Export JPG", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "File" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "JPG", exact: false }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("model.jpg");
});

//View Menu
test("Default options View", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "View" }).click();
  //Edges created by lavaan visible
  await page
    .evaluate(() => {
      const edgesFromLav = window.cy.edges(".fromLav");
      return edgesFromLav.every((edge) => edge.visible());
    })
    .then((visible) => {
      expect(visible).toBe(true);
    });
  //Standard estimates shown
  await page
    .evaluate(() => {
      const edge = window.cy.edges((edge) => {
        const sourceNode = edge.source();
        const targetNode = edge.target();
        return (
          sourceNode.data("label") === "visual" &&
          targetNode.data("label") === "x3"
        );
      });
      return edge.style("label") === "0.73";
    })
    .then((hasLabel) => {
      expect(hasLabel).toBe(true);
    });
});

test("Show Script", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "Show User Model / Script" }).click();

  await expect(page.getByTestId("result-text")).toContainText(
    "library(lavaan)"
  );
  const lavEdges = await page.evaluate(() =>
    window.cy.edges(".fromLav").map((edge) => edge.visible())
  );
  const usrEdges = await page.evaluate(() =>
    window.cy.edges(".fromUser").map((edge) => edge.visible())
  );

  // Expect all lavEdges to be invisible
  expect(lavEdges.every((isVisible) => !isVisible)).toBe(true);

  // Expect all usrEdges to be visible
  expect(usrEdges.every((isVisible) => isVisible)).toBe(true);
});

test("Show Full Model", async ({ page }) => {
  await page.goto("http://127.0.0.1:3245/");
  await page.getByRole("button", { name: "Show Full Model" }).click();

  await expect(page.getByTestId("result-text")).toContainText("lhs");
  const lavEdges = await page.evaluate(() =>
    window.cy.edges(".fromLav").map((edge) => edge.visible())
  );
  const usrEdges = await page.evaluate(() =>
    window.cy.edges(".fromUser").map((edge) => edge.visible())
  );
  const x = 3;
  // Expect all lavEdges to be visible
  expect(lavEdges.every((isVisible) => isVisible)).toBe(true);

  // Expect all usrEdges to be visible
  expect(usrEdges.every((isVisible) => isVisible)).toBe(true);
});
