// Fork-only (Admirable0531/mai-tools). Kept in its own file, with a one-line
// hook in song-database-factory.ts, so the daily upstream merge doesn't
// conflict with it.
import {isMaimaiNetOrigin} from '../game-region';
import {getMaiToolsBaseUrl, getScriptHost} from '../script-host';
import {SongDatabase, SongProperties} from '../song-props';

// Hand-made entries first, so they win over the generated ones.
const FILES = ['missing-songs.json', 'missing-songs-auto.json'];

/**
 * Where this fork's data lives. On maimai NET, getMaiToolsBaseUrl() is
 * upstream's site (it can't tell which copy of the scripts was loaded), which
 * has no data/fork/ files; the <script> tag that loaded us says which it was.
 */
function forkBaseUrl(): string {
  return isMaimaiNetOrigin(window.location.origin)
    ? getScriptHost('all-in-one')
    : getMaiToolsBaseUrl();
}

async function fetchSongs(url: string): Promise<SongProperties[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return [];
    }
    return (await response.json()).songs || [];
  } catch (e) {
    console.warn('Could not load ' + url, e);
    return [];
  }
}

/**
 * Adds songs from data/fork/ that the database doesn't already have.
 * Upstream's song data can lag a new chart by weeks, and a chart it doesn't
 * know is left out of the player's rating entirely. Songs upstream already
 * has are skipped, so its data wins as soon as it catches up.
 */
export async function addForkMissingSongs(database: SongDatabase): Promise<void> {
  const base = forkBaseUrl();
  const lists = await Promise.all(FILES.map((file) => fetchSongs(`${base}/data/fork/${file}`)));
  for (const song of lists.flat()) {
    if (database.hasSong(song.name, song.genre, song.dx)) {
      continue;
    }
    // A copy: insertOrUpdateSong applies regionOverrides by mutating the object.
    database.insertOrUpdateSong({...song, lv: [...song.lv]});
  }
}
