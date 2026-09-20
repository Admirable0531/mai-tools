# Testing

The purpose of this document is to list features to check when major code change is made.

## All-in-one bookmarklet

- On JP maimai net, analyze self rating.
- On international maimai net, analyze friend rating.
- Play record list: Summary table should display.
- Play record list: Each play record should contain DX score percentage and chart constant.
- Single play record: DX score percentage and chart level should be displayed.
- Single play record: can analyze score in classic-layout.
- Self score sorting: by achievement, by ap/fc, by sync, by official level, by internal level, by dx star.
- Self score list: each played chart gets a play count and last played date; unplayed charts get neither
  and cost no request. Reloading the page fills them in from cache without re-fetching.
- Self score sorting: by play count, by last played — including picking one of those before the values
  have finished loading, which should re-sort itself once they arrive.
- Self score list: "Last played overview" button opens a panel with a calendar heatmap (scrolled to the
  recent end, month labels along the top), a level × recency grid, and a longest-untouched list.
  Re-opening it should be near-instant, since the song data is already cached.
- Friend score sorting: by achievement, by ap/fc, by sync, by official level, by internal level, by dx star, by vs result.
- Song detail page: for each difficulty, DX score percentage and chart level should be displayed.
- Album page: each photo title becomes clickable and will download the photo with correct filename (date + song name + difficulty)
- etc.

## Classic layout (DX -> FiNALE score converter)

- Switch between DX and Cafe MiLK
- Switch between normal display, minus display, and detail display by clicking on achievement percentage.

## Rating visualizer

- Change scale
- Change min level
- Change max level
- Change language

## DX Achievement (from FiNALE score)

- Fill example data
