/**
 * Katalog Unit Usaha HMPTI ITS — Main JavaScript
 * Tech Stack: Pure Vanilla JS (No Frameworks)
 * Features:
 * 1. Preloader Screen Handler
 * 2. Sticky Glassmorphism Header & ScrollSpy Navigation
 * 3. Mobile Hamburger Menu Toggle
 * 4. Multi-Category Catalog Filter (F&B, Percetakan, Konsinyasi, Jasa Kreatif)
 * 5. Integrated WhatsApp Order & Basket System
 * 6. Interactive Review Modal & Realtime Star Ratings
 * 7. Copy Address & Dynamic Office Opening Status
 * 8. Back to Top Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current Year Update
    const yearElem = document.getElementById('currentYear');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       1. PRELOADER LOGIC
       ========================================================================== */
    const preloader = document.getElementById('preloader');

    const hidePreloader = () => {
        if (!preloader || preloader.classList.contains('fade-out')) return;
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 550);
    };

    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 600);
    });

    // Fallback safe timer
    setTimeout(hidePreloader, 2000);


    /* ==========================================================================
       2. HEADER, STICKY EFFECT & SCROLLSPY
       ========================================================================== */
    const header = document.getElementById('header');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Toggle
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile menu on clicking any navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ScrollSpy: Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const scrollSpy = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    correspondingLink.classList.add('active');
                } else {
                    correspondingLink.classList.remove('active');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);


    /* ==========================================================================
       3. CATALOG CATEGORY FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('#catalogFilters .filter-btn');
    const catalogCards = document.querySelectorAll('.catalog-card');

    const applyFilter = (category) => {
        // Update active class on filter buttons
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show/hide cards with smooth entrance
        catalogCards.forEach(card => {
            const cardCategories = (card.getAttribute('data-category') || '').split(' ');

            if (category === 'all' || cardCategories.includes(category)) {
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 40);
            } else {
                card.style.display = 'none';
            }
        });
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.getAttribute('data-category');
            applyFilter(cat);
        });
    });

    // Interlink from 4 Division Cards & Footer Links to Catalog Filter
    const quickFilterLinks = document.querySelectorAll('[data-filter]');
    quickFilterLinks.forEach(link => {
        link.addEventListener('click', () => {
            const filterTarget = link.getAttribute('data-filter');
            applyFilter(filterTarget);
        });
    });


    /* ==========================================================================
       4. TOAST NOTIFICATION & WHATSAPP BASKET SYSTEM
       ========================================================================== */
    const toastContainer = document.getElementById('toastContainer');
    const cartCountElem = document.getElementById('cartCount');
    const cartBtn = document.getElementById('cartBtn');
    const selectedServices = [];

    const showToast = (message, iconClass = 'fa-solid fa-circle-check') => {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after 3.2s
        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3200);
    };

    // Add order item
    const orderButtons = document.querySelectorAll('.btn-order');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.getAttribute('data-name') || 'Layanan HMPTI';
            const unitName = btn.getAttribute('data-unit') || 'Umum';

            selectedServices.push({ name: itemName, unit: unitName });

            // Update badge
            if (cartCountElem) {
                cartCountElem.textContent = selectedServices.length;
                cartCountElem.classList.add('bump');
                setTimeout(() => {
                    cartCountElem.classList.remove('bump');
                }, 300);
            }

            showToast(`${itemName} (${unitName}) ditambahkan! Klik keranjang untuk pesan.`);
        });
    });

    // Click Cart Button to Open WhatsApp Order
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (selectedServices.length === 0) {
                showToast('Daftar permintaanmu masih kosong. Silakan pilih dari katalog!', 'fa-solid fa-circle-info');
            } else {
                // Build WhatsApp message
                let message = 'Halo Admin Unit Usaha HMPTI ITS, saya ingin memesan layanan berikut:\n';
                selectedServices.forEach((item, idx) => {
                    message += `${idx + 1}. ${item.name} [${item.unit}]\n`;
                });
                message += '\nMohon info ketersediaan dan prosedur selanjutnya. Terima kasih!';

                const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
                window.open(waUrl, '_blank');
            }
        });
    }


    /* ==========================================================================
       5. REVIEW MODAL & STAR RATINGS
       ========================================================================== */
    const btnOpenReview = document.getElementById('btnOpenReview');
    const btnCloseReview = document.getElementById('btnCloseReview');
    const btnCancelReview = document.getElementById('btnCancelReview');
    const modalReview = document.getElementById('modalReview');
    const formReview = document.getElementById('formReview');
    const starOptions = document.querySelectorAll('.star-opt');
    const ratingValueInput = document.getElementById('ratingValue');
    const reviewsContainer = document.getElementById('reviewsContainer');

    const openReviewModal = () => {
        if (modalReview) modalReview.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeReviewModal = () => {
        if (modalReview) modalReview.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (btnOpenReview) btnOpenReview.addEventListener('click', openReviewModal);
    if (btnCloseReview) btnCloseReview.addEventListener('click', closeReviewModal);
    if (btnCancelReview) btnCancelReview.addEventListener('click', closeReviewModal);

    if (modalReview) {
        modalReview.addEventListener('click', (e) => {
            if (e.target === modalReview) {
                closeReviewModal();
            }
        });
    }

    // Star Rating Click
    let currentRating = 5;
    starOptions.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-rating'), 10);
            if (ratingValueInput) ratingValueInput.value = currentRating;

            starOptions.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-rating'), 10);
                if (sVal <= currentRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Review Form Submit
    if (formReview) {
        formReview.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reviewName').value.trim();
            const unit = document.getElementById('reviewUnit').value;
            const comment = document.getElementById('reviewComment').value.trim();

            if (!name || !comment) return;

            // Generate Initials
            const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

            // Generate Stars
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= currentRating) {
                    starsHTML += '<i class="fa-solid fa-star"></i>';
                } else {
                    starsHTML += '<i class="fa-regular fa-star"></i>';
                }
            }

            // Create New Review Item
            const newReview = document.createElement('div');
            newReview.className = 'review-item';
            newReview.innerHTML = `
                <div class="review-top">
                    <div class="reviewer-info">
                        <div class="avatar-circle">${initials || 'IT'}</div>
                        <div>
                            <h4 class="name">${name}</h4>
                            <span class="role"><i class="fa-solid fa-circle-check"></i> Pengguna Terverifikasi (${unit})</span>
                        </div>
                    </div>
                    <div class="review-stars">
                        ${starsHTML}
                    </div>
                </div>
                <p class="review-text">
                    "${comment}"
                </p>
                <span class="review-date">Baru saja &bull; ${unit}</span>
            `;

            if (reviewsContainer) {
                reviewsContainer.prepend(newReview);
            }

            // Reset & Close
            formReview.reset();
            currentRating = 5;
            starOptions.forEach(s => s.classList.add('active'));
            closeReviewModal();

            showToast('Terima kasih! Ulasanmu berhasil dikirimkan.', 'fa-solid fa-heart');
        });
    }


    /* ==========================================================================
       6. COPY ADDRESS & REALTIME OFFICE STATUS
       ========================================================================== */
    const btnCopyAddress = document.getElementById('btnCopyAddress');
    const fullAddressText = document.getElementById('fullAddressText');

    if (btnCopyAddress && fullAddressText) {
        btnCopyAddress.addEventListener('click', () => {
            const address = fullAddressText.textContent;
            navigator.clipboard.writeText(address).then(() => {
                const originalHtml = btnCopyAddress.innerHTML;
                btnCopyAddress.innerHTML = '<i class="fa-solid fa-check"></i> <span>Tersalin!</span>';
                showToast('Alamat sekretariat disalin ke clipboard!');

                setTimeout(() => {
                    btnCopyAddress.innerHTML = originalHtml;
                }, 2000);
            }).catch(() => {
                showToast('Gagal menyalin alamat', 'fa-solid fa-circle-exclamation');
            });
        });
    }

    // Dynamic Shop Status Check
    const badgeShopStatus = document.getElementById('badgeShopStatus');
    const updateOfficeStatus = () => {
        if (!badgeShopStatus) return;

        const now = new Date();
        const day = now.getDay(); // 0 is Sunday, 6 is Saturday
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour + minute / 60;

        let isOpen = false;

        // Monday to Friday: 09:00 - 17:00 WIB
        if (day >= 1 && day <= 5) {
            isOpen = currentTime >= 9.0 && currentTime < 17.0;
        }

        if (isOpen) {
            badgeShopStatus.innerHTML = '<span class="status-pulse"></span> Buka Sekarang';
            badgeShopStatus.style.background = 'var(--color-success-bg)';
            badgeShopStatus.style.color = 'var(--color-success)';
        } else {
            badgeShopStatus.innerHTML = '<span class="status-pulse" style="background-color: #EF4444;"></span> Offline &bull; Konsultasi via WhatsApp';
            badgeShopStatus.style.background = '#FEF2F2';
            badgeShopStatus.style.color = '#B91C1C';
        }
    };
    updateOfficeStatus();


    /* ==========================================================================
       7. BACK TO TOP BUTTON
       ========================================================================== */
    const btnBackToTop = document.getElementById('btnBackToTop');
    if (btnBackToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btnBackToTop.classList.add('show');
            } else {
                btnBackToTop.classList.remove('show');
            }
        });

        btnBackToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

