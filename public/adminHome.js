
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/admin/users/count');
        const data = await response.json();

        if (response.ok) {
            const userCountElement = document.getElementById('userCount');
            userCountElement.textContent = data.count; // Display the count
        } else {
            console.error('Error fetching user count:', data.message);
        }
    } catch (error) {
        console.error('Error fetching user count:', error);
    }
});