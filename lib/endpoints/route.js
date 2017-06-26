/**
 * Created by shailesh on 25/6/17.
 */
const express = require('express'),
  router = express.Router(),
  Stats = require('./stats'),
  path = require("path"),
  env = process.env.NODE_ENV,
  config = require("../../config/"+ env),
  fileName = path.resolve(config.fileName),
  statsInstance = new Stats(fileName);

router.get('/all/stats', statsInstance.getAllAirportStats.bind(statsInstance));
router.get('/:airport/stats', statsInstance.getAirportStats.bind(statsInstance));
router.get('/:airport/reviews', statsInstance.getAirportReviews.bind(statsInstance));


module.exports = router;