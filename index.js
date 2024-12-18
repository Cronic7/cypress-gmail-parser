const Imap = require("node-imap");
const { simpleParser } = require("mailparser");

/**
 * Fetches the most recent email's text from a specific sender.
 * @param {Object} config - IMAP configuration object.
 * @param {string} senderEmail - The email address of the sender to filter by.
 * @returns {Promise<string>} - A promise resolving to the email text.
 */
function fetchMostRecentEmail(config, senderEmail) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);

    function openInbox(cb) {
      imap.openBox("INBOX", false, cb);
    }

    imap.once("ready", () => {
      openInbox((err) => {
        if (err) {
          reject(err);
          imap.end();
          return;
        }

        imap.search([["FROM", senderEmail]], (err, results) => {
          if (err) {
            reject(err);
            imap.end();
            return;
          }

          if (results.length === 0) {
            resolve("No emails found from the specified sender.");
            imap.end();
            return;
          }

          const mostRecentEmail = results.slice(-1); // Get the most recent email ID
          const f = imap.fetch(mostRecentEmail, { bodies: "" });

          f.on("message", (msg) => {
            let raw = "";

            msg.on("body", (stream) => {
              stream.on("data", (chunk) => {
                raw += chunk.toString("utf8");
              });
            });

            msg.once("end", async () => {
              try {
                const parsed = await simpleParser(raw);
                resolve(parsed.text);
              } catch (parseError) {
                reject(parseError);
              }
            });
          });

          f.once("error", (fetchError) => {
            reject(fetchError);
          });

          f.once("end", () => {
            imap.end();
          });
        });
      });
    });

    imap.once("error", (imapError) => {
      reject(imapError);
    });

    imap.once("end", () => {
      console.log("Connection ended.");
    });

    imap.connect();
  });
}

module.exports = fetchMostRecentEmail;
