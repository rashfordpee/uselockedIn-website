# LockedIn Website 🔒

A modern, accessible, mobile-first landing page for the LockedIn Chrome Extension.

## 🚀 Quick Start

1. **Clone/Download** the files to your project folder
2. **Customize** the content (see customization guide below)
3. **Add your images** to the `images/` folder
4. **Deploy** to Vercel or your preferred hosting

## 📁 File Structure

```
lockedin-website/
├── index.html          # Main landing page
├── chef.html           # Meet the Chef page
├── style.css           # Main stylesheet
├── script.js           # JavaScript functionality
├── README.md           # This file
└── images/            # Your images go here
    ├── logo.png
    ├── extension-screenshot.png
    ├── profile-photo.jpg
    ├── favicon.ico
    └── icons/
```

## ⚡ Key Features Built

✅ **Mobile-first responsive design**
✅ **Dark/light theme toggle** with localStorage persistence
✅ **Rotating hero text** with gradient italics
✅ **Smooth FAQ accordion** with skeletal icons
✅ **Accessible navigation** with keyboard support
✅ **Zig-zag reason layout** as specified
✅ **Hierarchical audience grid**
✅ **Animated testimonials**
✅ **Chef page** with wiggling hat animation
✅ **SEO optimized** with meta tags
✅ **Performance optimized** with lazy loading

## 🎨 Customization Checklist

### 1. Content & Copy

- [ ] Update hero rotating words in `script.js` (line 12)
- [ ] Customize "What is LockedIn" description
- [ ] Modify the 5 reasons in "Why Lock In" section
- [ ] Update audience cards (icons, titles, descriptions)
- [ ] Replace testimonials with real user feedback
- [ ] Write your biography in `chef.html`
- [ ] Update FAQ questions and answers

### 2. Images & Media

- [ ] Add your logo to `images/logo.png`
- [ ] Replace extension placeholder with screenshot `images/extension-screenshot.png`
- [ ] Add your profile photo `images/profile-photo.jpg`
- [ ] Create favicon files (`favicon.ico`, `apple-touch-icon.png`, etc.)
- [ ] Replace emoji icons with professional SVG icons
- [ ] Add platform-specific store logos

### 3. Links & URLs

- [ ] Update Chrome Web Store link (search for "your-extension-id")
- [ ] Update Microsoft Edge store link
- [ ] Update Opera store link
- [ ] Add UC Browser store link when available
- [ ] Update LinkedIn profile URL
- [ ] Update support/donation link
- [ ] Add your email address in contact sections

### 4. SEO & Meta Tags

- [ ] Customize page titles and descriptions
- [ ] Update Open Graph images (`og-image.jpg`)
- [ ] Add your domain to meta tags
- [ ] Create `sitemap.xml`
- [ ] Add Google Analytics tracking ID (uncomment in `script.js`)

### 5. Branding & Colors

- [ ] Adjust color scheme in CSS custom properties (`:root` section)
- [ ] Customize font sizes if needed
- [ ] Update gradient colors for rotating text
- [ ] Modify hover effects and animations

## 🔧 Technical Details

### Typography

- **Headers:** Exo (600, 700, 800 weights)
- **Body:** Exo 2 (400, 500 weights)
- **Loaded via Google Fonts** with `display=swap`

### Accessibility Features

- WCAG AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly ARIA labels
- Focus indicators for all interactive elements
- Respects `prefers-reduced-motion` setting

### Performance

- Mobile-first CSS approach
- Intersection Observer for scroll animations
- Lazy loading for images
- Debounced scroll events
- Optimized CSS with custom properties

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Deploy automatically with custom domain

### Other Options

- **Netlify:** Drag and drop the folder
- **GitHub Pages:** Enable in repository settings
- **Traditional hosting:** Upload files via FTP

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Key Files to Customize

### `index.html`

- Search for `<!-- CUSTOMIZE -->` comments
- Update meta tags and SEO information
- Replace placeholder content
- Update platform store links

### `style.css`

- Modify CSS custom properties in `:root`
- Adjust responsive breakpoints if needed
- Customize animation durations and effects

### `script.js`

- Update rotating words array (line 12)
- Customize animation timing
- Add Google Analytics tracking (uncomment section)
- Modify platform detection logic

### `chef.html`

- Replace entire biography section
- Update social media links
- Add your profile photo
- Customize contact information

## 🔍 Testing Checklist

- [ ] Test on mobile devices (iOS & Android)
- [ ] Verify keyboard navigation works
- [ ] Test with screen readers
- [ ] Check color contrast in both themes
- [ ] Validate HTML and CSS
- [ ] Test all external links
- [ ] Verify FAQ accordion functionality
- [ ] Test theme toggle persistence

## 📈 Optional Enhancements

### Analytics

Uncomment Google Analytics section in `script.js` and add your tracking ID:

```javascript
gtag("config", "YOUR_GA_TRACKING_ID");
```

### Contact Form

Add a contact form section and uncomment the form handling code in `script.js`.

### Progressive Web App

Uncomment the service worker registration to make it a PWA.

### Additional Pages

- Create `privacy.html` for privacy policy
- Create `media.html` for videos and screenshots
- Add blog section for updates and tips

## 🆘 Need Help?

### Common Issues

- **Images not showing:** Check file paths in `images/` folder
- **Fonts not loading:** Verify Google Fonts link in `<head>`
- **JavaScript errors:** Check browser console for details
- **Mobile layout issues:** Test responsive design in dev tools

### Resources

- [Vercel Deployment Guide](https://vercel.com/docs)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Fonts](https://fonts.google.com/)
- [CSS Custom Properties Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## 📄 License

This code is provided as-is for the LockedIn project. Feel free to customize and deploy for your extension.

---

**Built with ❤️ by The Jiggy Designer**

_Remember: Once you're in, you're LockedIn!_
