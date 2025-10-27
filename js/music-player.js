/**
 * =================================================================
 * Nezha-UI 音乐播放器UI模块
 * @description 浮动音乐播放器UI外观，可自定义连接其他播放器
 * =================================================================
 */

// ------------------ 音乐播放器配置 ------------------
window.EnableMusicPlayer = false; // 【音乐播放器】是否启用音乐播放器UI (true/false)
window.MusicPlayerDefaultSide = "left"; // 【默认位置】left 或 right
window.MusicPlayerBallSize = 60; // 【球体大小】浮动球的直径(px)
window.MusicPlayerAutoCollapse = 3000; // 【自动收起】展开后多久自动收起(毫秒)，0为不自动收起
window.MusicPlayerCoverImage = "https://via.placeholder.com/60"; // 【封面图片】默认封面图片URL
window.MusicPlayerTitle = "音乐播放器"; // 【标题】默认显示标题
window.MusicPlayerArtist = "Nezha-UI"; // 【艺术家】默认显示艺术家

/**
 * 播放器状态回调（由外部播放器调用）
 * 使用方法：
 * 1. 播放时调用：window.MusicPlayerUI.setPlaying(true);
 * 2. 暂停时调用：window.MusicPlayerUI.setPlaying(false);
 * 3. 更新信息：window.MusicPlayerUI.updateInfo({ title: "歌名", artist: "歌手", cover: "封面URL" });
 */

