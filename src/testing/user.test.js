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
  it("GET /user/content/get", (done) => {
    chai
      .request(server)
      .get("/user/content/get")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Array");
        done();
      });
  });
  it("GET /user/comment/get/:page-:limit/:contentId", (done) => {
    chai
      .request(server)
      .get("/user/comment/get/1-2/60ed5544b735fb713a22d5bb")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Array");
        done();
      });
  });
  it("GET /user/search/:keyword", (done) => {
    chai
      .request(server)
      .get("/user/search/moon")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Array");
        done();
      });
  });
  it("GET /user/newResult", (done) => {
    chai
      .request(server)
      .get("/user/newResult")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Array");
        done();
      });
  });
  it("GET /user/content", (done) => {
    chai
      .request(server)
      .get("/user/content")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Array");
        done();
      });
  });
  it("GET /user/contentID/:_id", (done) => {
    chai
      .request(server)
      .get("/user/contentID/60f3e49cceddbc3818cab575")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });
  it("GET /user/profile", (done) => {
    chai
      .request(server)
      .get("/user/profile")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });
  it("POST /images", (done) => {
    chai
      .request(server)
      .post("/images")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .attach("photo", "uploads/test.jpg")
      .end((err, res) => {
        done();
      });
  });
});
