/* global ContentService, LockService, Logger, PropertiesService, SpreadsheetApp */
/*
 * Google Apps Script backend for the Pango registration form.
 * Paste this file into Code.gs in your Apps Script project.
 * Run setupRegistrationSheet once, then deploy as a Web app.
 */

var REGISTRATION_HEADERS_ = [
  "Timestamp",
  "Name",
  "Phone Number",
  "Email",
  "Gym Name",
];
var REGISTRATION_SPREADSHEET_ID_ =
  "1yrMuIfk6MZP3wOhR7FuM9jyVxr9_eYB8PMN5qd6p9MA";

function setupRegistrationSheet() {
  var properties = PropertiesService.getScriptProperties();
  var spreadsheetId = REGISTRATION_SPREADSHEET_ID_;
  var sheetName = (
    properties.getProperty("SHEET_NAME") || "Registrations"
  ).trim();
  properties.setProperty("SPREADSHEET_ID", spreadsheetId);
  properties.setProperty("SHEET_NAME", sheetName);

  var url = "https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/edit";
  Logger.log("Registration spreadsheet configured: " + url);
  return url;
}

// eslint-disable-next-line no-unused-vars -- Invoked by Google Apps Script.
function doGet() {
  return registrationJson_({
    ok: true,
    message:
      "Registration endpoint is live. Submit the website form to save your details.",
  });
}

// eslint-disable-next-line no-unused-vars -- Invoked by Google Apps Script.
function doPost(event) {
  try {
    if (event && event.postData && Number(event.postData.length) > 10000) {
      return registrationJson_({
        ok: false,
        error: "The submitted form is too large.",
      });
    }

    var result = validateRegistration_(event && event.parameter);
    if (!result.ok) return registrationJson_(result);

    var properties = PropertiesService.getScriptProperties();
    var spreadsheetId = REGISTRATION_SPREADSHEET_ID_;
    var sheetName = (
      properties.getProperty("SHEET_NAME") || "Registrations"
    ).trim();
    if (!spreadsheetId || !sheetName) {
      return registrationJson_({
        ok: false,
        error:
          "Registration is temporarily unavailable. Please try again later.",
      });
    }

    var lock = LockService.getScriptLock();
    if (!lock.tryLock(30000)) {
      return registrationJson_({
        ok: false,
        error: "Registration is busy right now. Please try again in a moment.",
      });
    }

    try {
      var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      var sheet =
        spreadsheet.getSheetByName(sheetName) ||
        spreadsheet.insertSheet(sheetName);
      var lastRow = sheet.getLastRow();

      if (lastRow === 0) {
        sheet
          .getRange(1, 1, 1, REGISTRATION_HEADERS_.length)
          .setValues([REGISTRATION_HEADERS_]);
        lastRow = 1;
      } else {
        var existingHeaders = sheet
          .getRange(1, 1, 1, REGISTRATION_HEADERS_.length)
          .getValues()[0];
        if (
          REGISTRATION_HEADERS_.some(function (header, index) {
            return existingHeaders[index] !== header;
          })
        ) {
          throw new Error("Unexpected registration sheet columns.");
        }
      }

      var data = result.data;
      sheet.getRange(lastRow + 1, 2, 1, 4).setNumberFormat("@");
      sheet
        .getRange(lastRow + 1, 1, 1, REGISTRATION_HEADERS_.length)
        .setValues([
          [
            new Date(),
            registrationCell_(data.name),
            registrationCell_(data.phone),
            registrationCell_(data.email),
            registrationCell_(data.gymName),
          ],
        ]);
      SpreadsheetApp.flush();
      return registrationJson_({ ok: true, submissionId: data.submissionId });
    } finally {
      lock.releaseLock();
    }
  } catch {
    return registrationJson_({
      ok: false,
      error: "We could not save your details. Please try again in a moment.",
    });
  }
}

function validateRegistration_(parameters) {
  var fields = parameters || {};
  var text = function (key) {
    return typeof fields[key] === "string" ? fields[key].trim() : "";
  };
  if (text("website")) {
    return {
      ok: false,
      error: "The form could not be submitted. Please try again.",
    };
  }

  var name = text("name");
  var rawPhone = text("phone");
  var phone = rawPhone.replace(/[\s().-]/g, "");
  var email = text("email").toLowerCase();
  var gymName = text("gymName");
  var submissionId = text("submissionId").toLowerCase();
  var errors = {};
  // eslint-disable-next-line no-control-regex -- Reject control characters in submitted text.
  var controlCharacters = /[\u0000-\u001f\u007f]/;

  if (name.length < 2 || name.length > 80 || controlCharacters.test(name)) {
    errors.name = "Enter your name using 2 to 80 characters.";
  }
  if (
    rawPhone.length > 30 ||
    !/^\+?[\d\s().-]+$/.test(rawPhone) ||
    !/^\+?\d{10,15}$/.test(phone) ||
    controlCharacters.test(rawPhone)
  ) {
    errors.phone = "Enter a valid phone number with 10 to 15 digits.";
  }
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    controlCharacters.test(email)
  ) {
    errors.email = "Enter a valid email address.";
  }
  if (gymName.length > 120 || controlCharacters.test(gymName)) {
    errors.gymName = "Use 120 characters or fewer for your gym name.";
  }
  if (Object.keys(errors).length) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      errors: errors,
    };
  }
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      submissionId,
    )
  ) {
    return { ok: false, error: "Please reopen the form and try again." };
  }

  return {
    ok: true,
    data: {
      name: name,
      phone: phone,
      email: email,
      gymName: gymName,
      submissionId: submissionId,
    },
  };
}

function registrationCell_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function registrationJson_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
