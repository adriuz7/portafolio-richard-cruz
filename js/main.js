'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    siteNav.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    siteNav.classList.toggle('is-open', !isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === 'todos' || card.dataset.category === selectedFilter;
      card.hidden = !shouldShow;
    });
  });
});

document.querySelectorAll('.project-card[data-project-url]').forEach((card) => {
  const url = (card.dataset.projectUrl || '').trim();
  const link = card.querySelector('[data-project-link]');
  const label = card.dataset.linkLabel;
  if (!link || !/^https?:\/\//i.test(url)) return;
  link.href = url;
  link.hidden = false;
  const labelNode = link.querySelector('[data-project-link-label]');
  if (labelNode && label) labelNode.textContent = label;
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxCounter = document.querySelector('.lightbox-counter');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
let currentGallery = [];
let currentGalleryIndex = 0;
let previouslyFocusedElement = null;

if (lightbox && lightboxImage && lightboxCaption && lightboxClose && lightboxPrev && lightboxNext) {
  const showCurrentImage = () => {
    const trigger = currentGallery[currentGalleryIndex];
    if (!trigger) return;
    const image = trigger.querySelector('img');
    const fullImage = trigger.dataset.full || image?.currentSrc || image?.src;
    if (!fullImage) return;

    lightboxImage.src = fullImage;
    lightboxImage.alt = image?.alt || 'Imagen del proyecto ampliada';
    lightboxCaption.textContent = trigger.dataset.caption || image?.alt || '';
    lightboxCounter.textContent = `${currentGalleryIndex + 1} de ${currentGallery.length}`;
    lightboxPrev.disabled = currentGalleryIndex <= 0;
    lightboxNext.disabled = currentGalleryIndex >= currentGallery.length - 1;

    currentGallery.forEach((item, index) => {
      item.classList.toggle('is-active', index === currentGalleryIndex);
    });
  };

  const moveGallery = (direction) => {
    const nextIndex = currentGalleryIndex + direction;
    if (nextIndex < 0 || nextIndex >= currentGallery.length) return;
    currentGalleryIndex = nextIndex;
    showCurrentImage();
  };

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const galleryId = trigger.dataset.galleryId;
      currentGallery = galleryId
        ? lightboxTriggers.filter((item) => item.dataset.galleryId === galleryId)
        : [trigger];
      currentGalleryIndex = Math.max(0, currentGallery.indexOf(trigger));
      previouslyFocusedElement = trigger;
      showCurrentImage();
      lightbox.showModal();
      lightboxClose.focus();
    });
  });

  const closeLightbox = () => {
    if (lightbox.open) lightbox.close();
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => moveGallery(-1));
  lightboxNext.addEventListener('click', () => moveGallery(1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveGallery(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveGallery(1);
    }
  });
  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
    currentGallery.forEach((item) => item.classList.remove('is-active'));
    if (previouslyFocusedElement) previouslyFocusedElement.focus();
  });
}

const observedSections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if ('IntersectionObserver' in window && observedSections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  observedSections.forEach((section) => sectionObserver.observe(section));
}
