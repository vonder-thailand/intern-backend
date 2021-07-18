const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;

chai.use(chaiHttp);

let token;
before((done) => {
  chai
    .request(server)
    .post("/login")
    .send({
      email: "admin@gmail.com",
      password: "1234",
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});
describe("Admin API", () => {});
