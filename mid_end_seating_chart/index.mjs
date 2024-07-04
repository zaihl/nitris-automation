import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import path from "path";
import os from "os";

const downloadDir = path.join(os.homedir(), "Downloads", "seating-charts");

chromium.use(stealth());

async function getMidSemSeating(username, password, bar) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--incognito"],
  });

  const context = await browser.newContext({
    acceptDownloads: true,
  });
  context.setDefaultTimeout(120000);
  bar.update(5);
  const page = await context.newPage();
  await page.goto("https://eapplication.nitrkl.ac.in/nitris/Login.aspx");

  const usernameInput = await page.locator("#txtUserName");
  const passwordInput = await page.locator("#txtPassword");
  const loginButton = await page.getByText("Log in");

  bar.update(25);

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  try {
    await page.locator("#lblMsg").waitFor({ state: "visible", timeout: 5000 });
    console.log("username/password is incorrect");
    await browser.close();
  } catch (error) {}
  bar.update(50);
  await page.locator("text=Academic").click();
  bar.update(55);
  await page.locator("text=Examination").click();
  bar.update(60);
  await page.locator('text="Examination Seating Chart"').click();
  bar.update(65);
  await page.locator('text="Mid Semester"').click();
  bar.update(70);

  let yearMenu = await page.locator("select").nth(0);
  await yearMenu.selectOption({ index: 1 });
  await page.waitForLoadState("load");
  await delay(1000);
  await page.screenshot({ path: `${downloadDir}/mid-seating.png` });
  bar.update(80);

  await page.goBack();
  await page.goBack();
  await page.reload();

  bar.update(90);
  // await page.locator('text="Examination Seating Chart"').click();
  await page.locator('text="End Semester"').click();

  yearMenu = await page.locator("select");
  await yearMenu.selectOption({ index: 1 });
  await page.waitForLoadState("load");
  await delay(1000);
  bar.update(100);
  await page.screenshot({ path: `${downloadDir}/end-seating.png` });
  await browser.close()
  bar.stop();
  console.log("Saved All files in: ");
  console.log(downloadDir);
}
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection");
});

export const seating_chart = getMidSemSeating;
