document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailField = document.getElementById('email_id_login');
    const passwordField = document.getElementById('password_login');
    const statusLabel = document.getElementById('statusLabel'); // For feedback message

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Function to clear error styles
    const clearErrorStyles = (field, errorSpan) => {
        field.classList.remove('input-error');
        errorSpan.textContent = '';
    };

    // Function to show errors
    const showErrorStyles = (field, errorSpan, message) => {
        field.classList.add('input-error');
        errorSpan.textContent = message;
    };

    // Email validation
    emailField.addEventListener('input', () => {
        const email = emailField.value.trim();
        if (!email) {
            showErrorStyles(emailField, emailError, 'Email is required.');
        } else if (!isValidEmail(email)) {
            showErrorStyles(emailField, emailError, 'Invalid email format.');
        } else {
            clearErrorStyles(emailField, emailError);
        }
    });

    // Password validation
    passwordField.addEventListener('input', () => {
        const password = passwordField.value.trim();
        if (!password) {
            showErrorStyles(passwordField, passwordError, 'Password is required.');
        } else if (!isStrongPassword(password)) {
            showErrorStyles(
                passwordField,
                passwordError,
                'Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character.'
            );
        } else {
            clearErrorStyles(passwordField, passwordError);
        }
    });

    // Function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Function to validate strong password
    function isStrongPassword(password) {
        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(password);
    }

    // Submit handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        statusLabel.textContent = '';
        clearErrorStyles(emailField, emailError);
        clearErrorStyles(passwordField, passwordError);

        const email = emailField.value.trim();
        const password = passwordField.value.trim();

        let isValid = true;

        // Email validation
        if (!email) {
            isValid = false;
            showErrorStyles(emailField, emailError, 'Email is required.');
        } else if (!isValidEmail(email)) {
            isValid = false;
            showErrorStyles(emailField, emailError, 'Invalid email format.');
        }

        // Password validation
        if (!password) {
            isValid = false;
            showErrorStyles(passwordField, passwordError, 'Password is required.');
        } else if (!isStrongPassword(password)) {
            isValid = false;
            showErrorStyles(
                passwordField,
                passwordError,
                'Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character.'
            );
        }

        // If all validations pass, send request to backend
        if (isValid) {
            try {
                const response = await fetch('/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Store user token in localStorage
                    localStorage.setItem('userToken', data.token);
                    statusLabel.textContent = 'Login successful!';
                    statusLabel.style.color = 'green';

                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = 'userHome.html'; // Adjust the redirect URL if necessary
                    }, 500);
                } else {
                    statusLabel.textContent = data.message || 'Invalid credentials.';
                    statusLabel.style.color = 'red';
                }
            } catch (error) {
                console.error('Error during login:', error);
                statusLabel.textContent = 'An error occurred. Please try again.';
                statusLabel.style.color = 'red';
            }
        }
    });
});
