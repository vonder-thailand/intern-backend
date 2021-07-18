const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;

chai.use(chaiHttp);

let email = "" + Math.random() + "@gmail.com";
let password = "p" + Math.random();
let username = "user" + Math.random();
let firstName = "first" + Math.random();
let lastName = "last" + Math.random();
let role = Math.random() > 0.5 ? "admin" : "user";

describe("Authentication api ", () => {
  /*describe("POST login", () => {
    it("should return a token", (done) => {
      chai
        .request(server)
        .post("/login")
        .send({
          email: "jay@gmail.com",
          password: "1234",
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.token).to.not.be.undefined;
          done();
        });
    });
  });
  describe("POST signup", () => {
    it("should return a token", (done) => {
      chai
        .request(server)
        .post("/signup")
        .send({
          email: email,
          password: password,
          username: username,
          firstName: firstName,
          lastName: lastName,
          role: role,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.token).to.not.be.undefined;
          done();
        });
    });
  });*/
});
