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
  // Add a new user
  /*const ss = new User({
    name: "sai",
    email: "sai1234@gmail.com",
    password: "1234",
  });
  await ss.save();
  */
  // Find all users
  //   const ss = await User.find();
  //   Used to find a particular user
  const ss = await User.find({ name: "sai" });
  console.log(ss);
};

adder();
