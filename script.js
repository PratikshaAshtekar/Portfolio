// Portfolio JavaScript
document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio ready");
  
  // Theme Toggle Functionality
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  // Get saved theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme on page load
  body.setAttribute('data-theme', savedTheme);
  
  // Theme toggle event listener
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update theme
    body.setAttribute('data-theme', newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Add smooth transition effect
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Remove transition after animation completes
    setTimeout(() => {
      body.style.transition = '';
    }, 300);
    
    console.log(`Theme switched to: ${newTheme}`);
  });
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced contact form handling with validation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    
    // Clear errors on input
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        clearError(input);
      });
    });
    
    function clearError(input) {
      const errorElement = input.parentNode.querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = '';
        input.style.borderColor = '#333';
      }
    }
    
    function showError(input, message) {
      const errorElement = input.parentNode.querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = message;
        input.style.borderColor = '#ff6b6b';
      }
    }
    
    function validateForm() {
      let isValid = true;
      
      // Clear previous errors
      [nameError, emailError, messageError].forEach(error => {
        error.textContent = '';
      });
      
      // Validate name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required');
        isValid = false;
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Validate message
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required');
        isValid = false;
      }
      
      return isValid;
    }
    
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        // Simulate form submission
        const submitButton = contactForm.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
          alert('Thank you! Your message has been sent.');
          console.log('✅ Form submitted successfully!', {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
            timestamp: new Date().toISOString()
          });
          contactForm.reset();
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 2000);
      }
    });
  }

  // Project modal functionality
  const modal = document.getElementById('projectModal');
  const modalClose = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  const projectButtons = document.querySelectorAll('.project-button');
  
  // Function to open modal
  function openModal(projectCard) {
    const title = projectCard.dataset.title;
    const description = projectCard.dataset.description;
    const image = projectCard.dataset.image;
    const tech = projectCard.dataset.tech;
    const github = projectCard.dataset.github;
    
    // Populate modal content
    document.getElementById('modalProjectTitle').textContent = title;
    document.getElementById('modalProjectDescription').textContent = description;
    document.getElementById('modalProjectImage').src = image;
    document.getElementById('modalProjectImage').alt = title;
    document.getElementById('modalGitHubLink').href = github;
    
    // Create tech stack tags
    const techStackContainer = document.getElementById('modalTechStack');
    techStackContainer.innerHTML = '';
    const techArray = tech.split(', ');
    techArray.forEach(techItem => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = techItem.trim();
      techStackContainer.appendChild(tag);
    });
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  // Function to close modal
  function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }
  
  // Project button click handlers
  projectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const projectCard = button.closest('.project-card');
      openModal(projectCard);
    });
  });
  
  // Close modal handlers
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Hire Me button functionality with glowing pulse animation
  const hireMeButton = document.querySelector('.cta-button');
  if (hireMeButton) {
    // Add hover effect with glowing pulse
    hireMeButton.addEventListener('mouseenter', () => {
      hireMeButton.style.animation = 'pulse 1.5s infinite';
    });
    
    hireMeButton.addEventListener('mouseleave', () => {
      hireMeButton.style.animation = 'none';
    });
    
    // Add touch support for mobile
    hireMeButton.addEventListener('touchstart', () => {
      hireMeButton.style.animation = 'pulse 1.5s infinite';
    });
    
    hireMeButton.addEventListener('touchend', () => {
      hireMeButton.style.animation = 'none';
    });
    
    hireMeButton.addEventListener('click', () => {
      // Scroll to contact section
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  // Add scroll effect to header
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });

  // Add intersection observer for fade-in animations with staggered effect
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay for better visual effect
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });

  // Add scroll reveal for project cards
  const projectCards = document.querySelectorAll('.project-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
      }
    });
  }, observerOptions);

  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });

  // Add typing effect to hero section
  const heroTitle = document.querySelector('.hero h1');
  const heroTagline = document.querySelector('.hero .tagline');
  
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        heroTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Start typing tagline after title is complete
        if (heroTagline) {
          const taglineText = heroTagline.textContent;
          heroTagline.textContent = '';
          let j = 0;
          const typeTagline = () => {
            if (j < taglineText.length) {
              heroTagline.textContent += taglineText.charAt(j);
              j++;
              setTimeout(typeTagline, 80);
            }
          };
          setTimeout(typeTagline, 500);
        }
      }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
  }

  // Back to top button functionality
  const backToTopButton = document.getElementById('backToTop');
  
  // Show/hide back to top button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });
  
  // Smooth scroll to top when button is clicked
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});