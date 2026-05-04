<?php
// PHP utility — array helpers
function array_pluck(array $arr, string $key): array {
    return array_map(fn($item) => $item[$key] ?? null, $arr);
}

function array_group_by(array $arr, string $key): array {
    $groups = [];
    foreach ($arr as $item) {
        $groups[$item[$key] ?? ''][] = $item;
    }
    return $groups;
}
