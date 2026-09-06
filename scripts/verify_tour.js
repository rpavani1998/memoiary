const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to app on fresh load...");
  await page.goto("http://localhost:3000");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Wait 3.5s for dev compilation + 1.2s splash timer + tour popover
  await page.waitForTimeout(4000);

  const stepText = await page.locator("text=Step 1 of 7").isVisible();
  console.log("Is Step 1 of 7 Tour Card visible:", stepText);

  await page.screenshot({ path: "/Users/pavanirajula/.gemini/antigravity-ide/brain/d23a08ef-0452-409b-829f-25f4a6a2c8f4/autostart_tour_verified.png" });
  await browser.close();
})();
