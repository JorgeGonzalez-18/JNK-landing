/**
 * ════════════════════════════════════════════════════════════════
 *  JNK EXPRESS — main.js
 *  Archivo principal de comportamiento e interactividad
 *
 *  Arquitectura: Funciones modulares, una responsabilidad cada una.
 *  Patrón: Función de inicialización central que orquesta el arranque.
 *
 *  Funciones incluidas:
 *  - initializeNavbar()           → Navbar sticky glassmorphism
 *  - initializeMobileMenu()       → Menú hamburguesa mobile
 *  - initializeHeroCanvas()       → Canvas con red de partículas
 *  - initializeCalculator()       → Calculadora de envíos completa
 *  - initializeCoverageMap()      → Tooltips del mapa SVG
 *  - initializeGallery()          → Galería + Lightbox
 *  - initializeTestimonials()     → Slider de testimonios
 *  - initializeScrollAnimations() → Reveal on scroll con IntersectionObserver
 *  - initializeStatCounters()     → Contadores animados
 *  - initializeContactForm()      → Validación + envío a WhatsApp
 *  - initializeVideoModal()       → Modal de video YouTube
 *  - initializeBackToTop()        → Botón volver arriba
 *  - initializeSmoothScroll()     → Navegación suave a secciones
 * ════════════════════════════════════════════════════════════════
 */


/* ══════════════════════════════════════
   PUNTO DE ENTRADA PRINCIPAL
   Se ejecuta cuando el DOM está completamente cargado
   ══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
    initializeNavbar();
    initializeMobileMenu();
    initializeHeroCanvas();
    initializeCalculator();
    initializeCoverageMap();
    initializeGallery();
    initializeTestimonials();
    initializeScrollAnimations();
    initializeStatCounters();
    initializeContactForm();
    initializeVideoModal();
    initializeBackToTop();
    initializeSmoothScroll();
});


/* ══════════════════════════════════════
   NAVBAR — Glassmorphism en scroll
   ══════════════════════════════════════ */

/**
 * initializeNavbar
 *
 * Qué hace: Cambia la apariencia del navbar según el scroll de la página.
 * Cómo funciona: Escucha el evento 'scroll'. Si el usuario bajó más de 60px,
 *   agrega la clase CSS 'navbar--scrolled' que activa el glassmorphism.
 *   También marca el link activo según la sección visible.
 * Por qué así: Es más eficiente que cambiar estilos directamente en JS.
 *   La clase CSS tiene las propiedades de transición definidas,
 *   lo que permite que el navegador optimice la animación.
 */
function initializeNavbar() {
    var navbar = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.navbar__link');

    if (!navbar) return;

    // Función que se ejecuta en cada evento de scroll
    function updateNavbarOnScroll() {
        var scrollY = window.scrollY || window.pageYOffset;

        // Activar glassmorphism después de 60px de scroll
        if (scrollY > 60) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }

        // Marcar el link de navegación activo según la sección visible
        updateActiveNavLink(navLinks);
    }

    window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });

    // Ejecutar al cargar por si la página ya está scrolleada
    updateNavbarOnScroll();
}

/**
 * updateActiveNavLink
 *
 * Qué hace: Resalta el link del navbar que corresponde a la sección visible.
 * Cómo funciona: Revisa qué sección del HTML está en el viewport
 *   y agrega la clase 'navbar__link--active' al link correspondiente.
 *
 * @param {NodeList} navLinks - Lista de todos los links del navbar
 */
function updateActiveNavLink(navLinks) {
    var sections = document.querySelectorAll('section[id]');
    var scrollY = window.scrollY + 100; // Offset para activar antes del tope

    sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(function (link) {
                link.classList.remove('navbar__link--active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('navbar__link--active');
                }
            });
        }
    });
}


/* ══════════════════════════════════════
   MENÚ MOBILE — Hamburguesa
   ══════════════════════════════════════ */

/**
 * initializeMobileMenu
 *
 * Qué hace: Abre y cierra el menú de navegación en pantallas pequeñas.
 * Cómo funciona: Alterna clases CSS y atributos ARIA al hacer click
 *   en el botón hamburguesa. También cierra el menú al hacer click
 *   en un link de navegación.
 * Por qué así: Los atributos ARIA son necesarios para que lectores de
 *   pantalla (usuarios con discapacidad visual) entiendan el estado del menú.
 */
function initializeMobileMenu() {
    var menuBtn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var menuLinks = document.querySelectorAll('.mobile-menu__link');

    if (!menuBtn || !menu) return;

    // Abrir o cerrar el menú
    menuBtn.addEventListener('click', function () {
        var isOpen = menu.classList.contains('mobile-menu--open');

        if (isOpen) {
            closeMobileMenu(menuBtn, menu);
        } else {
            openMobileMenu(menuBtn, menu);
        }
    });

    // Cerrar menú al hacer click en cualquier link
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMobileMenu(menuBtn, menu);
        });
    });

    // Cerrar menú al presionar la tecla Escape
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menu.classList.contains('mobile-menu--open')) {
            closeMobileMenu(menuBtn, menu);
            menuBtn.focus(); // Regresar el foco al botón (accesibilidad)
        }
    });
}

