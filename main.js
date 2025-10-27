/**
 * =================================================================
 * Nezha-UI 主入口文件
 * @description 统一调用所有功能模块，启动脚本。
 * =================================================================
 */

(function () {
  // 确保所有模块都已加载后再执行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    // 按顺序初始化各个模块
    if (typeof initCustomLinks === "function") {
      initCustomLinks();
    }

    if (typeof initIllustration === "function") {
      initIllustration();
    }

    if (typeof initFireworks === "function") {
      initFireworks();
    }

    if (typeof initVisitorInfo === "function") {
      initVisitorInfo();
    }

    if (typeof initRainEffect === "function") {
      initRainEffect();
    }

    // 音乐播放器模块（如果存在）
    if (typeof initMusicPlayer === "function") {
      initMusicPlayer();
    }
  }
})();
