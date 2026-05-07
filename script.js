// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 1000);
});

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
});

// Products Data
const products = [
    { id: 1, name: "Royal Oud", category: "men", price: 299, originalPrice: 399, rating: 5, image: "https://fragrancegallery.pk/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-11-at-6.17.58-PM-1.jpeg", badge: "Bestseller" },
    { id: 2, name: "Midnight Bloom", category: "women", price: 249, originalPrice: 349, rating: 4.5, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", badge: "Trending" },
    { id: 3, name: "Ocean Breeze", category: "unisex", price: 199, originalPrice: 299, rating: 4, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5Cfg1kmxFSS24RKQ20dcenXTtpXofTWnBw&s", badge: "New" },
    { id: 4, name: "Golden Amber", category: "unisex", price: 349, originalPrice: 449, rating: 5, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400", badge: "Limited" },
    { id: 5, name: "Savage Elixir", category: "men", price: 279, originalPrice: 379, rating: 4.5, image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400", badge: "Bestseller" },
    { id: 6, name: "Rose Petals", category: "women", price: 229, originalPrice: 329, rating: 4, image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400", badge: "" },
    { id: 7, name: "Woody Essence", category: "men", price: 319, originalPrice: 419, rating: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd0Y7ga0mgJexWfGWLybd2g00comFZ552dbg&s", badge: "Premium" },
    { id: 8, name: "Vanilla Dreams", category: "women", price: 189, originalPrice: 289, rating: 4.5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR_lVDOi1cumTuWiIlOM5zvxCeBBe-yciQZA&s", badge: "" }
];

let currentProducts = [...products];
let cart = [];
let wishlist = [];
let currentFilter = "all";
let currentSort = "default";
let visibleProducts = 8;

// Render Products
function renderProducts() {
    let filteredProducts = currentProducts;
    
    if (currentFilter !== "all") {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }
    
    if (currentSort === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (currentSort === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    
    const displayProducts = filteredProducts.slice(0, visibleProducts);
    const productsGrid = document.getElementById('productsGrid');
    
    productsGrid.innerHTML = displayProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-wishlist">
                <i class="far fa-heart"></i>
            </div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    $${product.price}
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification('Added to cart!');
}

// Update Cart UI
function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('#cartIcon .badge');
    const totalAmount = document.querySelector('.total-amount');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#888;">Your cart is empty</p>';
        totalAmount.textContent = '$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" style="display:flex; gap:15px; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid rgba(212,175,55,0.2);">
            <img src="${item.image}" style="width:80px; height:80px; object-fit:cover; border-radius:10px;">
            <div style="flex:1;">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners for cart actions
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
    });
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
    showNotification('Removed from cart');
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #d4af37;
        color: #000;
        padding: 12px 24px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Search
const searchIcon = document.getElementById('searchIcon');
const searchOverlay = document.querySelector('.search-overlay');
const closeSearch = document.querySelector('.close-search');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', () => {
    searchOverlay.classList.add('active');
});

closeSearch.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
});

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    currentProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    renderProducts();
});

// Cart Sidebar
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');

cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Filter and Sort
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderProducts();
    });
});

document.getElementById('sortProducts').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts();
});

// Load More
document.querySelector('.btn-load-more').addEventListener('click', () => {
    visibleProducts += 4;
    renderProducts();
});

// Category Click
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        document.querySelector(`.filter-btn[data-filter="${category}"]`).click();
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

// Countdown Timer
function startCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / (3600000));
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

startCountdown();

// Back to Top
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Form Submission
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Thank you! We will contact you soon.');
    e.target.reset();
});

document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Subscribed to newsletter!');
    e.target.reset();
});

// Initialize
renderProducts();

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        searchOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    }
});