/** Abre el menú mobile */
function openMobileMenu(menuBtn, menu) {
    menu.classList.add('mobile-menu--open');
    menu.removeAttribute('aria-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Cerrar menú de navegación');
}

/** Cierra el menú mobile */
function closeMobileMenu(menuBtn, menu) {
    menu.classList.remove('mobile-menu--open');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
}


/* ══════════════════════════════════════
   HERO CANVAS — Red de partículas animada
   ══════════════════════════════════════ */

/**
 * initializeHeroCanvas
 *
 * Qué hace: Dibuja una red de puntos luminosos conectados por líneas
 *   sobre el fondo del hero, creando el efecto de "red logística".
 * Cómo funciona: Usa la API Canvas 2D del navegador para dibujar
 *   puntos que se mueven lentamente. Si dos puntos están cerca,
 *   dibuja una línea semitransparente entre ellos.
 *   requestAnimationFrame asegura que la animación sea fluida y
 *   eficiente (solo dibuja cuando el navegador está listo).
 * Por qué así: Es una solución de cero dependencias, muy liviana y
 *   completamente controlable para ajustar al diseño de la marca.
 *   Se desactiva si el usuario prefiere movimiento reducido.
 */
function initializeHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');

    if (!canvas) return;

    // Respetar preferencia de accesibilidad: si el usuario prefiere
    // sin animaciones (por ejemplo, por epilepsia), no activar el canvas
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        canvas.style.display = 'none';
        return;
    }

    var ctx = canvas.getContext('2d');

    // Cantidad de puntos y distancia máxima para dibujar líneas
    var NUMERO_PUNTOS = 60;
    var DISTANCIA_MAX = 120; // px — si dos puntos están más cerca, se conectan

    var puntos = [];

    // Ajustar el tamaño del canvas al tamaño de la ventana
    function ajustarTamano() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Crear un punto con posición y velocidad aleatorias
    function crearPunto() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, // Velocidad máxima: 0.3px/frame
            vy: (Math.random() - 0.5) * 0.3,
            radio: Math.random() * 2 + 1
        };
    }

    // Inicializar los puntos
    function inicializarPuntos() {
        puntos = [];
        for (var i = 0; i < NUMERO_PUNTOS; i++) {
            puntos.push(crearPunto());
        }
    }

    // Mover cada punto y rebotar en los bordes del canvas
    function moverPuntos() {
        puntos.forEach(function (punto) {
            punto.x += punto.vx;
            punto.y += punto.vy;

            // Rebotar en borde izquierdo/derecho
            if (punto.x < 0 || punto.x > canvas.width) {
                punto.vx *= -1;
            }

            // Rebotar en borde superior/inferior
            if (punto.y < 0 || punto.y > canvas.height) {
                punto.vy *= -1;
            }
        });
    }

    // Dibujar todos los puntos y sus conexiones
    function dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar líneas de conexión entre puntos cercanos
        for (var i = 0; i < puntos.length; i++) {
            for (var j = i + 1; j < puntos.length; j++) {
                var dx = puntos[i].x - puntos[j].x;
                var dy = puntos[i].y - puntos[j].y;
                var distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia < DISTANCIA_MAX) {
                    // La opacidad de la línea disminuye con la distancia
                    var opacidad = 1 - distancia / DISTANCIA_MAX;

                    ctx.beginPath();
                    ctx.moveTo(puntos[i].x, puntos[i].y);
                    ctx.lineTo(puntos[j].x, puntos[j].y);
                    ctx.strokeStyle = 'rgba(229, 57, 53, ' + opacidad * 0.15 + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Dibujar los puntos
        puntos.forEach(function (punto) {
            ctx.beginPath();
            ctx.arc(punto.x, punto.y, punto.radio, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fill();
        });
    }

    // Bucle de animación principal
    function animar() {
        moverPuntos();
        dibujar();
        requestAnimationFrame(animar); // Pedir al navegador el próximo frame
    }

    // Ajustar canvas cuando la ventana cambie de tamaño
    window.addEventListener('resize', function () {
        ajustarTamano();
        inicializarPuntos();
    }, { passive: true });

    // Inicializar y arrancar
    ajustarTamano();
    inicializarPuntos();
    animar();
}


/* ══════════════════════════════════════
   CALCULADORA DE ENVÍOS
   ══════════════════════════════════════ */

/**
 * initializeCalculator
 *
 * Qué hace: Configura ambas calculadoras (hero y sección completa).
 * Cómo funciona: Escucha el submit de ambos formularios y llama
 *   a calculateShippingCost() con los datos ingresados.
 */
function initializeCalculator() {
    // Calculadora \u2014 sección dedicada (única en la página)
    var calcForm = document.getElementById('calc-form');
    if (calcForm) {
        calcForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var costo = calculateShippingCost(
                document.getElementById('calc-destino').value,
                parseFloat(document.getElementById('calc-peso').value) || 0,
                parseFloat(document.getElementById('calc-largo').value) || 0,
                parseFloat(document.getElementById('calc-ancho').value) || 0,
                parseFloat(document.getElementById('calc-alto').value) || 0
            );
            mostrarResultadoCalculadora(
                costo,
                document.getElementById('calc-destino').value,
                parseFloat(document.getElementById('calc-peso').value) || 0,
                parseFloat(document.getElementById('calc-largo').value) || 0,
                parseFloat(document.getElementById('calc-ancho').value) || 0,
                parseFloat(document.getElementById('calc-alto').value) || 0
            );
        });
    }
}

