import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import path from "path";
import os from "os";

chromium.use(stealth());

async function getGradeCard(username, password, bar) {
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

  bar.update(15);

  page.on("popup", async (popup) => {
    const downloadDir = path.join(os.homedir(), "Downloads");
    try {
      await popup.waitForLoadState("load");
      await popup.pdf({
        path: downloadDir + "/nitris-grade-card.pdf",
        format: "A4",
      });
    } catch (error) {
      console.log("Error generating PDF:", error);
    } finally {
      console.log("");
      console.log("Downloaded PDF to:");
      console.log(path.join(downloadDir, "nitris-grade-card.pdf"));
      await browser.close();
    }
  });

  const usernameInput = await page.locator("#txtUserName");
  const passwordInput = await page.locator("#txtPassword");
  const loginButton = await page.getByText("Log in");

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  bar.update(25);

  try {
    await page.locator("#lblMsg").waitFor({ state: "visible", timeout: 5000 });
    console.log("username/password is incorrect");
    await browser.close();
  } catch (error) {}

  bar.update(45);

  await page.locator("text=Academic").click();
  bar.update(60);
  await page.locator("text=Examination").click();
  bar.update(70);
  await page.locator('text="Examination Results"').click();
  bar.update(80);
  await page.locator('text="View Grade Card"').click();
  bar.update(100);
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection");
});

export const grade_card = getGradeCard;
