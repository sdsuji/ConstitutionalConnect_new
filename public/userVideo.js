document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id'); // Get the module ID from URL

    if (moduleId) {
        // Fetch the module data from the backend
        fetch(`/api/modules/${moduleId}`)
            .then(response => response.json())
            .then(module => {
                // Set the title and video
                document.getElementById('video-title').textContent = module.title;
                document.getElementById('video-source').src = module.video; // Set the video source URL
                document.getElementById('video-player').load(); // Reload the video player to reflect the new source

                // Listen for video end event to redirect to quiz page
                const videoPlayer = document.getElementById('video-player');
                videoPlayer.addEventListener('ended', () => {
                    // Redirect to the quiz page after the video ends
                    window.location.href = `/quizPage.html?id=${moduleId}`;
                });
            })
            .catch(error => console.error('Error loading video details:', error));
    } else {
        console.error('Module ID not found in URL');
    }
});