/**
 * calculateShippingCost
 *
 * Qué hace: Calcula el costo estimado de un envío.
 * Cómo funciona:
 *   1. Obtiene la tarifa base según el destino
 *   2. Calcula el peso volumétrico con la fórmula estándar courier
 *   3. Usa el mayor entre peso real y volumétrico (peso facturable)
 *   4. Suma tarifa base + (peso facturable × cargo por kg)
 *
 * IMPORTANTE: Esta es una simulación para el prototipo.
 * Las tarifas reales las define el cliente.
 * Para integrar con una API real en el futuro, reemplazar el
 * contenido de esta función con un fetch() al endpoint del cliente.
 *
 * Fórmula volumétrica estándar courier internacional:
 *   Peso volumétrico (kg) = Largo × Ancho × Alto (en cm) / 5000
 * Esta fórmula la usan DHL, FedEx y Correos de Costa Rica.
 *
 * @param {string} destino  - Código del destino (ej: 'riofrio')
 * @param {number} pesoReal - Peso físico del paquete en kg
 * @param {number} largo    - Largo del paquete en cm
 * @param {number} ancho    - Ancho del paquete en cm
 * @param {number} alto     - Alto del paquete en cm
 * @returns {number}        - Precio estimado en colones costarricenses
 */
function calculateShippingCost(destino, pesoReal, largo, ancho, alto) {

    // ───────────────────────────────────────────────────────────
    // TARIFAS BASE POR DESTINO — EN COLONES COSTARRICENSES
    // SIMULADAS para el prototipo — el cliente define las reales
    // Para cambiarlas, modificar los valores de este objeto
    // ───────────────────────────────────────────────────────────
    var tarifasBase = {
        'riofrio': 2500,
        'laguaria': 2800,
        'pital': 3200,
        'aguaszarcas': 3000,
        'venecia': 2900,
        'riocuarto': 3500,
        'lavirgen': 3800,
        'sanmiguel': 2700
    };

    // Cargo adicional por cada kg facturable — SIMULADO
    var cargoPorKg = 350;

    // Paso 1: Calcular el peso volumétrico
    // Fórmula estándar: (Largo × Ancho × Alto) ÷ 5000
    var pesoVolumetrico = (largo * ancho * alto) / 5000;

    // Paso 2: Determinar el peso facturable
    // Se cobra el mayor entre el peso real y el volumétrico
    var pesoFacturable = Math.max(pesoReal, pesoVolumetrico);

    // Paso 3: Obtener la tarifa base del destino
    // Si no se encuentra el destino, usar 3000 como tarifa por defecto
    var tarifaBase = tarifasBase[destino] || 3000;

    // Paso 4: Calcular el total
    var total = tarifaBase + (pesoFacturable * cargoPorKg);

    // Redondear al entero más cercano
    return Math.round(total);
}

/**
 * mostrarPrecioHero
 *
 * Qué hace: Muestra el precio calculado en la calculadora del hero.
 * Cómo funciona: Anima el número desde 0 hasta el valor final
 *   usando setInterval y una función de easing cuadrático.
 *   Al terminar, aplica un efecto de brillo (glow) temporal.
 *
 * @param {number} costoFinal - El precio calculado en colones
 */
function mostrarPrecioHero(costoFinal) {
    var elementoPrecio = document.getElementById('hero-calc-price');
    if (!elementoPrecio) return;

    animarContador(elementoPrecio, 0, costoFinal, 800, '₡', '', true);
}

/**
 * mostrarResultadoCalculadora
 *
 * Qué hace: Muestra el resultado completo en la sección calculadora.
 * Cómo funciona: Hace visible el contenedor del resultado,
 *   anima el precio y muestra el desglose del cálculo.
 */
