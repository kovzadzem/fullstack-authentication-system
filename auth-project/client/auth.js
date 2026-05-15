const API_URL = '[http://127.0.0.1:5001/api](http://127.0.0.1:5001/api)';

// ერორების და წარმატების შეტყობინებების მართვა
function displayMessage(text, isSuccess = false) {
    const msgEl = document.getElementById('message');
    if (!msgEl) return;
    msgEl.innerText = text;
    if (isSuccess) {
        msgEl.classList.add('success');
    } else {
        msgEl.classList.remove('success');
    }
}

// 1. რეგისტრაციის ფორმის დამუშავება
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, confirmPassword })
        });
        const data = await res.json();
        
        if (res.ok) {
            displayMessage(data.message, true);
            // წარმატებული რეგისტრაციის მერე 2 წამში გადავიდეს ლოგინზე
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            displayMessage(data.message, false);
        }
    } catch (err) {
        displayMessage('სერვერთან კავშირი ვერ დამყარდა.');
    }
});

// 2. ლოგინის ფორმის დამუშავება
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            // ტოკენის შენახვა LocalStorage-ში
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            displayMessage(data.message, false);
        }
    } catch (err) {
        displayMessage('სერვერთან კავშირი ვერ დამყარდა.');
    }
});

// 3. Dashboard-ის დაცვა და ინფორმაციის წამოღება
if (window.location.pathname.includes('dashboard.html')) {
    const token = localStorage.getItem('token');
    
    // თუ ტოკენი საერთოდ არ გვაქვს, ვაბრუნებთ ლოგინის გვერდზე
    if (!token) {
        window.location.href = 'index.html';
    } else {
        fetch(`${API_URL}/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('სესია არავალიდურია');
            return res.json();
        })
        .then(user => {
            document.getElementById('userDisplay').innerText = user.username;
        })
        .catch(() => {
            // თუ ტოკენი ვადაგასულია ან არასწორია, ვშლით და ვაბრუნებთ ლოგინზე
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
}

// 4. სისტემიდან გამოსვლა (Logout)
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});