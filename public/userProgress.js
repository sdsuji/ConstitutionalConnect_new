document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id'); // Get the module ID from the URL
    const userToken = localStorage.getItem('userToken'); // Get user token from localStorage

    if (!userToken) {
        alert('You must be logged in to view your progress.');
        return;
    }

    if (moduleId) {
        // Fetch the user's progress for the module
        fetch(`/api/userProgress/${moduleId}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.score !== undefined) {
                // Display the module title and score
                document.getElementById('module-title').textContent = data.moduleTitle;
                document.getElementById('score').textContent = `${data.score} / ${data.totalQuestions}`;
            } else {
                alert('No progress found for this module.');
            }
        })
        .catch(error => {
            console.error('Error fetching user progress:', error);
            alert('An error occurred while fetching your progress.');
        });
    } else {
        alert('Module ID is missing.');
    }
});
