/*
===============================================
SMART RING DASHBOARD - JAVASCRIPT
===============================================

Ce fichier gère les interactions et animations.

CONCEPTS CLÉS:
- DOM (Document Object Model): La structure HTML vue par JavaScript
- Event Listeners: "Écouter" les actions de l'utilisateur (clic, scroll, etc.)
- QuerySelector: Sélectionner des éléments HTML

===============================================
*/

// Attendre que la page soit complètement chargée
// DOMContentLoaded = "le HTML est prêt"
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard chargé !');

    // ========================================
    // NAVIGATION - Gestion des clics
    // ========================================

    // Sélectionner tous les liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');

    // Pour chaque lien, ajouter un "écouteur" de clic
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Empêcher le comportement par défaut du lien

            // Retirer la classe 'active' de tous les liens
            navLinks.forEach(l => l.classList.remove('active'));

            // Ajouter 'active' au lien cliqué
            this.classList.add('active');
        });
    });

    // ========================================
    // TABS FOOTER - Même logique
    // ========================================

    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ========================================
    // NAV FOOTER BUTTONS
    // ========================================

    const navFooterBtns = document.querySelectorAll('.nav-footer-btn');

    navFooterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            navFooterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ========================================
    // ANIMATION DES CARTES AU SURVOL
    // ========================================
    // Effet subtil de "tilt" (inclinaison) 3D au survol

    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            // Calculer la position de la souris relative à la carte
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;  // Position X dans la carte
            const y = e.clientY - rect.top;   // Position Y dans la carte

            // Calculer l'angle de rotation (max ±5 degrés)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;  // Rotation sur X
            const rotateY = (x - centerX) / centerX * 5;   // Rotation sur Y

            // Appliquer la transformation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        // Réinitialiser quand la souris quitte la carte
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========================================
    // ANIMATION DU RING
    // ========================================
    // Rotation légère en fonction de la position de la souris

    const ringContainer = document.querySelector('.ring-container');
    const ringImage = document.querySelector('.ring-image');

    if (ringContainer && ringImage) {
        document.addEventListener('mousemove', function(e) {
            // Position de la souris relative au centre de l'écran
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Calculer le décalage (max ±10 degrés)
            const moveX = (e.clientX - centerX) / centerX * 10;
            const moveY = (e.clientY - centerY) / centerY * 10;

            // Appliquer une rotation subtile
            ringImage.style.transform = `rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
        });
    }

    // ========================================
    // ANIMATION DES VALEURS (compteur)
    // ========================================
    // Anime les nombres de 0 à leur valeur finale

    function animateValue(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (accélération/décélération)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(start + (end - start) * easeOut);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ========================================
    // GLOW EFFECT SUR LE PROFIL
    // ========================================
    // Animation déjà gérée en CSS, mais on peut l'améliorer ici

    const profileGlow = document.querySelector('.profile-glow');

    if (profileGlow) {
        // Variation aléatoire de l'opacité pour un effet plus organique
        setInterval(() => {
            const randomOpacity = 0.4 + Math.random() * 0.3;
            profileGlow.style.opacity = randomOpacity;
        }, 2000);
    }

});

/*
===============================================
NOTES POUR APPRENDRE
===============================================

1. querySelector vs querySelectorAll
   - querySelector: Retourne UN élément (le premier trouvé)
   - querySelectorAll: Retourne TOUS les éléments correspondants

2. addEventListener
   - Permet d'exécuter du code quand quelque chose se passe
   - 'click', 'mousemove', 'mouseleave', 'scroll', etc.

3. classList
   - .add('classe'): Ajoute une classe CSS
   - .remove('classe'): Retire une classe CSS
   - .toggle('classe'): Ajoute si absente, retire si présente

4. getBoundingClientRect()
   - Retourne la taille et position d'un élément
   - Utile pour calculer des positions relatives

5. requestAnimationFrame
   - Optimise les animations (60 fps)
   - Mieux que setInterval pour les animations visuelles

===============================================
*/
