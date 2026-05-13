// Tableau principal des livres
let books = [];

// Sélection des éléments DOM
const tableBody = document.getElementById("bookTableBody");
const form = document.getElementById("bookForm");
const searchInput = document.getElementById("searchInput");

// Modal
const modal = document.getElementById("bookModal");
const closeModal = document.querySelector(".close");

//CHARGEMENT INITIAL (XML OU LOCALSTORAGE)

function initApp() {
    const savedData = localStorage.getItem('bibliothequeData');

    if (savedData) {
        // Si des données existent localement, on les utilise
        books = JSON.parse(savedData);
        displayBooks(books);
    } else {
        // Sinon, c'est le premier lancement, on charge le XML
        loadXMLBooks(); 
    }
}

function loadXMLBooks() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const xml = xhr.responseXML;
            const bookNodes = xml.getElementsByTagName("book");

            for (let i = 0; i < bookNodes.length; i++) {
                const book = {
                    title: bookNodes[i].getElementsByTagName("title")[0].textContent,
                    author: bookNodes[i].getElementsByTagName("author")[0].textContent,
                    year: bookNodes[i].getElementsByTagName("year")[0].textContent,
                    price: bookNodes[i].getElementsByTagName("price")[0].textContent,
                    image: bookNodes[i].getElementsByTagName("image")[0].textContent
                };
                books.push(book);
            }
            displayBooks(books);
            saveToLocalStorage(); // On sauvegarde les données du XML localement
        }
    };
    xhr.send();
}

//AFFICHAGE ET RECHERCHE

function displayBooks(bookList) {
    tableBody.innerHTML = "";

    bookList.forEach((book, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>${book.price} FCFA</td>
            <td>
                <button class="view-btn" onclick="viewBook(${index})">Voir</button>
                <button class="edit-btn" onclick="editBook(${index})">Modifier</button>
                <button class="delete-btn" onclick="deleteBook(${index})">Supprimer</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

searchInput.addEventListener("keyup", function () {
    const value = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(value)
    );
    displayBooks(filteredBooks);
});

//GESTION DU FORMULAIRE (AJOUT / MODIFICATION)

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const dateValue = document.getElementById("year").value; 
    
    // On stocke la date complète pour pouvoir la remodifier plus tard facilement
    const year = dateValue; 

    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;
    const index = document.getElementById("bookIndex").value;

    const newBook = { title, author, year, price, image };

    if (index !== "") {
        // Modification
        books[index] = newBook;
    } else {
        // Ajout
        books.push(newBook);
    }

    saveToLocalStorage();
    displayBooks(books);
    form.reset();
    document.getElementById("bookIndex").value = "";
});

//ACTIONS (VOIR, MODIFIER, SUPPRIMER)

function viewBook(index) {
    const book = books[index];

    document.getElementById("modalImage").src = book.image;
    document.getElementById("modalTitle").textContent = book.title;
    document.getElementById("modalAuthor").textContent = book.author;
    
    // Affichage de l'année dans la modal 
    document.getElementById("modalYear").textContent = new Date(book.year).getFullYear();
    document.getElementById("modalPrice").textContent = book.price;

    modal.style.display = "block";
}

function editBook(index) {
    const book = books[index];

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("year").value = book.year; // Le calendrier reprend la date
    document.getElementById("price").value = book.price;
    document.getElementById("image").value = book.image;

    document.getElementById("bookIndex").value = index;

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function deleteBook(index) {
    if (confirm("Voulez-vous vraiment supprimer ce livre ?")) {
        const rows = document.querySelectorAll("#bookTableBody tr");
        
        // Animation de sortie
        rows[index].style.transition = "all 0.4s ease";
        rows[index].style.opacity = "0";
        rows[index].style.transform = "translateX(-20px)";

        setTimeout(() => {
            books.splice(index, 1);
            saveToLocalStorage();
            displayBooks(books);
        }, 400);
    }
}

//UTILITAIRES

function saveToLocalStorage() {
    localStorage.setItem('bibliothequeData', JSON.stringify(books));
}

// Fermeture Modal
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// LANCEMENT DE L'APPLICATION
initApp();