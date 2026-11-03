// Santa & Sol waitlist: saves sign-ups from santasol.fun into the "Waitlist" Google Sheet.
//
// Lives in the Sheet's Apps Script project (Extensions > Apps Script), deployed as a
// Web app: Execute as "Me", Who has access "Anyone". The deployment's /exec URL goes in
// src/content/site.json as waitlistEndpoint. This copy is kept here for reference: after
// changing it, paste it into the Apps Script project and deploy a new version.

const SHEET_NAME = 'Sheet1';
const TIMEZONE = 'America/Costa_Rica';
const HEADERS = ['Signed up', 'Name', 'WhatsApp', 'Preferred beach',
                 'Preferred weekend', 'Status'];

// Bot protection: Cloudflare Turnstile. Put the Turnstile SECRET key in the script's
// properties (Project Settings > Script properties > Add: TURNSTILE_SECRET). Once it is
// set, every sign-up must carry a valid token from the widget on santasol.fun, so bots
// posting straight to this URL are turned away. Never paste the secret into this file.
const TURNSTILE_SECRET = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');

// Optional: put an email address between the quotes to get an email for every sign-up.
const NOTIFY_EMAIL = '';

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Spam protection: real people never fill in the hidden "company" field.
  if (p.company) return reply_({ ok: true });

  if (TURNSTILE_SECRET && !passesTurnstile_(p['cf-turnstile-response'])) {
    return reply_({ ok: false, error: 'failed bot check' });
  }

  const name = (p.name || '').trim();
  const whatsapp = (p.whatsapp || '').trim();
  if (!name || !whatsapp) return reply_({ ok: false, error: 'missing fields' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm'),
      name,
      "'" + whatsapp,               // the apostrophe keeps +506 numbers as text
      p.beach || '',
      p.weekend || '',
      'New'
    ]);
  } finally {
    lock.releaseLock();
  }

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, 'New Santa & Sol waitlist sign-up',
      name + ' (' + whatsapp + ') wants ' + (p.beach || '?') + ', ' + (p.weekend || '?'));
  }

  return reply_({ ok: true });
}

function passesTurnstile_(token) {
  if (!token) return false;
  const res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: TURNSTILE_SECRET, response: token },
    muteHttpExceptions: true
  });
  try {
    const data = JSON.parse(res.getContentText());
    return data.success === true && (!data.hostname || /santasol\.fun$/.test(data.hostname));
  } catch (err) {
    return false;
  }
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor (select "setupHeaders" and click Run) to add the column names now.
function setupHeaders() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}
