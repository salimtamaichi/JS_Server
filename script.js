var currentPage = 1;
var totalPages;

function fetchData(page) {
    fetch('https://swapi.py4e.com/api/people/?page=' + page)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ha fallado la solicitud. Código de error: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            displayCharacters(data.results);
            totalPages = Math.ceil(data.count / 10);
            document.getElementById("pageNumber").innerText = currentPage + " / " + totalPages;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayCharacters(characters) {
    var charactersDiv = document.getElementById('characters');
    charactersDiv.innerHTML = '';

    characters.forEach(function (character) {
        var characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.innerHTML = `
            <h2 onclick="fetchCharacter('${character.name}')">${character.name}</h2>
            <p><strong>Altura:</strong> ${character.height}</p>
            <p><strong>Cabello:</strong> ${character.hair_color}</p>
            <p><strong>Piel:</strong> ${character.skin_color}</p>
            <p><strong>Ojos:</strong> ${character.eye_color}</p>
            <p><strong>Nacimiento:</strong> ${character.birth_year}</p>
            <p><strong>Género:</strong> ${character.gender}</p>
        `;

        // Crear el elemento input para subir la imagen
        var fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', 'image/*');
        fileInput.setAttribute('id', `fileInput_${character.name.replace(/\s+/g, '')}`);
        fileInput.setAttribute('name', 'image');
        fileInput.classList.add('hidden');

        // Crear el botón para activar el input de la imagen
        var uploadButton = document.createElement('button');
        uploadButton.classList.add('mt-2', 'bg-yellow-500', 'hover:bg-yellow-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
        uploadButton.textContent = 'Subir Imagen';
        uploadButton.onclick = function () {
            var characterName = character.name;
            document.getElementById(`fileInput_${characterName.replace(/\s+/g, '')}`).click();
        };

        // Crear el botón para guardar el personaje
        var saveButton = document.createElement('button');
        saveButton.classList.add('mt-2', 'bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
        saveButton.textContent = 'Guardar Personaje';
        saveButton.dataset.characterName = character.name; // Almacenar el nombre del personaje en el atributo data-character-name
        saveButton.onclick = function () {
            var characterInfo = character;
            var imageName = this.dataset.characterName; // Obtener el nombre del personaje desde el atributo data-character-name
            saveCharacter(characterInfo, imageName);
        };

        // Agregar el input y los botones al characterDiv
        characterDiv.appendChild(fileInput);
        characterDiv.appendChild(uploadButton);
        characterDiv.appendChild(saveButton);

        // Evento para manejar la selección de archivo
        fileInput.addEventListener('change', function () {
            var characterInfo = character;

            var selectedFile = fileInput.files[0];
            // uploadImage(selectedFile, character.name);
            saveCharacter(characterInfo, selectedFile);

        });

        charactersDiv.appendChild(characterDiv);
    });
}

function saveCharacter(characterInfo, imageName) {
    var formData = new FormData();
    formData.append('characterInfo', JSON.stringify(characterInfo));
    formData.append('arxiu', imageName); // Agregar el nombre de la imagen al FormData

    fetch("http://localhost:3000/persona", {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar el personaje.');
            }
            console.log('Personaje guardado exitosamente.');
            return response.text();
        })
        alert('Has guardado el personaje correctamente')
}


function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchData(currentPage);
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchData(currentPage);
    }
}

function showAllCharacters() {
    currentPage = 1;
    totalPages = 1;
    fetchData(currentPage);
}

// Carga inicial de datos
fetchData(currentPage);

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const STAR_COUNT = 400
let result = ""
for (let i = 0; i < STAR_COUNT; i++) {
    result += `${randomNumber(-50, 50)}vw ${randomNumber(-50, 50)}vh ${randomNumber(0, 1)}px ${randomNumber(0, 1)}px #fff,`
}
function uploadImage(selectedFile, characterName) {
    var formData = new FormData();
    formData.append('image', selectedFile);

    fetch("http://localhost:3000/upload", {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en subir la imagen.');
            }
            console.log('Imagen subida exitosamente para:', characterName);
            return response.text();
        })
        .then(message => {
            alert(message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en subir la imagen.');
        });
}


