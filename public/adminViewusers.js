async function fetchAndDisplayUsers() {
    try {
        const response = await fetch("http://localhost:3000/api/users");
        const users = await response.json();

        const userTable = document.querySelector("#userTable tbody");


        userTable.innerHTML = "";

       
        users.forEach((user, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.profession}</td>
                <td>${user.institution}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
            `;

            userTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}



function searchUsers() {
    const input = document.getElementById('searchBar'); 
    const filter = input.value.toLowerCase();  
    const table = document.getElementById('userTable');
    
    const tr = table.getElementsByTagName('tr');  

    
    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');  
        if (td.length > 0) {  
            let profession = td[2].textContent || td[2].innerText;  
            let institution = td[3].textContent || td[3].innerText; 

            
            if (profession.toLowerCase().includes(filter) || institution.toLowerCase().includes(filter)) {
                tr[i].style.display = "";  
            } else {
                tr[i].style.display = "none";  
            }
        }
    }
}


document.getElementById('downloadBtn').addEventListener('click', function() {
    let table = document.getElementById('userTable');
    let rows = table.rows;
    let csv = [];

    
    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].cells;
        let row = [];
        
        
        for (let j = 0; j < cells.length; j++) {
            row.push(cells[j].innerText);
        }
        
        
        csv.push(row.join(','));
    }

    
    let csvContent = csv.join('\n');

    
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_list.csv'; 

    
    link.click();
});


document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);
