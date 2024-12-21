document.addEventListener('DOMContentLoaded', async () => {
    const newslettersContainer = document.getElementById('newsletters');
    const noNewslettersMessage = document.createElement('p');
    noNewslettersMessage.textContent = 'No newsletters available.';
    noNewslettersMessage.style.display = 'none'; // Hide the message initially

    try {
        const response = await fetch('/admin/newsletters');
        const newsletters = await response.json();

        if (newsletters.length === 0) {
            // Show the "No newsletters available" message
            noNewslettersMessage.style.display = 'block';
        } else {

        newsletters.forEach((newsletter) => {
            const newsletterDiv = document.createElement('div');
            newsletterDiv.classList.add('newsletter');

            newsletterDiv.innerHTML = `
                <h3>${newsletter.heading}</h3>
                <p>${newsletter.content}</p>
                <button class="btn btn-warning" onclick="editNewsletter('${newsletter._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteNewsletter('${newsletter._id}')">Delete</button>
            `;

            newslettersContainer.appendChild(newsletterDiv);
        });
    }

    // Add the "No newsletters available" message to the container
    newslettersContainer.appendChild(noNewslettersMessage);
    } catch (error) {
        console.error('Error fetching newsletters:', error);
    }
});

async function deleteNewsletter(newsletterId) {
    // Show a confirmation label
    const confirmationLabel = document.getElementById('confirmationLabel');
    confirmationLabel.style.display = 'block';
    confirmationLabel.textContent = 'Are you sure you want to delete this newsletter?';

    const yesButton = document.createElement('button');
    yesButton.classList.add('btn', 'btn-secondary');
    yesButton.textContent = 'Yes';
    yesButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/admin/newsletter/${newsletterId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Show success label and reload after timeout
                const successLabel = document.getElementById('successLabel');
                successLabel.style.display = 'block';
                successLabel.textContent = 'Newsletter deleted successfully!';

                setTimeout(() => {
                    location.reload(); // Refresh the page to reflect the changes
                }, 1000); // 2 seconds timeout
            } else {
                // Show failure label
                const errorLabel = document.getElementById('errorLabel');
                errorLabel.style.display = 'block';
                errorLabel.textContent = 'Failed to delete the newsletter. Please try again.';
            }
        } catch (error) {
            console.error('Error deleting newsletter:', error);
        }
    });

    const noButton = document.createElement('button');
    noButton.classList.add('btn', 'btn-secondary');
    noButton.textContent = 'No';
    noButton.addEventListener('click', () => {
        // Hide the confirmation label and buttons
        confirmationLabel.style.display = 'none';
    });
      
    // Add spacing (margin) between buttons
    yesButton.style.marginRight = '10px';
    // Append Yes/No buttons to the confirmation label
    confirmationLabel.appendChild(yesButton);
    confirmationLabel.appendChild(noButton);
}

function editNewsletter(newsletterId) {
    // Redirect to an edit page with the newsletterId as a query parameter
    window.location.href = `adminEditNewsletter.html?id=${newsletterId}`;
}
