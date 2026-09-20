import {isMaimaiNetOrigin} from '../common/game-region';
import {getInitialLanguage, Language} from '../common/lang';
import {removeScrollControl} from '../common/net-helpers';
import {PLAY_HISTORY_PATH} from '../common/play-history';
import {handleError} from '../common/util';

(function (d) {
  const LANG = getInitialLanguage();
  const UIString = {
    [Language.zh_TW]: {
      pleaseLogIn: '請登入 maimai DX NET',
      playInfoFailed: '無法載入遊玩次數與最後遊玩日期。',
    },
    [Language.en_US]: {
      pleaseLogIn: 'Please log in to maimai DX NET.',
      playInfoFailed: 'Could not load play count and last played date.',
    },
    [Language.ko_KR]: {
      pleaseLogIn: 'maimai DX NET에 로그인 해 주세요.',
      playInfoFailed: '플레이 횟수와 최종 플레이 일시를 불러오지 못했습니다.',
    },
  }[LANG];

  if (!isMaimaiNetOrigin(d.location.origin)) {
    handleError(UIString.pleaseLogIn);
    return;
  }

  // Enable right click
  d.body.oncontextmenu = null;

  const path = d.location.pathname;
  if (path === PLAY_HISTORY_PATH) {
    import('./recent-play-downloader');
  } else if (path.startsWith('/maimai-mobile/record/playlogDetail/')) {
    import('./score-converter');
    import('./play-record-helper');
  } else if (path.startsWith('/maimai-mobile/record/musicDetail/')) {
    removeScrollControl(d);
    import('./song-detail-helper');
  } else if (path.startsWith('/maimai-mobile/record/music')) {
    import('./score-sort');
    import('./play-last')
      .then((m) => m.addPlayAndLastPlayedInfo(d))
      .catch((err) => {
        console.error(err);
        handleError(UIString.playInfoFailed);
      });
    import('./play-heatmap')
      .then((m) => m.addLastPlayedOverviewButton(d))
      .catch((err) => console.error(err));
  } else if (path.startsWith('/maimai-mobile/friend/')) {
    import('./analyze-friend-rating-in-new-tab');
    if (path.startsWith('/maimai-mobile/friend/friendDetail/')) {
      import('./score-download');
    }
    if (
      path.startsWith('/maimai-mobile/friend/friendGenreVs/battleStart/') ||
      path.startsWith('/maimai-mobile/friend/friendLevelVs/battleStart/')
    ) {
      import('./score-sort');
    }
  } else if (
    path === '/maimai-mobile/home/' ||
    path === '/maimai-mobile/home/ratingTargetMusic/' ||
    path === '/maimai-mobile/playerData/'
  ) {
    removeScrollControl(d);
    import('./score-download');
    import('./analyze-rating-in-newtab');
  } else if (
    path.startsWith('/maimai-mobile/photo/') ||
    path.startsWith('/maimai-mobile/playerData/photo/')
  ) {
    import('./album-download-helper');
  }
})(document);
