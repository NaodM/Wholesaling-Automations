const { google } = require('googleapis');
const { KeyValueStore } = require('apify');
const sheets = google.sheets('v4');

// Authorization function to get authenticated client
async function authorize() {
    // Retrieve credentials from Apify Key-Value Store
    const keyValueStore = await KeyValueStore.open();
    const credentials = await keyValueStore.getValue('google_credentials');
    
    if (!credentials) {
        throw new Error("Credentials not found in Key-Value Store");
    }

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return await auth.getClient();
}

// Get data from Google Sheets
async function getSheetData(auth, spreadsheetId, range) {
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        auth,
    });
    return response.data.values;
}

// Update Google Sheets with given data
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
