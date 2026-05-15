document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');
    const themeBtn = document.getElementById('themeBtn');

    // 1. ავტორიზაციის (Login) ფუნქცია
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('http://127.0.0.1:5001/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', result.token);
                    alert('შესვლა წარმატებულია!');
                    window.location.href = 'dashboard.html';
                } else {
                    message.innerText = result.error;
                }
            } catch (err) {
                message.innerText = "სერვერთან კავშირი ვერ დამყარდა";
            }
        });
    }

    // 2. Dark Mode ლოგიკა
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
});