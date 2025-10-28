# Nezha-UI 模块化版本

这是哪吒面板美化脚本的模块化版本，将不同功能拆分成独立的 JS 文件，便于按需加载和维护。

## 📁 项目结构

```
Nezha-UI/
├── js/                          # 功能模块目录
│   ├── custom-links.js         # 自定义链接图标模块
│   ├── illustration.js         # 插图插入模块
│   ├── visitor-info.js         # 访客信息显示模块（包含工具函数）
│   ├── effect-fireworks.js     # 烟花特效模块
│   └── effect-rain.js          # 下雨特效模块
├── main.js                      # 主入口文件
├── nezha@v1.html               # 使用示例
└── README.md                    # 说明文档
```

## 🚀 使用方法

### 方式一：引入所有模块（推荐）

```html
<!DOCTYPE html>
<html>
<head>
  <!-- 引入阿里巴巴图标矢量库 -->
  <link rel="stylesheet" href="//at.alicdn.com/t/c/font_4956031_b03xczqy2rs.css" />
</head>
<body>
  
  <!-- 1. 加载功能模块 -->
  <script src="./js/custom-links.js"></script>
  <script src="./js/illustration.js"></script>
  <script src="./js/visitor-info.js"></script>
  <script src="./js/effect-fireworks.js"></script>
  <script src="./js/effect-rain.js"></script>
  
  <!-- 2. 主初始化脚本（必须最后加载） -->
  <script src="./main.js"></script>
  
</body>
</html>
```

### 方式二：按需引入模块

如果只需要某些功能，可以只引入对应的模块：

```html
<!-- 只引入访客信息和烟花特效 -->
<script src="./js/visitor-info.js"></script>
<script src="./js/effect-fireworks.js"></script>
<script src="./main.js"></script>
```

## ⚙️ 配置说明

每个模块的配置变量都在模块文件的顶部，可以直接修改：

### 📌 自定义链接 (custom-links.js)

```javascript
window.CustomLinks = JSON.stringify([
  { link: "https://blog.example.com", name: "Blog", icon: "icon-book" },
  { link: "https://t.me/your_bot", name: "Telegram", icon: "icon-paper-plane" }
]);
window.CustomLinkIconSize = "16px";
window.CustomLinkIconColor = "";
window.CustomLinkIconMarginRight = "1px";
```

### 🖼️ 插图 (illustration.js)

```javascript
window.CustomIllustration = "https://example.com/image.png";
```

### 👤 访客信息 (visitor-info.js)

```javascript
window.VisitorInfoAutoHideDelay = 2600; // 自动隐藏延迟时间（毫秒）
```

### 🎆 烟花特效 (effect-fireworks.js)

```javascript
window.EnableFireworks = true; // 是否启用烟花特效
```

### 🌧️ 下雨特效 (effect-rain.js)

```javascript
window.EnableRainEffect = true; // 是否启用下雨特效
```

## 📦 模块说明

### 1. custom-links.js - 自定义链接图标
为导航栏的链接添加 iconfont 图标，支持自定义图标大小、颜色和间距。

### 2. illustration.js - 插图插入
在页面右下角插入自定义插图，支持淡入动画效果和路由变化时重新插入。

### 3. visitor-info.js - 访客信息显示
显示访客的地理位置、IP、系统、浏览器等信息：
- **PC端**：右下角悬浮按钮，点击展开/收起
- **移动端**：首次弹出3秒后自动隐藏，滚动到底部再次显示

包含工具函数：
- `countryCodeToFlagEmoji()` - 国家代码转国旗Emoji
- `getOS()` - 获取操作系统信息
- `getBrowser()` - 获取浏览器信息
- `getCurrentDate()` - 获取格式化日期

### 4. effect-fireworks.js - 烟花特效
鼠标点击页面时产生彩色粒子爆炸效果，使用对象池优化性能。

### 5. effect-rain.js - 下雨特效
在页面背景渲染持续的下雨动画，支持根据屏幕尺寸自适应雨滴密度。

## 🎯 优势

✅ **模块化架构**：每个功能独立文件，便于维护和调试  
✅ **按需加载**：可根据需求选择性引入模块  
✅ **配置集中**：每个模块的配置都在文件顶部，修改方便  
✅ **无依赖冲突**：模块间相互独立，互不影响  
✅ **易于扩展**：添加新功能只需新建模块文件

## 📝 注意事项

1. **加载顺序**：`main.js` 必须在所有模块文件之后加载
2. **图标字体**：确保引入了正确的 iconfont.css 文件
3. **跨域问题**：某些功能（如访客信息）需要在服务器环境下运行
4. **浏览器兼容性**：建议使用现代浏览器（Chrome, Firefox, Edge, Safari）

## 🔧 开发计划

- [ ] 音乐播放器模块（待单独开发）
- [ ] 更多自定义主题选项
- [ ] 性能优化和代码压缩

## 📄 License

MIT License

