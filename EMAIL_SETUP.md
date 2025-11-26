# Email Setup Guide for Contact Form

The contact form is now configured to send emails to `maudeth4@gmail.com` using nodemailer. Here's how to set it up:

## Option 1: Gmail with App Password (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security" → "2-Step Verification"
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password
1. In Google Account settings, go to "Security" → "App passwords"
2. Select "Mail" as the app
3. Generate a new app password
4. Copy the 16-character password

### Step 3: Update Environment Variables
In your `.env.local` file, update:
```bash
EMAIL_USER=maudeth4@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## Option 2: Alternative Email Services

### Resend (Recommended for production)
1. Sign up at https://resend.com
2. Get your API key
3. Update the API route to use Resend instead of nodemailer

### SendGrid
1. Sign up at https://sendgrid.com
2. Get your API key
3. Update the API route to use SendGrid's API

## For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following variables:
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your app password or API key

## Testing

1. Start your development server: `npm run dev`
2. Go to `/contact` page
3. Fill out and submit the form
4. Check the email inbox for `maudeth4@gmail.com`

## Troubleshooting

- **"Invalid credentials"**: Double-check your email and app password
- **"Less secure apps"**: Use App Password instead of regular password
- **Rate limiting**: Gmail has sending limits; consider using a service like Resend for production
- **Firewall issues**: Some networks block SMTP; try using API-based services instead

## Security Notes

- Never commit actual passwords to version control
- Use environment variables for all sensitive data
- Consider using API-based email services for better reliability
- Gmail App Passwords are more secure than regular passwords for applications