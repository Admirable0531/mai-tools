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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./recent-play-downloader.css");
const dom_to_image_1 = __importDefault(require("dom-to-image"));
const date_util_1 = require("../common/date-util");
const difficulties_1 = require("../common/difficulties");
const game_region_1 = require("../common/game-region");
const lang_1 = require("../common/lang");
const level_helper_1 = require("../common/level-helper");
const net_helpers_1 = require("../common/net-helpers");
const play_history_1 = require("../common/play-history");
const song_name_helper_1 = require("../common/song-name-helper");
const song_props_1 = require("../common/song-props");
var Column;
(function (Column) {
    Column[Column["DATE"] = 0] = "DATE";
    Column[Column["SONG"] = 1] = "SONG";
    Column[Column["LV"] = 2] = "LV";
    Column[Column["ACHV"] = 3] = "ACHV";
    Column[Column["MARKS"] = 4] = "MARKS";
})(Column || (Column = {}));
(function (d) {
    const LANG = (0, lang_1.getInitialLanguage)();
    const UIString = {
        ["zh-TW" /* Language.zh_TW */]: {
            date: '日期',
            songName: '歌曲',
            difficulty: '難度',
            level: '等級',
            achievement: '達成率',
            marks: '成就',
            playDate: '遊玩日期：',
            newRecordToggleHeading: '顯示：',
            sortBy: '排序方式：',
            newRecordsOnly: '只顯示新高分紀錄',
            allRecords: '全部',
            olderFirst: '由舊到新',
            newerFirst: '由新到舊',
            copy: '複製',
            copied: '已複製到剪貼簿',
            downloadAsImage: '存成圖片',
        },
        ["en-US" /* Language.en_US */]: {
            date: 'Date',
            songName: 'Song',
            difficulty: 'Difficulty',
            level: 'Lv',
            achievement: 'Achv',
            marks: 'Marks',
            playDate: 'Play date:',
            newRecordToggleHeading: 'Display:',
            sortBy: 'Sort by:',
            newRecordsOnly: 'New records only',
            allRecords: 'All',
            olderFirst: 'Older first',
            newerFirst: 'Newer first',
            copy: 'Copy',
            copied: 'Copied to clipboard',
            downloadAsImage: 'Save as image',
        },
        ["ko-KR" /* Language.ko_KR */]: {
            date: '날짜',
            songName: '노래',
            difficulty: '난이도',
            level: '레벨',
            achievement: '정확도',
            marks: '성취도',
            playDate: '플레이 일:',
            newRecordToggleHeading: '표시:',
            sortBy: '정렬 순서:',
            newRecordsOnly: '새 기록만',
            allRecords: '전부',
            olderFirst: '옛날 기록부터',
            newerFirst: '최근 기록부터',
            copy: '복사',
            copied: '클립보드에 복사되었습니다',
            downloadAsImage: '이미지로 저장하기',
        },
    }[LANG];
    const DATE_CHECKBOX_CLASSNAME = 'dateCheckbox';
    const NEW_RECORD_RADIO_NAME = 'newRecordRadio';
    const SORT_BY_RADIO_NAME = 'sortByRadio';
    const SCORE_RECORD_ROW_CLASSNAME = 'recordRow';
    const SCORE_RECORD_CELL_BASE_CLASSNAME = 'recordCell';
    const SCORE_RECORD_CELL_CLASSNAME_BY_COL = {
        [Column.DATE]: 'dateCell',
        [Column.SONG]: 'songTitleCell',
        [Column.LV]: 'lvCell',
        [Column.ACHV]: 'achievementCell',
        [Column.MARKS]: 'marksCell',
    };
    const ce = d.createElement.bind(d);
    const tableHeadCellRenderer = {
        [Column.DATE]: () => {
            const cell = ce('th');
            cell.append(UIString.date);
            return cell;
        },
        [Column.SONG]: () => {
            const cell = ce('th');
            cell.append(UIString.songName);
            return cell;
        },
        [Column.LV]: () => {
            const cell = ce('th');
            cell.append(UIString.level);
            return cell;
        },
        [Column.ACHV]: () => {
            const cell = ce('th');
            cell.append(UIString.achievement);
            return cell;
        },
        [Column.MARKS]: () => {
            const cell = ce('th');
            cell.append(UIString.marks);
            return cell;
        },
    };
    const tableBodyCellRenderer = {
        [Column.DATE]: (record) => {
            const cell = ce('td');
            cell.append((0, date_util_1.formatDate)(record.date));
            return cell;
        },
        [Column.SONG]: (record, songDb) => {
            const cell = ce('td');
            cell.classList.add('songImg');
            cell.style.backgroundImage = `url("${record.songImgSrc}")`;
            const nickname = songDb.hasDualCharts(record.songName)
                ? (0, song_name_helper_1.getSongNicknameWithChartType)(record.songName, record.genre, record.chartType)
                : record.songName;
            cell.append(nickname);
            return cell;
        },
        [Column.LV]: (record) => {
            const cell = ce('td');
            cell.append((0, level_helper_1.getDisplayLv)(record.level, record.difficulty === 5 /* Difficulty.UTAGE */));
            return cell;
        },
        [Column.ACHV]: (record) => {
            const cell = ce('td');
            // Avoid <br> to keep it copyable as TSV.
            const rankSpan = document.createElement('span');
            rankSpan.className = 'd_b';
            rankSpan.append(record.rank);
            cell.append(rankSpan, '\t', record.achievement.toFixed(4) + '%');
            return cell;
        },
        [Column.MARKS]: (record) => {
            const cell = ce('td');
            cell.append(record.marks);
            return cell;
        },
    };
    function renderScoreHeadRow(columns) {
        const tr = ce('tr');
        tr.classList.add(SCORE_RECORD_ROW_CLASSNAME);
        columns.forEach((col) => {
            const cell = tableHeadCellRenderer[col]();
            cell.classList.add(SCORE_RECORD_CELL_BASE_CLASSNAME);
            cell.classList.add(SCORE_RECORD_CELL_CLASSNAME_BY_COL[col]);
            tr.append(cell);
        });
        return tr;
    }
    function renderScoreRow(columns, record, songDb) {
        const tr = ce('tr');
        tr.classList.add(SCORE_RECORD_ROW_CLASSNAME);
        tr.classList.add((0, difficulties_1.getDifficultyClassName)(record.difficulty));
        columns.forEach((col) => {
            const cell = tableBodyCellRenderer[col](record, songDb);
            cell.classList.add(SCORE_RECORD_CELL_BASE_CLASSNAME);
            const colClassName = SCORE_RECORD_CELL_CLASSNAME_BY_COL[col];
            cell.classList.add(colClassName);
            tr.append(cell);
        });
        return tr;
    }
    function renderTopScores(records, songDb, container, thead, tbody) {
        const columns = [Column.DATE, Column.SONG, Column.LV, Column.ACHV, Column.MARKS];
        thead.innerHTML = '';
        tbody.innerHTML = '';
        thead.append(renderScoreHeadRow(columns));
        records.forEach((r) => {
            tbody.append(renderScoreRow(columns, r, songDb));
        });
        container.style.paddingBottom = Math.floor(records.length / 2) + 2 + 'px';
    }
    function getSelectedDates() {
        const dateOptions = d.querySelectorAll('input.' + DATE_CHECKBOX_CLASSNAME);
        const selectedDates = new Set();
        dateOptions.forEach((op) => {
            if (op.checked) {
                selectedDates.add(op.value);
            }
        });
        return selectedDates;
    }
    function getFilterAndOptions() {
        const selectedDates = getSelectedDates();
        let showAllRecords = false;
        const newRecordRadios = d.getElementsByName(NEW_RECORD_RADIO_NAME);
        newRecordRadios.forEach((r) => {
            if (r.checked) {
                showAllRecords = r.value === 'allRecords';
            }
        });
        let olderFirst = true;
        const sortByRadios = d.getElementsByName(SORT_BY_RADIO_NAME);
        sortByRadios.forEach((r) => {
            if (r.checked) {
                olderFirst = r.value === 'olderFirst';
            }
        });
        return { dates: selectedDates, showAll: showAllRecords, olderFirst };
    }
    function filterRecords(allRecords, options) {
        let records = allRecords.slice();
        console.log(options);
        if (options.dates) {
            records = records.filter((r) => {
                return options.dates.has((0, date_util_1.formatDate)(r.date).split(' ')[0]);
            });
        }
        if (options.showAll) {
            return options.olderFirst ? records.reverse() : records;
        }
        // Keep the best record for each song + chart type + difficulty
        records.reverse(); // oldest -> newest, so newer records can overwrite older ones.
        const nameRecordMap = new Map();
        records.forEach((r) => {
            if (r.isNewRecord) {
                const mapKey = r.songName + '\t' + r.chartType + '\t' + r.difficulty;
                nameRecordMap.delete(mapKey);
                nameRecordMap.set(mapKey, r);
            }
        });
        records = [];
        nameRecordMap.forEach((r) => {
            records.push(r);
        });
        return options.olderFirst ? records : records.reverse();
    }
    function createDateOptions(playDates, onChange) {
        const div = ce('div');
        div.className = 'm_b_10 dateOptionsContainer';
        const heading = ce('div');
        heading.className = 't_c m_5';
        heading.append(UIString.playDate);
        div.append(heading);
        playDates.forEach((d) => {
            const label = ce('label');
            label.className = 'f_14 dateOptionLabel';
            const checkbox = ce('input');
            checkbox.type = 'checkbox';
            checkbox.className = DATE_CHECKBOX_CLASSNAME;
            checkbox.value = d;
            checkbox.checked = true;
            checkbox.addEventListener('change', onChange);
            label.append(checkbox, d);
            div.append(label);
        });
        return div;
    }
    function createNewRecordToggle(onChange) {
        const div = ce('div');
        div.className = 'm_b_10 newRecordToggleContainer';
        const heading = ce('div');
        heading.className = 't_c m_5';
        heading.append(UIString.newRecordToggleHeading);
        div.append(heading);
        ['newRecordsOnly', 'allRecords'].forEach((op, idx) => {
            const label = ce('label');
            label.className = 'f_14 newRecordLabel';
            const input = ce('input');
            input.type = 'radio';
            input.name = NEW_RECORD_RADIO_NAME;
            input.className = NEW_RECORD_RADIO_NAME;
            input.value = op;
            input.checked = idx === 0;
            input.addEventListener('change', onChange);
            label.append(input, UIString[op]);
            div.append(label);
        });
        return div;
    }
    function createSortByRadio(onChange) {
        const div = ce('div');
        div.className = 'm_b_10 sortByRadioContainer';
        const heading = ce('div');
        heading.className = 't_c m_5';
        heading.append(UIString.sortBy);
        div.append(heading);
        ['newerFirst', 'olderFirst'].forEach((op, idx) => {
            const label = ce('label');
            label.className = 'f_14 sortByLabel';
            const input = ce('input');
            input.type = 'radio';
            input.name = SORT_BY_RADIO_NAME;
            input.className = SORT_BY_RADIO_NAME;
            input.value = op;
            input.checked = idx === 0;
            input.addEventListener('change', onChange);
            label.append(input, UIString[op]);
            div.append(label);
        });
        return div;
    }
    function createCopyButton(onClick) {
        const div = ce('div');
        div.className = 'copyBtnContainer';
        const copyTextBtn = ce('button');
        copyTextBtn.className = 'copyBtn';
        copyTextBtn.append(UIString.copy);
        div.append(copyTextBtn);
        let snackbarContainer = d.querySelector('.snackbarContainer');
        let snackbar = d.querySelector('.snackbar');
        if (!snackbarContainer) {
            snackbarContainer = ce('div');
            snackbarContainer.className = 'snackbarContainer';
            snackbarContainer.style.display = 'none';
            d.body.append(snackbarContainer);
        }
        if (!snackbar) {
            snackbar = ce('div');
            snackbar.className = 'wrapper snackbar';
            snackbar.innerText = UIString.copied;
            snackbarContainer.append(snackbar);
        }
        copyTextBtn.addEventListener('click', (evt) => {
            onClick(evt);
            d.execCommand('copy');
            snackbarContainer.style.display = 'block';
            snackbar.style.opacity = '1';
            setTimeout(() => {
                snackbar.style.opacity = '0';
                setTimeout(() => {
                    snackbarContainer.style.display = 'none';
                }, 500);
            }, 4000);
        });
        const downloadBtn = ce('button');
        downloadBtn.className = 'downloadImgBtn';
        downloadBtn.append(UIString.downloadAsImage);
        downloadBtn.addEventListener('click', () => {
            const elem = d.querySelector('.playRecordContainer');
            dom_to_image_1.default.toPng(elem).then((dataUrl) => {
                const dtStr = Array.from(getSelectedDates()).join(',');
                const filename = 'record_' + dtStr + '.png';
                const a = ce('a');
                a.href = dataUrl;
                a.download = filename;
                //console.log(a);
                a.click();
                //a.innerText = filename;
                //a.target = "_blank";
                //a.style.fontSize = "16px";
                //a.style.color = "blue";
                //a.style.display = "block";
                //d.querySelector(".title.m_10").insertAdjacentElement("beforebegin", a);
            });
        });
        div.append(downloadBtn);
        return div;
    }
    function createOutputElement(allRecords, songDb, insertBefore) {
        const playDates = allRecords.reduce((s, r) => {
            s.add((0, date_util_1.formatDate)(r.date).split(' ')[0]);
            return s;
        }, new Set());
        let dv = d.getElementById('recordSummary');
        if (dv) {
            dv.innerHTML = '';
        }
        else {
            dv = ce('div');
            dv.id = 'recordSummary';
        }
        const playRecordContainer = ce('div');
        playRecordContainer.className = 'playRecordContainer';
        const table = ce('table'), thead = ce('thead'), tbody = ce('tbody');
        table.className = 'playRecordTable';
        table.append(thead, tbody);
        playRecordContainer.append(table);
        const handleOptionChange = () => {
            renderTopScores(filterRecords(allRecords, getFilterAndOptions()), songDb, playRecordContainer, thead, tbody);
        };
        dv.append(createDateOptions(playDates, handleOptionChange));
        dv.append(createNewRecordToggle(handleOptionChange));
        dv.append(createSortByRadio(handleOptionChange));
        const btn = createCopyButton(() => {
            const selection = window.getSelection();
            const range = d.createRange();
            range.selectNodeContents(tbody);
            selection.removeAllRanges();
            selection.addRange(range);
        });
        dv.append(btn);
        renderTopScores(filterRecords(allRecords, { olderFirst: false }), songDb, playRecordContainer, thead, tbody);
        dv.append(playRecordContainer);
        insertBefore.insertAdjacentElement('beforebegin', dv);
    }
    const titleImg = d.querySelector('.main_wrapper > img.title');
    if (titleImg) {
        (() => __awaiter(this, void 0, void 0, function* () {
            (0, net_helpers_1.removeScrollControl)(d);
            const rows = Array.from(d.querySelectorAll('.main_wrapper .p_10.t_l.f_0.v_b'));
            try {
                const gameVer = yield (0, net_helpers_1.fetchGameVersion)(d.body);
                const gameRegion = (0, game_region_1.getGameRegionFromOrigin)(d.location.origin);
                const songDb = yield (0, song_props_1.loadSongDatabase)(gameVer, gameRegion);
                const records = rows.map((row) => {
                    const record = (0, play_history_1.getPlayRecordFromRow)(row, songDb);
                    if (record.level) {
                        (0, net_helpers_1.addLvToSongTitle)(row, record.difficulty, (0, level_helper_1.getDisplayLv)(record.level, record.difficulty === 5 /* Difficulty.UTAGE */));
                    }
                    return record;
                });
                createOutputElement(records, songDb, titleImg);
            }
            catch (e) {
                const footer = d.getElementsByTagName('footer')[0];
                const textarea = ce('textarea');
                footer.append(textarea);
                textarea.value = e instanceof Error ? e.message + '\n' + e.stack : String(e);
            }
        }))().then((_) => { });
    }
})(document);
