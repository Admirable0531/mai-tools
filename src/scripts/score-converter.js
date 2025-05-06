"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Use it on a play record page to
 * 1) analyze DX score ratio
 * 2) convert to FiNALE achievement scale
 * 3) analyze break note judgements
 */
const difficulties_1 = require("../common/difficulties");
const dx_star_1 = require("../common/dx-star");
const fetch_score_util_1 = require("../common/fetch-score-util");
const game_region_1 = require("../common/game-region");
const lang_1 = require("../common/lang");
const net_helpers_1 = require("../common/net-helpers");
const script_host_1 = require("../common/script-host");
const util_1 = require("../common/util");
(function (d) {
    const UIString = {
        ["en-US" /* Language.en_US */]: {
            analyzeScore: 'Analyze Score ↗',
        },
        ["zh-TW" /* Language.zh_TW */]: {
            analyzeScore: '️分析分數 ↗',
        },
        ["ko-KR" /* Language.ko_KR */]: {
            analyzeScore: '정확도 분석하기 ↗',
        },
    }[(0, lang_1.getInitialLanguage)()];
    const BASE_NEWTAB_URL = (0, script_host_1.getScriptHost)('score-converter') + '/classic-layout/';
    const FINALE_RANK_IMG = new Map([
        ['S', '/maimai-mobile/maimai-img/icon_s.png'],
        ['S+', '/maimai-mobile/maimai-img/icon_s_plus.png'],
        ['SS', '/maimai-mobile/maimai-img/icon_ss.png'],
        ['SS+', '/maimai-mobile/maimai-img/icon_ss_plus.png'],
        ['SSS', '/maimai-mobile/maimai-img/icon_sss.png'],
        ['SSS+', '/maimai-mobile/maimai-img/icon_sss_plus.png'],
    ]);
    const DX_RANK_IMG = new Map([
        ['AAA', '/maimai-mobile/img/music_icon_aaa.png'],
        ['AA', '/maimai-mobile/img/music_icon_aa.png'],
        ['A', '/maimai-mobile/img/music_icon_a.png'],
    ]);
    const FINALE_APFC_IMG = new Map([
        ['fc', '/maimai-mobile/maimai-img/icon_fc_silver.png'],
        ['fcplus', '/maimai-mobile/maimai-img/icon_fc_gold.png'],
        ['ap', '/maimai-mobile/maimai-img/icon_ap.png'],
    ]);
    const DX_APFC_IMG = new Map([['applus', '/maimai-mobile/img/music_icon_app.png']]);
    const FINALE_SYNC_IMG = new Map([
        ['FS', '/maimai-mobile/maimai-img/icon_maxfever_silver.png'],
        ['FS+', '/maimai-mobile/maimai-img/icon_maxfever_gold.png'],
    ]);
    const DX_SYNC_IMG = new Map([
        ['FSD', '/maimai-mobile/img/music_icon_fsd.png'],
        ['FSD+', '/maimai-mobile/img/music_icon_fsdp.png'],
    ]);
    function fetchAndCacheImg(map, title) {
        let img = map.get(title);
        if (img instanceof Blob) {
            return Promise.resolve(img);
        }
        else if (img) {
            return fetch(img)
                .then((res) => res.blob())
                .then((b) => {
                map.set(title, b);
                return b;
            });
        }
    }
    function getAchv(e) {
        const achv = e.querySelector('.playlog_achievement_txt').innerText;
        return achv.substring(0, achv.length - 1); // remove "%"
    }
    function getNoteDetails(e) {
        return e.querySelector('.playlog_notes_detail').innerText
            .split('\n')
            .map((s) => s.trim())
            .map((s) => s.replace(/\t/g, '-'))
            .join('_')
            .replace(/^_+|_+$/g, ''); // remove first & last underscores
    }
    function getTrack(e) {
        return e.querySelector('.playlog_top_container .sub_title .f_b').innerText.replace('0', '');
    }
    function getPlayDate(e) {
        const jpDtText = e.querySelector('.playlog_top_container .sub_title span:last-child').innerText;
        return (0, net_helpers_1.getEpochTimeFromText)(jpDtText);
    }
    function getIsHighScore(e) {
        return e.querySelector('.playlog_achievement_newrecord') ? 1 : 0;
    }
    function getCombo(e) {
        return e.querySelector('.col2 .playlog_score_block .white').innerText;
        //return e.querySelector(".col2 .playlog_score_block .white").innerText.replace("/", " / ");
    }
    function getSongImage(e) {
        const img = e.querySelector('img.music_img');
        const canvas = d.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
    }
    function getRankTitle(e) {
        const src = e.querySelector('.playlog_scorerank').src.replace(/\?ver=.*$/, '');
        const title = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
        return title.toUpperCase().replace('PLUS', '+');
    }
    function getRankImage(title) {
        return (fetchAndCacheImg(FINALE_RANK_IMG, title) ||
            fetchAndCacheImg(DX_RANK_IMG, title) ||
            Promise.reject('invalid title "' + title + '"'));
    }
    function getApFcImage(e) {
        const src = e.querySelector('.playlog_result_innerblock > img:nth-child(2)').src.replace(/\?ver=.*$/, '');
        const title = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
        if (title === 'fc_dummy') {
            return Promise.resolve(null);
        }
        return (fetchAndCacheImg(FINALE_APFC_IMG, title) ||
            fetchAndCacheImg(DX_APFC_IMG, title) ||
            Promise.reject('invalid title "' + title + '"'));
    }
    function getSyncResult(e) {
        const src = e.querySelector('.playlog_result_innerblock > img:nth-child(3)').src;
        const title = src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
        switch (title) {
            case 'fs':
                return 'FS';
            case 'fsplus':
                return 'FS+';
            case 'fsd':
                return 'FSD';
            case 'fsdplus':
                return 'FSD+';
        }
        return null;
    }
    function getSyncImage(syncResult) {
        if (syncResult) {
            return (fetchAndCacheImg(FINALE_SYNC_IMG, syncResult) ||
                fetchAndCacheImg(DX_SYNC_IMG, syncResult) ||
                Promise.reject('invalid title "' + syncResult + '"'));
        }
        return Promise.resolve(null);
    }
    function addAnalyzeLink(link) {
        let ratingBlock = d.querySelector('.playlog_rating_detail_block');
        if (!ratingBlock) {
            return;
        }
        const existingLink = d.getElementById('openClassicLayout');
        if (existingLink) {
            existingLink.remove();
        }
        const linkElem = d.createElement('a');
        linkElem.id = 'openClassicLayout';
        linkElem.target = 'classic_layout';
        linkElem.className = 'blue d_ib f_12 m_10';
        linkElem.href = link;
        linkElem.append(UIString.analyzeScore);
        ratingBlock.append(linkElem);
    }
    function addScoreConverterLink() {
        (0, net_helpers_1.removeScrollControl)(d);
        const queryParams = new URLSearchParams({
            ["dt" /* QueryParam.Date */]: getPlayDate(d.body).toString(),
            ["tk" /* QueryParam.Track */]: getTrack(d.body),
            ["st" /* QueryParam.SongTitle */]: (0, fetch_score_util_1.getSongName)(d.body),
            ["df" /* QueryParam.Difficulty */]: (0, difficulties_1.getDifficultyForRecord)(d.body).toString(),
            ["ac" /* QueryParam.Achievement */]: getAchv(d.body),
            ["hs" /* QueryParam.HighScore */]: getIsHighScore(d.body).toString(),
            ["nd" /* QueryParam.NoteDetails */]: getNoteDetails(d.body),
            ["cb" /* QueryParam.Combo */]: getCombo(d.body),
        });
        const syncStatus = getSyncResult(d.body);
        if (syncStatus) {
            queryParams.set("sc" /* QueryParam.SyncStatus */, syncStatus);
        }
        const place = d.getElementById('placeName');
        if (place) {
            queryParams.set("place" /* QueryParam.Place */, place.innerText);
        }
        const url = BASE_NEWTAB_URL + '?' + queryParams.toString();
        addAnalyzeLink(url);
        window.addEventListener('message', (evt) => {
            if (util_1.ALLOWED_ORIGINS.includes(evt.origin)) {
                const data = evt.data;
                const source = evt.source;
                let rankTitle = '';
                switch (data.action) {
                    case 'ready':
                        source.postMessage({ action: 'songImage', imgSrc: getSongImage(d.body) }, evt.origin);
                        getApFcImage(d.body).then((img) => {
                            if (img) {
                                source.postMessage({ action: 'apFcImage', img }, evt.origin);
                            }
                        });
                        getSyncImage(getSyncResult(d.body)).then((img) => {
                            if (img) {
                                source.postMessage({ action: 'syncImage', img }, evt.origin);
                            }
                        });
                        rankTitle = getRankTitle(d.body);
                        getRankImage(rankTitle).then((img) => {
                            source.postMessage({ action: 'rankImage', title: rankTitle, img }, evt.origin);
                        });
                        break;
                    case 'getRankImage':
                        rankTitle = data.payload;
                        getRankImage(rankTitle).then((img) => {
                            source.postMessage({ action: 'rankImage', title: rankTitle, img }, evt.origin);
                        });
                        break;
                }
            }
        });
    }
    if ((0, game_region_1.isMaimaiNetOrigin)(d.location.origin) &&
        d.location.pathname.includes('/maimai-mobile/record/playlogDetail/')) {
        addScoreConverterLink();
        (0, dx_star_1.calculateDetailedDxStar)(d.body);
    }
})(document);
