
document.getElementById('email_id_login_admin').addEventListener('input', () => {
    const email = document.getElementById('email_id_login_admin').value.trim();
    if (!email) {
        showError('email_id_login_admin', 'emailError', 'Email is required');
    } else if (!isValidEmail(email)) {
        showError('email_id_login_admin', 'emailError', 'Enter a valid email address');
    } else {
        resetError('email_id_login_admin', 'emailError');
    }
});


document.getElementById('password_login_admin').addEventListener('input', () => {
    const password = document.getElementById('password_login_admin').value.trim();
    if (!password) {
        showError('password_login_admin', 'passwordError', 'Password is required');
    } else if (!isStrongPassword(password)) {
        showError(
            'password_login_admin',
            'passwordError',
            'Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character'
        );
    } else {
        resetError('password_login_admin', 'passwordError');
    }
});


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function isStrongPassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}


function showError(inputId, errorId, message) {
    if (inputId) {
        document.getElementById(inputId).style.borderColor = 'red';
    }
    const errorLabel = document.getElementById(errorId);
    errorLabel.innerText = message;
    errorLabel.style.display = 'block';
}


function resetError(inputId, errorId) {
    if (inputId) {
        document.getElementById(inputId).style.borderColor = '';
    }
    const errorLabel = document.getElementById(errorId);
    errorLabel.style.display = 'none';
}


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email_id_login_admin').value.trim();
    const password = document.getElementById('password_login_admin').value.trim();

    
    resetErrorStyles();

    let isValid = true;

   
    if (!email) {
        isValid = false;
        showError('email_id_login_admin', 'emailError', 'Email is required');
    } else if (!isValidEmail(email)) {
        isValid = false;
        showError('email_id_login_admin', 'emailError', 'Enter a valid email address');
    }

    if (!password) {
        isValid = false;
        showError('password_login_admin', 'passwordError', 'Password is required');
    } else if (!isStrongPassword(password)) {
        isValid = false;
        showError(
            'password_login_admin',
            'passwordError',
            'Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character'
        );
    }

    if (isValid) {
       
        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
               
                localStorage.setItem('adminToken', result.token);

               
                window.location.href = 'adminHome.html';
            } else {
               
                showError(null, 'credentialsError', result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            showError(null, 'credentialsError', 'An error occurred. Please try again later.');
        }
    }
});

// Function to reset all error styles and messages
function resetErrorStyles() {
    resetError('email_id_login_admin', 'emailError');
    resetError('password_login_admin', 'passwordError');
    resetError(null, 'credentialsError');
}
