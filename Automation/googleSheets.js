const { google } = require('googleapis');
const sheets = google.sheets('v4');

async function authorize() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return await auth.getClient();
}

async function getSheetData(auth, spreadsheetId, range) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        auth,
    });
    return response.data.values;
}

async function updateSheet(auth, spreadsheetId, range, values) {
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: { values },
        auth,
    });
}

module.exports = { authorize, getSheetData, updateSheet };
