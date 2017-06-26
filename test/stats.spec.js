/**
 * Created by shailesh on 25/6/17.
 */
"use strict";
process.env.NODE_ENV = 'test';
let chai = require('chai');
let should = chai.should(),
  server = require("../server"),
  chaiHttp = require('chai-http'),
  statsInstance = require('../lib/endpoints/stats');

chai.use(chaiHttp);

describe("Get Airport Stats", () => {
  it("should get collection of all airports stats", done => {
    chai.request(server)
      .get("/api/all/stats")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      })
  });
  
  it("should return stats for specific airports", done => {
    chai.request(server)
      .get("/api/aalborg-airport/stats")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("airportName");
        res.body.should.have.property("reviewsCount");
        res.body.should.have.property("recommendations");
        done();
      })
  });
  
  it("should return collection of reviews of given airports", done => {
    chai.request(server)
      .get("/api/aalborg-airport/reviews")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      })
  })
});

describe("Math", () => {
  it("should return sum of array of integers", done => {
    let sum = statsInstance.getSum([1, 2, 3, 4, 5]);
    
    sum.should.be.eql(15);
    done()
  });
});