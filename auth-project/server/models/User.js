// 1. mongoose ბიბლიოთეკის შემოტანა, რომელიც დაგვეხმარება სქემის (Schema) შექმნაში
const mongoose = require('mongoose');

// 2. მომხმარებლის სქემის განსაზღვრა (მონაცემთა სტრუქტურა)
// სქემა არის "ყალიბი", რომელსაც ყველა ახალი მომხმარებელი უნდა ერგებოდეს
const UserSchema = new mongoose.Schema({
    // username ველი: უნდა იყოს ტექსტი (String) და მისი შევსება აუცილებელია (required)
    username: { type: String, required: true },
    
    // email ველი: აუცილებელია და უნდა იყოს უნიკალური (unique: true)
    // ეს ნიშნავს, რომ ბაზა ორ სხვადასხვა მომხმარებელს ერთი და იმავე მეილით არ დაარეგისტრირებს
    email: { type: String, required: true, unique: true },
   
   // password ველი: აუცილებელია. აქ ჩაიწერება დაშიფრული (Hashed) პაროლი
    password: { type: String, required: true }
});

// 3. მოდელის შექმნა და ექსპორტი
// 'User' არის კოლექციის სახელი ბაზაში, ხოლო UserSchema არის მისი წესების ერთობლიობა
module.exports = mongoose.model('User', UserSchema);