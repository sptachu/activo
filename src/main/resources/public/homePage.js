// JavaScript to toggle between views
const activitiesSection = document.getElementById('activities');
const goalsSection = document.getElementById('goals');
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.textContent === 'Home') {
            activitiesSection.style.display = 'block';
            goalsSection.style.display = 'none';
        } else if (link.textContent === 'Goals & Progress') {
            activitiesSection.style.display = 'none';
            goalsSection.style.display = 'block';
        }
    });
});