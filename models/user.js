const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensures no duplicate emails
    }
});

// ✅ This will add `.authenticate()`, `.register()`, `.serializeUser()`, and `.deserializeUser()`
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
