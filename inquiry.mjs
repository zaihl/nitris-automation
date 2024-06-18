import inquirer from "inquirer";

export async function askUser() {
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
      type: "confirm",
      name: "confirm",
      message: "Are you sure?",
    },
  ];
    const answers = await inquirer.prompt(questions);
    return answers;
};

