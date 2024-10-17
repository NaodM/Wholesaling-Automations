// googleSheet.js: Script to interact with Google Sheets using Google API

const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Authorize function to authenticate using environment variables
async function authorize() {
    try {
        const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        return await auth.getClient();
    } catch (error) {
        console.error('Error parsing GOOGLE_SHEETS_CREDENTIALS:', error);
        throw error;
    }
}

// Function to get data from a Google Sheet
async function getSheetData(auth, spreadsheetId, range) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
            auth,
        });
        return response.data.values;
    } catch (error) {
        console.error('Error getting sheet data:', error);
        throw error;
    }
}

// Function to update data in a Google Sheet
async function updateSheet(auth, spreadsheetId, range, values) {
    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: { values },
            auth,
        });
    } catch (error) {
        console.error('Error updating sheet data:', error);
        throw error;
    }
}

module.exports = { authorize, getSheetData, updateSheet };
