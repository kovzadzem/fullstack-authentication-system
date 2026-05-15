document.addEventListener('DOMContentLoaded', () => {
    const regForm = document.getElementById('regForm');
    const themeBtn = document.getElementById('themeBtn');

    // 1. რეგისტრაციის ლოგიკა
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            username: document.getElementById('regUser').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPass').value,
            confirmPassword: document.getElementById('regConfirm').value
        };

        try {
            const res = await fetch('http://127.0.0.1:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            
            if (res.ok) {
                alert(result.message);
                window.location.href = 'index.html'; // წარმატების შემთხვევაში გადავიდეს ლოგინზე
            } else {
                alert(result.error);
            }
        } catch (err) {
            alert("სერვერთან კავშირი ვერ დამყარდა");
        }
    });

    // 2. Dark Mode ლოგიკა (იდენტური ყველა გვერდისთვის)
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