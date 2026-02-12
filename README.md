# Jewelicious Nepal

A static, multi-page storefront for a Nepali jewelry brand. The site includes a homepage with product search and a modal view, a dedicated products page with a detail panel, and an about page describing the brand and services.

## Live demo
- Add your GitHub Pages or hosted URL here.

## Features
- Product search and instant filtering.
- Product detail view (modal on Home, sticky panel on Products).
- Contact section with mailto form and WhatsApp link.
- Fully responsive layout with custom styling.

## Pages
- Home: product search, highlights, testimonials, and contact section.
- Products: searchable product list with a sticky detail panel.
- About: brand story, owners, and services.

## Quick start
No build step is required.

1) Open index.html in your browser.
2) Optional: use the VS Code Live Server extension for local preview.

## Data source (Google Sheet)
Product data loads from a public Google Sheet via OpenSheet.

1) Create a Google Sheet with the following columns:
   - ID
   - Name
   - Description
   - Price
   - ImageURL
2) Publish the sheet to the web.
3) Replace the placeholder value in both files:
   - index.html
   - products.html

Set:
- `SHEET_ID = "YOUR_SHEET_ID"`

## Project structure
- index.html
- products.html
- about.html
- styles.css
- logo.png
- footer.jpeg

## Customization
- Update brand text, contact info, and social links directly in the HTML files.
- Replace logo.png and footer.jpeg with your own assets.
- Update the owner photos referenced on the about page (see Notes).

## Notes
- The about page references owner photos at `images/owner-1.jpg` and `images/owner-2.jpg`. Add those files or update the paths.
- All content is static HTML/CSS with vanilla JavaScript.

## Contributing
Issues and suggestions are welcome. For major changes, open an issue first to discuss what you would like to change.

## License
No license is included yet. Add one if you plan to distribute or open source this project.
