const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token;
before(function (done) {
  chai
    .request(server)
    .post("/login")
    .send({
      email: "jay@gmail.com",
      password: "1234",
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe("User api", () => {
  //test path /user/find
  it("GET /user/find", (done) => {
    chai
      .request(server)
      .get("/user/find")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        _id: "60cc581817f3b688c92504c4",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });
});
