(async function addPlayAndLastPlayedInfo(document: Document) {
  const rows = Array.from(document.querySelectorAll('form[action*="musicDetail"]'));

  for (const form of rows) {
    const idxInput = form.querySelector('input[name="idx"]') as HTMLInputElement;
    if (!idxInput) continue;
    const idx = idxInput.value;

    try {
      const res = await fetch(
        `https://maimaidx-eng.com/maimai-mobile/record/musicDetail/?idx=${encodeURIComponent(idx)}`,
        {
          credentials: 'include',
        }
      );
      if (!res.ok) {
        console.warn('Failed to fetch detail for idx:', idx);
        continue;
      }

      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const playCountTh = Array.from(doc.querySelectorAll('th')).find((el) =>
        el.textContent?.includes('PLAY COUNT')
      );
      const lastPlayedTh = Array.from(doc.querySelectorAll('th')).find((el) =>
        el.textContent?.includes('Last played date')
      );

      const playCount = playCountTh?.nextElementSibling?.textContent?.trim() ?? '-';
      const lastPlayed = lastPlayedTh?.nextElementSibling?.textContent?.trim() ?? '-';

      const container = document.createElement('div');
      container.className = 't_l';
      container.innerHTML = `
        <div class="music_score_block w_120 d_ib t_r f_12 last-played">${lastPlayed}</div>
        <div class="music_score_block w_310 m_r_0 d_ib t_r f_12 play-count">
          <img src="https://maimaidx-eng.com/maimai-mobile/img/icon_music.png" class="v_m f_l">
          ${playCount}
        </div>
      `;

      const wrapper = form.closest(
        '.music_master_score_back, .music_expert_score_back, .music_advanced_score_back, .music_remaster_score_back, .music_basic_score_back'
      );
      if (wrapper) {
        wrapper.appendChild(container);
      }

      // delay to avoid rate-limiting
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error('Error fetching detail for', idx, e);
    }
  }
})(document);
export {};
