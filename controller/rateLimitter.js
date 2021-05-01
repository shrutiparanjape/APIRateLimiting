const redis = require('ioredis')
const client = redis.createClient({
  port: 6380,
  host: 'redis',
})
client.on('connect', function () {
  console.log('connected to redis');
});

const limitValue = 10;
const expireTimeInSec = 60;

const rateLimiter  = async (req, res, next) => {
  // check rate limit
  let overLimit = await isOverLimit(req.ip)
  if (overLimit.limit) {
    return res.status(429).json({
      message: 'Too many requests - try again later',
      data: null
    });
  } else {
    req.body = {
      ...req.body,
      currentRateLimit: overLimit.res,
      remainingLimit: limitValue - overLimit.res
    };
    return next();
  }
}

async function isOverLimit(ip) {
  let limitFromRedis
  try {
    limitFromRedis = await client.incr(ip)
    console.log(`${ip} has value: ${limitFromRedis}`)
    if (limitFromRedis > limitValue) {
      response = {
        'limit': true
      }
    }else{
      response = {
        'limit': false,
        'res':limitFromRedis
      }
    }
    client.expire(ip, expireTimeInSec)
    return response;
  } catch (err) {
    console.error('limit: could not increment key')
    throw err
  }
}

module.exports = { rateLimiter }