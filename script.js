// =================================================================
// PRODUCTION RTL/LTR AUTO-DETECTION SYSTEM
// =================================================================
// Automatically detects and applies RTL/LTR layout when language changes
// Supports: Manual changes, Google Translate, and dynamic language switching
// =================================================================

(function() {
  'use strict';
  
  // =================================================================
  // CONFIGURATION
  // =================================================================
  
  // RTL languages (ISO 639-1 codes)
  const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur', 'yi', 'ji', 'ps', 'sd', 'ug'];
  
  // Guard to prevent infinite mutation loops
  let isUpdating = false;
  
  // Debounce timer for performance
  let debounceTimer = null;
  
  // Track last known direction to avoid unnecessary updates
  let lastDirection = null;
  
  // =================================================================
  // CORE DIRECTION DETECTION
  // =================================================================
  
  /**
   * Detects the current text direction using multiple methods
   * Priority: 1) dir attribute, 2) lang attribute, 3) Google Translate classes, 4) computed style
   * @returns {string} 'rtl' or 'ltr'
   */
  function detectDirection() {
    const html = document.documentElement;
    const body = document.body;
    
    // Method 1: Check explicit dir attribute on <html> or <body>
    const explicitDir = html.getAttribute('dir') || body?.getAttribute('dir');
    if (explicitDir === 'rtl' || explicitDir === 'ltr') {
      return explicitDir;
    }
    
    // Method 2: Check for Google Translate classes (common pattern)
    if (html.classList.contains('translated-rtl')) {
      return 'rtl';
    }
    if (html.classList.contains('translated-ltr')) {
      return 'ltr';
    }
    
    // Method 3: Infer from lang attribute
    const lang = html.getAttribute('lang') || body?.getAttribute('lang') || 'en';
    const langCode = lang.substring(0, 2).toLowerCase();
    
    if (RTL_LANGUAGES.includes(langCode)) {
      return 'rtl';
    }
    
    // Method 4: Check computed direction (fallback)
    if (body) {
      const computedDir = window.getComputedStyle(body).direction;
      if (computedDir === 'rtl' || computedDir === 'ltr') {
        return computedDir;
      }
    }
    
    // Default to LTR
    return 'ltr';
  }
  
  // =================================================================
  // DIRECTION APPLICATION
  // =================================================================
  
  /**
   * Applies the detected direction to the document
   * Sets dir attribute, adds/removes classes, and loads Bootstrap RTL CSS
   * @param {string} direction - 'rtl' or 'ltr'
   */
  function applyDirection(direction) {
    // Guard: prevent infinite loops
    if (isUpdating) return;
    
    // Guard: avoid unnecessary updates
    if (direction === lastDirection) return;
    
    isUpdating = true;
    lastDirection = direction;
    
    const html = document.documentElement;
    const body = document.body;
    
    // Set dir attribute on root element
    html.setAttribute('dir', direction);
    
    if (direction === 'rtl') {
      // Add RTL classes
      html.classList.add('is-rtl');
      html.classList.remove('is-ltr');
      body?.classList.add('is-rtl');
      body?.classList.remove('is-ltr');
      
      // Load Bootstrap RTL CSS dynamically if not already loaded
      loadBootstrapRTL();
      
      console.log('✓ RTL layout applied');
      announceToScreenReader('Layout changed to right-to-left');
      
    } else {
      // Add LTR classes
      html.classList.add('is-ltr');
      html.classList.remove('is-rtl');
      body?.classList.add('is-ltr');
      body?.classList.remove('is-rtl');
      
      // Remove Bootstrap RTL CSS if present
      removeBootstrapRTL();
      
      console.log('✓ LTR layout applied');
      announceToScreenReader('Layout changed to left-to-right');
    }
    
    // Release guard after a short delay
    setTimeout(() => {
      isUpdating = false;
    }, 50);
  }
  
  /**
   * Loads Bootstrap RTL CSS dynamically
   */
  function loadBootstrapRTL() {
    if (document.getElementById('bootstrap-rtl-css')) return;
    
    const link = document.createElement('link');
    link.id = 'bootstrap-rtl-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css';
    document.head.appendChild(link);
  }
  
  /**
   * Removes Bootstrap RTL CSS
   */
  function removeBootstrapRTL() {
    const link = document.getElementById('bootstrap-rtl-css');
    if (link) link.remove();
  }
  
  // =================================================================
  // DEBOUNCED UPDATE HANDLER
  // =================================================================
  
  /**
   * Debounced direction update for performance
   * Uses requestAnimationFrame for smooth updates
   */
  function updateDirection() {
    if (debounceTimer) {
      cancelAnimationFrame(debounceTimer);
    }
    
    debounceTimer = requestAnimationFrame(() => {
      const detectedDirection = detectDirection();
      applyDirection(detectedDirection);
    });
  }
  
  // =================================================================
  // MUTATION OBSERVER - WATCHES FOR DYNAMIC CHANGES
  // =================================================================
  
  /**
   * Observes changes to <html> and <body> for language/direction changes
   * Detects: lang, dir, class changes (including Google Translate)
   */
  function initMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      // Check if any relevant attributes changed
      const hasRelevantChange = mutations.some(mutation => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName;
          return attrName === 'lang' || attrName === 'dir' || attrName === 'class';
        }
        return false;
      });
      
      if (hasRelevantChange) {
        console.log('Language/direction change detected via MutationObserver');
        updateDirection();
      }
    });
    
    // Observe <html> element
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'dir', 'class']
    });
    
    // Observe <body> element when available
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['lang', 'dir', 'class']
      });
    }
    
    console.log('✓ MutationObserver initialized');
  }
  
  // =================================================================
  // GOOGLE TRANSLATE DETECTION
  // =================================================================
  
  /**
   * Detects Google Translate injection and monitors for translation
   * Google Translate adds specific elements and classes when active
   */
  function detectGoogleTranslate() {
    // Watch for Google Translate's banner/frame
    const observer = new MutationObserver(() => {
      const googleElements = document.querySelector('.goog-te-banner-frame, .goog-te-menu-frame');
      const translatedClass = document.documentElement.className.match(/translated-(ltr|rtl)/);
      
      if (googleElements || translatedClass) {
        console.log('Google Translate detected, checking direction...');
        updateDirection();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  // =================================================================
  // ACCESSIBILITY - SCREEN READER ANNOUNCEMENTS
  // =================================================================
  
  /**
   * Announces direction changes to screen readers
   * @param {string} message
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('visually-hidden');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 3000);
  }
  
  // =================================================================
  // INITIALIZATION
  // =================================================================
  
  /**
   * Initialize the RTL/LTR detection system on page load
   */
  function init() {
    console.log('=== RTL/LTR Auto-Detection System Initialized ===');
    
    // Initial direction detection and application
    updateDirection();
    
    // Start monitoring for changes
    initMutationObserver();
    
    // Monitor for Google Translate specifically
    if (document.body) {
      detectGoogleTranslate();
    } else {
      document.addEventListener('DOMContentLoaded', detectGoogleTranslate);
    }
    
    console.log('✓ System ready. Monitoring for language changes...');
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();

// =================================================================
// ADDITIONAL PAGE FEATURES (TIMELINE, FORMS, TRANSLATION)
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
  
  // =================================================================
  // FLIP CARD FUNCTIONALITY FOR TIMELINE
  // =================================================================
  const flipCards = document.querySelectorAll('.flip-card');
  
  // Add click event to each flip card for mobile devices
  flipCards.forEach(card => {
    card.addEventListener('click', function() {
      // Toggle the 'flipped' class for mobile tap functionality
      this.classList.toggle('flipped');
    });
    
    // Add keyboard accessibility for flip cards
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Flip card to see more information');
    
    // Add keyboard support (Enter or Space to flip)
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.classList.toggle('flipped');
      }
    });
  });
  
  // =================================================================
  // FORM VALIDATION
  // =================================================================
  
  // Bootstrap form validation
  const forms = document.querySelectorAll('.needs-validation');
  
  // Loop over forms and prevent submission if invalid
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // Prevent default form submission
      event.preventDefault();
      event.stopPropagation();
      
      // Check if form is valid
      if (form.checkValidity()) {
        // Show success message
        alert('Thank you for subscribing to Intel\'s sustainability newsletter!');
        // Reset the form
        form.reset();
        form.classList.remove('was-validated');
      } else {
        // Add Bootstrap validation classes
        form.classList.add('was-validated');
      }
    }, false);
  });
  
  // =================================================================
  // AUTO-DETECT LANGUAGE & ADJUST LAYOUT FOR RTL (EXTRA CREDIT)
  // =================================================================
  
  /**
   * Detects if the page language changes (e.g., via Google Translate)
   * and applies RTL (right-to-left) styling automatically for RTL languages
   */
  
  // List of RTL language codes
  const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi', 'ji'];
  
  /**
   * Function to check if current language is RTL and apply direction
   */
  function detectAndApplyRTL() {
    // Get the current language from the html lang attribute
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.getAttribute('lang') || 'en';
    
    // Extract language code (first 2 characters)
    const langCode = currentLang.substring(0, 2).toLowerCase();
    
    // Check if the language is RTL
    if (rtlLanguages.includes(langCode)) {
      // Apply RTL direction
      htmlElement.setAttribute('dir', 'rtl');
      
      // Load Bootstrap RTL CSS dynamically if not already loaded
      if (!document.getElementById('bootstrap-rtl')) {
        const rtlLink = document.createElement('link');
        rtlLink.id = 'bootstrap-rtl';
        rtlLink.rel = 'stylesheet';
        rtlLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css';
        document.head.appendChild(rtlLink);
      }
      
      console.log('RTL layout applied for language:', langCode);
    } else {
      // Apply LTR direction (left-to-right)
      htmlElement.setAttribute('dir', 'ltr');
      
      // Remove Bootstrap RTL CSS if it exists
      const rtlLink = document.getElementById('bootstrap-rtl');
      if (rtlLink) {
        rtlLink.remove();
      }
      
      console.log('LTR layout applied for language:', langCode);
    }
  }
  
  // Run detection on page load
  detectAndApplyRTL();
  
  // =================================================================
  // LANGUAGE TRANSLATION WITH GOOGLE TRANSLATE
  // =================================================================
  
  /**
   * Trigger Google Translate when user selects a language and clicks Translate button
   */
  const languageSelect = document.getElementById('languageSelect');
  const translateBtn = document.getElementById('translateBtn');
  
  if (translateBtn && languageSelect) {
    translateBtn.addEventListener('click', function() {
      const selectedLang = languageSelect.value;
      
      // Wait for Google Translate to load
      const checkGoogleTranslate = setInterval(function() {
        const googleTranslateElement = document.querySelector('.goog-te-combo');
        
        if (googleTranslateElement) {
          clearInterval(checkGoogleTranslate);
          
          // Set the value and trigger change
          googleTranslateElement.value = selectedLang;
          googleTranslateElement.dispatchEvent(new Event('change'));
          
          // Update HTML lang attribute
          document.documentElement.setAttribute('lang', selectedLang);
          
          // Show visual feedback
          translateBtn.innerHTML = '<i class="bi bi-check-circle"></i> Translating...';
          translateBtn.disabled = true;
          
          // Re-enable button after translation
          setTimeout(() => {
            translateBtn.innerHTML = '<i class="bi bi-translate"></i> Translate';
            translateBtn.disabled = false;
            
            // Trigger RTL detection after translation
            detectAndApplyRTL();
            
            // Announce to screen reader
            const direction = rtlLanguages.includes(selectedLang.substring(0, 2)) ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)';
            announceToScreenReader(`Page translated to ${languageSelect.options[languageSelect.selectedIndex].text}. Layout is ${direction}`);
          }, 1500);
          
          console.log(`Translating page to: ${selectedLang}`);
        }
      }, 100);
      
      // Timeout after 5 seconds if Google Translate doesn't load
      setTimeout(() => {
        clearInterval(checkGoogleTranslate);
        if (translateBtn.disabled) {
          translateBtn.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Try Again';
          translateBtn.disabled = false;
          console.error('Google Translate failed to load');
        }
      }, 5000);
    });
  }
  
  // Monitor for language changes (e.g., Google Translate)
  // Use MutationObserver to watch for changes to the lang attribute
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'lang') {
        console.log('Language changed, reapplying RTL detection...');
        detectAndApplyRTL();
      }
    });
  });
  
  // Start observing the html element for attribute changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
  
  // Alternative detection: Monitor for Google Translate element changes
  // Google Translate adds specific classes and elements when translating
  const bodyObserver = new MutationObserver(function(mutations) {
    // Check if Google Translate has added translation elements
    const isTranslated = document.querySelector('.goog-te-banner-frame') || 
                         document.documentElement.classList.contains('translated-ltr') ||
                         document.documentElement.classList.contains('translated-rtl');
    
    if (isTranslated) {
      // Recheck language and apply RTL if needed
      detectAndApplyRTL();
    }
  });
  
  // Observe body for Google Translate changes
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
  
  // =================================================================
  // ACCESSIBILITY ENHANCEMENTS
  // =================================================================
  
  /**
   * Announce dynamic content changes to screen readers
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('visually-hidden'); // Bootstrap class for screen reader only
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove announcement after 3 seconds
    setTimeout(() => {
      announcement.remove();
    }, 3000);
  }
  
  // Announce when layout changes to RTL
  const originalDetectAndApplyRTL = detectAndApplyRTL;
  detectAndApplyRTL = function() {
    const htmlElement = document.documentElement;
    const oldDir = htmlElement.getAttribute('dir');
    
    originalDetectAndApplyRTL();
    
    const newDir = htmlElement.getAttribute('dir');
    if (oldDir !== newDir) {
      announceToScreenReader(`Layout changed to ${newDir === 'rtl' ? 'right-to-left' : 'left-to-right'}`);
    }
  };
  
  console.log('Intel Sustainability Page: All scripts loaded successfully!');
  console.log('RTL auto-detection: Active');
  console.log('Form validation: Active');
  console.log('Accessibility features: Active');
});
