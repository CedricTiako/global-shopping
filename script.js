// Charger les catégories et remplir le filtre de catégories
function loadCategories() {
    axios.get('products.json')
        .then(response => {
            const products = response.data;
            const categoryFilter = document.getElementById('category-filter');
            const categories = [...new Set(products.map(product => product.category))];
            
            // Vider les options existantes
            categoryFilter.innerHTML = '<option value="">Toutes les catégories</option>';
            
            // Ajouter chaque catégorie unique au filtre
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des catégories:', error));
}

// Fonction de gestion du filtrage par catégorie et tri
function filterAndSortProducts(searchTerm, category, sort) {
    axios.get('products.json')
        .then(response => {
            const products = response.data;
            let filteredProducts = products.filter(product => {
                const title = product.name.toLowerCase();
                const productCategory = product.category.toLowerCase();
                return title.includes(searchTerm) && (category === '' || productCategory === category.toLowerCase());
            });

            if (sort === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sort === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }

            displayProducts(filteredProducts);
            updatePaginationControls(filteredProducts.length);
        })
        .catch(error => console.error('Erreur lors du filtrage et tri des produits:', error));
}

// Fonction pour afficher les produits avec notation par étoiles
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = ''; // Effacer les produits existants

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item', 'bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'text-center');
        productElement.setAttribute('data-category', product.category);

        const rating = calculateAverageRating(product.ratings);
        const starsHTML = generateStarRating(rating);

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-md mb-4 mx-auto">
            <h3 class="product-title text-lg font-semibold text-gray-700 mb-2">${product.name}</h3>
            <p class="text-gray-500 mb-4">${product.description}</p>
            <p class="font-bold text-pink-600 mb-2">${product.price} XAF</p>
            <div class="rating mb-4">${starsHTML} (${rating} / 5)</div>
            <button class="whatsapp-button" onclick="sendMessage('${product.whatsappMessage}')">Commander via WhatsApp</button>
        `;

        container.appendChild(productElement);
    });
}

function calculateAverageRating(ratings) {
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return (total / ratings.length).toFixed(1);
}

// Fonction pour générer les étoiles de notation
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating); // Nombre d'étoiles pleines
    const halfStar = rating % 1 >= 0.5; // Si la note est >= 0.5, ajoute une demi-étoile

    // Ajouter les étoiles pleines
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="text-yellow-500">&#9733;</span>'; // Étoile pleine
    }

    // Ajouter la demi-étoile si nécessaire
    if (halfStar) {
        stars += '<span class="text-yellow-500">&#9733;</span>'; // Demi-étoile
    }

    // Ajouter les étoiles vides pour compléter jusqu'à 5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="text-gray-300">&#9733;</span>'; // Étoile vide
    }

    return stars;
}

// Fonction de gestion du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Affiche un message de confirmation après soumission
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    feedback.textContent = 'Merci pour votre message, ' + name + '. Nous vous contacterons bientôt.';

    // Optionnel : envoyer les données vers un serveur pour traitement (utiliser AJAX ou une API)
    console.log({
        name: name,
        email: email,
        message: message
    });

    // Réinitialiser le formulaire
    document.getElementById('contact-form').reset();
});

// Fonction de gestion du slider des statistiques
let statsIndex = 0;
const statsItems = document.querySelectorAll('.slider-item');

// Function to show statistics (if needed in future, ensure HTML elements exist)
function showStats(index) {
    statsItems.forEach((item, i) => {
        item.classList.toggle('translate-x-0', i === index);
        item.classList.toggle('translate-x-full', i !== index);
    });
}

// Remove event listeners for non-existing elements
// document.getElementById('nextBtn').addEventListener('click', () => {
//     statsIndex = (statsIndex + 1) % statsItems.length;
//     showStats(statsIndex);
// });

// document.getElementById('prevBtn').addEventListener('click', () => {
//     statsIndex = (statsIndex - 1 + statsItems.length) % statsItems.length;
//     showStats(statsIndex);
// });

// Affiche la première statistique
// showStats(statsIndex);

// Fonction pour envoyer un message WhatsApp
function sendMessage(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/237679214366?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Fonction de pagination
function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    // Effacer les boutons de pagination existants
    paginationContainer.innerHTML = '';

    // Créer les boutons de pagination
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('pagination-button', 'px-4', 'py-2', 'm-1', 'bg-green-400', 'text-white', 'rounded-md');
        button.className = `mx-1 px-3 py-1 rounded ${i === currentPage ? 'bg-green-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const category = document.getElementById('category-filter').value;
            const sort = document.getElementById('sort-filter').value;
            filterAndSortProducts(searchTerm, category, sort);
        });

        paginationContainer.appendChild(button);
    }
}

// Charger les produits lors du chargement de la page
filterAndSortProducts('', '', '');

// Appeler la fonction pour charger les catégories au chargement de la page
loadCategories();

// Variables de pagination
let currentPage = 1;
const itemsPerPage = 6; // Nombre de produits par page

// Fonction de gestion de la recherche
document.getElementById('search-input').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const sort = document.getElementById('sort-filter').value;
    filterAndSortProducts(searchTerm, category, sort);
});

// Fonction de gestion du filtrage par catégorie
document.getElementById('category-filter').addEventListener('change', function () {
    const category = this.value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const sort = document.getElementById('sort-filter').value;
    filterAndSortProducts(searchTerm, category, sort);
});

// Mise à jour des événements pour inclure le tri
const sortFilter = document.getElementById('sort-filter');
sortFilter.addEventListener('change', function () {
    const sort = this.value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    filterAndSortProducts(searchTerm, category, sort);
});
