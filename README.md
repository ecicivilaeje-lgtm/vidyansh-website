# Vidyansh website (PHP)

The Vidyansh website, "By Shubham Sir · From Dream to Destination", with an admin panel to edit everything.
Plain PHP 8.1+ and MySQL, so it runs on ordinary shared hosting (Hostinger, cPanel) with no build step.

## Put it online (Hostinger)

1. **Make a database.** hPanel › Databases › MySQL Databases. Create a database and a user, and note the database name, user and password.
2. **Upload the files.** hPanel › File Manager › `public_html`. Upload `vidyansh-php.zip`, right-click it › Extract, and move everything inside so that `index.php` sits directly in `public_html`. Delete the zip.
3. **Run the installer.** Open your domain in the browser. The installer opens by itself:
   - step 1: database name, user, password (host stays `localhost`), your website address, and an email for new enquiries;
   - step 2: your name, email and a password for the admin panel.
4. **Sign in** at `https://your-domain/admin`.

PHP version: hPanel › Advanced › PHP Configuration › 8.1 or newer (8.2/8.3 recommended).
Turn on the free SSL certificate in hPanel › Security › SSL so the site opens on https.

If the installer says it cannot save `config.php`, it shows the text to paste: create `config.php` next to `index.php` in File Manager, paste, save, reload.

## Using the admin panel

- **Courses, Test series, Tests, Question papers, Results board, Success stories, Faculty members, Blog posts, Study material, Live classes, Programme, Recorded lectures, Notices**: lists. Add, edit, duplicate, hide/show, reorder (↑ ↓), delete.
- **Contact details & menus, Homepage texts, Results settings, page texts, Policies**: one form each.
- **Enquiries**: every contact-form message, with Call / WhatsApp / Email buttons, "Mark as done", and a CSV download that opens in Excel.
- **Password & admins**: change your password, give someone else a login.
- Photos (JPG/PNG/WebP) and PDFs upload straight from the forms into `uploads/`.
- Blog posts have a writing editor, or upload a ready `.html` file.

Never publish results without the student's consent. Untick "Is sample" in Results settings once real results are in.

## Backups

Download the database from hPanel › Databases › phpMyAdmin › Export, and the `uploads/` folder from File Manager. Hostinger also keeps automatic backups.

## For developers

```
index.php            front controller (routes)          templates/pages/      one template per page
app/bootstrap.php    config, helpers, session          templates/sections/   homepage sections
app/db.php           PDO, tables, entries & blocks     templates/components/ shared pieces
app/content.php      content('<file>') + get_*()       templates/admin/      admin panel screens
app/admin/           admin router, schema, forms        assets/js/            vanilla JS per feature
app/enquiry.php      contact form backend               assets/css/site.css   compiled Tailwind (committed)
app/install.php      first-run installer               database/seed/        original content (JSON)
```

- Content is stored as JSON in two tables: `entries` (rows of a collection) and `blocks` (one document per page/section). `content('courses')` returns the same shape the original Next.js `content/courses.ts` exported.
- What the admin can edit, and how each field looks, is defined in `app/admin/schema.php`.
- After changing templates or JS, rebuild the CSS: `npm install && npm run css` (Tailwind v4 CLI). The live server never needs Node.
- Local run with SQLite: copy `config.sample.php` to `config.php`, set `'driver' => 'sqlite'`, run `php database/install-cli.php --fresh you@example.com yourpassword "Your Name"`, then `php -S localhost:8000 router.php`.
- `tools/compare.js` compares a page with the original Next.js build (used during the port).
- The article editor is TinyMCE 7 (GPL), bundled in `assets/vendor/tinymce`.
