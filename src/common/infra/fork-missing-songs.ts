// Fork-only (Admirable0531/mai-tools). Kept in its own file, with a one-line
// hook in song-database-factory.ts, so the daily upstream merge doesn't
// conflict with it.
import {getMaiToolsBaseUrl} from '../script-host';
import {SongDatabase, SongProperties} from '../song-props';

/**
 * Adds songs from data/fork/missing-songs.json that the database doesn't
 * already have. Upstream's song data can lag a new chart by weeks, and a
 * chart it doesn't know is left out of the player's rating entirely. Songs
 * upstream already has are skipped, so its data wins as soon as it catches up.
 */
export async function addForkMissingSongs(database: SongDatabase): Promise<void> {
  let songs: SongProperties[] = [];
  try {
    const response = await fetch(`${getMaiToolsBaseUrl()}/data/fork/missing-songs.json`);
    if (!response.ok) {
      return;
    }
    songs = (await response.json()).songs || [];
  } catch (e) {
    console.warn('Could not load fork missing-songs.json', e);
    return;
  }
  for (const song of songs) {
    if (database.hasSong(song.name, song.genre, song.dx)) {
      continue;
    }
    // A copy: insertOrUpdateSong applies regionOverrides by mutating the object.
    database.insertOrUpdateSong({...song, lv: [...song.lv]});
  }
}
