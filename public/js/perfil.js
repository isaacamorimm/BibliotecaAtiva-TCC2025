function toggleEditForm() {
            const displayInfo = document.getElementById('display-info');
            const editForm = document.getElementById('edit-form');

            // Alterna a visibilidade das divs
            displayInfo.style.display = displayInfo.style.display === 'none' ? 'block' : 'none';
            editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
        }