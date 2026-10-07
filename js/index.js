var root = document.documentElement;
var body = document.body;

function addClasses(element, list) {
  for (var i = 0; i < list.length; i++) {
    element.classList.add(list[i]);
  }
}

function removeClasses(element, list) {
  for (var i = 0; i < list.length; i++) {
    element.classList.remove(list[i]);
  }
}


var themeBtn = document.getElementById('theme-toggle-button');

function applyTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark');
    themeBtn.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('dark');
    themeBtn.setAttribute('aria-pressed', 'false');
  }
}

var savedTheme = localStorage.getItem('theme');
if (savedTheme === null) {
  savedTheme = 'dark';
}
applyTheme(savedTheme);

themeBtn.addEventListener('click', function () {
  var nextTheme;
  if (root.classList.contains('dark')) {
    nextTheme = 'light';
  } else {
    nextTheme = 'dark';
  }
  applyTheme(nextTheme);
  localStorage.setItem('theme', nextTheme);
});


var menuBtn = document.getElementById('mobile-menu-btn');
var navMenu = document.querySelector('.nav-links');
var navLinks = document.querySelectorAll('.nav-links a');

function openMenu() {
  navMenu.classList.add('active');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.innerHTML = '<i class="fa-solid fa-xmark text-xl"></i>';
}

function closeMenu() {
  navMenu.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
}

menuBtn.addEventListener('click', function () {
  if (navMenu.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
});

for (var n = 0; n < navLinks.length; n++) {
  navLinks[n].addEventListener('click', closeMenu);
}


var header = document.getElementById('header');
var sectionIds = ['hero-section', 'about', 'portfolio', 'experience', 'testimonials', 'contact'];
var spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
  var scrollPosition = window.scrollY + header.offsetHeight + 40;
  var currentId = sectionIds[0];

  for (var i = 0; i < sectionIds.length; i++) {
    var section = document.getElementById(sectionIds[i]);
    if (section.offsetTop <= scrollPosition) {
      currentId = sectionIds[i];
    }
  }

  var reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (reachedBottom) {
    currentId = sectionIds[sectionIds.length - 1];
  }

  for (var j = 0; j < spyLinks.length; j++) {
    if (spyLinks[j].getAttribute('href') === '#' + currentId) {
      spyLinks[j].classList.add('active');
    } else {
      spyLinks[j].classList.remove('active');
    }
  }
}


var scrollTopBtn = document.getElementById('scroll-to-top');

function toggleScrollTopBtn() {
  if (window.scrollY > 400) {
    removeClasses(scrollTopBtn, ['opacity-0', 'invisible']);
    addClasses(scrollTopBtn, ['opacity-100', 'visible']);
  } else {
    removeClasses(scrollTopBtn, ['opacity-100', 'visible']);
    addClasses(scrollTopBtn, ['opacity-0', 'invisible']);
  }
}

scrollTopBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', function () {
  updateActiveLink();
  toggleScrollTopBtn();
});

updateActiveLink();
toggleScrollTopBtn();


var filterBtns = document.querySelectorAll('.portfolio-filter');
var portfolioItems = document.querySelectorAll('.portfolio-item');

var activeFilterClasses = [
  'bg-linear-to-r',
  'from-primary',
  'to-secondary',
  'text-white',
  'hover:shadow-lg',
  'hover:shadow-primary/50'
];

var inactiveFilterClasses = [
  'bg-white',
  'dark:bg-slate-800',
  'text-slate-600',
  'dark:text-slate-300',
  'hover:bg-slate-100',
  'dark:hover:bg-slate-700',
  'border',
  'border-slate-300',
  'dark:border-slate-700'
];

