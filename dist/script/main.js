document.addEventListener('DOMContentLoaded', function () {
  // Initialize Embla Carousel
  const emblaNode = document.getElementById('embla');
  const dotsContainer = document.getElementById('heroDots');

  if (!emblaNode) return;

  const options = {
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps'
  };

  const autoplayOptions = {
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    playOnInit: true
  };

  // Initialize Embla with autoplay
  const emblaApi = EmblaCarousel(emblaNode, options, [
    EmblaCarouselAutoplay(autoplayOptions)
  ]);

  // Get slide count and create dots
  const slides = emblaApi.slideNodes();
  const slideCount = slides.length;

  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'hero-dot';
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', () => {
        emblaApi.scrollTo(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.hero-dot');
    const selectedIndex = emblaApi.selectedScrollSnap();

    dots.forEach((dot, index) => {
      if (index === selectedIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  emblaApi.on('init', () => {
    createDots();
    updateDots();
  });

  emblaApi.on('select', () => {
    updateDots();
  });

  emblaNode.addEventListener('mouseenter', () => {
    emblaApi.plugins().autoplay.stop();
  });

  emblaNode.addEventListener('mouseleave', () => {
    emblaApi.plugins().autoplay.play();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      emblaApi.scrollPrev();
    } else if (e.key === 'ArrowRight') {
      emblaApi.scrollNext();
    }
  });

  // Optional: Add smooth scroll indicator animation
  function updateScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-thumb');
    if (scrollIndicator) {
      const selectedIndex = emblaApi.selectedScrollSnap();
      const progress = (selectedIndex / (slideCount - 1)) * 100;
      const maxPosition = 300 - 64; // track height - thumb height
      const position = (progress / 100) * maxPosition;
      scrollIndicator.style.top = `${position}px`;
    }
  }

  emblaApi.on('select', updateScrollIndicator);
  emblaApi.on('init', updateScrollIndicator);

  // Initialize Destinations Carousel
  const destinationsEmblaNode = document.getElementById('destinationsEmbla');
  const destinationsPrevBtn = document.getElementById('destinationsPrevBtn');
  const destinationsNextBtn = document.getElementById('destinationsNextBtn');

  if (destinationsEmblaNode) {
    // Destinations carousel options
    const destinationsOptions = {
      loop: false,
      align: 'start',
      skipSnaps: false,
      dragFree: false,
      containScroll: 'keepSnaps',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 1024px)': { 
          slidesToScroll: 1,
          align: 'start'
        },
        '(min-width: 768px)': { 
          slidesToScroll: 1,
          align: 'start'
        },
        '(max-width: 767px)': { 
          slidesToScroll: 1,
          align: 'start'
        }
      }
    };

    // Initialize destinations carousel
    const destinationsEmblaApi = EmblaCarousel(destinationsEmblaNode, destinationsOptions);

    // Update navigation buttons state for destinations
    function updateDestinationsNavButtons() {
      if (destinationsPrevBtn && destinationsNextBtn) {
        destinationsPrevBtn.disabled = !destinationsEmblaApi.canScrollPrev();
        destinationsNextBtn.disabled = !destinationsEmblaApi.canScrollNext();
        
        // Update button styles
        if (destinationsPrevBtn.disabled) {
          destinationsPrevBtn.classList.add('disabled');
        } else {
          destinationsPrevBtn.classList.remove('disabled');
        }
        
        if (destinationsNextBtn.disabled) {
          destinationsNextBtn.classList.add('disabled');
        } else {
          destinationsNextBtn.classList.remove('disabled');
        }
      }
    }

    if (destinationsPrevBtn) {
      destinationsPrevBtn.addEventListener('click', () => {
        destinationsEmblaApi.scrollPrev();
      });
    }

    if (destinationsNextBtn) {
      destinationsNextBtn.addEventListener('click', () => {
        destinationsEmblaApi.scrollNext();
      });
    }

    destinationsEmblaApi.on('init', () => {
      updateDestinationsNavButtons();
    });

    destinationsEmblaApi.on('select', () => {
      updateDestinationsNavButtons();
    });
  }
});
