<?php
/**
 * Fills an empty database with the website's current content (database/seed/*.json,
 * exported from the original site). Run once by the installer.
 */

function seed_database(): void
{
    $dir = ROOT . '/database/seed';
    $files = [];
    foreach (CONTENT_FILES as $f) $files[$f] = json_decode(file_get_contents("$dir/$f.json"), true);

    // Reshape a few exports into the stored form.
    $journey = array_column($files['exams']['exams'], 'code');
    foreach ($files['exams']['examRoutes'] as &$e) $e['inJourney'] = in_array($e['code'], $journey, true);
    unset($e, $files['exams']['exams']);

    $files['test-series']['papers'] = [$files['test-series']['samplePaper']];
    unset($files['test-series']['samplePaper']);

    $features = [];
    foreach ($files['results']['storyFeatures'] as $f) { $id = $f['storyId']; unset($f['storyId']); $features[$id] = $f; }
    foreach ($files['results']['results']['stories'] as &$s) $s['feature'] = $features[$s['id']] ?? null;
    unset($s, $files['results']['storyFeatures']);

    $files['free-classes']['liveClasses'] = $files['free-classes']['nextLiveClass'] ? [$files['free-classes']['nextLiveClass']] : [];
    unset($files['free-classes']['nextLiveClass']);

    foreach ($files['blog']['blogPosts'] as &$p) {
        $html = "$dir/blog/{$p['slug']}.html";
        $p['html'] = is_file($html) ? file_get_contents($html) : '';
    }
    unset($p);

    $files['faculty']['facultyMembers'] = [];

    // Split collections out of each file; the rest is the file's block.
    foreach (CONTENT_COLLECTIONS as $collection => [$file, $path, $slugKey]) {
        $rows = array_get_path($files[$file], $path) ?? [];
        array_unset_path($files[$file], $path);
        foreach (array_values($rows) as $i => $row) {
            $slug = $slugKey && !empty($row[$slugKey]) ? (string) $row[$slugKey] : $collection . '-' . ($i + 1);
            entry_save($collection, $slug, $row, null, true, $i + 1);
        }
    }
    foreach ($files as $file => $data) block_save($file, $data);
}
