# XgPlayer Integration for Flarum

[![License](https://img.shields.io/github/license/chao2hang/flarum-xgplayer?style=flat-square)](https://github.com/chao2hang/flarum-xgplayer/blob/main/LICENSE)

A [Flarum](https://flarum.org/) extension that integrates [XgPlayer](https://xgplayer.bytedance.com/) (ByteDance video player) into forum posts.

## Features

- Embed videos using BBCode: `[xgplayer url=URL poster=URL type=TYPE]`
- Supports multiple video formats: **MP4**, **HLS** (.m3u8), **FLV**, **DASH**
- Editor toolbar button with video insertion modal
- Picture-in-Picture (PiP) support
- Fullscreen with auto-rotate on mobile
- Mobile-optimized progress bar and controls
- Lazy CDN loading (scripts loaded only when needed)

## Installation

```bash
composer require chaos/xigua-video
```

Then enable the extension in Flarum admin panel.

## Usage

### BBCode

```
[xgplayer url=https://example.com/video.mp4]
[xgplayer url=https://example.com/video.m3u8 type=hls]
[xgplayer url=https://example.com/video.mp4 poster=https://example.com/thumb.jpg]
```

### Editor Button

Click the **Video** button in the post editor toolbar to open the video insertion modal.

### Supported Formats

| Format | Type | Description |
|--------|------|-------------|
| MP4 | `mp4` | Standard video format (default) |
| HLS | `hls` | HTTP Live Streaming (.m3u8) |
| FLV | `flv` | Flash Video |
| DASH | `dash` | Dynamic Adaptive Streaming |

## Requirements

- Flarum `^2.0`
- PHP 8.x

## Configuration

No configuration needed. The extension uses XgPlayer CDN by default.

## Links

- [GitHub](https://github.com/chao2hang/flarum-xgplayer)
- [Packagist](https://packagist.org/packages/chaos/xigua-video)
- [XgPlayer Documentation](https://xgplayer.bytedance.com/)

## License

MIT