function mostrarResultadoCalculadora(costo, destino, peso, largo, ancho, alto) {
    var contenedor = document.getElementById('calc-resultado');
    var elementoPrecio = document.getElementById('calc-precio');
    var elementoDesglose = document.getElementById('calc-desglose');

    if (!contenedor || !elementoPrecio) return;

    // Hacer visible el resultado
    contenedor.removeAttribute('hidden');

    // Animar el precio
    animarContador(elementoPrecio, 0, costo, 800, '₡', '', true);

    // Mostrar desglose del cálculo
    if (elementoDesglose) {
        var pesoVol = ((largo * ancho * alto) / 5000).toFixed(2);
        var pesoFacturable = Math.max(peso, parseFloat(pesoVol)).toFixed(2);
        elementoDesglose.textContent =
            'Peso real: ' + peso + ' kg | Peso vol.: ' + pesoVol + ' kg | Peso facturable: ' + pesoFacturable + ' kg';
    }

    // Hacer scroll suave hacia el resultado
    setTimeout(function () {
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}


/* ══════════════════════════════════════
   MAPA DE COBERTURA — Tooltips SVG
   ══════════════════════════════════════ */

/**
 * initializeCoverageMap
 *
 * Qué hace: Agrega interactividad a los puntos del mapa SVG.
 * Cómo funciona: Al hacer hover sobre un punto del mapa,
 *   muestra el nombre de la ciudad y resalta el punto.
 * Por qué así: El SVG inline permite acceder a los elementos
 *   como si fueran elementos HTML normales, usando querySelector.
 */
function initializeCoverageMap() {
    var ciudades = document.querySelectorAll('.mapa__ciudad');

    if (!ciudades.length) return;

    ciudades.forEach(function (ciudad) {
        var punto = ciudad.querySelector('.mapa__punto');

        if (!punto) return;

        // Al pasar el mouse, escalar el punto
        ciudad.addEventListener('mouseenter', function () {
            punto.style.transform = 'scale(1.5)';
            punto.style.transformOrigin = 'center';
            ciudad.style.cursor = 'pointer';
        });

        // Al quitar el mouse, restaurar
        ciudad.addEventListener('mouseleave', function () {
            punto.style.transform = 'scale(1)';
        });
    });
}


/* ══════════════════════════════════════
   GALERÍA + LIGHTBOX
   ══════════════════════════════════════ */

/**
 * initializeGallery
 *
 * Qué hace: Configura la galería de imágenes con su lightbox.
 * Cómo funciona:
 *   1. Recoge todas las imágenes de la galería en un array
 *   2. Al hacer click en cualquier imagen, abre el lightbox
 *      mostrando esa imagen
 *   3. Los botones prev/next navegan entre imágenes
 *   4. Escape o click en backdrop cierra el lightbox
 *
 * La navegación funciona tanto con mouse como con teclado
 * (flechas izquierda/derecha y Escape).
 */
function initializeGallery() {
    var items = document.querySelectorAll('.galeria__item');
    var lightbox = document.getElementById('lightbox');

    if (!items.length || !lightbox) return;

    // Recoger datos de cada imagen en un array
    var imagenes = [];
    items.forEach(function (item) {
        var img = item.querySelector('.galeria__img');
        if (img) {
            imagenes.push({
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt') || ''
            });
        }
    });

    // Índice de la imagen actualmente visible en el lightbox
    var indiceActual = 0;

    // Referencias a elementos del lightbox
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var lightboxBackdrop = document.getElementById('lightbox-backdrop');

    // Abrir lightbox al hacer click en un item de la galería
    items.forEach(function (item) {
        item.addEventListener('click', function () {
            var indice = parseInt(item.getAttribute('data-index')) || 0;
            openLightbox(indice, imagenes, lightboxImg, lightboxCaption, lightbox);
            indiceActual = indice;
        });
    });

    // Botón cerrar
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function () {
            closeLightbox(lightbox);
        });
    }

    // Cerrar al hacer click en el fondo
    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', function () {
            closeLightbox(lightbox);
        });
    }

    // Navegar a imagen anterior
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function () {
            indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
            openLightbox(indiceActual, imagenes, lightboxImg, lightboxCaption, lightbox);
        });
    }

    // Navegar a imagen siguiente
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function () {
            indiceActual = (indiceActual + 1) % imagenes.length;
            openLightbox(indiceActual, imagenes, lightboxImg, lightboxCaption, lightbox);
        });
    }

    // Navegación por teclado
    document.addEventListener('keydown', function (event) {
        if (lightbox.hasAttribute('hidden')) return; // Lightbox cerrado, ignorar

        if (event.key === 'Escape') {
            closeLightbox(lightbox);
        } else if (event.key === 'ArrowLeft') {
            indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
            openLightbox(indiceActual, imagenes, lightboxImg, lightboxCaption, lightbox);
        } else if (event.key === 'ArrowRight') {
            indiceActual = (indiceActual + 1) % imagenes.length;
            openLightbox(indiceActual, imagenes, lightboxImg, lightboxCaption, lightbox);
        }
    });
}

