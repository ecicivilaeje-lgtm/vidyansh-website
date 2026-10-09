<?php
/*
 * Copy this file to config.php and fill in your hosting details.
 * On Hostinger: hPanel > Databases > MySQL Databases shows the name, user and host.
 */
return [
    // The live address of the website, without a slash at the end.
    'site_url' => 'https://www.example.com',

    // MySQL (live hosting). For a quick local test you can use 'sqlite' instead.
    'db' => [
        'driver' => 'mysql',
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'vidyansh',
        'user' => 'vidyansh_user',
        'pass' => 'change-me',
        // Used only when driver is 'sqlite'.
        'sqlite_path' => __DIR__ . '/storage/vidyansh.sqlite',
    ],

    // Show PHP errors on screen. Keep false on the live site.
    'debug' => false,

    // Where enquiry notifications are emailed (leave empty to only save them in the admin panel).
    'notify_email' => '',
];
