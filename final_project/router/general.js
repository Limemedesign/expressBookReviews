const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//******************************************************** */
//the code for registering a new user
// using
// let isValid = require("./auth_users.js").isValid;
// let users = require("./auth_users.js").users;

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

//******************************************************** */
// using
// let books = require("./booksdb.js");
//code 1
// Get the book list available in the shop

//public_users.get('/',function (req, res) {
//  return res.status(200).json(books);
//});

//////////////////////promise////////////////////////////

public_users.get('/',async function (req, res) {
    try {
        const data = await new Promise((resolve, reject) => {
            if (books) {
                resolve(books)
            } else {
                reject("Error: No book")
            }
        })
         res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ message: error })
    }
   
});

//******************************************************** */
//code 2
// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here

//  try {
//     const { isbn } = req.params;
//     const book = books[isbn];

//     if (!book) {
//       const e = new Error();
//       e.message = "Book not found.";
//       e.status = 404;
//       throw e;
//     }

//     return res.status(200).json(book);
//   } catch (e) {
//     return res.status(e.status).send(e.message);
//   }
// });

//////////////////////promise////////////////////////////

public_users.get('/isbn/:isbn', async function (req, res) {
      
    const { isbn } = req.params;
      try {  
        const dataFromISBN = await new Promise((resolve, reject) => {
        const book = books[isbn];
            if (book) {
                resolve(book)
            } else {
                reject({ message: "Error: no book", Status: 404})
            }
        });
        // ส่ง response พร้อมข้อมูลหนังสือถ้าค้นพบ
        return res.status(200).json(dataFromISBN);

        } catch (e) {
        // จัดการข้อผิดพลาดและส่ง response
        return res.status(e.status || 500).send(e.message || "An error occurred");
        }
    });


//******************************************************** */
//code 3
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here

//       // Extract the email parameter from the request URL
//     const { author } = req.params;
//     // Filter the users array to find users whose email matches the extracted email parameter
//     let filtered_books = Object.values(books).filter((book) => book.author === author);
//     // Send the filtered_users array as the response to the client
//     res.send(filtered_books);

//   //return res.status(300).json({message: "Yet to be implemented"});
// });

//////////////////////promise////////////////////////////

public_users.get('/author/:author', async function (req, res) {

    const { author } = req.params;
    
    try {
      const dataFromAuthor = await new Promise((resolve, reject) => {
      let filtered_books = Object.values(books).filter((book) => book.author === author);  
      
      if (filtered_books) {
            resolve(filtered_books)
        } else {
            reject({ message: "Error: no book", Status: 404 })
        }
      });
      return res.status(200).json(dataFromAuthor);

    } catch (e) {
        return res.status(e.status || 500).send(e.message || "An error occurred");
    }
  });

//******************************************************** */
//code 4
// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//  //Write your code here

//       // Extract the email parameter from the request URL
//     const { title } = req.params;
//     // Filter the users array to find users whose email matches the extracted email parameter
//     let filtered_books = Object.values(books).filter((book) => book.title === title);
//     // Send the filtered_users array as the response to the client
//     res.send(filtered_books);

//   //return res.status(300).json({message: "Yet to be implemented"});
// });

//////////////////////promise////////////////////////////


public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;
    try {
        const dataFromTitle = await new Promise((resolve, reject) => {
        let filtered_books = Object.values(books).filter((book) => book.title === title);
        if (filtered_books) {
            resolve(filtered_books)
        } else {
            reject({ message: "Error: no book", Status: 404})
        }
       });
    return res.status(200).json(dataFromTitle);

    } catch(e) {
        return res.status(e.status || 500).send(e.message || "An error occurred");
    }

    });


//******************************************************** */
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

module.exports.general = public_users;