/**
 * openLightbox
 *
 * Qué hace: Muestra el lightbox con la imagen del índice dado.
 *
 * @param {number}   indice        - Posición de la imagen en el array
 * @param {Array}    imagenes      - Array con datos de todas las imágenes
 * @param {Element}  lightboxImg   - Elemento <img> del lightbox
 * @param {Element}  lightboxCaption - Elemento de texto del lightbox
 * @param {Element}  lightbox      - Contenedor principal del lightbox
 */
function openLightbox(indice, imagenes, lightboxImg, lightboxCaption, lightbox) {
    var imagen = imagenes[indice];
    if (!imagen) return;

    lightboxImg.setAttribute('src', imagen.src);
    lightboxImg.setAttribute('alt', imagen.alt);

    if (lightboxCaption) {
        lightboxCaption.textContent = imagen.alt;
    }

    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo
}

/**
 * closeLightbox
 *
 * Qué hace: Oculta el lightbox y restaura el scroll de la página.
 *
 * @param {Element} lightbox - Contenedor principal del lightbox
 */
function closeLightbox(lightbox) {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
}


/* ══════════════════════════════════════
   TESTIMONIOS — Slider con prev/next
   ══════════════════════════════════════ */

/**
 * initializeTestimonials
 *
 * Qué hace: Controla el slider de testimonios.
 * Cómo funciona:
 *   - Solo muestra el testimonio con la clase 'testimonio-card--active'
 *   - Los botones prev/next cambian cuál card tiene esa clase
 *   - Los dots de navegación reflejan el testimonio activo
 *   - Se avanza automáticamente cada 6 segundos
 * Por qué así: Una animación CSS (keyframe fade-slide-in) se encarga
 *   de la transición visual, separando la lógica del estilo.
 */
function initializeTestimonials() {
    var cards = document.querySelectorAll('.testimonio-card');
    var dots = document.querySelectorAll('.testimonios__dot');
    var btnPrev = document.getElementById('test-prev');
    var btnNext = document.getElementById('test-next');

    if (!cards.length) return;

    var indiceActual = 0;
    var totalCards = cards.length;
    var intervaloAuto;

    // Mostrar el testimonio del índice dado
    function navigateTestimonials(nuevoIndice) {
        // Ocultar el card activo actual
        cards[indiceActual].classList.remove('testimonio-card--active');
        dots[indiceActual].classList.remove('testimonios__dot--active');
        dots[indiceActual].setAttribute('aria-selected', 'false');

        // Calcular el nuevo índice con circulación (0 → N → 0)
        indiceActual = (nuevoIndice + totalCards) % totalCards;

        // Mostrar el nuevo card
        cards[indiceActual].classList.add('testimonio-card--active');
        dots[indiceActual].classList.add('testimonios__dot--active');
        dots[indiceActual].setAttribute('aria-selected', 'true');
    }

    // Mostrar primer testimonio al cargar
    cards[0].classList.add('testimonio-card--active');

    // Botón siguiente
    if (btnNext) {
        btnNext.addEventListener('click', function () {
            reiniciarAutoPlay();
            navigateTestimonials(indiceActual + 1);
        });
    }

    // Botón anterior
    if (btnPrev) {
        btnPrev.addEventListener('click', function () {
            reiniciarAutoPlay();
            navigateTestimonials(indiceActual - 1);
        });
    }

    // Dots de navegación
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var indiceDestino = parseInt(dot.getAttribute('data-index'));
            reiniciarAutoPlay();
            navigateTestimonials(indiceDestino);
        });
    });

    // Auto-reproducción: cambiar testimonio cada 6 segundos
    function iniciarAutoPlay() {
        intervaloAuto = setInterval(function () {
            navigateTestimonials(indiceActual + 1);
        }, 6000);
    }

    // Reiniciar el contador de auto-reproducción cuando el usuario interactúa
    function reiniciarAutoPlay() {
        clearInterval(intervaloAuto);
        iniciarAutoPlay();
    }

    iniciarAutoPlay();
}


/* ══════════════════════════════════════
   SCROLL ANIMATIONS — Intersection Observer
   ══════════════════════════════════════ */

/**
 * initializeScrollAnimations
 *
 * Qué hace: Activa animaciones de entrada cuando los elementos
 *   entran en el viewport al hacer scroll.
 * Cómo funciona: IntersectionObserver es una API nativa del navegador
 *   que observa cuándo un elemento aparece en la pantalla.
 *   Cuando el 15% del elemento es visible, agrega la clase 'is-visible'
 *   que dispara las animaciones CSS definidas en styles.css.
 * Por qué así: Es mucho más eficiente que escuchar el evento scroll
 *   y calcular posiciones manualmente. Cero dependencias externas.
 *   'once: true' (unobserve después de activar) evita re-animaciones.
 */
