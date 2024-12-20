
async function fetchModules() {
    try {
        const response = await fetch('/api/admin/getModules');
        const data = await response.json();
        
        if (data.modules && data.modules.length > 0) {
            const modulesContainer = document.getElementById('modulesContainer');
            modulesContainer.innerHTML = ''; 

           
            data.modules.forEach(module => {
                const moduleDiv = document.createElement('div');
                moduleDiv.classList.add('module');
                moduleDiv.innerHTML = `
                    <h3>${module.title}</h3>
                    <p>${module.description}</p>
                    <button onclick="deleteModule('${module._id}')">Delete</button>
                `;
                modulesContainer.appendChild(moduleDiv);
            });
        } else {
            document.getElementById('modulesContainer').innerHTML = 'No modules available.';
        }
    } catch (error) {
        console.error('Error fetching modules:', error);
        alert('Failed to load modules');
    }
}


async function deleteModule(moduleId) {
    if (confirm('Are you sure you want to delete this module?')) {
        try {
            const response = await fetch(`/api/admin/deleteModule/${moduleId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                alert('Module deleted successfully!');
                fetchModules(); 
            } else {
                alert('Failed to delete module');
            }
        } catch (error) {
            console.error('Error deleting module:', error);
            alert('Failed to delete module');
        }
    }
}


fetchModules();
