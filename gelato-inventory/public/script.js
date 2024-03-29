function fetchInventory() {
    const freezer = document.getElementById('freezer').value; // Get the selected freezer value
    fetch(`/api/show-freezer-contents?freezer=${encodeURIComponent(freezer)}`)
        .then(response => response.json())
        .then(data => {
            inventory = data;
            updateInventoryDisplay();
        })
        .catch(error => {
            console.error('There has been a problem with fetching inventory:', error);
        });
}


// Add gelato to inventory on server
function addGelato(freezer, flavor, quantity) {
    fetch('/api/add-gelato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ freezer, flavor, quantity })
    })
    .then(response => {
        if (response.ok) {
            fetchInventory(); // Refresh the inventory display
        } else {
            console.error('There was a problem adding the gelato.');
        }
    })
    .catch(error => {
        console.error('There was a problem with the add operation:', error);
    });
}

// Use gelato from inventory on server
function useGelato(freezer, flavor, quantity) {
    fetch('/api/use-gelato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ freezer, flavor, quantity })
    })
    .then(response => {
        if (response.ok) {
            fetchInventory(); // Refresh the inventory display
        } else {
            response.text().then(text => alert(text));
        }
    })
    .catch(error => {
        console.error('There was a problem with the use operation:', error);
    });
}

function deleteGelato(freezer, flavor) {
    fetch('/api/delete-gelato', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ freezer, flavor })
    })
    .then(response => {
        if (response.ok) {
            fetchInventory(); // Refresh the inventory display
        } else {
            console.error('There was a problem deleting the gelato.');
        }
    })
    .catch(error => {
        console.error('There was a problem with the delete operation:', error);
    });
}


function updateInventoryDisplay() {
    const displayElement = document.getElementById('inventoryDisplay');
    const freezerSelection = document.getElementById('freezer').value; // Get the selected freezer value

    // Clear the current display
    displayElement.innerHTML = '';

    // Filter inventory items based on the selected freezer
    const filteredInventory = inventory.filter(item => item.Freezer.toString() === freezerSelection);

    // Go through each item in the filtered inventory and append it to the display
    filteredInventory.forEach(item => {
        const itemElement = document.createElement('div'); // You can use 'p', 'li', etc.
        itemElement.textContent = `Freezer: ${item.Freezer}, Flavor: ${item.Flavor}, Quantity: ${item.Quantity} `;
        
        // Create delete button for each item
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() { deleteGelato(item.Freezer, item.Flavor); };
        
        // Append the delete button to the item element
        itemElement.appendChild(deleteButton);

        // Append the item element to the display element
        displayElement.appendChild(itemElement);
    });
    
    // If no items found for this freezer, show a message
    if(filteredInventory.length === 0) {
        displayElement.textContent = 'No items found for this freezer.';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addButton').addEventListener('click', function() {
        const freezer = document.getElementById('freezer').value;
        const flavor = document.getElementById('flavor').value;
        const quantity = document.getElementById('quantity').value;
        addGelato(freezer, flavor, quantity);
    });
    
    document.getElementById('useButton').addEventListener('click', function() {
        const freezer = document.getElementById('freezer').value;
        const flavor = document.getElementById('flavor').value;
        const quantity = document.getElementById('quantity').value;
        useGelato(freezer, flavor, quantity);
    });
    
    document.getElementById('showContentButton').addEventListener('click', fetchInventory);

   // fetchInventory();
});

