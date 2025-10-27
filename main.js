/**
 * =================================================================
 * Nezha-UI 主入口文件
 * @description 统一调用所有功能模块，启动脚本
 * @author Faiz
 * @version 1.0.0
 * =================================================================
 */

(function () {
  /**
   * 主函数 - 启动所有功能模块
   */
  function init() {
    console.log('🎨 Nezha-UI 美化模块开始加载...');

    // 定义所有模块及其初始化函数
    const modules = [
      { name: '自定义链接模块', init: 'initCustomLinks' },
      { name: '插图模块', init: 'initIllustration' },
      { name: '访客信息模块', init: 'initVisitorInfo' },
      { name: '烟花特效模块', init: 'initFireworks' },
      { name: '下雨特效模块', init: 'initRainEffect' }
    ];

    let loadedCount = 0;
    let failedModules = [];

    // 初始化所有模块
    modules.forEach(module => {
      if (typeof window[module.init] === 'function') {
        try {
          window[module.init]();
          console.log(`✅ ${module.name} 已加载`);
          loadedCount++;
        } catch (error) {
          console.error(`❌ ${module.name} 初始化失败:`, error);
          failedModules.push(module.name);
        }
      } else if (!module.optional) {
        console.warn(`⚠️ ${module.name} 未找到，可能未正确加载`);
        failedModules.push(module.name);
      }
    });

    // 输出加载统计
    const totalRequired = modules.filter(m => !m.optional).length;
    console.log(`📊 模块加载完成: ${loadedCount}/${modules.length} (必需: ${totalRequired})`);

    if (failedModules.length === 0) {
      console.log('🎉 所有 Nezha-UI 美化模块已成功加载！');
    } else if (failedModules.length < totalRequired) {
      console.warn('⚠️ 部分模块未能加载:', failedModules.join(', '));
    } else {
      console.error('❌ 关键模块加载失败，请检查相关脚本文件');
    }
  }

  // 立即执行初始化
  // 由于是动态加载，脚本执行时 DOM 通常已经准备好了
  console.log('📦 main.js 已加载，准备初始化...');
  
  // 使用 setTimeout 确保所有前置模块都已加载
  setTimeout(function() {
    init();
  }, 100);

  // 将主函数暴露到全局作用域，方便调试
  window.NezhaUI = {
    init: init,
    version: '1.0.0'
  };
})();
