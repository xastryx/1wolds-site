module.exports = async (req, res) => {
  // Return and clear verification results
  if (global.verificationResults === undefined) {
    global.verificationResults = {}
  }

  const results = global.verificationResults
  global.verificationResults = {} // Clear results after retrieval

  res.status(200).json(results)
}
