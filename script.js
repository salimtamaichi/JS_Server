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
            <input type="file" accept="image/*" id="fileInput_${character.name.replace(/\s+/g, '')}" name="image" class="hidden">
            <button class="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                onclick="document.getElementById('fileInput_${character.name.replace(/\s+/g, '')}').click();">
                Subir Imagen
            </button>
        `;

        // Evento para manejar la selección de archivo
        var fileInput = characterDiv.querySelector(`#fileInput_${character.name.replace(/\s+/g, '')}`);
        fileInput.addEventListener('change', function () {
            var selectedFile = fileInput.files[0];
            uploadImage(selectedFile, character.name);
        });

        charactersDiv.appendChild(characterDiv);
    });
}

function fetchCharacter(characterName) {
    fetch(`http://localhost:3000/persona/${characterName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ha fallado la solicitud. Código de error: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            alert(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
