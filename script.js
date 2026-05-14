// Tableau principal des livres
let books = [];

// Sélection des éléments DOM
const tableBody = document.getElementById("bookTableBody");
const form = document.getElementById("bookForm");
const searchInput = document.getElementById("searchInput");

// Modal
const modal = document.getElementById("bookModal");
const closeModal = document.querySelector(".close");

// Chargement XML
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
        }
    };

    xhr.send();
}

// Affichage des livres
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
                <button class="action-btn view-btn" onclick="viewBook(${index})">Voir</button>
                <button class="action-btn edit-btn" onclick="editBook(${index})">Modifier</button>
                <button class="action-btn delete-btn" onclick="deleteBook(${index})">Supprimer</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Ajouter ou modifier
form.addEventListener("submit", function (e) {

    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    const index = document.getElementById("bookIndex").value;

    const newBook = {
        title,
        author,
        year,
        price,
        image
    };

    // Modification
    if (index !== "") {

        books[index] = newBook;

    } else {

        // Ajout
        books.push(newBook);
    }

    displayBooks(books);

    form.reset();

    document.getElementById("bookIndex").value = "";
});

// Voir détails
function viewBook(index) {

    const book = books[index];

    const modalImg = document.getElementById("modalImage");
    modalImg.src = book.image;
    modalImg.style.display = "block";
    modalImg.style.margin = "0 auto 15px";

    document.getElementById("modalTitle").textContent = book.title;
    document.getElementById("modalAuthor").textContent = book.author;
    document.getElementById("modalYear").textContent = book.year;
    document.getElementById("modalPrice").textContent = book.price;

    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.textAlign = "center";
}

// Fermer modal
closeModal.addEventListener("click", function () {

    modal.style.display = "none";
});

window.addEventListener("click", function (e) {

    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Modifier livre
function editBook(index) {

    const book = books[index];

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("year").value = book.year;
    document.getElementById("price").value = book.price;
    document.getElementById("image").value = book.image;

    document.getElementById("bookIndex").value = index;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Supprimer livre
function deleteBook(index) {

    const confirmation = confirm("Voulez-vous supprimer ce livre ?");

    if (confirmation) {

        books.splice(index, 1);

        displayBooks(books);
    }
}

// Recherche dynamique
searchInput.addEventListener("keyup", function () {

    const value = searchInput.value.toLowerCase();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(value)
    );

    displayBooks(filteredBooks);
});

// Initialisation
loadXMLBooks();
