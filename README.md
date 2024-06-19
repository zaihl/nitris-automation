# NITRIS Automation Tool

Welcome to the NITRIS Automation Tool project! This tool is designed to streamline your experience with the NIT Rourkela's NITRIS website, which is often slow and cumbersome to navigate. Our automation script significantly reduces the time it takes to perform routine tasks on the site.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description

The NITRIS portal is known for its slow loading times, often taking more than 2 minutes on an ideal day and over 5 minutes during busy periods. This project aims to mitigate these issues by automating tasks on the NITRIS website. Currently, the tool supports the following functionality: 

- **Grade Card Download Automation**: Quickly download your grade card by simply providing the necessary details.

## Features

- **Grade Card Download Automation**: Automatically navigates through the NITRIS website to download your grade card.

More features will be added in future updates to further enhance the automation capabilities of this tool.

## Technologies Used

- [Playwright](https://playwright.dev/) - For web automation.
- [Inquirer.js](https://www.npmjs.com/package/inquirer) - For prompting the user with relevant questions.

## Installation

To get started with the NITRIS Automation Tool, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zaihl/nitris-automation.git
   ```

2. **Install dependencies:**

   Make sure you have [Node.js](https://nodejs.org/) installed. Then run:

   ```bash
   npm install
   ```

## Usage

To use the NITRIS Automation Tool, follow these steps:

1. **Move to the desired directory**

    ```bash
    cd grade_card_downloader
    ```

1. **Run the script:**

   ```bash
   node index.mjs
   ```

2. **Follow the prompts:** The tool will ask you a series of questions to gather the necessary information to perform the automation tasks.

   ![Example Usage](https://github.com/zaihl/nitris-automation/assets/109749616/2766636f-b60c-4652-ac4e-03bc6563e2cf)


## Contributing

We welcome contributions to enhance the functionality of the NITRIS Automation Tool! If you have any ideas or improvements, please feel free to submit a pull request.

1. **Fork the repository**
2. **Create a new branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes:**

   ```bash
   git commit -m 'Add some feature'
   ```

4. **Push to the branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a pull request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---
