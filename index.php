<?php
// Force cache clearing headers
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Path to the index.html file
$html_file = 'index.html';

// If the file exists, include it
if (file_exists($html_file)) {
    readfile($html_file);
} else {
    // Fallback text if file is missing
    echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Advantis</title></head>';
    echo '<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">';
    echo '<h1>Welcome to Advantis</h1>';
    echo '<p>Our website is currently being updated. Please check back soon.</p>';
    echo '<p><a href="https://advantis.care/fix-redirects.html">Having trouble? Click here for help</a></p>';
    echo '</body></html>';
}
?> 