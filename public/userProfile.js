document.addEventListener('DOMContentLoaded', async () => {
    const nameField = document.getElementById('name_register');
    const professionField = document.getElementById('profession_register');
    const institutionField = document.getElementById('Institution_register');
    const emailField = document.getElementById('email_id_register');
    const phoneField = document.getElementById('phoneno_register');
    const editButton = document.getElementById('edit_button');
    const saveButton = document.getElementById('save_button');
    const statusMessage = document.getElementById('status_message');
    const nameError = document.getElementById('nameError');
    const professionError = document.getElementById('professionError');
    const institutionError = document.getElementById('institutionError');
    const phoneError = document.getElementById('phoneError');

    // Disable fields initially
    const fields = [nameField, professionField, institutionField, emailField, phoneField];
    fields.forEach(field => field.disabled = true);

    // Clear status message on page load
    statusMessage.textContent = '';
    statusMessage.style.display = 'none';

    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (!token) {
        statusMessage.textContent = 'You are not logged in. Please log in first.';
        statusMessage.style.color = 'red';
        statusMessage.style.display = 'block';
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
            // Populate fields with user data
            nameField.value = userData.name;
            professionField.value = userData.profession;
            institutionField.value = userData.institution;
            emailField.value = userData.email;
            phoneField.value = userData.phone;
        } else {
            const error = await response.json();
            statusMessage.textContent = error.message || 'Error fetching profile.';
            statusMessage.style.color = 'red';
            statusMessage.style.display = 'block';
            if (error.message === 'Invalid token') {
                setTimeout(() => {
                    window.location.href = 'userLogin.html';
                }, 2000);
            }
        }
    } catch (error) {
        statusMessage.textContent = 'An error occurred while fetching your profile details.';
        statusMessage.style.color = 'red';
        statusMessage.style.display = 'block';
    }

    // Enable fields when "Edit" button is clicked
    editButton.addEventListener('click', (event) => {
        event.preventDefault();
        fields.forEach(field => field.disabled = false); // Enable fields
        saveButton.style.display = 'inline'; // Show Save button
        editButton.style.display = 'none'; // Hide Edit button
    });

    // Function to validate fields
    function validateFields() {
        let isValid = true;

        // Clear previous error messages
        nameError.textContent = '';
        professionError.textContent = '';
        institutionError.textContent = '';
        phoneError.textContent = '';

        // Name validation
        if (nameField.value.trim() === '') {
            nameError.textContent = 'Name is required.';
            isValid = false;
        }

        // Profession validation
        if (professionField.value.trim() === '') {
            professionError.textContent = 'Profession is required.';
            isValid = false;
        }

        // Institution validation
        if (institutionField.value.trim() === '') {
            institutionError.textContent = 'Institution/Organisation is required.';
            isValid = false;
        }

        // Phone number validation (simple format check)
        const phoneRegex = /^[0-9]{10}$/;
        if (phoneField.value.trim() === '') {
            phoneError.textContent = 'Phone number is required.';
            isValid = false;
        } else if (!phoneRegex.test(phoneField.value.trim())) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number.';
            isValid = false;
        }

        return isValid;
    }

    // Save changes to the user profile
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Validate fields before saving
        if (!validateFields()) {
            statusMessage.textContent = 'Please fill in all required fields correctly.';
            statusMessage.style.color = 'red';
            statusMessage.style.display = 'block';
            return;
        }

        const updatedUser = {
            name: nameField.value,
            profession: professionField.value,
            institution: institutionField.value,
            phone: phoneField.value,
        };

        try {
            const response = await fetch('/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                const result = await response.json();
                statusMessage.textContent = 'Profile updated successfully!';
                statusMessage.style.color = 'green';
                statusMessage.style.display = 'block';
                setTimeout(() => {
                    statusMessage.textContent = '';
                    statusMessage.style.display = 'none';
                }, 60000); // Show status for 1 minute
                fields.forEach(field => field.disabled = true); // Disable fields after save
                saveButton.style.display = 'none'; // Hide Save button
                editButton.style.display = 'inline'; // Show Edit button
            } else {
                const error = await response.json();
                statusMessage.textContent = error.message || 'Error saving profile.';
                statusMessage.style.color = 'red';
                statusMessage.style.display = 'block';
            }
        } catch (error) {
            statusMessage.textContent = 'An error occurred while updating your profile.';
            statusMessage.style.color = 'red';
            statusMessage.style.display = 'block';
        }
    });
});
