import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import path from "path";
import fs from "fs";
import os from "os";
import https from "https";

chromium.use(stealth());

const pyqName = []

async function getPyqs(username, password, subject, bar) {
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

  bar.update(5);

  context.on("page", async (page) => {
    const pyqDir = path.join(os.homedir(), "Downloads", "nitrs-pyq", subject);
    const fileName = pyqName[pyqName.length - 1].replace(/[\/\\]/g, "_");
    const filePath = path.join(pyqDir, fileName + ".pdf");

    try {
      await page.waitForLoadState("networkidle");
      const pdfUrl = page.url();
      if (!pdfUrl.toLowerCase().endsWith(".pdf")) {
        console.log(
          "Warning: URL does not end with .pdf. Current URL:",
          pdfUrl
        );
      }
      const responseBuffer = await page.evaluate(async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return Array.from(new Uint8Array(arrayBuffer));
      }, pdfUrl);

      await fs.promises.mkdir(pyqDir, { recursive: true });
      await fs.promises.writeFile(filePath, Buffer.from(responseBuffer));

      console.log(`PDF saved successfully: ${filePath}`);
    } catch (error) {
      console.error("Error downloading PDF:", error.message);
      console.error("URL:", page.url());
      console.error("Attempted file path:", filePath);
    } finally {
      await page.close();
    }
  });

  const usernameInput = await page.locator("#txtUserName");
  const passwordInput = await page.locator("#txtPassword");
  const loginButton = await page.getByText("Log in");

  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  bar.update(10);

  try {
    await page.locator("#lblMsg").waitFor({ state: "visible", timeout: 5000 });
    console.log("username/password is incorrect");
    await browser.close();
  } catch (error) {}

  await page.locator("text=Academic").click();
  bar.update(30);
  await page.locator("text=Examination").click();
  await page.locator('text="Previous Year Question Papers"').click();
  await page.locator('text="View Question Paper"').click();
  bar.update(40);
  await page
    .locator("#ContentPlaceHolder2_ContentPlaceHolder1_mainContent_txtsearch")
    .fill(subject);
  const searchBtn = await page.locator(
    "#ContentPlaceHolder2_ContentPlaceHolder1_mainContent_btnSearch"
  );
  await searchBtn.click();
  bar.update(50);
  await page.waitForLoadState("domcontentloaded")
  const yearMenu = await page.locator("select").nth(0);
  const supYearMenu = await page.locator("select").nth(1);
  const years = await yearMenu.locator("option");
  const sups = await supYearMenu.locator("option");

  await exploreOption(page, yearMenu, years, bar, subject);
  
  await delay(10000);
  await browser.close();
}


async function exploreOption(page, yearMenu, years, bar, subject) {
  await delay(2000);
  const yearsLength = await years.count();
  const pyqDir = path.join(os.homedir(), "Downloads", "nitrs-pyq");
  let progress = 5;
  for (let i = 1; i < yearsLength; i++) {
    await delay(1000)
    bar.update(50 + progress);
    progress += 5;
    await yearMenu.selectOption({ index: i });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("load");
    await delay(4000);
      const year = await years.nth(i).textContent();
      const viewButtons = await page.getByRole('cell', { name: 'View', exact: true});
      const viewButtonsLength = await viewButtons.count();
      if (viewButtonsLength > 0) {
        for (let j = 0; j < viewButtonsLength; j++) {
          pyqName.push(subject + "_" + year + "_" + j);
          const selectedButton = await viewButtons.nth(j);
          await selectedButton.getByRole('link', { name: 'View' }).click();
          await page.waitForEvent('popup');
          await page.waitForLoadState("domcontentloaded");
          await page.waitForLoadState("load");
          await delay(4000);
        }
      }
      if (i == yearsLength - 1) {
        pyqName.push("all_done");
      }
  }
  bar.update(95);
  console.log('done with all years')
  console.log("Saved All files in: ");
  console.log(pyqDir + '\\' + subject);
}


async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection");
});

export const pyq = getPyqs;
