import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import path from "path";
import os from "os";

chromium.use(stealth());

async function getPyqs(username, password, bar) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--incognito"],
  });

  const context = await browser.newContext({
    acceptDownloads: true,
  });
  context.setDefaultTimeout(120000);
  const page = await context.newPage();
  await page.goto("https://eapplication.nitrkl.ac.in/nitris/Login.aspx");

  page.on("popup", async (popup) => {
    const downloadDir = path.join(os.homedir(), "Downloads");
    try {
      await popup.waitForLoadState("load");
      await popup.pdf({
        path: downloadDir + "/nitris-grade-card.pdf",
        format: "A4",
      });
    } catch (error) {
    } finally {
      await browser.close();
    }
  });

  const usernameInput = await page.locator("#txtUserName");
  const passwordInput = await page.locator("#txtPassword");
  const loginButton = await page.getByText("Log in");

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  try {
    await page.locator("#lblMsg").waitFor({ state: "visible", timeout: 5000 });
    console.log("username/password is incorrect");
    await browser.close();
  } catch (error) {}

  await page.locator("text=Academic").click();
  await page.locator("text=Examination").click();
  await page.locator('text="Previous Year Question Papers"').click();
  await page.locator('text="View Question Paper"').click();

  await browser.close();
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection");
});

export const pyq = getPyqs;
