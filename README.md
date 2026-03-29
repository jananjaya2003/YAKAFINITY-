# YAKAFINITY Website

Premium tech service website + admin management panel built for GitHub + Netlify hosting.

Main website files are now stored in `Yakafinity Website/`, while the portfolio stays in `My Portfolio/`.

## Pages

- `Yakafinity Website/index.html` - Home page.
- `Yakafinity Website/about.html` - Company overview and process.
- `Yakafinity Website/services.html` - Full services catalog.
- `Yakafinity Website/contact.html` - Contact + order form page.
- `Yakafinity Website/service-detail.html` - Individual service details page.
- `Yakafinity Website/client-portal.html` - Client login + payment gateway page.
- `Yakafinity Website/admin-login.html` - Protected admin login page.
- `Yakafinity Website/admin.html` - Management page to edit company details, services, and orders.

## Services Included

- AI Solutions 🤖
- Pro Accounts 💎
- Development 💻📱
- Marketing & Design 🎨📈
- Hosting & IT 🌐🔐

## Admin Features

- Admin login/session gate
- Edit brand details (name, domain, tagline, logo URL)
- Update admin username/password
- Add, edit, delete service categories and service images
- Add, edit, delete service items/plans with LKR pricing
- Upload logo, service images, and service-item images directly from device
- Manage orders and delivery status
- Export/import full data backup (`.json`)

## Service Click Flow

- Home page shows the 5 main services as clickable cards.
- Clicking a service opens `Yakafinity Website/service-detail.html?id=<service-id>`.
- Service detail page has direct CTA to order that service.

## Client Login + Payment

- Page: `Yakafinity Website/client-portal.html` (or `/client`)
- Login methods:
  - Google Sign-In
  - Mobile OTP (Firebase Phone Auth)
- Payment buttons:
  - Stripe
  - PayPal
  - PayHere

### Setup Required

1. Open `integrations-config.js`
2. Add your Firebase project credentials.
3. Add your payment links (`stripePaymentLink`, `paypalLink`, `payhereLink`).
4. In Firebase Console, enable:
   - Google provider
   - Phone provider
5. Add your Netlify domain (`www.yakafinity.com`) to Firebase authorized domains.

## Default Admin Login

- Username: `tharindujb2003`
- Password: `tjbro2003@#`

Change these immediately in the `Admin Access` section after first login.

## Published Admin Links

When the site is published on `yakafinity.com`, use these admin login pages:

- Main website admin login: `https://yakafinity.com/admin`
- Direct main admin page after login: `https://yakafinity.com/Yakafinity%20Website/admin.html`
- Portfolio admin login: `https://yakafinity.com/My%20Portfolio/manage-login.html`
- Direct portfolio admin page after login: `https://yakafinity.com/My%20Portfolio/manage.html`

Shared login for both admin systems:

- Username: `tharindujb2003`
- Password: `tjbro2003@#`

## Local Run

Open `Yakafinity Website/index.html` directly in browser, or use any static server.

## Image Folders

- Main site admin saves images into `admin-images/site-admin/brand`, `admin-images/site-admin/services`, and `admin-images/site-admin/items`
- Portfolio manager saves images into `admin-images/portfolio-admin/`
- For real file save/delete from the browser, open the admin pages in a modern Chromium browser on `localhost` or `https`, then connect the matching folder when prompted

## Deploy to GitHub + Netlify

1. Push this project to a GitHub repository.
2. In Netlify: `Add new site` -> `Import an existing project` -> choose your GitHub repo.
3. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: `.`
4. Deploy.
5. In Netlify `Domain management`, add your custom domain:
   - `www.yakafinity.com`
6. Update your domain DNS records to Netlify values (shown in Netlify dashboard).
7. Open `/admin` on your site to access admin login.

## Important Note

Current admin storage uses browser local storage, so data is saved per browser/device.
For multi-device team management, add a backend (Netlify Functions + database) later.
