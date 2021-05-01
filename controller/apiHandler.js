const apiHandler = (req, res) => {
    const { currentRateLimit, remainingLimit } = req.body;
    res.status(200).json({
        message: "Accessing resources",
        data: {
            currentRateLimit,
            remainingLimit
        }
    })
}

module.exports = { apiHandler };