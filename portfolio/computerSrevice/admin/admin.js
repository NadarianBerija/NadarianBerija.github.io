document.addEventListener('DOMContentLoaded', () => {
    // Menu Items
    const addMenuItemForm = document.getElementById('add-menu-item-form');
    const logoutBtn = document.getElementById('logout-btn');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const editItemIdInput = document.getElementById('edit-item-id');
    const addBtn = document.getElementById('add-btn');
    const updateBtn = document.getElementById('update-btn');

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('/menu');
            const menuItems = await response.json();
            renderMenuItems(menuItems);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const renderMenuItems = (menuItems) => {
        menuItemsContainer.innerHTML = '';
        menuItems.forEach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu__items');
            menuItemElement.innerHTML = `
                <img src="../${item.img}" alt="${item.altimg}">
                <div class="menu__item-content">
                    <h3 class="menu__item-subtitle">${item.title}</h3>
                    <div class="menu__item-descr">${item.descr}</div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Price</div>
                        <div class="menu__item-total"><span>${item.price}</span> EUR</div>
                    </div>
                </div>
                <div class="menu__item-actions">
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${item._id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item._id}">Delete</button>
                </div>
            `;
            menuItemsContainer.appendChild(menuItemElement);
        });
    };

    addMenuItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addMenuItemForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Menu item added successfully!');
                addMenuItemForm.reset();
                fetchMenuItems();
            } else {
                alert('Failed to add menu item. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    updateBtn.addEventListener('click', async () => {
        const itemId = editItemIdInput.value;
        const formData = new FormData(addMenuItemForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/menu/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Menu item updated successfully!');
                addMenuItemForm.reset();
                fetchMenuItems();
                addBtn.style.display = 'block';
                updateBtn.style.display = 'none';
            } else {
                alert('Failed to update menu item. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST'
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    menuItemsContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const itemId = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this item?')) {
                try {
                    const response = await fetch(`/menu/${itemId}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Menu item deleted successfully!');
                        fetchMenuItems();
                    } else {
                        alert('Failed to delete menu item. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                }
            }
        }

        if (e.target.classList.contains('edit-btn')) {
            const itemId = e.target.dataset.id;
            const response = await fetch('/menu');
            const menuItems = await response.json();
            const selectedItem = menuItems.find(item => item._id === itemId);

            if (selectedItem) {
                document.getElementById('img').value = selectedItem.img;
                document.getElementById('altimg').value = selectedItem.altimg;
                document.getElementById('title').value = selectedItem.title;
                document.getElementById('descr').value = selectedItem.descr;
                document.getElementById('price').value = selectedItem.price;
                editItemIdInput.value = selectedItem._id;

                addBtn.style.display = 'none';
                updateBtn.style.display = 'block';
            }
        }
    });

    fetchMenuItems();


    // Components
    const addComponentForm = document.getElementById('add-component-form');
    const componentsListContainer = document.getElementById('components-list-container');
    const editComponentIdInput = document.getElementById('edit-component-id');
    const addComponentBtn = document.getElementById('add-component-btn');
    const updateComponentBtn = document.getElementById('update-component-btn');

    const fetchComponents = async () => {
        try {
            const response = await fetch('/components');
            const components = await response.json();
            renderComponents(components);
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    };

    const renderComponents = (components) => {
        componentsListContainer.innerHTML = '';
        components.forEach(comp => {
            const componentElement = document.createElement('div');
            componentElement.classList.add('component__items');
            componentElement.innerHTML = `
                
                    <div class="component-content">
                        <div class="component-name">${comp.name}</div> 
                        <div class="component-category">Category: ${comp.category}</div> 
                        <div class="component-price">${comp.price} EUR</div>
                    </div>
                    <div class="menu__item-actions">
                        <button class="btn btn-primary btn-sm edit-component-btn" data-id="${comp._id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-component-btn" data-id="${comp._id}">Delete</button>
                    </div>
                
            `;
            componentsListContainer.appendChild(componentElement);
        });
    };

    addComponentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('component-name').value,
            category: document.getElementById('component-category').value,
            price: document.getElementById('component-price').value
        };

        try {
            const response = await fetch('/components', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                addComponentForm.reset();
                fetchComponents();
            } else {
                alert('Failed to add component');
            }
        } catch (error) {
            console.error(error);
        }
    });

    componentsListContainer.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('delete-component-btn')) {
            if (confirm('Delete this component?')) {
                await fetch(`/components/${id}`, { method: 'DELETE' });
                fetchComponents();
            }
        }

        if (e.target.classList.contains('edit-component-btn')) {
            const response = await fetch('/components');
            const components = await response.json();
            const comp = components.find(c => c._id === id);
            if (comp) {
                document.getElementById('component-name').value = comp.name;
                document.getElementById('component-category').value = comp.category;
                document.getElementById('component-price').value = comp.price;
                editComponentIdInput.value = comp._id;

                addComponentBtn.style.display = 'none';
                updateComponentBtn.style.display = 'block';
            }
        }
    });

    updateComponentBtn.addEventListener('click', async () => {
        const id = editComponentIdInput.value;
        const data = {
            name: document.getElementById('component-name').value,
            category: document.getElementById('component-category').value,
            price: document.getElementById('component-price').value
        };
        try {
            await fetch(`/components/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            addComponentForm.reset();
            editComponentIdInput.value = '';
            addComponentBtn.style.display = 'block';
            updateComponentBtn.style.display = 'none';
            fetchComponents();
        } catch (error) {
            console.error(error);
        }
    });

    fetchComponents();

});

