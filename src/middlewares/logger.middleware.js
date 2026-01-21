const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const { method, originalUrl } = req;

  console.log(`[${timestamp}] [REQ] ${method} ${originalUrl} - Started`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const endTimestamp = new Date().toISOString();
    console.log(`[${endTimestamp}] [RES] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = logger;
