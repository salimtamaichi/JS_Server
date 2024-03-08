
var currentPage = 1;
var totalPages;

function fetchData(page) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                displayCharacters(response.results);
                totalPages = Math.ceil(response.count / 10);
                document.getElementById("pageNumber").innerText = currentPage + " / " + totalPages;
            } else {
                console.error('Ha fallado la solicitud. Código de error: ' + xhr.status);
            }
        }
    };

    xhr.open('GET', 'https://swapi.py4e.com/api/people/?page=' + page, true);
    xhr.send();
}

function displayCharacters(characters) {
    var charactersDiv = document.getElementById('characters');
    charactersDiv.innerHTML = '';

    characters.forEach(function (character) {
        var characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.innerHTML = `
                <h2>${character.name}</h2>
                <p><strong>Altura:</strong> ${character.height}</p>
                <p><strong>Cabello:</strong> ${character.hair_color}</p>
                <p><strong>Piel:</strong> ${character.skin_color}</p>
                <p><strong>Ojos:</strong> ${character.eye_color}</p>
                <p><strong>Nacimiento:</strong> ${character.birth_year}</p>
                <p><strong>Género:</strong> ${character.gender}</p>
            `;

        // Agregar el campo para seleccionar archivo
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.className = 'hidden';
        characterDiv.appendChild(fileInput);

        // Agregar el botón de subir imagen con estilos de Tailwind CSS
        var uploadButton = document.createElement('button');
        uploadButton.textContent = 'Subir Imagen';
        uploadButton.className = 'mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded';
        uploadButton.onclick = function () {
            // Disparar un clic en el campo de entrada de archivos cuando se hace clic en el botón
            fileInput.click();
        };
        characterDiv.appendChild(uploadButton);

        // Evento para manejar la selección de archivo
        fileInput.addEventListener('change', function () {
            var selectedFile = fileInput.files[0];
            uploadImage(selectedFile);
        });

        charactersDiv.appendChild(characterDiv);
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
function uploadImage() {
    var formData = new FormData();
    var fileInput = document.getElementById('fileInput');
    console.log(fileInput);
    var file = fileInput.files[0];
    formData.append('image', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en subir la imagen.');
            }
            console.log('Imagen subida exitosamente.');
            return response.text(); // Convertir la respuesta a texto
        })
        .then(message => {
            alert(message); // Mostrar mensaje de éxito al usuario
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en subir la imagen.');
        });
}

