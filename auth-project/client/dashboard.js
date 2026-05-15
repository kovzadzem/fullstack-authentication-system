document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const themeBtn = document.getElementById('themeBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // 1. ავტორიზაციის შემოწმება
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. მომხმარებლის მონაცემების წამოღება
    async function loadProfile() {
        try {
            const res = await fetch('http://127.0.0.1:5001/api/profile', {
                headers: { 'Authorization': token }
            });
            const data = await res.json();

            if (res.ok) {
                document.getElementById('user').innerText = data.username;
                document.getElementById('mail').innerText = data.email;
            } else {
                logout(); // თუ ტოკენი არასწორია, პირდაპირ გამოაგდოს
            }
        } catch (err) {
            console.error("შეცდომა პროფილის ჩატვირთვისას:", err);
        }
    }

    // 3. გამოსვლის ფუნქცია
    function logout() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }

    logoutBtn.addEventListener('click', logout);

    // 4. Dark Mode ლოგიკა
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerText = '☀️';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeBtn.innerText = isDark ? '☀️' : '🌙';
    });

    loadProfile();
});
// ... (ავტორიზაციის და loadProfile-ის კოდი იგივე რჩება) ...

if (res.ok) {
    document.getElementById('user').innerText = data.username;
    document.getElementById('mail').innerText = data.email;
    // მომხმარებლის სახელის პირველი ასოს ჩასმა ავატარში
    document.getElementById('userInitial').innerText = data.username.charAt(0).toUpperCase();
}