document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const nameField = document.getElementById('name_register');
    const professionField = document.getElementById('profession_register');
    const institutionField = document.getElementById('Institution_register');
    const emailField = document.getElementById('email_id_register');
    const phoneField = document.getElementById('phoneno_register');
    const passwordField = document.getElementById('password_register');
    const confirmPasswordField = document.getElementById('confirm_password_register');

    const nameError = document.getElementById('nameError');
    const professionError = document.getElementById('professionError');
    const institutionError = document.getElementById('institutionError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const statusLabel = document.getElementById('statusLabel'); 

    
    function resetError(field, errorElement) {
        field.style.borderColor = '';
        errorElement.style.display = 'none';
    }

    
    function showError(field, errorElement, message) {
        field.style.borderColor = 'red';
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    
    nameField.addEventListener('input', () => {
        if (nameField.value.trim() === '') {
            showError(nameField, nameError, 'Name is required');
        } else {
            resetError(nameField, nameError);
        }
    });

    professionField.addEventListener('input', () => {
        if (professionField.value.trim() === '') {
            showError(professionField, professionError, 'Profession is required');
        } else {
            resetError(professionField, professionError);
        }
    });

    institutionField.addEventListener('input', () => {
        if (institutionField.value.trim() === '') {
            showError(institutionField, institutionError, 'Institution/Organisation is required');
        } else {
            resetError(institutionField, institutionError);
        }
    });

    emailField.addEventListener('input', () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailField.value.trim() === '') {
            showError(emailField, emailError, 'Email is required');
        } else if (!emailRegex.test(emailField.value)) {
            showError(emailField, emailError, 'Invalid email format');
        } else {
            resetError(emailField, emailError);
        }
    });

    phoneField.addEventListener('input', () => {
        const phoneRegex = /^\d{10}$/;
        if (phoneField.value.trim() === '') {
            showError(phoneField, phoneError, 'Phone number is required');
        } else if (!phoneRegex.test(phoneField.value)) {
            showError(phoneField, phoneError, 'Phone number should be 10 digits');
        } else {
            resetError(phoneField, phoneError);
        }
    });
    passwordField.addEventListener('input', () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
        if (passwordField.value.trim() === '') {
            showError(passwordField, passwordError, 'Password is required');
        } else if (!passwordRegex.test(passwordField.value)) {
            showError(passwordField, passwordError, 'Password must be at least 8 characters long, contain letters, numbers, and at least one special character');
        } else {
            resetError(passwordField, passwordError);
        }
    });

    confirmPasswordField.addEventListener('input', () => {
        if (confirmPasswordField.value.trim() === '') {
            showError(confirmPasswordField, confirmPasswordError, 'Confirm Password is required');
        } else if (confirmPasswordField.value !== passwordField.value) {
            showError(confirmPasswordField, confirmPasswordError, 'Passwords do not match');
        } else {
            resetError(confirmPasswordField, confirmPasswordError);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        let formValid = true;

       
        if (emailField.value.trim() === 'sujitacbe2018@gmail.com') {
            showError(emailField, emailError, 'Cannot use this email ID.');
            formValid = false;
        }

        
        if (nameField.value.trim() === '') {
            showError(nameField, nameError, 'Name is required');
            formValid = false;
        }

        if (professionField.value.trim() === '') {
            showError(professionField, professionError, 'Profession is required');
            formValid = false;
        }

        if (institutionField.value.trim() === '') {
            showError(institutionField, institutionError, 'Institution/Organisation name is required');
            formValid = false;
        }

        if (emailField.value.trim() === '') {
            showError(emailField, emailError, 'Email is required');
            formValid = false;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailField.value)) {
            showError(emailField, emailError, 'Invalid email format');
            formValid = false;
        }

        if (phoneField.value.trim() === '') {
            showError(phoneField, phoneError, 'Phone number is required');
            formValid = false;
        }else if(!/^\d{10}$/.test(phoneField.value)){
            showError(phoneField, phoneError, 'Phone number should be 10 digits');
            formValid = false;
        }

        if (passwordField.value.trim() === '') {
            showError(passwordField, passwordError, 'Password is required');
            formValid = false;
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(passwordField.value)) {
            showError(passwordField, passwordError, 'Password must be at least 8 characters long, contain letters, numbers, and at least one special character');
            formValid = false;
        }

        if (confirmPasswordField.value.trim() === '') {
            showError(confirmPasswordField, confirmPasswordError, 'Confirm Password is required');
            formValid = false;
        } else if (confirmPasswordField.value !== passwordField.value) {
            showError(confirmPasswordField, confirmPasswordError, 'Passwords do not match');
            formValid = false;
        }

        if (formValid) {
           
            const userData = {
                name: nameField.value,
                profession: professionField.value,
                institution: institutionField.value,
                email: emailField.value,
                phone: phoneField.value,
                password: passwordField.value,
                confirmPassword: confirmPasswordField.value,
            };

            try {
                
                const response = await fetch('/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (response.ok) {
                    statusLabel.textContent = 'Registration successful!';
                    statusLabel.style.color = 'green';
                    setTimeout(() => {
                        window.location.href = 'userLogin.html';
                    }, 500); 
                } else {
                    statusLabel.textContent = data.message;
                    statusLabel.style.color = 'red';
                }
            } catch (error) {
                console.error('Error during registration:', error);
                statusLabel.textContent = 'An error occurred. Please try again.';
                statusLabel.style.color = 'red';
            }
        }
    });
});
