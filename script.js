// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animate service cards on scroll
const cards = document.querySelectorAll('.service-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});
window.addEventListener('scroll', function() {
    const bgLogo = document.querySelector('.hero-bg-logo');
    const scrollPosition = window.scrollY;
    
    // 1. Calculate Blur: Every 50px scrolled adds 1px of blur (up to 10px)
    const blurValue = Math.min(scrollPosition / 50, 10); 
    
    // 2. Calculate Opacity: Fades out as it blurs
    const opacityValue = Math.max(0.12 - (scrollPosition / 4000), 0);

    // Apply the styles dynamically
    bgLogo.style.filter = `blur(${blurValue}px)`;
    bgLogo.style.opacity = opacityValue;
});