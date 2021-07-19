const chai = require("chai");
const chaiJsonPattern = require("chai-json-pattern").default;
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;
const {
  authPattern,
  contentPattern,
  commentPattern,
  arraySearchPatten,
  resultPattern,
  userProfilePattern,
} = require("./user.pattern");

const commentModel = require("../models/comment.model");

chai.use(chaiHttp);
chai.use(chaiJsonPattern);

let token;
let comment_id;
const search_keyword = "moon";
const tag = ["word smart"];
const content_type = ["board"];
const content_id = "60e280a87d0a2a6450588ec9";

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
        _id: "60d96eb6add0dd4f80dd523e",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(authPattern);
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
        expect(res.body).to.matchPattern([contentPattern]);
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
        expect(res.body).to.matchPattern([commentPattern]);
        done();
      });
  });

  describe("GET /user/search/:keyword", () => {
    it("just search", (done) => {
      chai
        .request(server)
        .get("/user/search/" + search_keyword)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);
          done();
        });
    });
    it("filter tag && content_type -> search", (done) => {
      chai
        .request(server)
        .get("/user/search/" + search_keyword)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ tag: tag, content_type: content_type })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);
          done();
        });
    });
    it("filter tag -> search", (done) => {
      chai
        .request(server)
        .get("/user/search/" + search_keyword)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ tag: tag })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);
          done();
        });
    });
    it("filter content_type -> search", (done) => {
      chai
        .request(server)
        .get("/user/search/" + search_keyword)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ content_type: content_type })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);
          done();
        });
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
        expect(res.body).to.matchPattern([resultPattern]);
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
        expect(res.body).to.matchPattern([contentPattern]);
        done();
      });
  });

  it("GET /user/contentID/:_id", (done) => {
    chai
      .request(server)
      .get("/user/contentID/" + content_id)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(contentPattern);
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
        expect(res.body).to.matchPattern(userProfilePattern);
        done();
      });
  });
  it("POST /comment", (done) => {
    chai
      .request(server)
      .post("/comment")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        contentId: content_id,
        comment: "TDD",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(commentPattern);
        commen_id = res.body._id;
        done();
      });
  });

  /*
  it("POST /user/content", (done) => {
    chai
      .request(server)
      .post("/user/content")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        content_body: "hello world",
        content_type: "board",
        title: "hero",
        tag: ["logic smart"],
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });
  it("POST /user/content/tag", (done) => {
    chai
      .request(server)
      .post("/user/content/tag")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        tag: ["logic smart"],
        content_type: ["question", "board"],
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Array");
        done();
      });
  });
  it("POST /user/newResult", () => {
    chai
      .request(server)
      .post("/user/newResult")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send([
        { categoryId: 1, score: 2 },
        { categoryId: 2, score: 1 },
        { categoryId: 3, score: 1 },
        { categoryId: 4, score: 1 },
        { categoryId: 5, score: 1 },
        { categoryId: 6, score: 1 },
        { categoryId: 7, score: 1 },
        { categoryId: 8, score: 1 },
        { categoryId: 1, score: 1 },
        { categoryId: 2, score: 1 },
        { categoryId: 3, score: 1 },
        { categoryId: 4, score: 1 },
        { categoryId: 5, score: 1 },
        { categoryId: 6, score: 1 },
        { categoryId: 7, score: 1 },
        { categoryId: 8, score: 1 },
        { categoryId: 1, score: 1 },
        { categoryId: 2, score: 2 },
        { categoryId: 3, score: 3 },
        { categoryId: 4, score: 3 },
        { categoryId: 5, score: 3 },
        { categoryId: 6, score: 3 },
        { categoryId: 7, score: 3 },
        { categoryId: 8, score: 3 },
      ])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Object");
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
        expect(res).to.have.status(500);
        expect(res.body).to.be.a("String");
        done();
      });
  });*/
  //testing
});

describe("clear dummy database", () => {
  it("clear comment", async (done) => {
    const comment = await commentModel.deleteOne(
      { _id: comment_id },
      (unit, err, data) => {
        done();
      }
    );
  });
});
