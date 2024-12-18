# Cypress Gmail Parser

A Node.js utility to fetch the most recent email from a specified sender using IMAP, tailored for integration with Cypress tests. This package enables automated testing workflows involving email content validation, OTP extraction, registration link retrieval, and URL parsing.

## Features

- Fetches the most recent email from a specified sender.
- Parses the email body into plain text.
- Extracts OTPs, registration links, and URLs from email content.
- Seamless integration with Cypress through `cy.task`.

## Installation

```bash
npm install cypress-gmail-parser
```
## Configuration
IMAP Configuration
Ensure you have the following details for the email account:

Here's an example of the configuration:

```bash
const imapConfig = {
  user: "your-email@example.com",
  password: "your-app-password",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
};
```
## Usage Guide
### 1. Cypress Plugin Setup
In your Cypress project, add the following to cypress/plugins/index.js:

 ```
const fetchMostRecentEmail = require("cypress-gmail-parser");

module.exports = (on) => {
  on("task", {
    fetchEmail({ imapConfig, senderEmail }) {
      return fetchMostRecentEmail(imapConfig, senderEmail);
    },
  });
};
```
This registers the fetchEmail task for use in your Cypress tests.

### 2. Writing Cypress Tests
In your test files, use the cy.task method to fetch the email:

```
describe("Email Test Suite", () => {
  it("Should fetch the most recent email text", () => {
    const imapConfig = {
      user: "your-email@example.com",
      password: "your-app-password",
      host: "imap.gmail.com",
      port: 993,
      tls: true,
    };

    const senderEmail = "sender@example.com";

    cy.task("fetchEmail", { imapConfig, senderEmail }).then((emailText) => {
      expect(emailText).to.include("expected content");
      cy.log("Email Text:", emailText);
    });
  });

  it("Should extract OTP from the email", () => {
    const imapConfig = {
      user: "your-email@example.com",
      password: "your-app-password",
      host: "imap.gmail.com",
      port: 993,
      tls: true,
    };

    const senderEmail = "sender@example.com";

    cy.task("fetchEmail", { imapConfig, senderEmail }).then((emailText) => {
      const otp = emailText.match(/\b\d{6}\b/)[0]; // Example regex for 6-digit OTP
      expect(otp).to.match(/\d{6}/);
      cy.log("Extracted OTP:", otp);
    });
  });

  it("Should extract registration link from the email", () => {
    const imapConfig = {
      user: "your-email@example.com",
      password: "your-app-password",
      host: "imap.gmail.com",
      port: 993,
      tls: true,
    };

    const senderEmail = "sender@example.com";

    cy.task("fetchEmail", { imapConfig, senderEmail }).then((emailText) => {
      const link = emailText.match(/https?:\/\/\S+/)[0]; // Example regex for URL
      expect(link).to.include("http");
      cy.log("Extracted URL:", link);
    });
  });
});

```
### 3. Running Tests
Run your tests using the Cypress test runner:

```
npx cypress open

```
### Error Handling
Ensure that the email account credentials and IMAP configuration are correct.
Confirm that the sender email address exists in the inbox.
Check for proper network connectivity to the IMAP server.


### License
MIT License

### Contributing
Feel free to open issues or submit pull requests to improve this utility!

 