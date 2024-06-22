import inquirer from "inquirer";
import { grade_card } from "./grade_card_downloader/index.mjs";
import { mid_sem } from "./mid_sem_results/index.mjs";
import { seating_chart } from "./mid_sem_seating_chart/index.mjs";
import { pyq } from "./pyq_downloader/index.mjs";
import { getCredentials, setCredentials } from "./helper.mjs";
import  cliProgress from "cli-progress";

const bar = new cliProgress.SingleBar(
  {
    format: "  {bar} {percentage}% | ETA: {eta}s | {value}/{total}",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  },
  cliProgress.Presets.shades_classic
)

export async function askUser() {
  const { username, password } = await getCredentials();
  const questions = [
    {
      type: "input",
      name: "username",
      message: "What is your roll no?",
    },
    {
      type: "password",
      name: "password",
      mask: "*",
      message: "What is your password?",
    },
    {
      type: "list",
      name: "choice",
      message: "Please select one of the following options:",
      choices: ["Grade Card Downloader", "Mid-sem Results Downloader", "Seating arrangement downloader", "PYQ Downloader"],
    },
  ];
  if (username && password) {
    questions.splice(0, 2);
  }
    const answers = await inquirer.prompt(questions);
    answers.username = answers.username || username;
    answers.password = answers.password || password;
  if (!username && !password) {
    await setCredentials(answers.username, answers.password);
  }
    return answers;
};

async function init() {
  const answers = await askUser();
  const choice = answers.choice
  try {
    if (choice.includes("Grade Card Downloader")) {
      console.log('executing, please wait...')
      bar.start(100, 0)
      await grade_card(answers.username, answers.password, bar);
      bar.stop()
    } else if (choice.includes("Mid-sem Results Downloader")) {
      console.log('executing, please wait...')
      bar.start(100, 0)
      await mid_sem(answers.username, answers.password, bar);
      bar.stop()
    } else if (choice.includes("Seating arrangement downloader")) {
      console.log('executing, please wait...')
      bar.start(100, 0)
      await seating_chart(answers.username, answers.password, bar);
      bar.stop()
    } else if (choice.includes("PYQ Downloader")) {
      console.log('executing, please wait...')
      bar.start(100, 0)
      await pyq(answers.username, answers.password, bar);
      bar.stop()
    }
  } catch (error) {
    console.log("there was an error in ", choice);
    console.log(error)
  } finally {
    return;
  }
}

init();