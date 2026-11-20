# Pango gym growth page

## Run locally

```sh
npm install
npm run dev
```

Yellow call-to-action buttons open a registration popup. Full name, phone
number, and email are required. Gym name is optional. Submissions are saved to
Google Sheets through the Apps Script backend in `GoogleSheets.gs`.

## Connect Google Sheets

1. Open **Extensions → Apps Script** from a Google Sheet, or create a standalone
   Apps Script project. Replace the contents of `Code.gs` with the entire
   contents of this repository's `GoogleSheets.gs`.
2. The backend is configured to use your spreadsheet ID. In the Apps Script
   editor, choose `setupRegistrationSheet` from the function list and click
   **Run** to save that ID in Script Properties. The function logs the sheet
   URL; it does not create a new spreadsheet. The `Registrations` tab and its
   headers are created automatically when the first valid form submission arrives.
3. Choose **Deploy → New deployment → Web app**. Set **Execute as** to yourself
   and **Who has access** to **Anyone**. Authorize access to your sheet, deploy,
   and copy the Web app URL ending in `/exec`.
4. The website uses the deployment URL configured in
   `src/lib/registration.js`; replace that source constant if you deploy a new
   Apps Script URL. No environment variable is required.
5. Restart `npm run dev`. For a hosted site, rebuild/redeploy the site with
   `npm run build` after changing the URL.
6. Submit the popup with your own test details. Confirm that the success screen
   appears and a new row exists in the sheet. Test once with the gym name blank.

The script creates the `Registrations` tab and these columns on the first valid
submission: Timestamp, Name, Phone Number, Email, Gym Name. Submission IDs are
used only to confirm requests and are not written to the sheet. Retrying after a
saved request whose response was lost can add a duplicate row.

Use the deployed `/exec` URL, not the editor URL or `/dev` test URL. After
changing `GoogleSheets.gs`, deploy a new version through **Manage deployments**. If
access is restricted to signed-in Google users, anonymous visitors cannot
submit; use an account that allows an **Anyone** web-app deployment.

The URL-encoded POST avoids a CORS preflight. The frontend reads the JSON
response and shows success only when the matching submission is confirmed.
Do not use `no-cors`, which prevents confirmation. Failed requests keep entered
values and reuse their submission ID when retried.

The endpoint validates fields again, serializes writes, and stores text without
evaluating spreadsheet formulas. It does
not send email or WhatsApp messages, process payment, or confirm a paid booking.
No sheet ID or Google credentials belong in frontend code.

Until the URL and sheet are configured, the popup opens and validates input
but reports that registration is unavailable on submission. It never pretends
the details were saved.

## Checks

```sh
npm test
npm run lint
npm run build
```

Tests cover client validation and submission responses plus the Apps Script
backend using mocked Google services. They do not write to a live spreadsheet.
