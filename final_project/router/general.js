const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({ message: "Missing username or password" });
    } else if (isValid(username)) {
      return res.status(404).json({ message: "User already exists.", users: users });
    } else {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "Customer successfully registered. Now you can login.",
        users: users
      });
    }
  });


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

 try {
    const { isbn } = req.params;
    const book = books[isbn];

    if (!book) {
      const e = new Error();
      e.message = "Book not found.";
      e.status = 404;
      throw e;
    }

    return res.status(200).json(book);
  } catch (e) {
    return res.status(e.status).send(e.message);
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

      // Extract the email parameter from the request URL
    const { author } = req.params;
    // Filter the users array to find users whose email matches the extracted email parameter
    let filtered_books = Object.values(books).filter((book) => book.author === author);
    // Send the filtered_users array as the response to the client
    res.send(filtered_books);

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 //Write your code here

      // Extract the email parameter from the request URL
    const { title } = req.params;
    // Filter the users array to find users whose email matches the extracted email parameter
    let filtered_books = Object.values(books).filter((book) => book.title === title);
    // Send the filtered_users array as the response to the client
    res.send(filtered_books);

  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

 try {
    const { isbn } = req.params;
    const book = books[isbn];

    if (!book) {
      const e = new Error();
      e.message = "Book not found.";
      e.status = 404;
      throw e;
    }

    return res.status(200).json(book.reviews);
  } catch (e) {
    return res.status(e.status).send(e.message);
  }
});

////promise
  /////////////////////




module.exports.general = public_users;
