document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletter');
    const headingField = document.getElementById('h1_newsletter');
    const contentField = document.getElementById('paragraph_newsletter');
    const statusLabel = document.getElementById('statusLabel');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Clear any previous error messages
        statusLabel.textContent = '';

        const heading = headingField.value.trim();
        const content = contentField.value.trim();

        // Validate the input fields
        if (!heading || !content) {
            statusLabel.textContent = 'Please fill in both the heading and content fields.';
            statusLabel.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/admin/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set content type as JSON
                },
                body: JSON.stringify({ heading, content }), // Send data as JSON
            });

            const data = await response.json();

            if (response.ok) {
                statusLabel.textContent = 'Newsletter created successfully!';
                statusLabel.style.color = 'green';
                form.reset(); // Clear the form

                // Reset statusLabel 
                setTimeout(() => {
                    statusLabel.textContent = '';
                }, 1000); 
            } else {
                statusLabel.textContent = data.message || 'Error creating newsletter.';
                statusLabel.style.color = 'red';
            }
        } catch (error) {
            console.error('Error creating newsletter:', error);
            statusLabel.textContent = 'An error occurred. Please try again.';
            statusLabel.style.color = 'red';
        }
    });
});
