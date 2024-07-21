document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/index.html';
      return;
    }
  
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'x-auth-token': token }
      });
      if (response.ok) {
        const user = await response.json();
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
      } else {
        alert('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  });
  
  document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
  
    const body = { name, email };
    if (oldPassword && newPassword) {
      body.oldPassword = oldPassword;
      body.newPassword = newPassword;
    }
  
    const response = await fetch('/api/users/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(body)
    });
  
    if (response.ok) {
      alert('Profile updated successfully!');
    } else {
      alert('Profile update failed');
    }
  });
  