function initMusicPlayer() {
  if (!window.EnableMusicPlayer) {
    return;
  }

  // 注入样式
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes soundwave {
      from {
        transform: scale(1);
        opacity: 0.8;
      }
      to {
        transform: scale(1.6);
        opacity: 0;
      }
    }

    .music-player-container {
      position: fixed;
      z-index: 1050;
      display: flex;
      align-items: center;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      overflow: hidden;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      cursor: move;
    }

    .music-player-container.expanded {
      border-radius: 25px;
    }

    .music-album-wrapper {
      position: relative;
      flex-shrink: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .music-album-image {
      object-fit: cover;
      border-radius: 50%;
      transition: transform 0.3s;
    }

    .music-album-image.playing {
      animation: spin 10s linear infinite;
    }

    .music-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }

    .music-album-wrapper:hover .music-overlay {
      opacity: 1;
    }

    .music-wave-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      border-radius: 50%;
    }

    .music-wave {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.6);
      animation: soundwave 2s infinite ease-out;
      display: none;
    }

    .music-player-container.playing .music-wave {
      display: block;
    }

    .music-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 15px;
      opacity: 0;
      width: 0;
      transition: all 0.4s;
      white-space: nowrap;
    }

    .music-player-container.expanded .music-controls {
      opacity: 1;
      width: auto;
    }

    .music-info {
      display: flex;
      flex-direction: column;
      max-width: 150px;
      overflow: hidden;
    }

    .music-title {
      color: white;
      font-size: 14px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .music-artist {
      color: rgba(255, 255, 255, 0.7);
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .music-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      font-size: 18px;
      opacity: 0.8;
      transition: opacity 0.3s, transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .music-btn:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(styleSheet);

  // 变量初始化
  let isPlaying = false;
  let isExpanded = false;
  let currentSide = window.MusicPlayerDefaultSide || "left";
  const ballSize = window.MusicPlayerBallSize || 60;
  let autoCollapseTimer = null;

  // 创建UI元素
  const container = document.createElement("div");
  container.className = "music-player-container";
  container.style.width = `${ballSize}px`;
  container.style.height = `${ballSize}px`;
  container.style[currentSide] = "20px";
  container.style.bottom = "80px";
  document.body.appendChild(container);

  // 封面区域
  const albumWrapper = document.createElement("div");
  albumWrapper.className = "music-album-wrapper";
  albumWrapper.style.width = `${ballSize}px`;
  albumWrapper.style.height = `${ballSize}px`;

  const albumImage = document.createElement("img");
  albumImage.className = "music-album-image";
  albumImage.style.width = `${ballSize}px`;
  albumImage.style.height = `${ballSize}px`;
  albumImage.src = window.MusicPlayerCoverImage;

  const overlay = document.createElement("div");
  overlay.className = "music-overlay";
  overlay.innerHTML = '<i class="iconfont icon-play" style="font-size: 24px;"></i>';

  // 音波效果
  const waveContainer = document.createElement("div");
  waveContainer.className = "music-wave-container";
  for (let i = 0; i < 3; i++) {
    const wave = document.createElement("div");
    wave.className = "music-wave";
    wave.style.animationDelay = `${i * 0.6}s`;
    waveContainer.appendChild(wave);
  }

  albumWrapper.append(albumImage, overlay, waveContainer);

  // 控制面板
  const controls = document.createElement("div");
  controls.className = "music-controls";

  const musicInfo = document.createElement("div");
  musicInfo.className = "music-info";
  musicInfo.innerHTML = `
    <div class="music-title">${window.MusicPlayerTitle}</div>
    <div class="music-artist">${window.MusicPlayerArtist}</div>
  `;

  const prevBtn = document.createElement("button");
  prevBtn.className = "music-btn";
  prevBtn.innerHTML = '<i class="iconfont icon-prev"></i>';
  prevBtn.title = "上一曲";

  const playBtn = document.createElement("button");
  playBtn.className = "music-btn";
  playBtn.innerHTML = '<i class="iconfont icon-play"></i>';
  playBtn.title = "播放/暂停";

  const nextBtn = document.createElement("button");
  nextBtn.className = "music-btn";
  nextBtn.innerHTML = '<i class="iconfont icon-next"></i>';
  nextBtn.title = "下一曲";

  controls.append(musicInfo, prevBtn, playBtn, nextBtn);
  container.append(albumWrapper, controls);

  // 功能函数
  function setPlaying(playing) {
    isPlaying = playing;
    if (playing) {
      container.classList.add("playing");
      albumImage.classList.add("playing");
      playBtn.innerHTML = '<i class="iconfont icon-pause"></i>';
      overlay.innerHTML = '<i class="iconfont icon-pause" style="font-size: 24px;"></i>';
    } else {
      container.classList.remove("playing");
      albumImage.classList.remove("playing");
      playBtn.innerHTML = '<i class="iconfont icon-play"></i>';
      overlay.innerHTML = '<i class="iconfont icon-play" style="font-size: 24px;"></i>';
    }
  }

  function updateInfo(info) {
    if (info.title) {
      musicInfo.querySelector(".music-title").textContent = info.title;
    }
    if (info.artist) {
      musicInfo.querySelector(".music-artist").textContent = info.artist;
    }
    if (info.cover) {
      albumImage.src = info.cover;
    }
  }

  function expandPlayer() {
    isExpanded = true;
    container.classList.add("expanded");
    container.style.width = "auto";

    if (window.MusicPlayerAutoCollapse > 0) {
      clearTimeout(autoCollapseTimer);
      autoCollapseTimer = setTimeout(collapsePlayer, window.MusicPlayerAutoCollapse);
    }
  }

  function collapsePlayer() {
    isExpanded = false;
    container.classList.remove("expanded");
    container.style.width = `${ballSize}px`;
    clearTimeout(autoCollapseTimer);
  }

  // 事件监听
  albumWrapper.onclick = () => {
    if (!isExpanded) {
      expandPlayer();
    }
  };

  // 按钮点击事件（触发自定义事件，由外部播放器监听）
  playBtn.onclick = () => {
    const event = new CustomEvent('nezha-music-play-pause', { detail: { isPlaying } });
    window.dispatchEvent(event);
  };

  prevBtn.onclick = () => {
    const event = new CustomEvent('nezha-music-prev');
    window.dispatchEvent(event);
  };

  nextBtn.onclick = () => {
    const event = new CustomEvent('nezha-music-next');
    window.dispatchEvent(event);
  };

  // 拖拽功能
  let isDragging = false;
  let startX, startY, startLeft, startBottom;

  container.onmousedown = (e) => {
    if (e.target.closest('.music-controls')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = container.getBoundingClientRect();
    startLeft = currentSide === "left" ? rect.left : window.innerWidth - rect.right;
    startBottom = window.innerHeight - rect.bottom;
    container.style.transition = "none";
  };

  document.onmousemove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = startY - e.clientY;
    
    if (currentSide === "left") {
      container.style.left = `${Math.max(0, Math.min(window.innerWidth - 100, startLeft + deltaX))}px`;
    } else {
      container.style.right = `${Math.max(0, Math.min(window.innerWidth - 100, startLeft - deltaX))}px`;
    }
    container.style.bottom = `${Math.max(0, Math.min(window.innerHeight - 100, startBottom + deltaY))}px`;
  };

  document.onmouseup = () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.transition = "";
    
    // 判断靠近哪一侧
    const rect = container.getBoundingClientRect();
    if (rect.left < window.innerWidth / 2) {
      currentSide = "left";
      container.style.right = "auto";
    } else {
      currentSide = "right";
      container.style.left = "auto";
    }
  };

  // 暴露API到全局，供外部播放器调用
  window.MusicPlayerUI = {
    setPlaying: setPlaying,
    updateInfo: updateInfo,
    expand: expandPlayer,
    collapse: collapsePlayer
  };

  console.log("🎵 音乐播放器UI已加载");
}

/**
 * 使用示例：
 * 
 * // 1. 连接外部播放器后，更新播放状态
 * window.MusicPlayerUI.setPlaying(true);  // 开始播放
 * window.MusicPlayerUI.setPlaying(false); // 暂停播放
 * 
 * // 2. 更新歌曲信息
 * window.MusicPlayerUI.updateInfo({
 *   title: "歌曲名称",
 *   artist: "艺术家",
 *   cover: "封面图片URL"
 * });
 * 
 * // 3. 监听用户点击按钮
 * window.addEventListener('nezha-music-play-pause', (e) => {
 *   console.log('用户点击了播放/暂停按钮', e.detail);
 *   // 在这里调用你的播放器API
 * });
 * 
 * window.addEventListener('nezha-music-prev', () => {
 *   console.log('用户点击了上一曲');
 * });
 * 
 * window.addEventListener('nezha-music-next', () => {
 *   console.log('用户点击了下一曲');
 * });
 */
