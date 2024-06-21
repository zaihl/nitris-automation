import { chromium } from "playwright-extra";
import { expect } from "@playwright/test";
import stealth from "puppeteer-extra-plugin-stealth";
import path from "path";
import os from "os";

chromium.use(stealth());

const { username, password } = {
  username: "",
  password: "",
};
async function getGradeCard() {
  const browser = await chromium.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--incognito"],
  });

  const context = await browser.newContext({
    acceptDownloads: true,
  });
  context.setDefaultTimeout(60000);
  const page = await context.newPage();
  await page.goto("https://eapplication.nitrkl.ac.in/nitris/Login.aspx");

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
  } catch (error) {
    console.log("password is correct");
  }

  await page.locator("text=Academic").click();
  await page.locator("text=Examination").click();
  await page.locator('text="Examination Results"').click();
  await page.locator('text="Mid Semester Mark"').click();
  console.log("in examination section");

  await page.waitForLoadState("load");

  const yearMenu = await page.locator("select").nth(0);
  const semMenu = await page.locator("select").nth(1);

  const years = await yearMenu.locator("option");
  const semesters = await semMenu.locator("option");

  await exploreOption(page, yearMenu, semMenu, years, semesters);

  await browser.close();
}

try {
  await getGradeCard();
} catch (error) {
  console.log(error);
} finally {
  console.log("done executing the script");
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection");
});

async function exploreOption(page, yearMenu, semMenu, years, semesters) {
  const yearsLength = await years.count();
  const semsLength = await semesters.count();
  for (let i = 1; i < yearsLength; i++) {
    await yearMenu.selectOption({ index: i });
    for (let j = 1; j < semsLength; j++) {
      await semMenu.selectOption({ index: j });
      await page.waitForLoadState("load");
      const sem = await semesters.nth(j).textContent()
      const year = await years.nth(i).textContent()
      const notFound = await page.locator(
        "#ContentPlaceHolder2_ContentPlaceHolder1_mainContent_gvSubjects", 
        { name: 'No Records Found....'}
      );
      const notFoundText = await notFound.textContent();
      if (!notFoundText.includes('No Records Found....')) {
        console.log("year:", year, "sem:", sem);
        await delay(3000);
        await page.screenshot({ path: `./marks/${year}_${sem}.png` });
      }
    }
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}