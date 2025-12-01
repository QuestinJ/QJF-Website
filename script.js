// Self-invoking function to encapsulate the script and avoid polluting the global scope.
(function () {
    // Select the hamburger menu icon and the navigation menu.
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    // Add a click event listener to the hamburger icon.
    hamburger.addEventListener("click", () => {
        // Toggle the 'active' class on both the hamburger and the nav menu
        // to show/hide the mobile menu and animate the icon.
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Add click event listeners to all navigation links.
    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        // When a nav link is clicked, close the mobile menu.
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });

    // --- INTERACTIVE MAP (Leaflet.js) ---
    // Only initialize if the map element exists (projects.html)
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Initialize map centered on Heber City sample area
        const map = L.map('map').setView([40.510, -111.407], 14);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Sample Data (from the table)
        const hazards = [
            { lat: 40.516, lng: -111.417, severity: 'High', cause: 'Tree Root', address: '235 W 650 N', photo: 'Sample%20Photos/caused_by_tree_trip_hazrd.jpg' },
            { lat: 40.515, lng: -111.416, severity: 'Medium', cause: 'Lifted Panel', address: '598 N 200 W', photo: 'Sample%20Photos/medium_trip_hazard.jpg' },
            { lat: 40.505, lng: -111.398, severity: 'Low', cause: 'Minor Settling', address: '960 E 200 S', photo: 'Sample%20Photos/low_trip_hazard.jpg' },
            { lat: 40.504, lng: -111.397, severity: 'High', cause: 'Expansion Heave', address: '234 S 1000 E', photo: 'Sample%20Photos/high_trip_hazard.jpg' },
            { lat: 40.512, lng: -111.405, severity: 'Extreme', cause: 'Severe Buckling', address: '450 S Main St', photo: 'Sample%20Photos/extreme_high_trip_hazard.jpg' },
            { lat: 40.508, lng: -111.410, severity: 'Severe', cause: 'Spalling', address: '120 E 100 S', photo: 'Sample%20Photos/severe_spalling_single%20_panel.jpg' }
        ];

        // Custom Icons based on severity
        const getColor = (severity) => {
            if (severity === 'High' || severity === 'Extreme' || severity === 'Severe') return 'red';
            if (severity === 'Medium') return 'orange';
            return 'green';
        };

        hazards.forEach(hazard => {
            // Create a simple circle marker
            L.circleMarker([hazard.lat, hazard.lng], {
                color: getColor(hazard.severity),
                fillColor: getColor(hazard.severity),
                fillOpacity: 0.8,
                radius: 8
            }).addTo(map)
                .bindPopup(`
                <strong>${hazard.severity} Severity</strong><br>
                ${hazard.cause}<br>
                <em>${hazard.address}</em><br>
                <img src="${hazard.photo}" style="width:100px; margin-top:5px; border-radius:4px;">
            `);
        });
    }

    // --- CONTACT FORM HANDLING ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Send to Google Apps Script (Placeholder URL - User must update)
            // We use 'no-cors' mode because GAS doesn't support CORS headers easily for simple POSTs,
            // but the data still gets sent.
            fetch('https://script.google.com/macros/s/AKfycbzX3gGHZH4ea9JwqSg2yaGU2HRJnXf8PRv4ldPQiGrd64Zta8K03HfDQUbwPxUcVNemJw/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    // Since 'no-cors' returns an opaque response, we assume success if no network error.
                    alert('Thank you! Your message has been sent. We will be in touch shortly.');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error sending your message. Please try again or email us directly.');
                })
                .finally(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // --- CAROUSEL LOGIC ---
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        // Make functions available globally for onclick events
        window.showSlide = (index) => {
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === currentSlide) slide.classList.add('active');
            });
        };

        window.nextSlide = () => {
            window.showSlide(currentSlide + 1);
            resetTimer();
        };

        window.prevSlide = () => {
            window.showSlide(currentSlide - 1);
            resetTimer();
        };

        function startAutoPlay() {
            slideInterval = setInterval(() => {
                window.showSlide(currentSlide + 1);
            }, 4000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startAutoPlay();
        }

        startAutoPlay();
    }

})();
