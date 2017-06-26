/**
 * Created by shailesh on 25/6/17.
 */
"use strict";
const fs = require("fs"),
  es = require("event-stream");

class Stats {
  
  constructor(fileName) {
    this.fileName = fileName;
    this.statsMap = new Map();
    this.rowCount = 0;
    this.readLineByLine();
  }
  
  readLineByLine() {
    let s = fs.createReadStream(this.fileName)
      .pipe(es.split())
      .pipe(es.mapSync(line => {
      
        // pause the readstream
        s.pause();
      
        // process line here and call s.resume() when ready
        
        if (this.rowCount) {
          this.parseEachLine(line);
        }
        // resume the readstream, possibly from a callback
        this.rowCount++;
        s.resume();
      }))
      .on("error", err => {
        console.log("Error while reading file.", err);
      })
      .on("end", () => {
        console.log("Read entire file.");
        this.getAverageRating()
      });
  }
  
  parseEachLine(line) {
  
    let splitLine = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g); //split by commas but ignore commaas within quotes
    
    if (splitLine) {
      let airportName = splitLine[0] && splitLine[0].replace(/"/g, "") ? splitLine[0].replace(/"/g, "") : "",
        overallRating = splitLine[10] && splitLine[10].replace(/"/g, "") ? splitLine[10].replace(/"/g, "") : 0,
        recommended = splitLine[19] && splitLine[19].replace(/"/g, "") ? splitLine[19].replace(/"/g, "") : 0,
        date = splitLine[5] && splitLine[5].replace(/"/g, "") ? splitLine[5].replace(/"/g, "") : "",
        country = splitLine[4] && splitLine[4].replace(/"/g, "") ? splitLine[4].replace(/"/g, "") : "",
        content = splitLine[6] && splitLine[6].replace(/"/g, "") ? splitLine[6].replace(/"/g, "") : "";

      overallRating = Number(overallRating);
      recommended = Number(recommended);
      if (airportName) {
        if (!this.statsMap.has(airportName)) {
          this.statsMap.set(airportName, {
            "count": 1,
            "ratingList": [overallRating],
            "recommendations": recommended,
            "reviews": [{
              "overallRating": overallRating,
              "r_date": date,
              country,
              content
            }]
          });
        }else {
          let data = this.statsMap.get(airportName),
            reviewObj = {
              "overallRating": overallRating,
              "r_date": date,
              country,
              content
            };
      
          data.ratingList.push(overallRating);
          data.reviews.push(reviewObj);
          this.statsMap.set(airportName, {
            "count": data.count + 1,
            "ratingList": data.ratingList,
            "recommendations": recommended ? data.recommendations + 1 : data.recommendations,
            "reviews": data.reviews
          });
        }
      }
    }
  }
  
  getAllAirportStats(req, res) {
    if (this.statsMap.size) {
      let collection = [];
      
      for (let [key, value] of this.statsMap.entries()) {
        let collectionObj = {
          "name": key,
          "count": value.count
        };

        collection.push(collectionObj);
      }
      
      collection.sort((a, b) => {
        if (a.count > b.count) return -1;
        else if(a.count < b.count) return 1;
        else return 0;
      });
      return res.json(collection);
    }
  }
  
  getAirportStats(req, res) {
    let airport = req.params.airport,
      resultObj = {};
    
    if (this.statsMap.has(airport)) {
      let stats = this.statsMap.get(airport);

      resultObj.airportName = airport;
      resultObj.reviewsCount = stats.count;
      resultObj.averageRating = stats.averageRating;
      resultObj.recommendations = stats.recommendations;
      
      return res.json(resultObj);
    }
    
    return res.json(resultObj);
  }
  
  getAverageRating() {
    for (let value of this.statsMap.values()) {
      let {ratingList} = value;
      if (ratingList.length > 1) {
        value.averageRating = Stats.getSum(ratingList) / ratingList.length;
      }else {
        value.averageRating = ratingList[0];
      }
    }
  }
  
  getAirportReviews(req, res) {
    let airport = req.params.airport,
      collection = [];
    
    if (this.statsMap.has(airport)) {
      let reviews = this.statsMap.get(airport).reviews;
      
      collection.push(reviews);
      
      return res.json(collection);
    }
    return res.json(collection);
  }
  
  static getSum(list) {
    return list.reduce((a, b) => a + b);
  }
}

module.exports = Stats;