function initializeScrollAnimations() {
    // Seleccionar todos los elementos que tienen clases de animación
    var elementosAnimados = document.querySelectorAll(
        '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom-soft, .reveal-stagger'
    );

    if (!elementosAnimados.length) return;

    // Configuración del observer
    var opcionesObserver = {
        threshold: 0.15,   // Activar cuando el 15% del elemento es visible
        rootMargin: '0px 0px -40px 0px' // Activar 40px antes del borde inferior
    };

    var observer = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                // Elemento visible: agregar clase que activa la animación CSS
                entrada.target.classList.add('is-visible');
                // Dejar de observar este elemento (solo animar una vez)
                observer.unobserve(entrada.target);
            }
        });
    }, opcionesObserver);

    // Empezar a observar cada elemento
    elementosAnimados.forEach(function (elemento) {
        observer.observe(elemento);
    });
}


/* ══════════════════════════════════════
   CONTADORES ANIMADOS — Stats section
   ══════════════════════════════════════ */

/**
 * initializeStatCounters
 *
 * Qué hace: Anima los números de la sección de estadísticas,
 *   contando desde 0 hasta el valor final.
 * Cómo funciona: Usa IntersectionObserver para detectar cuando
 *   los contadores entran al viewport. Luego llama a animarContador()
 *   para cada uno, que usa setInterval con easing cuadrático.
 * Por qué así: Los contadores solo se activan cuando el usuario
 *   los ve, haciendo el efecto más impactante.
 */
function initializeStatCounters() {
    // Configuración de cada contador
    var contadores = [
        { id: 'stat-envios', objetivo: 50000, prefijo: '+', sufijo: ',000' },
        { id: 'stat-destinos', objetivo: 9, prefijo: '', sufijo: '' },
        { id: 'stat-entregas', objetivo: 98, prefijo: '', sufijo: '%' },
        { id: 'stat-anos', objetivo: 10, prefijo: '+', sufijo: '' }
    ];

    var opcionesObserver = { threshold: 0.5 };

    var observer = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                var elemento = entrada.target;

                // Encontrar la configuración de este contador
                contadores.forEach(function (config) {
                    if (elemento.id === config.id) {
                        animarContador(
                            elemento,
                            0,
                            config.objetivo,
                            1500,
                            config.prefijo,
                            config.sufijo,
                            false
                        );
                    }
                });

                observer.unobserve(elemento);
            }
        });
    }, opcionesObserver);

    contadores.forEach(function (config) {
        var elemento = document.getElementById(config.id);
        if (elemento) {
            observer.observe(elemento);
        }
    });
}

/**
 * animarContador
 *
 * Qué hace: Anima un número desde un valor inicial hasta el final.
 * Cómo funciona: Usa setInterval a 60fps con easing cuadrático
 *   para que la animación acelere al inicio y frene al final,
 *   dándole un efecto natural.
 *   Al terminar (opcionalmente) aplica efecto glow.
 *
 * @param {Element} elemento   - El elemento DOM donde se muestra el número
 * @param {number}  inicio     - Valor de inicio (usualmente 0)
 * @param {number}  fin        - Valor final objetivo
 * @param {number}  duracion   - Duración total en milisegundos
 * @param {string}  prefijo    - Texto antes del número (ej: '+', '₡')
 * @param {string}  sufijo     - Texto después del número (ej: '%')
 * @param {boolean} conGlow    - Si aplicar efecto glow al terminar
 */
function animarContador(elemento, inicio, fin, duracion, prefijo, sufijo, conGlow) {
    var tiempoInicio = null;

    // Función que se ejecuta en cada frame de la animación
    function paso(tiempoActual) {
        if (!tiempoInicio) tiempoInicio = tiempoActual;

        // Progreso de 0 a 1
        var progreso = Math.min((tiempoActual - tiempoInicio) / duracion, 1);

        // Easing cuadrático: acelera al inicio, frena al final
        var progresoConEasing = 1 - Math.pow(1 - progreso, 3);

        // Valor actual interpolado
        var valorActual = Math.round(inicio + (fin - inicio) * progresoConEasing);

        // Formatear con separador de miles si es >= 1000
        var textoValor = valorActual >= 1000
            ? valorActual.toLocaleString('es-CR')
            : valorActual.toString();

        elemento.textContent = prefijo + textoValor + sufijo;

        if (progreso < 1) {
            requestAnimationFrame(paso);
        } else {
            // Animación terminada — aplicar efecto glow si se pidió
            if (conGlow) {
                elemento.classList.add('hero-calc__price--glow', 'calc-resultado__precio--glow');
                setTimeout(function () {
                    elemento.classList.remove('hero-calc__price--glow', 'calc-resultado__precio--glow');
                }, 1500);
            }
        }
    }

    requestAnimationFrame(paso);
}


/* ══════════════════════════════════════
   FORMULARIO DE CONTACTO → WHATSAPP
   ══════════════════════════════════════ */

