/**
 * Santa3AU Reconstruction - Main JavaScript
 * Implementing interactive features and mobile compatibility
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartButtons = document.querySelectorAll('.product-card button');
    
    // Mobile Navigation Toggle
    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
            
            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
            
            // Scroll to target
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 76, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Product Card Animation and Interaction
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Add to Cart Functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;
            const productPrice = this.parentElement.querySelector('p').textContent;
            
            // Create notification
            const notification = document.createElement('div');
            notification.classList.add('notification');
            notification.innerHTML = `
                <p><strong>${productName}</strong> added to cart!</p>
                <p>Price: ${productPrice}</p>
            `;
            
            // Style notification
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#0f5738';
            notification.style.color = 'white';
            notification.style.padding = '15px';
            notification.style.borderRadius = '4px';
            notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            notification.style.zIndex = '1000';
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            // Add notification to the DOM
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Hide and remove notification
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(50px)';
                
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        });
    });
    
    // Scroll animations for elements
    const fadeInElements = document.querySelectorAll('.product-card, h2, .media-container, .map-container, .facebook-container');
    
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries, fadeInObserver) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    fadeInElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        element.style.transform = 'translateY(20px)';
        fadeInObserver.observe(element);
    });
    
    // Add CSS class for animation
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .appear {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
    
    // Initialize Facebook SDK when the page loads
    if (window.FB) {
        FB.init({
            appId: '123456789012345',
            autoLogAppEvents: true,
            xfbml: true,
            version: 'v17.0'
        });
    }
    
    // Check if video element exists and add custom controls if needed
    const videoElement = document.querySelector('video');
    if (videoElement) {
        // Add event listeners for video playback
        videoElement.addEventListener('play', function() {
            console.log('Video playback started');
        });
        
        videoElement.addEventListener('pause', function() {
            console.log('Video playback paused');
        });
        
        videoElement.addEventListener('ended', function() {
            console.log('Video playback ended');
        });
    }
    
    // Create placeholder for analytics data
    const analyticsData = {
        pageViews: 0,
        interactions: 0,
        products: {
            'Premium Christmas Tree': 0,
            'LED Christmas Lights': 0,
            'Ornament Set': 0
        }
    };
    
    // Simulate analytics tracking
    function trackEvent(category, action, label) {
        console.log(`Analytics Event: ${category} - ${action} - ${label}`);
        analyticsData.interactions++;
        
        // Track product interactions
        if (category === 'Products' && action === 'Add to Cart') {
            analyticsData.products[label]++;
        }
    }
    
    // Add event tracking to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            let category = 'Interaction';
            let action = 'Click';
            let label = buttonText;
            
            if (this.closest('.product-card')) {
                category = 'Products';
                action = 'Add to Cart';
                label = this.closest('.product-card').querySelector('h3').textContent;
            } else if (buttonText === 'Shop Now') {
                category = 'CTA';
                action = 'Click';
                label = 'Hero Button';
            }
            
            trackEvent(category, action, label);
        });
    });
    
    // Increment page view counter
    analyticsData.pageViews++;
    console.log('Page view recorded');
});
