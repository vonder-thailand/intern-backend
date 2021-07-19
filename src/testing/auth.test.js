const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;
const userModel = require("../models/auth.model");

chai.use(chaiHttp);

let email = "" + Math.random() + "@gmail.com";
let password = "p" + Math.random();
let username = "user" + Math.random();
let firstName = "first" + Math.random();
let lastName = "last" + Math.random();
let role = Math.random() > 0.5 ? "admin" : "user";

describe("Authentication api ", () => {
  describe("POST login", () => {
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
          expect(res.body.resuit)
            .to.be.an("object")
            .to.have.keys([
              "role",
              "isDeleted",
              "_id",
              "firstName",
              "lastName",
              "email",
              "password",
              "username",
              "created_at",
              "updated_at",
            ]);
          expect(res.body.resuit.role).to.be.a("String");
          expect(res.body.resuit.isDeleted).to.be.a("Boolean");
          expect(res.body.resuit._id).to.be.a("String");
          expect(res.body.resuit.firstName).to.be.a("String");
          expect(res.body.resuit.lastName).to.be.a("String");
          expect(res.body.resuit.username).to.be.a("String");
          expect(res.body.resuit.email).to.be.a("String");
          expect(res.body.resuit.password).to.be.a("String");
          expect(res.body.resuit.created_at).to.be.a("String");
          expect(res.body.resuit.updated_at).to.be.a("String");
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
  });

  describe("Clear Databse", () => {
    it("should remove dummy documents", async () => {
      return await userModel.deleteOne({ username: username });
    });
  });
});
