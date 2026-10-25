/**
 * Lunar Medical – website inquiries → Google Sheet
 *
 * Paste into the sheet's Extensions → Apps Script editor, then deploy as a
 * web app (Execute as: Me, Who has access: Anyone). Put the /exec URL in
 * FORM_ENDPOINT in assets/js/main.js.
 */
const SHEET_NAME = 'Inquiries';
const NOTIFY_EMAIL = 'admin@lunar-med.com';
const HEADERS = ['Received', 'Name', 'Email', 'Organization', 'Phone', 'Topic', 'Message', 'Status'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.company_website) return json({ ok: true }); // honeypot: drop bots quietly
  if (!p.name || !p.email || !p.message) return json({ ok: false, error: 'missing fields' });

  const topic = p.topic_label || p.topic || 'General';
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([new Date(), clean(p.name), clean(p.email), clean(p.organization),
      clean(p.phone), clean(topic), clean(p.message), 'New']);
  } finally {
    lock.releaseLock();
  }

  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: String(p.email),
      subject: 'Website inquiry: ' + topic + ' from ' + String(p.name).slice(0, 100),
      body: [
        'Name: ' + p.name,
        'Email: ' + p.email,
        'Organization: ' + (p.organization || '-'),
        'Phone: ' + (p.phone || '-'),
        'Topic: ' + topic,
        '',
        String(p.message).slice(0, 5000),
        '',
        'Logged in the Website Inquiries sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      ].join('\n'),
    });
  } catch (err) {
    // The row is saved even if the notice email fails (e.g. daily quota).
  }

  return json({ ok: true });
}

// Trim, cap length, and stop values being read as spreadsheet formulas.
function clean(v) {
  v = String(v || '').trim().slice(0, 5000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
