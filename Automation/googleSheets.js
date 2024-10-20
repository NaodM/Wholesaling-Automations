const { google } = require('googleapis');

// Authorization function to get authenticated client
async function authorize() {
    // Retrieve credentials from environment variable
    const credentialsString = process.env.GOOGLE_SHEETS_CREDENTIALS;

    if (!credentialsString) {
        throw new Error("Credentials not found in Environment Variables");
    }

    // Parse the credentials JSON string
    let credentials;
    try {
        credentials = JSON.parse(credentialsString);
    } catch (error) {
        throw new Error("Failed to parse credentials JSON from Environment Variables");
    }

    // Use the parsed credentials to authorize
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return await auth.getClient();
}

// Get data from Google Sheets
async function getSheetData(auth, spreadsheetId, range) {
    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data.values;
}

// Update Google Sheets with given data
async function updateSheet(auth, spreadsheetId, range, values) {
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: { values },
    });
}

// Exporting all the functions
module.exports = { authorize, getSheetData, updateSheet };
