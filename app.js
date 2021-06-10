const express = require("express");
const {
  crateBook,
  findBookByName,
  updateBookById,
  deleteBookById,
  softDeleteBookById,
} = require("./src/functions/index");
const connectToDatabase = require("./src/utils/mongo");
const app = express();
const port = 8080;

const connectMongo = async (req, res, next) => {
  await connectToDatabase();
  next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(connectMongo);

// findbook
app.get("/book/:testname", async (req, res) => {
  // console.log({ param: req.params });
  // console.log({ query: req.query });
  try {
    const bookData = await findBookByName(req.params.testname);
    res.send(bookData);
  } catch (err) {
    console.log("err: ", err);
    res.send(err);
  }
});

//create book
app.post("/create/book", async (req, res) => {
  try {
    console.log("req: ", req.body);
    const book = await crateBook(req.body);
    res.send(book);
  } catch (err) {
    console.log("err: ", err);
    res.send(err);
  }
});

//update book
app.put("/edit/book", async (req, res) => {
  try {
    const updateBook = await updateBookById(req.body);
    res.send(updateBook);
  } catch (err) {
    console.log("err: ", err);
    res.send(err);
  }
});

//delete book
app.delete("/delete/book", async (req, res) => {
  try {
    console.log("req: ", req.body);
    const deleteBook = await softDeleteBookById(req.body);
    res.send(deleteBook);
  } catch (err) {
    console.log("err: ", err);
    res.send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
