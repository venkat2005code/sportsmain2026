// Note: Theme and RTL Toggle logic has been moved to a consolidated head script 
// in each HTML file for better reliability and faster initial interaction.
// Head script handles: setTheme, setDirection, and delegated click listeners.

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Dropdown Logic
document.addEventListener('click', (e) => {
    const isDropdownButton = e.target.closest('[data-dropdown-toggle]');
    const isDropdownMenu = e.target.closest('[data-dropdown-menu]');

    if (isDropdownButton) {
        const targetId = isDropdownButton.getAttribute('data-dropdown-toggle');
        const targetMenu = document.getElementById(targetId);

        // Close other dropdowns
        document.querySelectorAll('[data-dropdown-menu]').forEach(menu => {
            if (menu.id !== targetId) {
                menu.classList.add('hidden');
                menu.classList.remove('opacity-100', 'scale-100');
                menu.classList.add('opacity-0', 'scale-95');
            }
        });

        if (targetMenu) {
            targetMenu.classList.toggle('hidden');
            setTimeout(() => {
                targetMenu.classList.toggle('opacity-0');
                targetMenu.classList.toggle('scale-95');
                targetMenu.classList.toggle('opacity-100');
                targetMenu.classList.toggle('scale-100');
            }, 10);
        }
    } else if (!isDropdownMenu) {
        // Click outside, close all
        document.querySelectorAll('[data-dropdown-menu]').forEach(menu => {
            menu.classList.add('opacity-0', 'scale-95');
            menu.classList.remove('opacity-100', 'scale-100');
            setTimeout(() => {
                menu.classList.add('hidden');
            }, 200);
        });
    }
});

// Scroll Reveal Animation with Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, {
    root: null,
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// Pricing Toggle Logic
const pricingToggle = document.getElementById('pricing-toggle');
const toggleSlider = document.getElementById('toggle-slider');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');
const pricePeriod = document.getElementById('price-period');

let isYearly = true; // Default state (as shown in the UI with toggle on the right)

if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
        isYearly = !isYearly;

        // Update toggle position
        if (isYearly) {
            toggleSlider.classList.remove('left-1');
            toggleSlider.classList.add('right-1');
            monthlyLabel.classList.remove('text-brand-text', 'font-bold');
            monthlyLabel.classList.add('text-brand-muted');
            yearlyLabel.classList.remove('text-brand-muted');
            yearlyLabel.classList.add('text-brand-text', 'font-bold');
        } else {
            toggleSlider.classList.remove('right-1');
            toggleSlider.classList.add('left-1');
            monthlyLabel.classList.remove('text-brand-muted');
            monthlyLabel.classList.add('text-brand-text', 'font-bold');
            yearlyLabel.classList.remove('text-brand-text', 'font-bold');
            yearlyLabel.classList.add('text-brand-muted');
        }

        // Update prices
        document.querySelectorAll('[data-monthly]').forEach(priceEl => {
            const monthlyPrice = priceEl.getAttribute('data-monthly');
            const yearlyPrice = priceEl.getAttribute('data-yearly');
            const price = isYearly ? yearlyPrice : monthlyPrice;

            // Update price text
            if (price === '0') {
                priceEl.textContent = '$0';
            } else {
                const periodText = pricePeriod ? '/mo' : '';
                priceEl.innerHTML = `$${price}<span class="text-lg font-normal opacity-70">${periodText}</span>`;
            }
        });
    });
}

// Fix for dropdown links not redirecting - Force navigation with capture phase
document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-dropdown-menu] a');
    if (link && link.href && link.href.length > 0) {
        // Allow opening in new tab with modifier keys
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        // Prevent default and stop propagation to ensure clean navigation
        e.preventDefault();
        e.stopPropagation();

        // Force navigation
        window.location.href = link.href;
    }
}, true); // Use capture phase to run before other listeners
