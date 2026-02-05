/*
===============================================
SMART RING DASHBOARD - JAVASCRIPT
===============================================

Ce fichier gère les interactions et animations.

CONCEPTS CLÉS:
- DOM (Document Object Model): La structure HTML vue par JavaScript
- Event Listeners: "Écouter" les actions de l'utilisateur (clic, scroll, etc.)
- QuerySelector: Sélectionner des éléments HTML
- getBoundingClientRect(): Mesurer taille et position d'un élément

NOUVEAU CONCEPT - SLIDER GLISSANT:
- On mesure la position de l'onglet actif avec getBoundingClientRect()
- On déplace un élément "slider" derrière l'onglet actif
- La transition CSS fait le glissement smooth automatiquement

===============================================
*/

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // FONCTION UTILITAIRE : SLIDER GLISSANT
    // ========================================
    /*
       Cette fonction prend :
       - container : l'élément parent (ex: .nav-main)
       - slider : l'élément qui glisse (ex: .nav-slider)
       - activeItem : l'onglet actif (ex: le lien cliqué)

       Elle mesure la position de l'onglet actif et déplace le slider.

       Comment ça marche (en maths) :
       - getBoundingClientRect() retourne {left, top, width, height}
       - Pour positionner le slider relativement au container,
         on soustrait la position du container : item.left - container.left
       - On ajuste pour le padding du container
    */
    function moveSlider(container, slider, activeItem) {
        // Pas d'onglet actif ? On cache le slider
        if (!activeItem) {
            slider.style.opacity = '0';
            return;
        }

        // Mesurer les positions
        const containerRect = container.getBoundingClientRect();
        const activeRect = activeItem.getBoundingClientRect();

        // Calculer la position relative (par rapport au container)
        const left = activeRect.left - containerRect.left;
        const width = activeRect.width;

        // Appliquer au slider
        slider.style.left = left + 'px';
        slider.style.width = width + 'px';
        slider.style.opacity = '1';
    }

    // ========================================
    // NAVIGATION PRINCIPALE (Overview/Apps/Store)
    // ========================================

    const navMain = document.querySelector('.nav-main');
    const navSlider = document.querySelector('.nav-slider');
    const navLinks = document.querySelectorAll('.nav-link');

    // Positionner le slider sur l'onglet actif au chargement
    if (navMain && navSlider) {
        const activeNav = document.querySelector('.nav-link.active');
        moveSlider(navMain, navSlider, activeNav);

        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Retirer 'active' de tous, l'ajouter au cliqué
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Déplacer le slider vers le nouvel onglet
                moveSlider(navMain, navSlider, this);
            });
        });
    }

    // ========================================
    // TABS FOOTER (Journey/Stats/Duels)
    // ========================================

    const footerTabs = document.querySelector('.footer-tabs');
    const tabSlider = document.querySelector('.tab-slider');
    const tabs = document.querySelectorAll('.tab');

    if (footerTabs && tabSlider) {
        const activeTab = document.querySelector('.tab.active');
        moveSlider(footerTabs, tabSlider, activeTab);

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                moveSlider(footerTabs, tabSlider, this);
            });
        });
    }

    // ========================================
    // NAV FOOTER BUTTONS (icônes du bas)
    // ========================================

    const navFooterBtns = document.querySelectorAll('.nav-footer-btn');

    navFooterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            navFooterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ========================================
    // ANIMATION DES CARTES AU SURVOL (tilt 3D)
    // ========================================

    const cards = document.querySelectorAll('.card');

    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Max ±5 degrés de rotation
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========================================
    // ANIMATION DU RING (suit la souris)
    // ========================================

    const ringImage = document.querySelector('.ring-image');

    if (ringImage) {
        document.addEventListener('mousemove', function(e) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Max ±10 degrés
            const moveX = (e.clientX - centerX) / centerX * 10;
            const moveY = (e.clientY - centerY) / centerY * 10;

            ringImage.style.transform = `rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
        });
    }

    // ========================================
    // GLOW EFFECT SUR LE PROFIL
    // ========================================

    const profileGlow = document.querySelector('.profile-glow');

    if (profileGlow) {
        setInterval(() => {
            const randomOpacity = 0.4 + Math.random() * 0.3;
            profileGlow.style.opacity = randomOpacity;
        }, 2000);
    }

    // ========================================
    // REPOSITIONNER LES SLIDERS AU RESIZE
    // ========================================
    /*
       Si l'utilisateur redimensionne la fenêtre, les positions changent.
       On recalcule les sliders pour qu'ils restent en place.
    */
    window.addEventListener('resize', function() {
        const activeNav = document.querySelector('.nav-link.active');
        const activeTab = document.querySelector('.tab.active');

        if (navMain && navSlider && activeNav) {
            moveSlider(navMain, navSlider, activeNav);
        }
        if (footerTabs && tabSlider && activeTab) {
            moveSlider(footerTabs, tabSlider, activeTab);
        }
    });

});

/*
===============================================
NOTES POUR APPRENDRE
===============================================

1. querySelector vs querySelectorAll
   - querySelector: Retourne UN élément (le premier trouvé)
   - querySelectorAll: Retourne TOUS les éléments correspondants

2. getBoundingClientRect()
   - Retourne un objet {left, top, right, bottom, width, height}
   - Les valeurs sont en pixels, relatives au viewport (l'écran visible)
   - C'est LA méthode pour mesurer et positionner des éléments

3. Le principe du slider glissant :
   - Un seul élément se déplace (le slider)
   - La transition CSS fait l'animation automatiquement
   - On calcule juste OÙ le placer avec getBoundingClientRect()
   - Avantage : un seul fond qui bouge = glissement fluide
     (vs animer le background de chaque onglet = pas de glissement)

4. cubic-bezier(0.25, 0.1, 0.25, 1)
   - Courbe d'animation personnalisée
   - Le slider accélère doucement puis ralentit
   - Ça donne un mouvement naturel et organique

===============================================
*/
