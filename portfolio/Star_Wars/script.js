const dataContainer = document.getElementById('data-container');

function fetchData(category) {
    const apiUrl = `https://swapi.py4e.com/api/${category}/`;
    dataContainer.innerHTML = 'Loading...';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayData(category, data.results);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            dataContainer.innerHTML = 'Error fetching data. Please try again.';
        });
}

function displayData(category, data) {
    dataContainer.innerHTML = '';
    let content = '';

    data.forEach(item => {
        content += '<div class="item">';
        switch (category) {
            case 'films':
                content += `<h3>${item.title}</h3>`;
                content += `<p><strong>Director:</strong> ${item.director}</p>`;
                content += `<p><strong>Release Date:</strong> ${item.release_date}</p>`;
                content += `<p>${item.opening_crawl}</p>`;
                break;
            case 'people':
                content += `<h3>${item.name}</h3>`;
                content += `<p><strong>Birth Year:</strong> ${item.birth_year}</p>`;
                content += `<p><strong>Gender:</strong> ${item.gender}</p>`;
                break;
            case 'planets':
                content += `<h3>${item.name}</h3>`;
                content += `<p><strong>Climate:</strong> ${item.climate}</p>`;
                content += `<p><strong>Population:</strong> ${item.population}</p>`;
                break;
            case 'starships':
                content += `<h3>${item.name}</h3>`;
                content += `<p><strong>Model:</strong> ${item.model}</p>`;
                content += `<p><strong>Manufacturer:</strong> ${item.manufacturer}</p>`;
                break;
        }
        content += '</div>';
    });

    dataContainer.innerHTML = content;
}