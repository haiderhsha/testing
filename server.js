
    const express = require('express');
    const axios = require('axios');
    const { Parser } = require('json2csv');

    const app = express();

    // BigCommerce API credentials
    const storeHash = 'k78hfijwo5';  // Replace with your store hash
    const accessToken = 'ep5vyvspq007uflt3vndnnt1hfoktqj';  // Replace with your access token

    // BigCommerce API endpoint for product reviews
    const reviewsApiUrl = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products/reviews`;

    // Route to handle CSV export
    app.get('/export-reviews', async (req, res) => {
        try {
            // Fetch product reviews from BigCommerce API
            const response = await axios.get(reviewsApiUrl, {
                headers: {
                    'X-Auth-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            });

            const reviews = response.data.data;
            const fields = ['id', 'product_id', 'customer_id', 'rating', 'date_added', 'review'];

            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(reviews);

            res.header('Content-Type', 'text/csv');
            res.attachment('reviews_export.csv');
            res.send(csv);

        } catch (error) {
            console.error('Error fetching or exporting reviews:', error);
            res.status(500).send('Error occurred while exporting reviews.');
        }
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port 3000');
    });
    