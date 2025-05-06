// src/scripts/addPlayAndLastPlayedInfo.ts

export async function addPlayAndLastPlayedInfo(document: Document) {
  const diffMap: Record<string, string> = {
    'music_basic_score_back': 'basic',
    'music_advanced_score_back': 'advanced',
    'music_expert_score_back': 'expert',
    'music_master_score_back': 'master',
    'music_remaster_score_back': 'remaster',
  };

  const blocks = Array.from(document.querySelectorAll('div[class*="_score_back"]'));
  console.log("🎵 Found", blocks.length, "music blocks");

  for (const block of blocks) {
    const form = block.querySelector<HTMLFormElement>('form[action*="musicDetail"]');
    const idx = form?.querySelector<HTMLInputElement>('input[name="idx"]')?.value;
    if (!idx) continue;

    const classList = Array.from(block.classList);
    const diffClass = classList.find((c) => c.endsWith('_score_back'));
    const diffId = diffMap[diffClass ?? ''] ?? 'master';

    try {
      const res = await fetch(`https://maimaidx-eng.com/maimai-mobile/record/musicDetail/?idx=${encodeURIComponent(idx)}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        console.warn('❌ Failed to fetch for idx =', idx);
        continue;
      }

      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const targetDiv = doc.querySelector<HTMLElement>(`#${diffId}`);
      if (!targetDiv) continue;

      let playCount = 'N/A';
      let lastPlayed = 'N/A';
      const tds = Array.from(targetDiv.querySelectorAll('td'));

      for (let i = 0; i < tds.length; i++) {
        const text = tds[i].textContent?.trim() ?? '';
        if (text.includes("PLAY COUNT")) playCount = tds[i + 1]?.textContent?.trim() ?? 'N/A';
        if (text.includes("Last played date")) lastPlayed = tds[i + 1]?.textContent?.trim() ?? 'N/A';
      }

      const outer = document.createElement('div');
      outer.className = 't_l';
      outer.style.marginTop = '4px';

      const playCountDiv = document.createElement('div');
      playCountDiv.className = 'music_score_block w_120 d_ib t_r f_12';
      playCountDiv.textContent = `🕹️ ${playCount} plays`;

      const lastPlayedDiv = document.createElement('div');
      lastPlayedDiv.className = 'music_score_block w_310 m_r_0 d_ib t_r f_12';
      lastPlayedDiv.textContent = `📅 ${lastPlayed}`;

      outer.appendChild(playCountDiv);
      outer.appendChild(lastPlayedDiv);
      block.appendChild(outer);

      await new Promise((resolve) => setTimeout(resolve, 400)); // prevent rate-limiting
    } catch (e) {
      console.error('❌ Error fetching for idx =', idx, e);
    }
  }
}