function setActiveFilterBtn(activeBtn) {
  for (var i = 0; i < filterBtns.length; i++) {
    var btn = filterBtns[i];
    if (btn === activeBtn) {
      removeClasses(btn, inactiveFilterClasses);
      addClasses(btn, activeFilterClasses);
      btn.setAttribute('aria-pressed', 'true');
    } else {
      removeClasses(btn, activeFilterClasses);
      addClasses(btn, inactiveFilterClasses);
      btn.setAttribute('aria-pressed', 'false');
    }
  }
}

function filterItems(category) {
  for (var i = 0; i < portfolioItems.length; i++) {
    var item = portfolioItems[i];
    if (category === 'all' || item.getAttribute('data-category') === category) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  }
}

function setupFilterBtn(btn) {
  btn.addEventListener('click', function () {
    setActiveFilterBtn(btn);
    filterItems(btn.getAttribute('data-filter'));
  });
}

for (var f = 0; f < filterBtns.length; f++) {
  setupFilterBtn(filterBtns[f]);
}


var track = document.getElementById('testimonials-carousel');
var viewport = track.parentElement;
var cards = track.children;
var dotsBox = document.querySelector('[role="tablist"]');
var nextTestimonialBtn = document.getElementById('next-testimonial');
var prevTestimonialBtn = document.getElementById('prev-testimonial');

var dotOnClass = 'carousel-indicator h-3 w-8 rounded-full bg-accent transition-all duration-300 cursor-pointer';
var dotOffClass = 'carousel-indicator h-3 w-3 rounded-full bg-slate-400 dark:bg-slate-600 transition-all duration-300 hover:scale-125 cursor-pointer';

var currentIndex = 0;
var cardsPerView = 1;
var maxIndex = 0;
var cardWidth = 0;
var autoTimer = null;
var dots = [];

function measure() {
  cardWidth = cards[0].getBoundingClientRect().width;
  cardsPerView = Math.round(viewport.clientWidth / cardWidth);
  if (cardsPerView < 1) {
    cardsPerView = 1;
  }
  maxIndex = cards.length - cardsPerView;
  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }
}

function showSlide() {
  track.style.transform = 'translateX(' + currentIndex * cardWidth + 'px)';
  for (var i = 0; i < dots.length; i++) {
    if (i === currentIndex) {
      dots[i].className = dotOnClass;
      dots[i].setAttribute('aria-selected', 'true');
    } else {
      dots[i].className = dotOffClass;
      dots[i].setAttribute('aria-selected', 'false');
    }
  }
}

function goToSlide(index) {
  currentIndex = index;
  showSlide();
}

function nextSlide() {
  if (currentIndex >= maxIndex) {
    goToSlide(0);
  } else {
    goToSlide(currentIndex + 1);
  }
}

function prevSlide() {
  if (currentIndex <= 0) {
    goToSlide(maxIndex);
  } else {
    goToSlide(currentIndex - 1);
  }
}

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 5000);
}

function stopAuto() {
  clearInterval(autoTimer);
}

function restartAuto() {
  stopAuto();
  startAuto();
}

function setupDot(dot, index) {
  dot.addEventListener('click', function () {
    goToSlide(index);
    restartAuto();
  });
}

function createDots() {
  dotsBox.innerHTML = '';
  dots = [];
  for (var i = 0; i <= maxIndex; i++) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'التوصية ' + (i + 1));
    setupDot(dot, i);
    dotsBox.appendChild(dot);
    dots.push(dot);
  }
}

nextTestimonialBtn.addEventListener('click', function () {
  nextSlide();
  restartAuto();
});

prevTestimonialBtn.addEventListener('click', function () {
  prevSlide();
  restartAuto();
});

viewport.addEventListener('mouseenter', stopAuto);
viewport.addEventListener('mouseleave', startAuto);

function refreshCarousel() {
  measure();
  if (dots.length !== maxIndex + 1) {
    createDots();
  }
  showSlide();
}

window.addEventListener('resize', refreshCarousel);
window.addEventListener('load', refreshCarousel);

refreshCarousel();
startAuto();


