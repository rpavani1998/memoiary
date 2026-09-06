const { chromium } = require("playwright");
const { execSync } = require("child_process");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);

  // Click on Talk with AI button or MessageSquare icon
  const reflectBtn = await page.getByRole("button", { name: "Talk with AI" }).first();
  if (await reflectBtn.isVisible()) {
    await reflectBtn.click();
    await page.waitForTimeout(1000);
  }

  // Handle any modal
  const guestBtn = await page.$("button:has-text('Continue as Guest'), button:has-text('Dismiss'), button:has-text('Close')");
  if (guestBtn) {
    console.log("Dismissing modal...");
    await guestBtn.click();
    await page.waitForTimeout(1500);
  }

  // Click reflection tab if not active
  const chatTab = await page.$("[title*='AI Reflect'], [title*='Talk AI'], button:has-text('Talk with AI')");
  if (chatTab) {
    await chatTab.click();
    await page.waitForTimeout(2000);
  }

  await page.screenshot({ path: "/Users/pavanirajula/.gemini/antigravity-ide/brain/d23a08ef-0452-409b-829f-25f4a6a2c8f4/memoiary_reflect_clean_full.png" });
  await browser.close();

  // Crop exact center (330 to 1110)
  execSync(`python3 -c "from PIL import Image; im = Image.open('/Users/pavanirajula/.gemini/antigravity-ide/brain/d23a08ef-0452-409b-829f-25f4a6a2c8f4/memoiary_reflect_clean_full.png'); im.crop((330, 0, 1110, 900)).save('/Users/pavanirajula/.gemini/antigravity-ide/brain/d23a08ef-0452-409b-829f-25f4a6a2c8f4/memoiary_reflect_centered.png')"`);
  console.log("Successfully saved clean memoiary_reflect_centered.png!");
})();
