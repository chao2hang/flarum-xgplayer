import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import TextEditorButton from 'flarum/common/components/TextEditorButton';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';

const XGPLAYER_CDN = {
  css: 'https://unpkg.com/xgplayer@3.0.24/dist/index.min.css',
  core: 'https://unpkg.com/xgplayer@3.0.24/dist/index.min.js',
  hls: 'https://unpkg.com/xgplayer-hls@3.0.24/dist/index.min.js',
  flv: 'https://unpkg.com/xgplayer-flv@3.0.24/dist/index.min.js',
  dash: 'https://unpkg.com/xgplayer-dash@3.0.24/dist/index.min.js',
};

const VIDEO_TYPES = [
  { value: 'mp4', label: 'MP4', desc: 'Standard video format' },
  { value: 'hls', label: 'HLS', desc: 'HTTP Live Streaming (.m3u8)' },
  { value: 'flv', label: 'FLV', desc: 'Flash Video' },
  { value: 'dash', label: 'DASH', desc: 'Dynamic Adaptive Streaming' },
];

const loadedScripts = new Set();

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has(src)) {
      resolve();
      return;
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      loadedScripts.add(src);
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      loadedScripts.add(src);
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadStyle(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function getPluginsForType(type) {
  const plugins = [];
  if (type === 'hls' && window.HlsPlayer) plugins.push(window.HlsPlayer);
  if (type === 'flv' && window.FlvPlayer) plugins.push(window.FlvPlayer);
  if (type === 'dash' && window.DashPlayer) plugins.push(window.DashPlayer);
  return plugins;
}

function initPlayers() {
  const containers = document.querySelectorAll('.xgplayer-container:not([data-initialized])');
  if (!containers.length) return;

  containers.forEach((container, index) => {
    const url = container.dataset.url;
    if (!url) return;

    const type = container.dataset.type || 'mp4';
    const poster = container.dataset.poster || '';
    const playerId = `xgplayer-${Date.now()}-${index}`;
    container.id = playerId;
    container.setAttribute('data-initialized', 'true');

    const config = {
      id: playerId,
      url: url,
      width: '100%',
      height: 'auto',
      fitVideoSize: 'fixWidth',
      videoInit: true,
      autoplay: false,
      playbackRate: [0.5, 0.75, 1, 1.25, 1.5, 2],
      lang: 'zh-cn',
      plugins: getPluginsForType(type),
      pip: true,               // Enable Picture-in-Picture button
      mini: true,              // Enable mini player on scroll
      // Fullscreen configuration
      fullscreen: true,        // Enable fullscreen button
      rotateFullscreen: true,  // Auto-rotate to landscape on fullscreen (mobile)
      mobile: {
        disablePress: false, // Enable long-press speed playback
        pressRate: 3,        // 3x speed on long press (default: 2)
      },
    };

    if (poster) config.poster = poster;

    new window.Player(config);
  });
}

class VideoModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.url = '';
    this.poster = '';
    this.type = 'mp4';
  }

  className() {
    return 'xgplayer-modal Modal--small';
  }

  title() {
    return 'Insert Video Player';
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <label>Video URL</label>
            <input
              className="FormControl"
              type="url"
              placeholder="https://example.com/video.mp4"
              value={this.url}
              oninput={(e) => (this.url = e.target.value)}
              required
            />
          </div>

          <div className="Form-group">
            <label>Video Format</label>
            <div className="xgplayer-type-selector">
              {VIDEO_TYPES.map((t) => (
                <label className="xgplayer-type-option" key={t.value}>
                  <input
                    type="radio"
                    name="videoType"
                    value={t.value}
                    checked={this.type === t.value}
                    onchange={() => (this.type = t.value)}
                  />
                  <span className="xgplayer-type-label">
                    <strong>{t.label}</strong>
                    <small>{t.desc}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="Form-group">
            <label>Poster URL (optional)</label>
            <input
              className="FormControl"
              type="url"
              placeholder="https://example.com/poster.jpg"
              value={this.poster}
              oninput={(e) => (this.poster = e.target.value)}
            />
          </div>

          <div className="Form-group">
            <Button
              className="Button Button--primary"
              disabled={!this.url}
              onclick={() => this.onsubmit()}
            >
              Insert Video
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit() {
    if (!this.url) return;

    let bbcode = `[xgplayer url=${this.url}`;
    if (this.poster) bbcode += ` poster=${this.poster}`;
    if (this.type !== 'mp4') bbcode += ` type=${this.type}`;
    bbcode += ']';

    const editor = app.composer.editor;
    if (editor) {
      editor.insertAtCursor(bbcode);
    }

    app.modal.close();
  }
}

app.initializers.add('chaos-xigua-video', () => {
  loadStyle(XGPLAYER_CDN.css);

  loadScript(XGPLAYER_CDN.core).then(() => {
    const loadPromises = [];
    if (XGPLAYER_CDN.hls) loadPromises.push(loadScript(XGPLAYER_CDN.hls));
    if (XGPLAYER_CDN.flv) loadPromises.push(loadScript(XGPLAYER_CDN.flv));
    if (XGPLAYER_CDN.dash) loadPromises.push(loadScript(XGPLAYER_CDN.dash));

    Promise.all(loadPromises).then(() => {
      initPlayers();
      const observer = new MutationObserver(() => initPlayers());
      observer.observe(document.body, { childList: true, subtree: true });
    });
  });

  extend('flarum/common/components/TextEditor', 'toolbarItems', function (items) {
    items.add(
      'xgplayer',
      <TextEditorButton onclick={() => app.modal.show(VideoModal)} icon="fas fa-video">
        Video
      </TextEditorButton>,
      50
    );
  });
});
