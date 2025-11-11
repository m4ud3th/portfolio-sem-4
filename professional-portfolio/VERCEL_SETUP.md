# Vercel Environment Variables Setup

## Email Configuration for Contact Form

To enable the contact form email functionality on Vercel, you need to set up the following environment variables:

### Steps:

1. **Go to your Vercel Dashboard**
   - Navigate to your project
   - Click on "Settings" → "Environment Variables"

2. **Add the following variables:**

   **EMAIL_USER**
   - Value: `maudeth4@gmail.com` (or your preferred Gmail address)
   - Environment: Production, Preview, Development

   **EMAIL_PASS**
   - Value: Your Gmail App Password (see below for setup)
   - Environment: Production, Preview, Development

### How to Get Gmail App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification (must be enabled)
3. Scroll to "App passwords" at the bottom
4. Click "App passwords"
5. Select "Mail" and "Other (Custom name)"
6. Name it "Portfolio Contact Form"
7. Click "Generate"
8. Copy the 16-character password (no spaces)
9. Use this as your `EMAIL_PASS` value in Vercel

### After Adding Variables:

1. Click "Save" for each variable
2. Redeploy your application:
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"

### Testing:

After redeployment, test the contact form at:
- Production: `https://your-domain.com/contact`

### Alternative Email Services:

If you prefer not to use Gmail, you can update the transporter in `/src/app/api/contact/route.ts` to use:
- SendGrid
- Mailgun
- AWS SES
- Any other SMTP service

### Environment Variables for Local Development:

Create a `.env.local` file in the root directory:

```env
EMAIL_USER=maudeth4@gmail.com
EMAIL_PASS=your_app_password_here
```

Note: `.env.local` is already in `.gitignore` and won't be committed to your repository.
