Skip Tracing Automation for Google Sheet Leads

This project automates skip tracing by using Apify to scrape TruPeopleSearch for phone numbers of leads listed in a Google Sheet. It reads lead data from Google Sheets, scrapes the TruPeopleSearch website, and updates the Google Sheet with the retrieved phone numbers.

Project Breakdown

googleSheets.js

Contains functions for Google Sheets operations:

authorize(): Authenticates using service account credentials.

getSheetData(): Fetches lead data from Google Sheets.

updateSheet(): Updates Google Sheets with scraped phone numbers.

apifyScraper.js

Contains Apify scraping logic for extracting phone numbers from TruPeopleSearch based on provided names.

main.js

The primary script that ties together Google Sheets and Apify, orchestrating the entire workflow from fetching data to updating the Google Sheet.

