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
        saveButton.classList.add('mt-2', 'bg-yellow-500', 'hover:bg-yellow-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'm-2');
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

document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("optionsCharacters").innerHTML = "";
    document.getElementById("comparationCharacters").innerHTML = "";
    document.getElementById("starwadleInput").value = "";
    document.getElementById("starwadleInput").style.display = "block";
    document.getElementById("checkBtn").style.display = "block";
    document.getElementById("youWin").style.display = "none";
    document.getElementById("winnerImg").style.display = "none";

    let start = true
    fetch("http://localhost:3000/starwardle", {
        method: "POST",
        body: start
    })
        .then(
            (resp) => {
                resp.json().then(
                    (respJSON) => {
                        console.log(respJSON)
                        document.getElementById("characterToGuess").innerHTML = "";
                        document.getElementById("characterToGuess").style.border = "1px solid white";

                        let i = 0;
                        const keys = Object.keys(respJSON.personajeAdivinar);
                        const intervalId = setInterval(() => {
                            if (i < keys.length) {
                                const atributo = keys[i];
                                if (atributo != "name" && atributo != "img") {
                                    const p = document.createElement("p");
                                    p.textContent = `${atributo}: ${respJSON.personajeAdivinar[atributo]}`;
                                    document.getElementById("characterToGuess").appendChild(p); // Agregar el elemento al div
                                }
                                i++;

                            } else {
                                clearInterval(intervalId); // Detener el intervalo cuando se procesen todos los elementos
                            }
                        }, 50); // Establecer un intervalo de tiempo (100 ms) entre cada iteración
                    }
                )
            }
        )
})

document.getElementById("checkBtn").addEventListener("click", () => {
    const name = document.getElementById("starwadleInput").value;

    // Enviar el nombre dentro de un objeto JSON
    fetch("http://localhost:3000/compararPersonaje", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: name })
    })
        .then(resp => {
            resp.json().then(respJSON => {
                let div = document.createElement("div");
                document.getElementById("comparationCharacters").prepend(div);
                // Iterar sobre las claves y valores del objeto
                let i = 0;
                let adivinado = true;
                const keys = Object.keys(respJSON.datos);
                const intervalId = setInterval(() => {
                    if (i < keys.length && keys[i] != "img") {
                        const atributo = keys[i];
                        const p = document.createElement("p");
                        const valor = respJSON.datos[atributo];
                        console.log(respJSON.comparaciones[atributo])
                        if (adivinado && !respJSON.comparaciones[atributo]) {
                            adivinado = false;
                        }
                        const comparacion = respJSON.comparaciones[atributo];

                        p.textContent = `${atributo}: ${valor}`;
                        p.style.color = comparacion ? "#66ff66" : "red";

                        if (comparacion) {
                            p.classList.add("neon-green");
                        } else {
                            p.classList.add("neon-red");
                        }

                        div.appendChild(p);
                        i++;
                    } else {
                        if (adivinado) {
                            document.getElementById("starwadleInput").style.display = "none";
                            document.getElementById("youWin").style.display = "block";
                            document.getElementById("winnerImg").style.display = "block";
                            document.getElementById("winnerImg").setAttribute("src", "./server/data/"+respJSON.datos["img"]  )
                           
                            div.style.border = "1px solid #66ff66";
                            div.style.boxShadow = " 0 0 5px #66ff66, 0 0 1px #66ff66, 0 0 1px #66ff66, 0 0 1px #66ff66, 0 0 1px #66ff66, 0 0 1px #66ff66, 0 0 1px #66ff66";
                        } else {
                            div.style.border = "1px solid red";
                            div.style.boxShadow = " 0 0 5px #ff6666, 0 0 1px #ff6666, 0 0 5px #ff6666, 0 0 5px #ff6666, 0 0 5px #ff6666, 0 0 5px #ff6666, 0 0 5px #ff6666";



                        }
                        clearInterval(intervalId); // Detener el intervalo cuando se procesen todos los elementos
                    }
                }, 50); // Establecer un intervalo de tiempo (100 ms) entre cada iteración

                document.getElementById("starwadleInput").value = "";
                document.getElementById("optionsCharacters").innerHTML = "";
            });
        });
});




document.getElementById("starwadleInput").addEventListener("keyup", (e) => {
    if(document.getElementById("starwadleInput").value == "") {
        document.getElementById("checkBtn").setAttribute("disabled", true);
    }    let name = document.getElementById("starwadleInput").value;
    fetch("http://localhost:3000/buscarPersonajes", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', // Añade este encabezado para indicar que el cuerpo de la solicitud contiene JSON
        },
        body: JSON.stringify({ name: name }) // Asegúrate de enviar un objeto JSON con la propiedad 'name'
    })
        .then(resp => resp.json())
        .then(respJSON => {
            document.getElementById("optionsCharacters").innerHTML = "";
            for (let i = 0; i < respJSON.length; i++) {
                let div = document.createElement("div")
                div.classList.add("characterOption");

                div.addEventListener("click", () => {
                    document.getElementById("checkBtn").removeAttribute("disabled")

                    document.getElementById("starwadleInput").value = respJSON[i].name;
                    document.getElementById("optionsCharacters").innerHTML = "";

                })
                if (respJSON[i].img) {
                    let img = document.createElement("img");
                    img.src = `./server/data/${respJSON[i].img}`;
                    img.alt = `Imagen de ${respJSON[i].name}`;
                    img.style.maxWidth = "100px"; // Ajustar el tamaño de la imagen según sea necesario
                    div.appendChild(img); // Agregar la imagen al div
                }
                let p = document.createElement("p");
                p.textContent = respJSON[i].name;
                div.append(p)
                document.getElementById("optionsCharacters").append(div)
            }
        })
        .catch(error => {
        });
});