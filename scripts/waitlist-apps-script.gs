// Santa & Sol waitlist: saves sign-ups from santasol.fun into the "Waitlist" Google Sheet.
//
// Lives in the Sheet's Apps Script project (Extensions > Apps Script), deployed as a
// Web app: Execute as "Me", Who has access "Anyone". The deployment's /exec URL goes in
// src/content/site.json as waitlistEndpoint. This copy is kept here for reference: after
// changing it, paste it into the Apps Script project and deploy a new version.

const SHEET_NAME = 'Sheet1';
const TIMEZONE = 'America/Costa_Rica';
const HEADERS = ['Signed up', 'Name', 'WhatsApp', 'Preferred beach',
                 'Preferred weekend', 'Source', 'Medium', 'Campaign', 'Status'];

// Optional: put an email address between the quotes to get an email for every sign-up.
const NOTIFY_EMAIL = '';

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Spam protection: real people never fill in the hidden "company" field.
  if (p.company) return reply_({ ok: true });

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
      p.utm_source || '',
      p.utm_medium || '',
      p.utm_campaign || '',
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

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
