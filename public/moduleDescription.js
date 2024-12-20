document.addEventListener('DOMContentLoaded', () => {
    // Get the module ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id');
    console.log('Module ID:', moduleId);  // Debugging line to check the moduleId

    if (moduleId) {
        // Fetch the module data from the server
        fetch(`/api/modules/${moduleId}`)
            .then(response => response.json())
            .then(module => {
                console.log(module);  // Check the fetched module data

                // Display module title and description
                document.getElementById('module-title').textContent = module.title;
                document.getElementById('module-description').textContent = module.description;

                // Handle "Start Learning" button click event
                const startLearningBtn = document.getElementById('start-learning-btn');
                startLearningBtn.addEventListener('click', () => {
                    // Redirect to userVideo.html with moduleId as query parameter
                    window.location.href = `userVideo.html?id=${moduleId}`;
                });
            })
            .catch(error => console.error('Error loading module details:', error));
    } else {
        console.error('Module ID not found in URL');
    }
});
