# Mongoose Cheat Sheet

## Introduction to Mongoose

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward and schema-based solution to model your application data and interact with MongoDB collections. This cheat sheet covers the essential concepts and commands for using Mongoose effectively.

<img src="https://miro.medium.com/v2/resize:fit:1050/1*acfAKaDI7uv5GyFnJmiPhA.png" alt="Mongoose Image" width="300px"/>

## Table of Contents
1. [Installation](#installation)
2. [Connecting to MongoDB](#connecting-to-mongodb)
3. [Defining a Mongoose Schema](#defining-a-mongoose-schema)
4. [Creating a Model](#creating-a-model)
5. [CRUD Operations](#crud-operations)
   - Create
   - Read
   - Update
   - Delete
6. [Querying with Mongoose](#querying-with-mongoose)
   - Comparison Operators
   - Logical Operators
   - Regular Expressions
   - Sorting
   - Pagination
   - Counting Documents
7. [Middleware](#middleware)
   - Document Middleware
   - Query Middleware
   - Aggregate Middleware
8. [Validation](#validation)
9. [Population](#population)
10. [Indexes](#indexes)
11. [Embedding Documents](#embedding-documents)
12. [References](#references)
13. [Transactions](#transactions)
14. [Aggregation](#aggregation)
15. [Virtuals](#virtuals)
16. [Plugins](#plugins)
17. [Debugging](#debugging)

## Installation

Install Mongoose in your Node.js project using npm or yarn:

```bash
npm install mongoose
```

## Connecting to MongoDB

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
```
**Example**
```javascript
// getting-started.js
const mongoose = require("mongoose");

async function main() {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/sample")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB...", err));
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch((err) => console.log(err));
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true }, // Added 'required' property for email
  password: String,
});

const User = mongoose.model("User", userSchema);
const adder = async () => {
  const ss = new User({
    name: "sai",
    email: "sai1234@gmail.com",
    password: "1234",
  });

  await ss.save();
};

adder();

```

## Defining a Mongoose Schema

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  profileImage: { type: Buffer }, // For storing image data in the database
});

const User = mongoose.model('User', userSchema);
```

## Creating a Model
```javascript
const express = require('express');
const multer = require('multer');
const upload = multer(); // Middleware for handling multipart/form-data (file uploads)

const app = express();

app.post('/users', upload.single('profileImage'), async (req, res) => {
  const { name, email, age } = req.body;
  const profileImage = req.file ? req.file.buffer : undefined; // Get the image data from the request

  try {
    const newUser = new User({ name, email, age, profileImage });
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
```

## CRUD Operations

### Create

```javascript
const express = require('express');
const multer = require('multer');
const upload = multer(); // Middleware for handling multipart/form-data (file uploads)

const app = express();

app.post('/users', upload.single('profileImage'), async (req, res) => {
  const { name, email, age } = req.body;
  const profileImage = req.file ? req.file.buffer : undefined; // Get the image data from the request

  try {
    const newUser = new User({ name, email, age, profileImage });
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
```

### Read

```javascript
app.get('/users', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send(allUsers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
```

### Update

```javascript
app.patch('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const { age } = req.body;

  try {
    await User.updateOne({ _id: userId }, { age });
    res.send('User updated successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
```

### Delete

```javascript
app.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await User.deleteOne({ _id: userId });
    res.send('User deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});
```

## Querying with Mongoose

### Comparison Operators

```javascript
const usersWithAgeGreaterThan25 = await User.find({ age: { $gt: 25 } });
const usersWithNameEqualToJohn = await User.find({ name: 'John' });
```

### Logical Operators

```javascript
const usersWithAgeGreaterThan25AndNameEqualToJohn = await User.find({ $and: [{ age: { $gt: 25 } }, { name: 'John' }] });
const usersWithAgeGreaterThan25OrNameEqualToJohn = await User.find({ $or: [{ age: { $gt: 25 } }, { name: 'John' }] });
```

### Regular Expressions

```javascript
const usersWithEmailMatchingPattern = await User.find({ email: { $regex: /example\.com$/ } });
```

### Sorting

```javascript
const sortedUsersByNameAscending = await User.find().sort({ name: 1 });
const sortedUsersByAgeDescending = await User.find().sort({ age: -1 });
```

### Pagination

```javascript
const pageSize = 10;
const pageNumber = 2;
const usersPage = await User.find().skip((pageNumber - 1) * pageSize).limit(pageSize);
```

### Counting Documents

```javascript
const totalUsers = await User.countDocuments();
```

## Middleware

Middleware in Mongoose can be used for various purposes, such as image processing before saving an image to the database. For simplicity, we will use middleware for logging.

```javascript
userSchema.pre('save', function (next) {
  console.log('About to save a user.');
  next();
});
```

## Validation

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, validate: /^\S+@\S+\.\S+$/ },
  age: { type: Number, min: 18, max: 100 },
});
```

## Population

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

const postSchema = new mongoose.Schema({
  title: String,
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

const user = await User.findOne().populate('posts');
```

## Indexes

```javascript
userSchema.index({ name: 1 }); // Single field index
userSchema.index({ age: 1, email: 1 }); // Compound index
```

## Embedding Documents

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  address: {
    street: String,
    city: String,
    country: String,
  },
});
```

## References

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

const postSchema = new mongoose.Schema({
  title: String,
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
```

## Transactions

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await newUser.save({ session: session });
  await newPost.save({ session: session });

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

## Aggregation

```javascript
const usersWithTotalPosts = await User.aggregate([
  { $lookup: { from: 'posts', localField

: 'posts', foreignField: '_id', as: 'totalPosts' } },
  { $project: { name: 1, totalPosts: { $size: '$totalPosts' } } },
]);
```

## Virtuals

```javascript
userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});
```

## Plugins

```javascript
const mongoose = require('mongoose');
const timestampPlugin = require('mongoose-timestamp');

userSchema.plugin(timestampPlugin);
```

## Debugging

Set

 the `DEBUG` environment variable to `mongoose:*` to enable Mongoose debugging logs:

```bash
DEBUG=mongoose:* node your-app.js
```

# Conclusion

In conclusion, this Mongoose cheat sheet serves as a valuable reference guide for efficiently working with MongoDB in Node.js applications. Covering key concepts such as schema definition, model creation, CRUD operations, querying, middleware, validation, population, and more, it equips developers of all levels with the knowledge to build robust and scalable applications with ease. Happy coding with Mongoose and MongoDB!

## License

This project is licensed under the [MIT License](LICENSE).
