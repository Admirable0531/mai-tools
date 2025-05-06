"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./styles.css");
const net_helpers_1 = require("../common/net-helpers");
const localizePage_1 = require("./localizePage");
(function () {
    (0, localizePage_1.performLocalization)();
    const BASE_SCORE_PER_TYPE = {
        tap: 500,
        hold: 1000,
        touch: 500,
        slide: 1500,
        break: 2500,
    };
    const STD_NOTE_TYPES = ['tap', 'hold', 'slide', 'break'];
    const DX_NOTE_TYPES = [
        'tap',
        'hold',
        'slide',
        'touch',
        'break',
    ];
    const inputElem = document.querySelector('.input');
    const analyzeBtn = document.getElementById('analyze');
    const convertBtn = document.getElementById('convert');
    const WIKI_URL_PREFIX = 'https://maimai.fandom.com/zh/wiki/';
    const WIKI_URL_SUFFIX = '?variant=zh-hant';
    const JUDGEMENTS_LEN = 5;
    const ZERO_JUDGEMENT = [0, 0, 0, 0, 0];
    function calculatePctPerNote(countPerType) {
        let totalBaseScore = 0;
        for (const nt of DX_NOTE_TYPES) {
            if (countPerType[nt]) {
                totalBaseScore += countPerType[nt] * BASE_SCORE_PER_TYPE[nt];
            }
        }
        const pctPerNoteType = new Map();
        const pctPerTap = (100 * 500) / totalBaseScore;
        const bonusPctPerBreak = 1 / countPerType.break;
        pctPerNoteType.set('tap', pctPerTap);
        pctPerNoteType.set('hold', pctPerTap * 2);
        pctPerNoteType.set('slide', pctPerTap * 3);
        pctPerNoteType.set('touch', pctPerTap);
        pctPerNoteType.set('breakDx', pctPerTap * 5 + bonusPctPerBreak);
        pctPerNoteType.set('break', pctPerTap * 5.2);
        let finaleMaxAchv = (100 * 100 * countPerType.break) / totalBaseScore;
        finaleMaxAchv = Math.floor(finaleMaxAchv * 100) / 100;
        finaleMaxAchv += 100;
        return [pctPerNoteType, finaleMaxAchv];
    }
    function trimSpaces(textLine) {
        return textLine.trim().replace(/\s+/g, '-');
    }
    function parseNumArrayFromText(line, fallback) {
        const textArr = line.match(/\d+/g);
        return textArr ? textArr.map((num) => parseInt(num, 10)) : fallback;
    }
    function analyzeNoteDetails(songTitle, judgements) {
        if (judgements.length >= 4) {
            // update song title UI
            const songTitleElem = document.getElementById('songTitle');
            songTitleElem.innerText = songTitle || '';
            songTitleElem.href = WIKI_URL_PREFIX + encodeURIComponent(songTitle) + WIKI_URL_SUFFIX;
            const noteTypes = judgements.length === 4 ? STD_NOTE_TYPES : DX_NOTE_TYPES;
            const judgementsPerType = new Map();
            judgements.forEach((j, idx) => {
                judgementsPerType.set(noteTypes[idx], j);
            });
            // Update chart info UI
            const countPerType = {
                tap: 0,
                hold: 0,
                slide: 0,
                touch: 0,
                break: 0,
            };
            const totalNoteCount = DX_NOTE_TYPES.reduce((total, noteType) => {
                const playerJ = judgementsPerType.get(noteType) || [];
                const noteCount = playerJ.reduce((acc, c) => acc + c, 0);
                countPerType[noteType] = noteCount;
                if (noteType === 'touch') {
                    document
                        .querySelector('.touchRow')
                        .classList[noteCount === 0 ? 'add' : 'remove']('hidden');
                }
                document.getElementById(`${noteType}Count`).innerText = noteCount.toString();
                return total + noteCount;
            }, 0);
            document.getElementById('totalNoteCount').innerText = totalNoteCount.toString();
            // Do some crazy math
            const [pctPerNoteType, finaleMaxAchv] = calculatePctPerNote(countPerType);
            // Update chart info - percentage per note type
            pctPerNoteType.forEach((pct, nt) => {
                nt = nt.charAt(0).toUpperCase() + nt.substring(1);
                let elem;
                switch (nt) {
                    case 'Break':
                        elem = document.getElementById('finalePctPerBreak');
                        elem.innerText += pct.toFixed(2);
                        break;
                    case 'BreakDx':
                        elem = document.getElementById('dxPctPerBreak');
                        elem.innerText = pct.toFixed(4);
                        break;
                    default:
                        elem = document.getElementById('pctPer' + nt);
                        elem.innerText = pct.toFixed(2);
                        break;
                }
                elem.innerText += '%';
            });
            document.getElementById('finaleMaxAchv').innerText = finaleMaxAchv.toFixed(2) + '%';
        }
    }
    function parseJudgement(text) {
        let lines = text.split('_');
        if (lines.length < 5) {
            lines = text.split('\n');
        }
        const breakJ = parseNumArrayFromText(lines.pop(), undefined);
        // zeroJ is a placeholder for non-existent note types
        const zeroJ = ZERO_JUDGEMENT.slice(0, breakJ.length);
        const touchJ = parseNumArrayFromText(lines.pop(), undefined);
        const slideJ = parseNumArrayFromText(lines.pop(), zeroJ);
        const holdJ = parseNumArrayFromText(lines.pop(), zeroJ);
        const tapJ = parseNumArrayFromText(lines.pop(), zeroJ);
        const judgements = [tapJ, holdJ, slideJ, breakJ];
        if (touchJ) {
            judgements.splice(3, 0, touchJ);
        }
        return judgements;
    }
    /**
     * @param query URLSearchParams to add to the destination URL.
     */
    function handleButtonClick(baseUrl, query) {
        const lines = inputElem.value.split('\n');
        if (lines.length < 6) {
            return;
        }
        // Parse from the last line
        while (lines.length) {
            const currentLine = lines.pop();
            if (currentLine.includes('✦')) {
                // Ignore DX star info
                continue;
            }
            if (!query.has("nd" /* QueryParam.NoteDetails */)) {
                const judgements = currentLine.match(/\d+/g);
                if (judgements &&
                    judgements.length >= JUDGEMENTS_LEN - 1 &&
                    judgements.length <= JUDGEMENTS_LEN) {
                    let noteDetails = trimSpaces(currentLine);
                    for (let i = 0; i < DX_NOTE_TYPES.length - 1; i++) {
                        noteDetails = trimSpaces(lines.pop()) + '_' + noteDetails;
                    }
                    query.set("nd" /* QueryParam.NoteDetails */, noteDetails);
                    continue;
                }
            }
            const achievementMatch = currentLine.match(/(\d+\.\d+)%/);
            if (achievementMatch) {
                query.set("ac" /* QueryParam.Achievement */, achievementMatch[1]);
                query.set("st" /* QueryParam.SongTitle */, lines.pop());
                continue;
            }
            const trackIndex = currentLine.indexOf('TRACK 0');
            if (trackIndex >= 0) {
                query.set("tk" /* QueryParam.Track */, 'TRACK ' + currentLine.substring(trackIndex + 7, trackIndex + 8));
                query.set("dt" /* QueryParam.Date */, String((0, net_helpers_1.getEpochTimeFromText)(currentLine)));
            }
        }
        if (query.has("st" /* QueryParam.SongTitle */) &&
            query.has("ac" /* QueryParam.Achievement */) &&
            query.has("nd" /* QueryParam.NoteDetails */)) {
            const newUrl = baseUrl + '?' + query;
            console.log(newUrl);
            window.location.assign(newUrl);
        }
    }
    analyzeBtn.addEventListener('click', () => {
        handleButtonClick(document.location.origin + document.location.pathname, new URLSearchParams());
    });
    convertBtn.addEventListener('click', () => {
        handleButtonClick('../classic-layout/', 
        // GameVersion: 10 because
        // 1) MiLK has the best BGM and waifus (just kidding)
        // 2) I want to force classic layout to use old score system
        new URLSearchParams({ ["gameVersion" /* QueryParam.GameVersion */]: '10' }));
    });
    // Handle parameters from URL
    const searchParams = new URLSearchParams(document.location.search);
    let shouldShowInput = true;
    const songTitle = searchParams.get("st" /* QueryParam.SongTitle */);
    const noteDetail = searchParams.get("nd" /* QueryParam.NoteDetails */);
    if (songTitle && noteDetail) {
        document.title = `${songTitle} - ${document.title}`;
        const judgements = parseJudgement(noteDetail);
        analyzeNoteDetails(songTitle, judgements);
        shouldShowInput = false;
    }
    document.getElementById('resetLink').classList[shouldShowInput ? 'add' : 'remove']('hidden');
    document.getElementById('inputContainer').classList[shouldShowInput ? 'remove' : 'add']('hidden');
})();
