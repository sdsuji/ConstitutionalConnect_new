document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/modules')  // Fetching modules from the backend
        .then(response => response.json())
        .then(modules => {
            const container = document.getElementById('modules-container');
            modules.forEach(module => {
                const moduleElement = document.createElement('div');
                moduleElement.classList.add('module');
                moduleElement.innerHTML = `
                    <img src="${module.image}" alt="${module.title}" onclick="viewModule('${module._id}')">  <!-- Image click event -->
                    <h5>${module.title}</h5>
                   
                `;
                container.appendChild(moduleElement);
            });
        });
});

// Function to redirect to the module description page
function viewModule(moduleId) {
    window.location.href = `moduleDescription.html?id=${moduleId}`;  // Redirect to the module's description page with ID as query parameter
}
