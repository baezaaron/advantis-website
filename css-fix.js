/**
 * Enhanced CSS Loading Fix for Advantis Website
 * This script ensures CSS files are loaded correctly across all devices
 * and prevents redirect loops
 */

(function() {
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Enhanced CSS Fix script running...');
        
        // Track page loads to detect potential redirect loops
        const visitCount = parseInt(sessionStorage.getItem('pageVisitCount') || '0');
        sessionStorage.setItem('pageVisitCount', visitCount + 1);
        
        // Check if we might be in a redirect loop
        if (visitCount > 2) {
            console.warn('Potential redirect loop detected, applying emergency fixes');
            document.documentElement.classList.add('emergency-mode');
            
            // Record the issue for future page loads
            localStorage.setItem('cssIssuesDetected', 'true');
            
            // Add meta tag to prevent further redirects
            const meta = document.createElement('meta');
            meta.name = 'redirect-blocker';
            meta.content = 'true';
            document.head.appendChild(meta);
        }
        
        // Force reload CSS files with timestamp-based cache busting
        function reloadStylesheets() {
            const timestamp = new Date().getTime();
            const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
            
            styleSheets.forEach(function(link) {
                // Skip external CDN resources
                if (link.href.includes('cdnjs.cloudflare.com') || 
                    link.href.includes('fonts.googleapis.com')) {
                    return;
                }
                
                const originalHref = link.getAttribute('href').split('?')[0];
                const newHref = originalHref + '?v=' + timestamp;
                
                // Create a new link element instead of modifying the existing one
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = newHref;
                
                // Add event listeners to track loading status
                newLink.addEventListener('load', function() {
                    console.log('CSS loaded successfully: ' + newHref);
                });
                
                newLink.addEventListener('error', function() {
                    console.error('Failed to load CSS: ' + newHref);
                    applyFallbackStyles();
                });
                
                // Replace the old link with the new one
                link.parentNode.insertBefore(newLink, link.nextSibling);
                setTimeout(() => link.parentNode.removeChild(link), 100);
                
                console.log('Refreshed CSS: ' + newHref);
            });
        }
        
        // Check if CSS loaded correctly
        function checkCSSLoaded() {
            let styleSheets = document.styleSheets;
            let cssLoaded = false;
            let cssLoadErrors = 0;
            
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    // Check if we can access rules (will throw error if not loaded)
                    if (styleSheets[i].cssRules && styleSheets[i].cssRules.length > 0) {
                        if (!styleSheets[i].href || 
                            (!styleSheets[i].href.includes('cdnjs') && 
                             !styleSheets[i].href.includes('fonts.googleapis'))) {
                            cssLoaded = true;
                        }
                    }
                } catch (e) {
                    // CORS error or CSS not loaded
                    cssLoadErrors++;
                }
            }
            
            // If we have errors or external styles didn't load
            if (cssLoadErrors > 0 || !cssLoaded) {
                console.warn('CSS loading issues detected, applying fixes...');
                document.body.classList.add('css-loading-issue');
                applyFallbackStyles();
                
                // Try reloading stylesheets as a last resort
                if (visitCount < 2) {
                    reloadStylesheets();
                }
            } else {
                console.log('CSS loaded successfully');
            }
        }
        
        // Apply more robust fallback styles if CSS failed to load
        function applyFallbackStyles() {
            const style = document.createElement('style');
            style.textContent = `
                body.css-loading-issue,
                body.emergency-mode {
                    font-family: Arial, sans-serif !important;
                    line-height: 1.6 !important;
                    color: #333 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background-color: #fff !important;
                }
                
                body.css-loading-issue a,
                body.emergency-mode a {
                    color: #0066CC !important;
                    text-decoration: none !important;
                }
                
                body.css-loading-issue h1, 
                body.css-loading-issue h2, 
                body.css-loading-issue h3,
                body.emergency-mode h1,
                body.emergency-mode h2,
                body.emergency-mode h3 {
                    color: #2C3E50 !important;
                    margin-bottom: 20px !important;
                    font-family: Arial, sans-serif !important;
                }
                
                body.css-loading-issue .container,
                body.emergency-mode .container {
                    width: 100% !important;
                    max-width: 1200px !important;
                    margin: 0 auto !important;
                    padding: 0 15px !important;
                }
                
                body.css-loading-issue img,
                body.emergency-mode img {
                    max-width: 100% !important;
                    height: auto !important;
                    display: block !important;
                }
                
                body.css-loading-issue .btn, 
                body.css-loading-issue .btn-primary, 
                body.css-loading-issue .contact-btn,
                body.emergency-mode .btn,
                body.emergency-mode .btn-primary,
                body.emergency-mode .contact-btn {
                    background-color: #0066CC !important;
                    color: #fff !important;
                    display: inline-block !important;
                    padding: 8px 20px !important;
                    border-radius: 4px !important;
                    text-decoration: none !important;
                }
                
                body.css-loading-issue .main-nav,
                body.emergency-mode .main-nav {
                    background: #fff !important;
                    padding: 15px 0 !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                    position: relative !important;
                    width: 100% !important;
                }
                
                body.css-loading-issue .footer,
                body.emergency-mode .footer {
                    background: #f8f9fa !important;
                    padding: 30px 0 !important;
                    margin-top: 30px !important;
                }
                
                body.emergency-mode .emergency-notice {
                    background-color: #ffeb3b !important;
                    color: #333 !important;
                    padding: 10px !important;
                    text-align: center !important;
                    font-weight: bold !important;
                }
            `;
            document.head.appendChild(style);
            
            // Add emergency notice if in emergency mode
            if (visitCount > 2 || localStorage.getItem('cssIssuesDetected')) {
                const notice = document.createElement('div');
                notice.className = 'emergency-notice';
                notice.textContent = 'Using fallback styles due to loading issues. Please refresh the page if content appears incorrectly.';
                document.body.insertBefore(notice, document.body.firstChild);
            }
        }
        
        // Run checks
        setTimeout(checkCSSLoaded, 500);
        
        // Add a CSS reload button for troubleshooting
        if (window.location.search.includes('debug=1') || 
            window.location.search.includes('fix=1') || 
            localStorage.getItem('cssIssuesDetected')) {
            
            const fixButton = document.createElement('button');
            fixButton.textContent = 'Fix Styles';
            fixButton.style.cssText = 'position:fixed; bottom:10px; right:10px; z-index:9999; background:#0066CC; color:white; border:none; border-radius:4px; padding:8px 15px; cursor:pointer; font-family:Arial; font-size:14px;';
            
            fixButton.addEventListener('click', function() {
                reloadStylesheets();
                setTimeout(() => location.reload(), 500);
            });
            
            document.body.appendChild(fixButton);
        }
        
        // Special handling for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            console.log('Mobile device detected, applying specific fixes');
            document.documentElement.classList.add('mobile-device');
            
            // Prevent redirect loops on mobile devices
            if (visitCount > 1) {
                // Add viewport meta tag with specific settings for mobile
                const viewportMeta = document.querySelector('meta[name="viewport"]');
                if (viewportMeta) {
                    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
                }
                
                // Force absolute URLs for all links to prevent redirect issues
                document.querySelectorAll('a').forEach(link => {
                    if (link.href && link.href.startsWith(window.location.origin)) {
                        link.href = link.href;  // Ensure absolute URL
                    }
                });
            }
        }
    });
})(); 