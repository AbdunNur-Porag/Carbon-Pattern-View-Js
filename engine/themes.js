const Themes = (function () {
  const themes = {};
  let currentStyleTag = null;

  function injectCss(cssText) {
    // Remove old style tag if exists
    if (currentStyleTag) {
      currentStyleTag.remove();
      currentStyleTag = null;
    }
    // Create new style tag
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = cssText;
    document.body.appendChild(style);
    currentStyleTag = style;
  }

  return {
    config(newThemes) {
      // Merge new themes into existing
      Object.assign(themes, newThemes);
    },

    apply(name) {
      if (!themes[name]) {
        console.warn(`Themes: No theme found with name '${name}'`);
        return;
      }
      // Inject CSS for the theme
      injectCss(themes[name]);
    },

    getThemes() {
      return { ...themes };
    }
  };
})();
