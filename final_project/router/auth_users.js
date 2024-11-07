// ฟังก์ชันการล็อกอินใน auth_users.js (หรือตามไฟล์ของคุณ)
const express = require("express");
const jwt = require("jsonwebtoken");
const regd_users = express.Router();
let books = require("./booksdb.js");

let users = [];

// Check if a user with the given username already exists
const isValid = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// โค้ดสำหรับ "/customer/login"
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }

  // สร้าง JWT และบันทึกในเซสชัน
  const payload = { username };
  const accessToken = jwt.sign(payload, "access", { expiresIn: 60 * 60 });

  req.session.authorization = { accessToken, username };

  return res.status(200).json({
    message: "User successfully logged in.",
    accessToken: accessToken
  });
});


// /customer/auth/review/:isbn
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
      res.status(403).json({ message: "User not authenticated" });
    }
    const { isbn } = req.params;
    const { review } = req.body;
  
    if (!isbn && !review && review !== null) {
      return res
        .status(400)
        .json({ message: "Invalid input: ISBN and review should be required" });
    }
  
    if (books[isbn]) {
      const book = books[isbn];
      const getReviewObj = book["reviews"];
      const username = req.session.authorization.username;
      if (getReviewObj[username]) {
        getReviewObj[username] = { review: review };
        res.status(200).send(`Review modified successfully ISBN : ${isbn}`);
      } else {
        getReviewObj[username] = { review: review };
        res.status(200).send(`Review added successfully ISBN : ${isbn}`);
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

  

// delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.session.authorization.username;  // ดึงชื่อผู้ใช้จาก session

    if (books[isbn]) {  // ตรวจสอบว่า ISBN นี้มีหนังสือในระบบหรือไม่
        const book = books[isbn];
        const reviews = book["reviews"];  // เข้าถึงรีวิวของหนังสือ

        if (reviews && reviews[username]) {  // ตรวจสอบว่าผู้ใช้เคยรีวิวหนังสือแล้วหรือไม่
            delete reviews[username];  // ลบรีวิวของผู้ใช้
            return res.status(200).send(`Review deleted for ISBN: ${isbn}`);
        } else {
            return res.status(404).send("Review not found");
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;