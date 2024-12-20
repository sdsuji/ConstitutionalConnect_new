document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById('reset_password');
    const confirmPasswordField = document.getElementById('reset_confirm_password');
    const otpField = document.getElementById('reset_otp');
    const resetButton = document.querySelector('.btn-success');
    
    // Get the span elements to show error messages below inputs
    const passwordErrorLabel = document.getElementById('passwordError');
    const confirmPasswordErrorLabel = document.getElementById('confirmPasswordError');
    const otpErrorLabel = document.getElementById('otpError');
    
    // Get the div to show status message below the form
    const statusMessageDiv = document.getElementById('statusMessage');

    // Function to validate password strength
    function validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }

    // Event listener for password field
    passwordField.addEventListener('input', () => {
        const password = passwordField.value;
        
        if (validatePasswordStrength(password)) {
            passwordField.style.borderColor = 'green';
            passwordErrorLabel.textContent = ''; // Clear any previous error
        } else {
            passwordField.style.borderColor = 'red';
            passwordErrorLabel.textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
            passwordErrorLabel.style.color = 'red';
        }
    });

    // Event listener for confirm password field
    confirmPasswordField.addEventListener('input', () => {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        
        if (password === confirmPassword) {
            confirmPasswordField.style.borderColor = 'green';
            confirmPasswordErrorLabel.textContent = ''; // Clear any previous error
        } else {
            confirmPasswordField.style.borderColor = 'red';
            confirmPasswordErrorLabel.textContent = 'Passwords do not match.';
            confirmPasswordErrorLabel.style.color = 'red';
        }
    });

    // Event listener for OTP field
    otpField.addEventListener('input', () => {
        if (otpField.value.trim()) {
            otpField.style.borderColor = 'green';
            otpErrorLabel.textContent = ''; // Clear any previous error
        } else {
            otpField.style.borderColor = 'red';
            otpErrorLabel.textContent = 'OTP cannot be empty.';
            otpErrorLabel.style.color = 'red';
        }
    });

    // Button click listener
    resetButton.addEventListener('click', () => {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        const otp = otpField.value;

        // Reset all error labels
        passwordErrorLabel.textContent = '';
        confirmPasswordErrorLabel.textContent = '';
        otpErrorLabel.textContent = '';
        statusMessageDiv.textContent = ''; // Reset status message

        // Validation checks
        if (!validatePasswordStrength(password)) {
            passwordErrorLabel.textContent = 'Password does not meet the criteria.';
            passwordErrorLabel.style.color = 'red';
            return;
        }

        if (password !== confirmPassword) {
            confirmPasswordErrorLabel.textContent = 'Passwords do not match.';
            confirmPasswordErrorLabel.style.color = 'red';
            return;
        }

        if (!otp.trim()) {
            otpErrorLabel.textContent = 'OTP is required.';
            otpErrorLabel.style.color = 'red';
            return;
        }

        // If all validations pass
        statusMessageDiv.textContent = 'Validating OTP and resetting password...';
        statusMessageDiv.style.color = 'blue';

        // Proceed to submit the data to the backend
        resetPassword(password, otp);
    });

    // Function to reset password
    async function resetPassword(password, otp) {
        try {
            const response = await fetch('/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, otp }),
            });

            const result = await response.json();

            if (response.ok) {
                statusMessageDiv.textContent = 'Password reset successfully! Redirecting to login...';
                statusMessageDiv.style.color = 'green';
                setTimeout(() => {
                    window.location.href = 'userLogin.html';
                }, 2000);
            } else {
                statusMessageDiv.textContent = result.message || 'Error resetting password.';
                statusMessageDiv.style.color = 'red';
            }
        } catch (error) {
            statusMessageDiv.textContent = 'An error occurred while resetting password.';
            statusMessageDiv.style.color = 'red';
        }
    }
});
