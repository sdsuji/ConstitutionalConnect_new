document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleId = urlParams.get('id');  // Get the module ID from URL

    console.log('Module ID:', moduleId);  // Debugging log

    if (moduleId) {
        fetch(`/api/modules/${moduleId}`)
            .then(response => response.json())
            .then(module => {
                const pdfUrl = module.pdfUrl;  // Get the PDF URL from the response
                console.log('PDF URL:', pdfUrl);  // Debugging log

                const pdfContainer = document.getElementById('pdf-container');
                const iframe = document.createElement('iframe');
                iframe.src = pdfUrl;  // Embed the PDF
                iframe.width = '100%';
                iframe.height = '600px';  // Adjust the height as needed
                pdfContainer.appendChild(iframe);

                // Handle the download button
                const downloadBtn = document.getElementById('download-btn');
                downloadBtn.addEventListener('click', () => {
                    const link = document.createElement('a');
                    link.href = pdfUrl;
                    link.download = `module-${moduleId}.pdf`;
                    link.click();
                });
            })
            .catch(error => {
                console.error('Error loading module details:', error);
                alert('Failed to load PDF.');
            });
    } else {
        console.error('Module ID not found in URL');
    }
});