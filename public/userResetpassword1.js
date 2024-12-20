// Auto-populate the email field on page load
document.addEventListener('DOMContentLoaded', async () => {
    const emailField = document.getElementById('emailid_to_reset');
    const statusMessage = document.createElement('p'); // Status message for any errors
    document.body.appendChild(statusMessage);

    // Retrieve the user's email from localStorage (or API)
    const token = localStorage.getItem('userToken');
    if (!token) {
        statusMessage.textContent = 'You are not logged in. Redirecting to login...';
        statusMessage.style.color = 'red';
        setTimeout(() => {
            window.location.href = 'userLogin.html';
        }, 2000);
        return;
    }

    try {
        const response = await fetch('/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const userData = await response.json();
            emailField.value = userData.email; // Auto-populate email field
        } else {
            const error = await response.json();
            statusMessage.textContent = error.message || 'Error fetching email.';
            statusMessage.style.color = 'red';
        }
    } catch (error) {
        statusMessage.textContent = 'An error occurred while fetching your email.';
        statusMessage.style.color = 'red';
    }
});

// Handle the "Send OTP" button click
document.getElementById('send_otp_button').addEventListener('click', async () => {
    const emailField = document.getElementById('emailid_to_reset');
    const email = emailField.value.trim();
    const statusMessage = document.createElement('p'); // Status message for sending OTP
    document.body.appendChild(statusMessage);

    if (!email) {
        statusMessage.textContent = 'Email is required.';
        statusMessage.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('/user/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }), // Send email in request body
        });

        if (response.ok) {
            const result = await response.json();
            statusMessage.textContent = result.message;
            statusMessage.style.color = 'green';

            // Redirect to reset password page after success
            setTimeout(() => {
                window.location.href = 'userResetpassword.html';
            }, 2000);
        } else {
            const error = await response.json();
            statusMessage.textContent = error.message || 'Error sending OTP.';
            statusMessage.style.color = 'red';
        }
    } catch (error) {
        statusMessage.textContent = 'An error occurred while sending OTP.';
        statusMessage.style.color = 'red';
    }
});
