document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    
    if (!token && window.location.pathname !== '/index.html' && window.location.pathname !== '/register.html') {
        window.location.href = '/index.html';
    } else if (token && window.location.pathname === '/main.html') {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (userName) {
            const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
            welcomeElement.textContent = `Welcome, ${capitalizedUserName}`;
        } else {
            console.log('User name not found in localStorage');
        }
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = '/index.html';
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed');
    }
});

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            console.log('Token stored in localStorage:', data.token);

            // Fetch user details after storing the token
            await fetchUserDetails(data.token);

            window.location.href = '/main.html';
        } else {
            const errorData = await response.json();
            console.error('Login error:', errorData);
            alert('Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed');
    }
});

async function fetchUserDetails(token) {
    try {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('userName', user.name);
            console.log('User name stored in localStorage:', user.name);
        } else {
            console.error('Failed to fetch user details');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    window.location.href = '/index.html';
});
