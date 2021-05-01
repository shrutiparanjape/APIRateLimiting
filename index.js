const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const rateLimiterObj = require('./controller/rateLimitter');
const apiHandlerObj = require('./controller/apiHandler');

app.get('/ping', (req, res) => res.send('API Rate Limiting App'))
app.use(rateLimiterObj.rateLimiter)
app.get('/v1/weather', apiHandlerObj.apiHandler);
app.listen(port, () => console.log(`API Rate Limiting app listening at http://localhost:${port}`))