const Apify = require('apify');

async function runScraper(searchAddresses) {
    const requestQueue = await Apify.openRequestQueue();
    for (const address of searchAddresses) {
        await requestQueue.addRequest({ url: `https://www.trupeoplesearch.com/results?address=${encodeURIComponent(address)}` });
    }

    const crawler = new Apify.CheerioCrawler({
        requestQueue,
        handlePageFunction: async ({ $ }) => {
            const phoneNumbers = [];
            $('span[itemprop="telephone"]').each((_, element) => {
                phoneNumbers.push($(element).text().trim());
            });

            // Extracting the Name
            let name = $('div.person-name').text().trim(); // Replace 'div.person-name' with the correct selector for the name
            
            // Extracting the Age
            let age = $('span.age').text().trim(); // Replace 'span.age' with the correct selector for the age
            
            await Apify.pushData({ name, age, phoneNumbers });
        },
    });

    await crawler.run();
    const dataset = await Apify.openDataset();
    const { items } = await dataset.getData();
    return items;
}

module.exports = { runScraper };
