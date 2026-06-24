

document.addEventListener('DOMContentLoaded', function () {
    initializeNavbar();
    initializeMobileMenu();
    initializeHeroCanvas();
    initializeCalculator();
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


function initializeCalculator() {
    var calcForm = document.getElementById('calc-form');
    if (calcForm) {
        calcForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var costo = calculateShippingCost(
                document.getElementById('calc-origen').value,
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
    // Sliders con valor numérico visible y barra de progreso
    var sliders = [
        { input: 'calc-peso', display: 'calc-peso-val', unidad: 'kg' },
        { input: 'calc-largo', display: 'calc-largo-val', unidad: 'cm' },
        { input: 'calc-ancho', display: 'calc-ancho-val', unidad: 'cm' },
        { input: 'calc-alto', display: 'calc-alto-val', unidad: 'cm' },
    ];

    sliders.forEach(function (slider) {
        var input = document.getElementById(slider.input);
        var display = document.getElementById(slider.display);
        if (!input || !display) return;

        input.addEventListener('input', function () {
            display.textContent = input.value + ' ' + slider.unidad;
            var porcentaje = ((input.value - input.min) / (input.max - input.min)) * 100;
            input.style.background = 'linear-gradient(to right, var(--color-red) ' + porcentaje + '%, rgba(255,255,255,0.15) ' + porcentaje + '%)';
        });
    });

    // Inicializar progreso visible al cargar
    sliders.forEach(function (slider) {
        var input = document.getElementById(slider.input);
        if (!input) return;
        var porcentaje = ((input.value - input.min) / (input.max - input.min)) * 100;
        input.style.background = 'linear-gradient(to right, var(--color-red) ' + porcentaje + '%, rgba(255,255,255,0.15) ' + porcentaje + '%)';
    });
}

/**
 * calculateShippingCost

 * @param {string} destino  - Código del destino (ej: 'riofrio')
 * @param {number} pesoReal - Peso físico del paquete en kg
 * @param {number} largo    - Largo del paquete en cm
 * @param {number} ancho    - Ancho del paquete en cm
 * @param {number} alto     - Alto del paquete en cm
 * @returns {number}        - Precio estimado en colones costarricenses
 */
function calculateShippingCost(origen, destino, peso, largo, ancho, alto) {
    // Precio base según origen
    var precioBase = (origen === 'sanjose') ? 2000 : 1200;

    // Peso volumétrico (fórmula estándar)
    var pesoVolumetrico = (largo * ancho * alto) / 5000;

    // Peso facturable — el mayor entre real y volumétrico
    var pesoFacturable = Math.max(peso, pesoVolumetrico);

    // Costo adicional por kg extra a partir de 6kg
    var costoAdicional = 0;
    if (pesoFacturable > 6) {
        var kgExtra = pesoFacturable - 6;
        costoAdicional = Math.ceil(kgExtra) * 500;
    }

    return precioBase + costoAdicional;
}



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
    // Construir mensaje pre-listo para WhatsApp con los datos del cálculo
    var selectDestino = document.getElementById('calc-destino');
    var selectOrigen = document.getElementById('calc-origen');
    var textoDestino = selectDestino ? selectDestino.options[selectDestino.selectedIndex].text : destino;
    var textoOrigen = selectOrigen ? selectOrigen.options[selectOrigen.selectedIndex].text : 'San José';

    var mensajeWA = '🚚 *Consulta de tarifa — JNK Express*\n\n' +
        '📍 *Origen:* ' + textoOrigen + '\n' +
        '📍 *Destino:* ' + textoDestino + '\n' +
        '⚖️ *Peso real:* ' + peso + ' kg\n' +
        '📦 *Dimensiones:* ' + largo + ' × ' + ancho + ' × ' + alto + ' cm\n' +
        '💰 *Precio estimado:* ₡' + costo.toLocaleString('es-CR');

    var urlWA = 'https://wa.me/50683362762?text=' + encodeURIComponent(mensajeWA);

    var btnWA = document.getElementById('calc-wa-btn');
    if (btnWA) {
        btnWA.setAttribute('href', urlWA);
    }

    // Hacer scroll suave hacia el resultado
    setTimeout(function () {
        contenedor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
}





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
 * 
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
 * 
 * 
 * 
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
 * @param {Element} campo
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

 * @param {Event} event
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
            var alturaNavbar = parseInt(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--navbar-height')
            ) || 72;
            var posicionSeccion = seccion.getBoundingClientRect().top + window.scrollY - alturaNavbar;

            window.scrollTo({
                top: posicionSeccion,
                behavior: 'smooth'
            });
        });
    });
}
