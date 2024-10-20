const { authorize, getSheetData, updateSheet } = require('./googleSheets');
const { runScraper } = require('./apifyScraper');

async function main() {
    try {
        // Step 1: Authorize Google Sheets Access
        const auth = await authorize();

        // Step 2: Get Addresses from Google Sheets
        const spreadsheetId = process.env.SPREADSHEET_ID; // Google Sheet ID from environment variable
        const sheetName = process.env.SHEET_NAME || 'Test'; // Sheet name from environment variable or default to 'Sheet1'
        const range = `${sheetName}!M2:M`; // Addresses are in column M, starting from row 2
        const leads = await getSheetData(auth, spreadsheetId, range);

        // Step 3: Extract Addresses from Leads, filter out empty addresses
        const searchAddresses = leads.map(lead => lead[0] ? lead[0] : null);

        // Step 4: Run Apify Scraper to Get Information
        const scrapedData = await runScraper(searchAddresses.filter(address => address !== null));

        // Step 5: Prepare Data for Update in Google Sheets
        const updateRangesPhones = [
            `${Test}!E2:E`, // Phone 1
            `${Test}!F2:F`, // Phone 2
            `${Test}!G2:G`, // Phone 3
            `${Test}!H2:H`, // Phone 4
            `${Test}!I2:I`, // Phone 5
            `${Test}!J2:J`, // Phone 6
            `${Test}!K2:K`, // Phone 7
            `${Test}!L2:L`  // Phone 8
        ];

        // Initialize arrays for each phone column
        const phoneNumbersByColumn = Array(updateRangesPhones.length).fill(null).map(() => []);

        // Fill phone numbers for each lead or leave blank if missing
        leads.forEach((lead, index) => {
            if (!lead[0]) {
                // If there is no address, leave all phone columns blank for this lead
                for (let i = 0; i < updateRangesPhones.length; i++) {
                    phoneNumbersByColumn[i].push(['']);
                }
            } else {
                // Find the scraped data for this address
                const scrapedInfo = scrapedData.find(item => item.address === lead[0]);
                if (scrapedInfo && scrapedInfo.phoneNumbers && scrapedInfo.phoneNumbers.length > 0) {
                    // If phone numbers are found, update columns accordingly
                    for (let i = 0; i < updateRangesPhones.length; i++) {
                        phoneNumbersByColumn[i].push([scrapedInfo.phoneNumbers[i] || '']);
                    }
                } else {
                    // If no phone numbers are found, leave columns blank
                    for (let i = 0; i < updateRangesPhones.length; i++) {
                        phoneNumbersByColumn[i].push(['']);
                    }
                }
            }
        });

        // Update each phone column
        for (let i = 0; i < updateRangesPhones.length; i++) {
            await updateSheet(auth, spreadsheetId, updateRangesPhones[i], phoneNumbersByColumn[i]);
        }

        console.log("Information has been updated successfully.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
