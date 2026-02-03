const navItems = document.querySelectorAll('.nav__item');

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((nav) => nav.classList.remove('nav__item--active'));
    item.classList.add('nav__item--active');
  });
});
