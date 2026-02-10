# Project 2: Intel Sustainability Journey

Build an interactive webpage that presents Intel's sustainability goals in a timeline format. Using AI and your knowledge of responsive design, you'll experiment with hover effects, transitions, and layouts to ensure it adapts seamlessly to both desktop and mobile.

Launch a Codespace to get started! Remember to Commit and Push your project changes to GitHub from Codespaces to prevent losing progress.

## Features Implemented ✨

### Core Requirements
- ✅ **Bootstrap Integration**: Full Bootstrap 5.3.2 implementation with responsive grid system
- ✅ **RTL Support**: Right-to-left text flow enabled with automatic detection
- ✅ **Three-Column Section**: Responsive grid layout featuring RISE Strategy, Commitment, and Water & Waste
- ✅ **Bootstrap Icons**: Visual enhancement with icons for each section
- ✅ **Styled Learn More Links**: Interactive links with hover effects and accessibility features
- ✅ **Subscription Form**: Accessible newsletter form with validation
- ✅ **Footer Section**: Professional footer with copyright and navigation links
- ✅ **Accessibility Improvements**: WCAG compliant with proper ARIA labels, skip links, and high contrast support

### LevelUp Features (Extra Credit) 🌟

#### Auto-Detect Language & Adjust Layout (10 pts)
- **JavaScript RTL Detection**: Automatically detects page language changes
- **Google Translate Support**: Works with Google Translate and other translation tools
- **Dynamic Bootstrap RTL CSS**: Loads RTL stylesheet when needed
- **MutationObserver**: Monitors HTML lang attribute changes in real-time
- **Language Switcher**: Built-in dropdown menu to test RTL functionality

#### Enhanced Interactivity (10 pts)
- **Bootstrap Modals**: Three detailed modals for RISE Strategy, Commitment, and Water & Waste
- **Accordion Component**: Interactive accordion within the Water & Waste modal
- **Smooth Animations**: Hover effects and transitions throughout
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements

## How to Test RTL Functionality 🧪

### Method 1: Built-in Translation Button (RECOMMENDED)
1. Open `index.html` in your browser
2. Look for the **"Translate Page"** widget in the top-right corner
3. Select a language from the dropdown:
   - **Arabic (العربية)** or **Hebrew (עברית)** for RTL languages
   - **Spanish, French, German, Chinese, Japanese** for LTR languages
4. Click the **"Translate"** button
5. Watch the page content translate AND the layout automatically adjust to RTL/LTR
6. Select English and click Translate again to return to original

### Method 2: Right-Click Translation (Browser Feature)
1. Open `index.html` in your browser
2. Right-click anywhere on the page
3. Select "Translate to Arabic" or "Translate to Hebrew"
4. The script will automatically detect the language change
5. Layout will adjust to RTL
6. Translate back to English to see LTR layout

### Method 3: Browser Developer Tools (For Testing)
1. Open browser DevTools (F12)
2. In the Console, run: `document.documentElement.setAttribute('lang', 'ar')`
3. Watch the automatic RTL detection activate
4. Check the Console for detection logs

### What Happens When You Translate:
- ✅ Page content translates to selected language via Google Translate
- ✅ Layout automatically switches to RTL for Arabic/Hebrew
- ✅ Layout switches to LTR for other languages
- ✅ Bootstrap RTL CSS loads dynamically for RTL languages
- ✅ All icons, buttons, and components adjust direction
- ✅ Screen readers announce the language change

## Accessibility Features ♿

- **Skip to Main Content**: Keyboard shortcut for screen reader users
- **ARIA Labels**: Comprehensive labels for all interactive elements
- **Form Validation**: Built-in Bootstrap validation with helpful error messages
- **High Contrast Support**: Media queries for high contrast mode
- **Reduced Motion**: Respects user preference for reduced motion
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Indicators**: Clear focus outlines for navigation
- **Descriptive Alt Text**: All images have detailed descriptions
- **Screen Reader Announcements**: Dynamic content changes announced

## Interactive Components 🎯

### Modals
- **RISE Strategy Modal**: Detailed information about Intel's RISE framework
- **Commitment Modal**: Net-zero pathway with visual cards
- **Water & Waste Modal**: Includes interactive accordion for detailed information

### Forms
- **Newsletter Subscription**: Validated form with name, email, and consent checkbox
- **Real-time Validation**: Bootstrap validation with user-friendly error messages
- **Success Feedback**: Alert confirmation on successful submission

### Timeline Cards
- **Flip Animation**: Cards flip on hover or tap to reveal details
- **Touch Support**: Mobile-friendly tap interactions
- **Keyboard Accessible**: Space or Enter to flip cards

## Technologies Used 🛠️

- **HTML5**: Semantic markup
- **CSS3**: Custom styling with advanced selectors
- **Bootstrap 5.3.2**: Grid system, components, utilities
- **Bootstrap Icons**: Visual enhancement
- **JavaScript (ES6+)**: Interactive features and RTL detection
- **Google Fonts**: Tinos, Scope One, Bitcount Single
- **MutationObserver API**: Real-time language detection
- **WCAG 2.1**: Accessibility guidelines compliance

## Testing Checklist ✓

- [ ] Open page in browser
- [ ] Select Arabic from language dropdown and click "Translate" button
- [ ] Verify page content translates to Arabic
- [ ] Verify layout switches to RTL (right-to-left)
- [ ] Select English and click "Translate" to return to original
- [ ] Verify layout switches back to LTR
- [ ] Test with Hebrew for another RTL language
- [ ] Click "Learn More" links to open modals
- [ ] Verify modals also display in RTL when translated
- [ ] Test accordion within Water & Waste modal
- [ ] Submit newsletter form (test validation)
- [ ] Flip timeline cards by clicking/hovering
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Check responsive layout on mobile (DevTools)
- [ ] Verify skip to main content link (Tab key)
- [ ] Check browser console for translation logs

## Browser Compatibility 🌐

Tested and working on:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits 📸

Timeline images from Unsplash photographers:
- Andrew D, Lazar Andy, Mika Baumeister, Vishnu Mohanan, Bolivia Inteligente

---

**Project Status**: ✅ Complete with all requirements + extra credit features
