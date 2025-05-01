const fs = require('fs');
const marked = require('marked');
const path = require('path');
const matter = require('gray-matter');

// Configure marked options
marked.setOptions({
    headerIds: true,
    gfm: true
});

// Create a blog post template
const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="../blog-style.css">
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <!-- Add your navigation and other head elements -->
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-brand">
            <a href="../index.html">
                <img src="../images/logo.png" alt="Logo" class="logo">
            </a>
        </div>
        <div class="nav-links">
            <a href="../index.html">Home</a>
            <a href="../about.html">About</a>
            <div class="dropdown">
                <a href="../services.html">Services</a>
                <div class="dropdown-content">
                    <a href="../services.html#apcm">Advanced Primary Care Management</a>
                    <a href="../services.html#ccm">Chronic Care Management</a>
                    <a href="../services.html#rpm">Remote Patient Monitoring</a>
                    <a href="../services.html#preventative">Preventative Care</a>
                    <a href="../services.html#snf">SNF Primary Care</a>
                </div>
            </div>
            <a href="../resources.html">Resources</a>
            <a href="../careers.html">Careers</a>
            <a href="../contact.html">Contact</a>
        </div>
    </nav>

    <div class="blog-container">
        <article class="blog-post">
            <div class="blog-meta">
                <span class="blog-date">{{date}}</span>
                <span class="blog-author">By {{author}}</span>
                <span class="blog-category">{{category}}</span>
            </div>
            {{content}}
        </article>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <img src="../images/logo.png" alt="Logo" class="footer-logo">
                <p>123 Healthcare Street<br>Suite 100<br>City, State 12345</p>
                <p>Phone: (555) 123-4567<br>Email: info@advantis.care</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../about.html">About</a></li>
                    <li><a href="../services.html">Services</a></li>
                    <li><a href="../resources.html">Resources</a></li>
                    <li><a href="../careers.html">Careers</a></li>
                    <li><a href="../contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Services</h3>
                <ul>
                    <li><a href="../services.html#apcm">Advanced Primary Care Management</a></li>
                    <li><a href="../services.html#ccm">Chronic Care Management</a></li>
                    <li><a href="../services.html#rpm">Remote Patient Monitoring</a></li>
                    <li><a href="../services.html#preventative">Preventative Care</a></li>
                    <li><a href="../services.html#snf">SNF Primary Care</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Us</h3>
                <form class="footer-contact-form" action="https://formspree.io/f/xyzwkdrz" method="POST">
                    <input type="text" name="name" placeholder="Name" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="text" name="company" placeholder="Company" required>
                    <textarea name="message" placeholder="Message" required></textarea>
                    <div class="g-recaptcha" data-sitekey="6LepWCorAAAAACKOTeqIfRkulqMHijMDkpvqm8fO"></div>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    </footer>

    <script src="../script.js"></script>
</body>
</html>
`;

// Function to extract front matter
function extractFrontMatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { frontMatter: {}, content: content };

    const frontMatter = {};
    const frontMatterString = match[1];
    frontMatterString.split('\n').forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value) {
            frontMatter[key.trim()] = value.join(':').trim().replace(/^"(.*)"$/, '$1');
        }
    });

    return {
        frontMatter,
        content: match[2]
    };
}

// Convert markdown file
function convertMarkdownFile(filePath) {
    const markdown = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(markdown);
    const frontMatter = parsed.data;
    const content = parsed.content;
    const htmlContent = marked.parse(content);

    let html = template
        .replace('{{title}}', frontMatter.title || '')
        .replace('{{date}}', frontMatter.date || '')
        .replace('{{author}}', frontMatter.author || '')
        .replace('{{category}}', frontMatter.category || '')
        .replace('{{content}}', htmlContent);

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'blog-posts-html');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Write the HTML file
    const outputFile = path.join(outputDir, path.basename(filePath, '.md') + '.html');
    fs.writeFileSync(outputFile, html);
    console.log(`Converted ${filePath} to ${outputFile}`);
}

// Convert all markdown files in the blog-posts directory
const blogPostsDir = path.join(__dirname, 'blog-posts');
fs.readdirSync(blogPostsDir)
    .filter(file => file.endsWith('.md'))
    .forEach(file => {
        convertMarkdownFile(path.join(blogPostsDir, file));
    }); 