var selects = document.querySelectorAll('.custom-select');

function openSelect(select) {
  var list = select.parentElement.querySelector('.custom-options');
  list.classList.remove('hidden');
  select.setAttribute('aria-expanded', 'true');
  select.querySelector('i').style.transform = 'rotate(180deg)';
}

function closeSelect(select) {
  var list = select.parentElement.querySelector('.custom-options');
  list.classList.add('hidden');
  select.setAttribute('aria-expanded', 'false');
  select.querySelector('i').style.transform = '';
}

function closeAllSelects() {
  for (var i = 0; i < selects.length; i++) {
    closeSelect(selects[i]);
  }
}

function resetSelect(select) {
  var label = select.querySelector('.selected-text');
  select.setAttribute('data-value', '');
  label.textContent = select.getAttribute('data-placeholder');
  addClasses(label, ['text-slate-500', 'dark:text-slate-400']);
}

function setupOption(option, select) {
  option.addEventListener('click', function (e) {
    e.stopPropagation();
    var label = select.querySelector('.selected-text');
    select.setAttribute('data-value', option.getAttribute('data-value'));
    label.textContent = option.textContent.trim();
    removeClasses(label, ['text-slate-500', 'dark:text-slate-400']);
    closeSelect(select);
  });
}

function setupSelect(select) {
  var list = select.parentElement.querySelector('.custom-options');
  var options = list.querySelectorAll('.custom-option');
  var label = select.querySelector('.selected-text');

  select.setAttribute('data-value', '');
  select.setAttribute('data-placeholder', label.textContent.trim());

  select.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = !list.classList.contains('hidden');
    closeAllSelects();
    if (!isOpen) {
      openSelect(select);
    }
  });

  for (var i = 0; i < options.length; i++) {
    setupOption(options[i], select);
  }
}

for (var s = 0; s < selects.length; s++) {
  setupSelect(selects[s]);
}

document.addEventListener('click', closeAllSelects);


var form = document.querySelector('form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  var data = {
    name: document.getElementById('full-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    projectType: selects[0].getAttribute('data-value'),
    budget: selects[1].getAttribute('data-value'),
    details: document.getElementById('project-details').value
  };
  console.log(data);

  var submitBtn = form.querySelector('button[type="submit"]');
  var oldHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'تم الإرسال بنجاح';

  form.reset();
  for (var i = 0; i < selects.length; i++) {
    resetSelect(selects[i]);
  }

  setTimeout(function () {
    submitBtn.innerHTML = oldHtml;
    submitBtn.disabled = false;
  }, 3000);
});


var settingsBtn = document.getElementById('settings-toggle');
var sidebar = document.getElementById('settings-sidebar');
var closeSettingsBtn = document.getElementById('close-settings');

function openSettings() {
  sidebar.classList.remove('translate-x-full');
  sidebar.setAttribute('aria-hidden', 'false');
  settingsBtn.setAttribute('aria-expanded', 'true');
  settingsBtn.classList.add('invisible');
}

function closeSettings() {
  sidebar.classList.add('translate-x-full');
  sidebar.setAttribute('aria-hidden', 'true');
  settingsBtn.setAttribute('aria-expanded', 'false');
  settingsBtn.classList.remove('invisible');
}

settingsBtn.addEventListener('click', openSettings);
closeSettingsBtn.addEventListener('click', closeSettings);

document.addEventListener('click', function (e) {
  var isOpen = !sidebar.classList.contains('translate-x-full');
  if (isOpen && !sidebar.contains(e.target) && !settingsBtn.contains(e.target)) {
    closeSettings();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeSettings();
    closeMenu();
    closeAllSelects();
  }
});


var fontBtns = document.querySelectorAll('.font-option');
var fontNames = ['alexandria', 'tajawal', 'cairo'];

