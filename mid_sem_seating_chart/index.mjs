import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import path from "path";
import os from "os";

chromium.use(stealth());

const { username, password } = {username: "", password: ""}
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
  await page.locator('text="Examination Seating Chart"').click();
  await page.locator('text="Mid Semester"').click();
  console.log('in examination section')

  let yearMenu = await page.locator('select')
  await yearMenu.selectOption({index: 1})
  await page.waitForLoadState("load");
  await delay(1000);
  await page.screenshot({path: './mid-seating.png'})

  await page.goBack()
  await page.goBack()
  await page.reload()
  await page.locator('text="Examination Seating Chart"').click();
  await page.locator('text="End Semester"').click();

  yearMenu = await page.locator("select");
  await yearMenu.selectOption({ index: 1 });
  await page.waitForLoadState("load");
  await delay(1000);
  await page.screenshot({ path: "./end-seating.png" });

  await browser.close()
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

try {
  await getGradeCard();
} catch (error) {
  console.log(error);
} finally {
  console.log("done executing the script")
}

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection");
});