/**
 * initializeContactForm
 *
 * Qué hace: Configura el formulario de contacto para que,
 *   al enviarlo, construya un mensaje y abra WhatsApp.
 * Cómo funciona:
 *   1. Valida todos los campos antes de enviar
 *   2. Si hay errores, los muestra inline (accesible con aria-live)
 *   3. Si todo está bien, construye un mensaje formateado
 *   4. Abre WhatsApp con ese mensaje pre-escrito
 * Por qué así: Sin backend, sin servidor, funciona 100% en el navegador.
 *   El cliente recibe el mensaje directamente en WhatsApp.
 */
function initializeContactForm() {
    var formulario = document.getElementById('contacto-form');

    if (!formulario) return;

    formulario.addEventListener('submit', function (event) {
        // Prevenir el envío HTML por defecto
        event.preventDefault();

        // Validar campos
        var esValido = validateContactForm();

        if (esValido) {
            submitFormToWhatsApp(event);
        }
    });

    // Limpiar errores al escribir en un campo
    var campos = formulario.querySelectorAll('input, textarea');
    campos.forEach(function (campo) {
        campo.addEventListener('input', function () {
            clearFieldError(campo);
        });
    });
}

/**
 * validateContactForm
 *
 * Qué hace: Valida todos los campos del formulario de contacto.
 * Cómo funciona: Revisa cada campo y muestra mensajes de error
 *   específicos si alguno no cumple las reglas.
 *
 * @returns {boolean} - true si todos los campos son válidos
 */
function validateContactForm() {
    var esValido = true;

    // Nombre: no puede estar vacío
    var nombre = document.getElementById('cf-nombre');
    if (!nombre || nombre.value.trim().length < 2) {
        showFieldError(nombre, 'Por favor ingresá tu nombre completo (mínimo 2 caracteres).');
        esValido = false;
    }

    // Teléfono: formato costarricense (8 dígitos)
    var telefono = document.getElementById('cf-telefono');
    var reglaTelefono = /^[0-9\s\-]{7,15}$/;
    if (!telefono || !reglaTelefono.test(telefono.value.trim())) {
        showFieldError(telefono, 'Ingresá un número de teléfono válido (ej: 8888-8888).');
        esValido = false;
    }

    // Email: formato válido
    var email = document.getElementById('cf-email');
    var reglaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !reglaEmail.test(email.value.trim())) {
        showFieldError(email, 'Ingresá un correo electrónico válido (ej: correo@dominio.com).');
        esValido = false;
    }

    // Mensaje: no puede estar vacío
    var mensaje = document.getElementById('cf-mensaje');
    if (!mensaje || mensaje.value.trim().length < 5) {
        showFieldError(mensaje, 'Por favor escribí un mensaje (mínimo 5 caracteres).');
        esValido = false;
    }

    return esValido;
}

/**
 * showFieldError
 *
 * Qué hace: Muestra un mensaje de error debajo de un campo del formulario.
 *
 * @param {Element} campo   - El elemento input o textarea con error
 * @param {string}  mensaje - El mensaje de error a mostrar
 */
function showFieldError(campo, mensaje) {
    if (!campo) return;

    campo.classList.add('contacto-form__input--error');

    var errorId = campo.id + '-error';
    var errorElem = document.getElementById(errorId);
    if (errorElem) {
        errorElem.textContent = mensaje;
    }
}

/**
 * clearFieldError
 *
 * Qué hace: Limpia el mensaje de error de un campo.
 *
 * @param {Element} campo - El campo cuyo error se quiere limpiar
 */
function clearFieldError(campo) {
    if (!campo) return;

    campo.classList.remove('contacto-form__input--error');

    var errorId = campo.id + '-error';
    var errorElem = document.getElementById(errorId);
    if (errorElem) {
        errorElem.textContent = '';
    }
}

/**
 * submitFormToWhatsApp
 *
 * Qué hace: Construye un mensaje con los datos del formulario y abre WhatsApp.
 * Cómo funciona: Toma los valores de cada campo, los formatea en un
 *   mensaje legible con emojis y los codifica como URL.
 *   Luego abre WhatsApp con ese mensaje pre-escrito.
 * Por qué así: No requiere backend ni servidor.
 *   Funciona 100% en el navegador y es compatible con Netlify sin configuración extra.
 *   El cliente recibe el mensaje en WhatsApp, que ya usa diariamente.
 *
 * @param {Event} event - El evento submit del formulario
 */
