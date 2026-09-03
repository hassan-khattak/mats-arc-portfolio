# MATS ARC Gaming Studio Portfolio

A cinematic, responsive portfolio website for MATS ARC Gaming Studio. The site is built with plain HTML, CSS, and JavaScript, so it has no package dependencies or build step.

## Features

- Animated particle and constellation background
- Cinematic hero section with HUD and glitch effects
- Responsive game portfolio grid
- Interactive 3D card tilt and lighting
- Dedicated cinematic detail pages for every game
- Original optimized key art and gameplay visuals
- Scroll-triggered reveals and animated studio statistics
- Mobile navigation
- Reduced-motion accessibility support
- Dedicated privacy-policy page
- Dedicated player-support page
- External privacy links for integrated game-service providers
- Data-deletion and support contact links

## Run Locally

From the project directory, start a static web server:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000
```

The privacy policy is available at:

```text
http://127.0.0.1:8000/privacy.html
```

You can also open `index.html` directly, but using a local server more closely matches production hosting.

## Project Structure

```text
portfolio/
├── index.html      # Portfolio content and page structure
├── privacy.html    # Privacy policy and data-deletion information
├── support.html    # Player support, troubleshooting, and contact information
├── void-runners.html, mythic-legends.html, arc-rival.html, chrono-knight.html
│                    # Individual game detail pages
├── style.css       # Complete visual design and responsive styles
├── game.css        # Shared game-detail page design
├── script.js       # Homepage animation and interaction logic
├── legal.js        # Privacy-page background and scroll effects
├── support.js      # Support game picker and email composer
├── assets/images/  # Optimized original WebP artwork
└── README.md       # Project documentation
```

## Customization

### Studio information

Update the studio name, description, copyright notice, and email addresses in `index.html` and `privacy.html`.

The current public contact is:

```text
support@matsarc.com
```

### Games

Each game card is defined in `index.html`. Update its:

- Title and genre
- Cover image URL
- Store availability
- Badge and release status

The corresponding dialog content is stored in the `gameData` object inside `script.js`. Keep each card's `data-game` value matched with its entry in `gameData`.

### Images

The current game covers use remote Unsplash URLs. For production, replace them with original game screenshots or key art stored in a local `assets/` directory. Local assets avoid third-party availability issues and give the studio a distinct identity.

Example:

```html
<img src="assets/images/void-runners.webp" alt="Void Runners">
```

### Colors and typography

The primary theme variables are at the beginning of `style.css`:

```css
:root {
  --ink: #05070d;
  --panel: #0b101b;
  --cyan: #54e8ff;
  --violet: #8b5cff;
  --text: #f4f8ff;
  --muted: #8996aa;
}
```

The site loads Orbitron and Rajdhani from Google Fonts.

## Privacy Policy

The privacy policy currently identifies the following potential third-party providers:

- Google Play Services
- Google AdMob
- Google Analytics for Firebase
- Firebase Crashlytics
- Meta/Facebook
- Unity
- GameAnalytics
- AppLovin

Before publishing a game, verify that this list precisely matches the SDKs included in that game. The website policy, Google Play Data Safety form, Apple App Privacy disclosures, and in-game disclosures must remain consistent.

Update the effective and last-updated dates whenever the policy materially changes.

## Deployment

Because this is a static website, it can be deployed to services such as:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- Any conventional web host

Upload every project file while preserving the current directory structure. Configure the host to serve `index.html` as the default document.

## Production Checklist

- Replace stock images with original game artwork
- Replace placeholder store buttons with real URLs
- Verify all game descriptions and release statuses
- Confirm the public contact mailbox is monitored
- Verify every third-party SDK disclosure
- Add a favicon and social-sharing image
- Add Open Graph and social metadata
- Test navigation, dialogs, and email links on mobile
- Test with reduced-motion enabled
- Connect a custom domain and HTTPS

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas 2D API
- Google Fonts

## License

All MATS ARC branding, game concepts, artwork, and content are proprietary unless otherwise stated. Third-party images, fonts, services, and trademarks remain subject to their respective licenses and terms.
