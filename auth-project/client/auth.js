// 1. ვამატებთ Event Listener-ს, რომელიც ელოდება მთლიანი HTML სტრუქტურის (DOM) ჩატვირთვას
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. DOM-ის ელემენტების სელექცია ID-ის მიხედვით, რათა შევძლოთ მათთან ინტერაქცია
    const loginForm = document.getElementById('loginForm'); // ავტორიზაციის ფორმა
    const message = document.getElementById('message');   // ადგილი შეცდომების გამოსატანად
    const themeBtn = document.getElementById('themeBtn'); // თემის გადამრთველი ღილაკი

    // 3. ვამოწმებთ, არსებობს თუ არა ფორმა გვერდზე (Error Handling-ისთვის)
    if (loginForm) {
        // ფორმის გაგზავნის (Submit) ივენთის მოსმენა
        loginForm.addEventListener('submit', async (e) => {
            
            // e.preventDefault() აჩერებს გვერდის ავტომატურ გადატვირთვას ფორმის გაგზავნისას
            e.preventDefault();
            
            // ინპუტებიდან ვიღებთ მომხმარებლის მიერ შეყვანილ ტექსტურ მნიშვნელობებს (.value)
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // 4. ვახორციელებთ ასინქრონულ HTTP POST მოთხოვნას სერვერის API ენდპოინტზე
                const res = await fetch('http://127.0.0.1:5001/api/login', {
                    method: 'POST', // განვსაზღვრავთ მოთხოვნის მეთოდს
                    headers: { 'Content-Type': 'application/json' }, // სერვერს ვეუბნებით, რომ ვუგზავნით JSON მონაცემებს
                    body: JSON.stringify({ email, password }) // JS ობიექტს ვაქცევთ JSON სტრინგად
                });

                // 5. სერვერიდან დაბრუნებულ პასუხს (Stream) ვაკონვერტირებთ JSON ფორმატში
                const result = await res.json();

                // 6. ვამოწმებთ სერვერის პასუხის სტატუსს (თუ სტატუსი არის 200-299 დიაპაზონში)
                if (res.ok) {
                    // localStorage-ში ვინახავთ სერვერიდან მოსულ JWT ტოკენს (Session Management)
                    localStorage.setItem('token', result.token);
                    
                    alert('შესვლა წარმატებულია!');
                    // Redirect: მომხმარებლის გადაყვანა დაცულ Dashboard გვერდზე
                    window.location.href = 'dashboard.html';
                } else {
                    // თუ ავტორიზაცია ვერ მოხერხდა, UI-ზე გამოგვაქვს სერვერიდან მოსული შეცდომის ტექსტი
                    message.innerText = result.error;
                }
            } catch (err) {
                // Network Error-ის დამუშავება (მაგალითად, თუ სერვერი გათიშულია)
                message.innerText = "სერვერთან კავშირი ვერ დამყარდა";
            }
        });
    }

    // --- 7. DARK MODE ლოგიკა (User Preference Persistence) ---

    // გვერდის ჩატვირთვისას ვამოწმებთ, რა თემა იყო შენახული ბრაუზერის მეხსიერებაში
    if (localStorage.getItem('theme') === 'dark') {
        // თუ შენახულია 'dark', Body ელემენტს ვამატებთ შესაბამის CSS კლასს
        document.body.classList.add('dark-mode');
        themeBtn.innerText = '☀️'; // ვცვლით ღილაკის ვიზუალს
    }

    // ღილაკზე დაჭერისას თემის გადართვა (Toggle Mechanism)
    themeBtn.addEventListener('click', () => {
        // classList.toggle ანაცვლებს კლასის არსებობას (თუ არის - შლის, თუ არაა - ამატებს)
        document.body.classList.toggle('dark-mode');
        
        // ვამოწმებთ, ამჟამად არის თუ არა აქტიური მუქი რეჟიმი
        const isDark = document.body.classList.contains('dark-mode');
        
        // მომხმარებლის არჩევანს ვინახავთ მეხსიერებაში, რომ დარეფრეშების შემდეგ არ დაიკარგოს
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // ღილაკის აიქონის დინამიური ცვლილება მდგომარეობის მიხედვით
        themeBtn.innerText = isDark ? '☀️' : '🌙';
    });
});