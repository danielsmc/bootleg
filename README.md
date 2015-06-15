# Bootleg
The act of playing a videotape or film causes wear and tear on the media itself. The effect of each playback is slight, but the cumulative damage will be noticable after repeated viewings. An internet video, on the other hand, can be played millions of times without change. Bootleg is a browser extension that rectifies this deficiency by simulating wear on internet videos.

In Bootleg's world, every time a byte of video data is played back, there's a small chance (currently one in a billion) that that byte will be zeroed out. Using the play count reported by the video provider, the extension simulates the cumulative effect of this damage before playing a video. Bootleg is designed to treat a video as a single object: everyone who views a particular video will see the same pattern of wear, and damage realistically accumulates as the play count increases.

Currently, Bootleg supports Vine videos (both embeds and vine.co video pages.)

## TODO

* Add support for more video services
* Package extension and release to Chrome Store
* Better support for the vine.co homepage, profile pages, etc.
* Change the poster so it's clear when a video's too worn to play
