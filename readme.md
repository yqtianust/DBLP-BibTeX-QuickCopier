# DBLP BibTeX Copier

A handy tool to add a small clipboard button before each publication title on DBLP author pages, enabling quick copying of BibTeX entries.

This project contains **two versions** of the tool:

- **Chrome Extension** — located in the [`chrome-extension/`](./chrome-extension) folder
- **Tampermonkey Userscript** — located in the [`tampermonkey/`](./tampermonkey) folder

---

## Features

- Adds a compact 📋 icon button next to each publication title on DBLP author pages
- Clicking the button copies the BibTeX entry for that publication to your clipboard
- Works on any DBLP author profile page URL matching `https://dblp.org/*`
- Lightweight and unobtrusive UI

---

## Installation

### Chrome Extension

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top right)
3. Click **Load unpacked** and select the [`chrome-extension/`](./chrome-extension/) folder
4. Visit a DBLP author page (e.g., `https://dblp.org/pid/180/5774-1.html`) to see the copy buttons

### Tampermonkey Userscript

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser (Chrome, Firefox, Edge, etc.)
2. Open the [`tampermonkey/dblp-copy-bibtex.user.js`](./tampermonkey/dblp-bibtex-quickcopier.user.js) file in your browser or import it via Tampermonkey dashboard
3. Visit a DBLP author page to use the copy buttons

---

## Usage

Simply click the 📋 button next to any publication title to copy its BibTeX entry to your clipboard.

---

## Development & Contribution

Feel free to fork the repo, submit issues, or create pull requests!

The project is structured to allow easy improvements or adaptations.

---

## License

This project is licensed under the GNU License. See the [LICENSE](./LICENSE) file for details.

---

## Author

Yongqiang Tian — [Homepage](https://yqtian.com)

---

## Acknowledgments

- Data source: [DBLP Computer Science Bibliography](https://dblp.org)

