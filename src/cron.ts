import { websitesToScrape } from './config/scraping-config';
import { scrapeAllWebsites } from './scrapers/scraper';

scrapeAllWebsites(websitesToScrape).catch(error => {
  console.error('Initial scraping failed:', error);
});


// Ensure database connection
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connection established');
    
//     // Run scraping job every day at midnight
//     cron.schedule('0 0 * * *', async () => {
//       try {
//         await scrapeAllWebsites(websitesToScrape);
//       } catch (error) {
//         console.error('Cron job failed:', error);
//       }
//     });

//     // Optional: Run immediately on startup
//     scrapeAllWebsites(websitesToScrape).catch(error => {
//       console.error('Initial scraping failed:', error);
//     });
//   })
//   .catch(error => {
//     console.error('Unable to connect to the database:', error);
//   });
