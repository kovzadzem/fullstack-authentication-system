// 1. jsonwebtoken ბიბლიოთეკის შემოტანა ტოკენის ვერიფიკაციისთვის (შემოწმებისთვის)
const jwt = require('jsonwebtoken');


// 2. Middleware ფუნქციის ექსპორტი (req - მოთხოვნა, res - პასუხი, next - შემდეგ ეტაპზე გადასვლა)
module.exports = (req, res, next) => {
   
   
    // 3. ტოკენის ამოღება HTTP Header-იდან (ველოდებით ფორმატს: "Bearer TOKEN_HERE")
    // ?.split(' ')[1] ნიშნავს, რომ ვიღებთ მხოლოდ ტოკენს "Bearer"-ის გარეშე
    const token = req.header('Authorization')?.split(' ')[1];
    
    
    // 4. თუ ტოკენი საერთოდ არ არსებობს, ვაბრუნებთ 401 შეცდომას (Unauthorized)
    if (!token) return res.status(401).json({ message: 'წვდომა უარყოფილია. ტოკენი არ არსებობს.' });


    // 5. ტოკენის შემოწმება "საიდუმლო გასაღებით" (JWT_SECRET), რომელიც .env ფაილშია
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 6. თუ ტოკენი სწორია, მასში ჩაშიფრულ ინფორმაციას (მაგ: იუზერის ID) ვამატებთ მოთხოვნის (req) ობიექტს
        req.user = decoded;
       
        // 7. next() ფუნქცია ეუბნება Express-ს, რომ შემოწმება გავლილია და გადავიდეს შემდეგ ფუნქციაზე (ლოგიკაზე)
        next();
    } catch (err) {
      
      
        // 8. თუ ტოკენი არასწორია (მაგალითად ვინმემ ხელით შეცვალა), ვაბრუნებთ შეცდომას
        res.status(401).json({ message: 'ტოკენი არ არის ვალიდური.' });
    }
};