function applyFont(name) {
  for (var i = 0; i < fontNames.length; i++) {
    body.classList.remove('font-' + fontNames[i]);
  }
  body.classList.add('font-' + name);

  for (var j = 0; j < fontBtns.length; j++) {
    if (fontBtns[j].getAttribute('data-font') === name) {
      fontBtns[j].classList.add('active');
      fontBtns[j].setAttribute('aria-checked', 'true');
    } else {
      fontBtns[j].classList.remove('active');
      fontBtns[j].setAttribute('aria-checked', 'false');
    }
  }
}

function setupFontBtn(btn) {
  btn.addEventListener('click', function () {
    var name = btn.getAttribute('data-font');
    applyFont(name);
    localStorage.setItem('font', name);
  });
}

for (var k = 0; k < fontBtns.length; k++) {
  setupFontBtn(fontBtns[k]);
}


var colors = [
  { id: 'violet',  name: 'Violet',  primary: '#7861F4', secondary: '#9B6BF6', accent: '#C084FC' },
  { id: 'rose',    name: 'Rose',    primary: '#F35E57', secondary: '#F0457A', accent: '#F0800B' },
  { id: 'emerald', name: 'Emerald', primary: '#0AA573', secondary: '#14B8A6', accent: '#06B6D4' },
  { id: 'sky',     name: 'Sky',     primary: '#219CE5', secondary: '#4F7DF3', accent: '#7861F4' },
  { id: 'red',     name: 'Red',     primary: '#F24155', secondary: '#F35E57', accent: '#F0800B' },
  { id: 'orange',  name: 'Orange',  primary: '#F0800B', secondary: '#F59E0B', accent: '#F24155' }
];

var ringClasses = ['ring-2', 'ring-offset-2', 'ring-primary', 'ring-offset-white', 'dark:ring-offset-slate-900'];
var colorsGrid = document.getElementById('theme-colors-grid');
var swatches = [];

function applyColor(id) {
  var chosen = colors[0];
  for (var i = 0; i < colors.length; i++) {
    if (colors[i].id === id) {
      chosen = colors[i];
    }
  }

  root.style.setProperty('--color-primary', chosen.primary);
  root.style.setProperty('--color-secondary', chosen.secondary);
  root.style.setProperty('--color-accent', chosen.accent);

  for (var j = 0; j < swatches.length; j++) {
    if (swatches[j].getAttribute('data-color') === chosen.id) {
      addClasses(swatches[j], ringClasses);
      swatches[j].setAttribute('aria-checked', 'true');
    } else {
      removeClasses(swatches[j], ringClasses);
      swatches[j].setAttribute('aria-checked', 'false');
    }
  }
}

function createSwatch(color) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'h-12 w-12 mx-auto rounded-full transition-all duration-300 hover:scale-110';
  btn.style.background = 'linear-gradient(135deg, ' + color.primary + ', ' + color.secondary + ')';
  btn.setAttribute('role', 'radio');
  btn.setAttribute('aria-label', color.name);
  btn.setAttribute('title', color.name);
  btn.setAttribute('aria-checked', 'false');
  btn.setAttribute('data-color', color.id);

  btn.addEventListener('click', function () {
    applyColor(color.id);
    localStorage.setItem('color', color.id);
  });

  colorsGrid.appendChild(btn);
  swatches.push(btn);
}

for (var c = 0; c < colors.length; c++) {
  createSwatch(colors[c]);
}


var resetBtn = document.getElementById('reset-settings');

resetBtn.addEventListener('click', function () {
  localStorage.removeItem('theme');
  localStorage.removeItem('font');
  localStorage.removeItem('color');
  applyTheme('dark');
  applyFont('tajawal');
  applyColor('violet');
});


var savedFont = localStorage.getItem('font');
if (savedFont === null) {
  savedFont = 'tajawal';
}
applyFont(savedFont);

var savedColor = localStorage.getItem('color');
if (savedColor === null) {
  savedColor = 'violet';
}
applyColor(savedColor);