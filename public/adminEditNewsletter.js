document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsletterId = urlParams.get('id');
    
    if (!newsletterId) {
        window.location.href = 'adminNewsletterupdate.html'; 
        return;
    }

    try {
        const response = await fetch(`/admin/newsletter/${newsletterId}`);
        const newsletter = await response.json();

        if (!newsletter) {
            window.location.href = 'adminNewsletterupdate.html'; 
            return;
        }

       
        document.getElementById('heading').value = newsletter.heading;
        document.getElementById('content').value = newsletter.content;
    } catch (error) {
        console.error('Error fetching newsletter:', error);
    }

   
    const form = document.getElementById('editNewsletterForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const heading = document.getElementById('heading').value;
        const content = document.getElementById('content').value;

        try {
            const response = await fetch(`http://localhost:3000/admin/newsletter/${newsletterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ heading, content }),
            });

            if (response.ok) {
                
                const successLabel = document.getElementById('successLabel');
                successLabel.style.display = 'block';
                successLabel.textContent = 'Newsletter updated successfully!';
                setTimeout(() => {
                    window.location.href = 'adminNewsletterupdate.html'; 
                }, 1000);
            } else {
                console.error('Failed to update the newsletter');
            }
        } catch (error) {
            console.error('Error updating newsletter:', error);
        }
    });

    
    const cancelButton = document.getElementById('cancelButton');
    cancelButton.addEventListener('click', () => {
        
        const cancelLabel = document.getElementById('cancelLabel');
        cancelLabel.style.display = 'block';
        cancelLabel.textContent = 'Changes have been canceled.';
        setTimeout(() => {
            window.location.href = 'adminNewsletterupdate.html'; 
        }, 1000); 
    });
});
