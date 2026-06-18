// Interactive JavaScript for Myntra Clone

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hero Banner Carousel
    const bannerSection = document.querySelector('.section1');
    if (bannerSection) {
        const banners = bannerSection.querySelectorAll('.homeImg');
        if (banners.length > 1) {
            // Wrap banners in a slider container
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'hero-slider';
            
            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'hero-slider-wrapper';
            
            // Move banners into wrapper
            banners.forEach((banner, index) => {
                const slide = document.createElement('div');
                slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
                slide.appendChild(banner.cloneNode(true));
                sliderWrapper.appendChild(slide);
                banner.remove();
            });
            
            sliderContainer.appendChild(sliderWrapper);
            
            // Add navigation dots
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            banners.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
                dot.dataset.index = index;
                dotsContainer.appendChild(dot);
            });
            sliderContainer.appendChild(dotsContainer);
            
            // Insert slider back into section
            bannerSection.insertBefore(sliderContainer, bannerSection.firstChild);
            
            let currentSlide = 0;
            const slides = sliderWrapper.querySelectorAll('.hero-slide');
            const dots = dotsContainer.querySelectorAll('.slider-dot');
            const totalSlides = slides.length;
            
            function showSlide(index) {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
                currentSlide = (index + totalSlides) % totalSlides;
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }
            
            // Auto slide every 4 seconds
            let slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 4000);
            
            // Click on dots
            dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    clearInterval(slideInterval);
                    const index = parseInt(e.target.dataset.index);
                    showSlide(index);
                    slideInterval = setInterval(() => {
                        showSlide(currentSlide + 1);
                    }, 4000);
                });
            });
        }
    }

    // 2. Interactive Badges (Wishlist & Bag)
    let wishlistCount = 0;
    let bagCount = 0;
    
    const wishlistBadge = document.getElementById('wishlist-count');
    const bagBadge = document.getElementById('bag-count');
    
    // Update badge visibility helper
    function updateBadge(badge, count) {
        if (!badge) return;
        badge.textContent = count;
        if (count > 0) {
            badge.classList.add('show');
        } else {
            badge.classList.remove('show');
        }
    }

    // 3. Category Items Interactions
    const categoryContainer = document.querySelector('.category-grid');
    if (categoryContainer) {
        const items = categoryContainer.querySelectorAll('.category-card');
        items.forEach(item => {
            // Create overlays for interaction
            const overlay = document.createElement('div');
            overlay.className = 'card-overlay';
            
            const wishBtn = document.createElement('button');
            wishBtn.className = 'card-btn wish-btn';
            wishBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Wishlist';
            
            const bagBtn = document.createElement('button');
            bagBtn.className = 'card-btn bag-btn';
            bagBtn.innerHTML = '<i class="fa-solid fa-bag-shopping"></i> Add to Bag';
            
            overlay.appendChild(wishBtn);
            overlay.appendChild(bagBtn);
            item.appendChild(overlay);
            
            // Add click listeners
            wishBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                wishlistCount++;
                updateBadge(wishlistBadge, wishlistCount);
                showToast('Added to Wishlist! ❤️');
                animateBadge(wishlistBadge);
            });
            
            bagBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                bagCount++;
                updateBadge(bagBadge, bagCount);
                showToast('Added to Shopping Bag! 🛍️');
                animateBadge(bagBadge);
            });
        });
    }

    // Badge bounce animation
    function animateBadge(badge) {
        if (!badge) return;
        badge.classList.remove('bounce');
        void badge.offsetWidth; // Trigger reflow
        badge.classList.add('bounce');
    }

    // 4. Toast Notification System
    function showToast(message) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger enter animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // 5. Search Bar Suggestion Dropdown
    const searchBar = document.querySelector('.search');
    if (searchBar) {
        const searchWrapper = searchBar.parentElement;
        searchWrapper.style.position = 'relative';
        
        const suggestions = [
            'Kurtas & Suits',
            'T-Shirts & Polos',
            'Casual Shoes',
            'Dresses',
            'Activewear HRX',
            'Puma Shoes',
            'Formal Shirts',
            'Handbags & Wallets'
        ];
        
        const dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions';
        searchWrapper.appendChild(dropdown);
        
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            dropdown.innerHTML = '';
            
            if (query.length > 0) {
                const filtered = suggestions.filter(item => item.toLowerCase().includes(query));
                if (filtered.length > 0) {
                    filtered.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> <span>${item}</span>`;
                        div.addEventListener('click', () => {
                            searchBar.value = item;
                            dropdown.classList.remove('show');
                            showToast(`Searching for "${item}"...`);
                        });
                        dropdown.appendChild(div);
                    });
                    dropdown.classList.add('show');
                } else {
                    dropdown.classList.remove('show');
                }
            } else {
                dropdown.classList.remove('show');
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        searchBar.addEventListener('focus', () => {
            if (searchBar.value.trim().length > 0) {
                dropdown.classList.add('show');
            }
        });
    }

    // 6. Header Profile Dropdown
    const profileBtn = document.querySelector('.profile');
    if (profileBtn) {
        profileBtn.style.position = 'relative';
        
        const profileMenu = document.createElement('div');
        profileMenu.className = 'profile-dropdown';
        profileMenu.innerHTML = `
            <div class="dropdown-header">
                <h4>Welcome</h4>
                <p>To access account and manage orders</p>
                <button class="login-btn">LOGIN / SIGNUP</button>
            </div>
            <hr>
            <ul class="dropdown-links">
                <li><a href="#"><i class="fa-regular fa-file-lines"></i> Orders</a></li>
                <li><a href="#"><i class="fa-regular fa-heart"></i> Wishlist</a></li>
                <li><a href="#"><i class="fa-regular fa-gift"></i> Gift Cards</a></li>
                <li><a href="#"><i class="fa-regular fa-envelope"></i> Contact Us</a></li>
            </ul>
        `;
        profileBtn.appendChild(profileMenu);
        
        profileBtn.addEventListener('click', (e) => {
            profileMenu.classList.toggle('show');
            e.stopPropagation();
        });
        
        document.addEventListener('click', () => {
            profileMenu.classList.remove('show');
        });
        
        profileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 7. Contact Feedback Form Handler
    const contactForm = document.querySelector('#form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('input[name="username"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const comment = contactForm.querySelector('textarea[name="comment"]').value.trim();
            
            if (name && email && comment) {
                // Show success modal or toast
                showToast(`Thank you, ${name}! Your feedback has been received. 🌟`);
                contactForm.reset();
            } else {
                showToast('Please fill out all fields in the contact form.');
            }
        });
    }
});
