document.addEventListener('DOMContentLoaded', async () => {
    const newsletterContainer = document.getElementById('newsletter-container');
    
    try {
        const response = await fetch('/user/newsletters');
        const newsletters = await response.json();

        // Clear any previous content in the container
        newsletterContainer.innerHTML = '';

        if (newsletters.length === 0) {
            // No newsletters, show the "No newsletters to display" message
            const noNewslettersMessage = document.createElement('p');
            noNewslettersMessage.textContent = 'No newsletters to display';
            noNewslettersMessage.style.textAlign = 'center';
            noNewslettersMessage.style.fontSize = '20px';
            noNewslettersMessage.style.fontWeight = 'bold';
            noNewslettersMessage.style.marginTop = '20px';
            noNewslettersMessage.style.color = 'white';
            newsletterContainer.appendChild(noNewslettersMessage);
        } else {
            // Display newsletters
            const colors = ['first-time', 'default', 'updated']; 
            let colorIndex = 0; 

            newsletters.forEach(newsletter => {
                const newsletterDiv = document.createElement('div');
                newsletterDiv.classList.add('newsletter', colors[colorIndex]);

                const heading = document.createElement('h2');
                heading.textContent = newsletter.heading;
                newsletterDiv.appendChild(heading);

                const content = document.createElement('p');
                content.textContent = newsletter.content;
                newsletterDiv.appendChild(content);

                // Insert each newsletter at the top of the container
                newsletterContainer.insertBefore(newsletterDiv, newsletterContainer.firstChild); 

                // Cycle through the color array
                colorIndex = (colorIndex + 1) % colors.length; 
            });
        }

    } catch (error) {
        console.error('Error fetching newsletters:', error);
        newsletterContainer.innerHTML = '<p>Error fetching newsletters.</p>';
    }
});
