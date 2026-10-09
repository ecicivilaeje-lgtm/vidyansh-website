<?php
/**
 * Database access. Content lives in two tables:
 *  - entries: rows of a collection (courses, test series, blog posts...), each row's fields stored as JSON
 *  - blocks:  one JSON document per page or section (site settings, about page, homepage copy...)
 * plus enquiries (form submissions) and admins.
 */

function db(): PDO
{
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = config('db');
    if (!$c) throw new RuntimeException('Missing config.php');
    if (($c['driver'] ?? 'mysql') === 'sqlite') {
        $pdo = new PDO('sqlite:' . $c['sqlite_path']);
        $pdo->exec('PRAGMA foreign_keys = ON');
    } else {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $c['host'], $c['port'] ?? 3306, $c['name']);
        $pdo = new PDO($dsn, $c['user'], $c['pass']);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
}

function db_is_sqlite(): bool
{
    return (config('db')['driver'] ?? 'mysql') === 'sqlite';
}

/** Creates the tables if they do not exist. Safe to run more than once. */
function db_migrate(): void
{
    $sqlite = db_is_sqlite();
    $id = $sqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY';
    $text = $sqlite ? 'TEXT' : 'LONGTEXT';
    $tail = $sqlite ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';
    $stmts = [
        "CREATE TABLE IF NOT EXISTS entries (
            id $id,
            collection VARCHAR(64) NOT NULL,
            slug VARCHAR(191) NOT NULL,
            position INT NOT NULL DEFAULT 0,
            published SMALLINT NOT NULL DEFAULT 1,
            data $text NOT NULL,
            created_at VARCHAR(19) NOT NULL,
            updated_at VARCHAR(19) NOT NULL
        )$tail",
        "CREATE TABLE IF NOT EXISTS blocks (
            name VARCHAR(64) NOT NULL PRIMARY KEY,
            data $text NOT NULL,
            updated_at VARCHAR(19) NOT NULL
        )$tail",
        "CREATE TABLE IF NOT EXISTS enquiries (
            id $id,
            name VARCHAR(191) NOT NULL DEFAULT '',
            phone VARCHAR(64) NOT NULL DEFAULT '',
            email VARCHAR(191) NOT NULL DEFAULT '',
            subject VARCHAR(191) NOT NULL DEFAULT '',
            message $text,
            data $text,
            status VARCHAR(16) NOT NULL DEFAULT 'new',
            created_at VARCHAR(19) NOT NULL
        )$tail",
        "CREATE TABLE IF NOT EXISTS admins (
            id $id,
            name VARCHAR(191) NOT NULL,
            email VARCHAR(191) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at VARCHAR(19) NOT NULL,
            last_login_at VARCHAR(19) NULL
        )$tail",
    ];
    foreach ($stmts as $sql) db()->exec($sql);
    // Unique indexes (portable syntax differs for IF NOT EXISTS on MySQL, so check first).
    $indexes = [
        ['entries', 'entries_collection_slug', 'collection, slug', true],
        ['admins', 'admins_email', 'email', true],
    ];
    foreach ($indexes as [$table, $name, $cols, $unique]) {
        if ($sqlite) {
            db()->exec(sprintf('CREATE %sINDEX IF NOT EXISTS %s ON %s (%s)', $unique ? 'UNIQUE ' : '', $name, $table, $cols));
        } else {
            $exists = db()->query("SHOW INDEX FROM $table WHERE Key_name = " . db()->quote($name))->fetch();
            if (!$exists) db()->exec(sprintf('CREATE %sINDEX %s ON %s (%s)', $unique ? 'UNIQUE ' : '', $name, $table, $cols));
        }
    }
}

function now_str(): string
{
    return date('Y-m-d H:i:s');
}

/* ---------------- Entries (collections) ---------------- */

/** All rows of a collection in display order. Each row's fields, plus _id, _slug, _published. */
function entries(string $collection, bool $includeDrafts = false): array
{
    static $cache = [];
    $key = $collection . ($includeDrafts ? ':all' : '');
    if (isset($cache[$key])) return $cache[$key];
    $sql = 'SELECT id, slug, position, published, data FROM entries WHERE collection = ?' . ($includeDrafts ? '' : ' AND published = 1') . ' ORDER BY position, id';
    $st = db()->prepare($sql);
    $st->execute([$collection]);
    $rows = [];
    foreach ($st as $r) $rows[] = entry_decode($r);
    return $cache[$key] = $rows;
}

function entry_decode(array $r): array
{
    $data = json_decode($r['data'], true) ?: [];
    $data['_id'] = (int) $r['id'];
    $data['_slug'] = $r['slug'];
    $data['_published'] = (int) $r['published'] === 1;
    $data['_position'] = (int) $r['position'];
    return $data;
}

function entry_by_id(int $id): ?array
{
    $st = db()->prepare('SELECT * FROM entries WHERE id = ?');
    $st->execute([$id]);
    $r = $st->fetch();
    return $r ? entry_decode($r) + ['_collection' => $r['collection']] : null;
}

function entry_strip(array $data): array
{
    foreach (array_keys($data) as $k) if (is_string($k) && str_starts_with($k, '_')) unset($data[$k]);
    return $data;
}

function entry_save(string $collection, string $slug, array $data, ?int $id = null, ?bool $published = null, ?int $position = null): int
{
    $json = json_encode(entry_strip($data), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($id) {
        $sets = 'slug = ?, data = ?, updated_at = ?';
        $args = [$slug, $json, now_str()];
        if ($published !== null) { $sets .= ', published = ?'; $args[] = $published ? 1 : 0; }
        if ($position !== null) { $sets .= ', position = ?'; $args[] = $position; }
        $args[] = $id;
        db()->prepare("UPDATE entries SET $sets WHERE id = ?")->execute($args);
        return $id;
    }
    if ($position === null) {
        $st = db()->prepare('SELECT COALESCE(MAX(position), 0) + 1 FROM entries WHERE collection = ?');
        $st->execute([$collection]);
        $position = (int) $st->fetchColumn();
    }
    db()->prepare('INSERT INTO entries (collection, slug, position, published, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        ->execute([$collection, $slug, $position, ($published ?? true) ? 1 : 0, $json, now_str(), now_str()]);
    return (int) db()->lastInsertId();
}

function entry_delete(int $id): void
{
    db()->prepare('DELETE FROM entries WHERE id = ?')->execute([$id]);
}

/* ---------------- Blocks (single documents) ---------------- */

function block(string $name): array
{
    static $cache = [];
    if (isset($cache[$name])) return $cache[$name];
    $st = db()->prepare('SELECT data FROM blocks WHERE name = ?');
    $st->execute([$name]);
    $json = $st->fetchColumn();
    return $cache[$name] = $json ? (json_decode($json, true) ?: []) : [];
}

function block_save(string $name, array $data): void
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $st = db()->prepare('SELECT COUNT(*) FROM blocks WHERE name = ?');
    $st->execute([$name]);
    if ($st->fetchColumn()) {
        db()->prepare('UPDATE blocks SET data = ?, updated_at = ? WHERE name = ?')->execute([$json, now_str(), $name]);
    } else {
        db()->prepare('INSERT INTO blocks (name, data, updated_at) VALUES (?, ?, ?)')->execute([$name, $json, now_str()]);
    }
}
