# Advantis Healthcare Website

This repository contains the website code for Advantis, a healthcare solutions company.

## Deployment Options

This website is designed to work on multiple hosting platforms with different configurations for each:

### Netlify Deployment (Recommended)

1. Push this repository to GitHub
2. Connect your GitHub repository to Netlify
3. Deploy with the following settings:
   - Build command: (leave blank)
   - Publish directory: `/` (root)
   - The `netlify.toml` file will handle all redirects and headers

### Traditional Web Server (Apache/Nginx)

The site includes:
- `.htaccess` - Configuration for Apache servers
- `web.config` - Configuration for IIS servers
- `index.php` - PHP fallback for servers with PHP support

### Troubleshooting

If users experience "too many redirects" errors:
1. Direct them to `/fix-redirects.html` or `/redirect-fix.html` which provide troubleshooting steps
2. Both pages include an auto-fix button to help resolve common caching issues

## Development

To work on this site locally:
1. Clone the repository
2. Open the site in your browser (no build step required)
3. For testing PHP fallbacks, use a local PHP server: `php -S localhost:8000`

## File Structure

- `index.html` - Main homepage
- `*.html` - Other site pages
- `index.php` - PHP fallback (for servers with PHP support)
- `style.css`, `advantis-main.css`, `common-fixes.css` - CSS files
- `script.js` - Main JavaScript functionality
- `images/` - All site images
- `netlify.toml` - Netlify configuration
- `.htaccess` - Apache server configuration
- `web.config` - IIS server configuration
- `fix-redirects.html` - User troubleshooting page
- `404.html` - Custom 404 page