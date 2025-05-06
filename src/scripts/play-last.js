"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
(function addPlayAndLastPlayedInfo(document) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const rows = Array.from(document.querySelectorAll('form[action*="musicDetail"]'));
        for (const form of rows) {
            const idxInput = form.querySelector('input[name="idx"]');
            if (!idxInput)
                continue;
            const idx = idxInput.value;
            try {
                const res = yield fetch(`https://maimaidx-eng.com/maimai-mobile/record/musicDetail/?idx=${encodeURIComponent(idx)}`, {
                    credentials: 'include',
                });
                if (!res.ok) {
                    console.warn('Failed to fetch detail for idx:', idx);
                    continue;
                }
                const html = yield res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const playCountTh = Array.from(doc.querySelectorAll('th')).find((el) => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('PLAY COUNT'); });
                const lastPlayedTh = Array.from(doc.querySelectorAll('th')).find((el) => { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Last played date'); });
                const playCount = (_c = (_b = (_a = playCountTh === null || playCountTh === void 0 ? void 0 : playCountTh.nextElementSibling) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '-';
                const lastPlayed = (_f = (_e = (_d = lastPlayedTh === null || lastPlayedTh === void 0 ? void 0 : lastPlayedTh.nextElementSibling) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : '-';
                const container = document.createElement('div');
                container.className = 't_l';
                container.innerHTML = `
        <div class="music_score_block w_120 d_ib t_r f_12 last-played">${lastPlayed}</div>
        <div class="music_score_block w_310 m_r_0 d_ib t_r f_12 play-count">
          <img src="https://maimaidx-eng.com/maimai-mobile/img/icon_music.png" class="v_m f_l">
          ${playCount}
        </div>
      `;
                const wrapper = form.closest('.music_master_score_back, .music_expert_score_back, .music_advanced_score_back, .music_remaster_score_back, .music_basic_score_back');
                if (wrapper) {
                    wrapper.appendChild(container);
                }
                // delay to avoid rate-limiting
                yield new Promise((r) => setTimeout(r, 300));
            }
            catch (e) {
                console.error('Error fetching detail for', idx, e);
            }
        }
    });
})(document);