function submitFormToWhatsApp(event) {
    var nombre = document.getElementById('cf-nombre').value.trim();
    var telefono = document.getElementById('cf-telefono').value.trim();
    var correo = document.getElementById('cf-email').value.trim();
    var mensaje = document.getElementById('cf-mensaje').value.trim();

    // Construir el mensaje con formato legible en WhatsApp
    var textoWhatsApp =
        '🚚 *Nueva consulta desde la web — JNK Express*\n\n' +
        '👤 *Nombre:* ' + nombre + '\n' +
        '📞 *Teléfono:* ' + telefono + '\n' +
        '📧 *Correo:* ' + correo + '\n' +
        '💬 *Mensaje:* ' + mensaje;

    // Codificar el texto para ser usado en una URL
    var urlWhatsApp = 'https://wa.me/50683362762?text=' + encodeURIComponent(textoWhatsApp);

    // Abrir WhatsApp en una nueva pestaña
    window.open(urlWhatsApp, '_blank');

    // Limpiar el formulario después de enviar
    document.getElementById('contacto-form').reset();
}


/* ══════════════════════════════════════
   MODAL DE VIDEO
   ══════════════════════════════════════ */

/**
 * initializeVideoModal
 *
 * Qué hace: Controla el modal que reproduce el video corporativo.
 * Cómo funciona:
 *   - Al abrir: asigna el src al iframe (para no cargar YouTube hasta necesitarlo)
 *     y muestra el modal
 *   - Al cerrar: limpia el src del iframe (detiene el video y libera recursos)
 * Por qué así: Si el src del iframe se cargara al inicio, YouTube cargaría
 *   inmediatamente (impactando el rendimiento). Asignarlo solo al abrir
 *   es una optimización de carga (lazy loading del video).
 */
function initializeVideoModal() {
    var modal = document.getElementById('video-modal');
    var btnAbrir1 = document.getElementById('video-thumb-btn');
    var btnAbrir2 = document.getElementById('video-play-btn');
    var btnCerrar = document.getElementById('video-modal-close');
    var backdrop = document.getElementById('video-modal-backdrop');
    var iframe = document.getElementById('video-iframe');

    if (!modal || !iframe) return;

    // URL del video de YouTube — REEMPLAZAR con el URL real del cliente
    // Formato correcto: https://www.youtube.com/embed/ID_DEL_VIDEO?autoplay=1
    var urlVideoYoutube = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';

    // Función para abrir el modal
    function openVideoModal() {
        iframe.setAttribute('src', urlVideoYoutube);
        modal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        btnCerrar.focus(); // Enfocar el botón cerrar (accesibilidad)
    }

    // Función para cerrar el modal
    function closeVideoModal() {
        iframe.setAttribute('src', ''); // Limpiar src para detener el video
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    // Botones que abren el modal
    if (btnAbrir1) btnAbrir1.addEventListener('click', openVideoModal);
    if (btnAbrir2) btnAbrir2.addEventListener('click', openVideoModal);

    // Botón cerrar
    if (btnCerrar) btnCerrar.addEventListener('click', closeVideoModal);

    // Cerrar al hacer click en el fondo
    if (backdrop) backdrop.addEventListener('click', closeVideoModal);

    // Cerrar con Escape
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
            closeVideoModal();
        }
    });
}


/* ══════════════════════════════════════
   BOTÓN VOLVER ARRIBA
   ══════════════════════════════════════ */

/**
 * initializeBackToTop
 *
 * Qué hace: Muestra un botón flotante para volver al inicio
 *   cuando el usuario baja más de 400px.
 * Cómo funciona: Escucha el evento scroll y controla la visibilidad
 *   del botón con el atributo 'hidden' y CSS para animar la transición.
 */
function initializeBackToTop() {
    var boton = document.getElementById('back-to-top');

    if (!boton) return;

    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY || window.pageYOffset;

        if (scrollY > 400) {
            boton.removeAttribute('hidden');
        } else {
            boton.setAttribute('hidden', '');
        }
    }, { passive: true });

    boton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ══════════════════════════════════════
   NAVEGACIÓN SUAVE — Smooth Scroll
   ══════════════════════════════════════ */

/**
 * initializeSmoothScroll
 *
 * Qué hace: Hace que todos los links de ancla (#seccion) naveguen
 *   suavemente hasta la sección destino.
 * Cómo funciona: Intercepta el click en links internos, calcula
 *   la posición de la sección y hace scroll con compensación del navbar.
 * Por qué así: Aunque CSS tiene 'scroll-behavior: smooth', este enfoque
 *   en JS permite compensar la altura del navbar fijo, evitando que
 *   el contenido quede oculto debajo de él.
 */
function initializeSmoothScroll() {
    var linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach(function (link) {
        link.addEventListener('click', function (event) {
            var href = link.getAttribute('href');

            // Ignorar links que son solo '#'
            if (href === '#') return;

            var seccion = document.querySelector(href);
            if (!seccion) return;

            event.preventDefault();

            // Calcular posición con offset del navbar
            var alturaNavbar = 72;
            var posicionSeccion = seccion.getBoundingClientRect().top + window.scrollY - alturaNavbar;

            window.scrollTo({
                top: posicionSeccion,
                behavior: 'smooth'
            });
        });
    });
}
