// === HumanJS Framework ===
// Global Component Registry
const com = {};

// Core App initializer
function App(config) {
  try {
    const root = document.querySelector(config.root || "#app");
    Router.config(config.routes || {});
    config.init?.();
    Router.set(); // Render initial route
  } catch (e) {
    LogError("App", e);
  }
}

// View function supporting Background, Class, Attrs, Children
function View({
  Type = "div",
  Id,
  Class,
  Html,
  Background = {}, // Inline CSS styles object
  Children = [],
  OnClick,
  Attrs = {}
}) {
  try {
    const el = document.createElement(Type);

    // Set ID
    if (Id) el.id = Id;

    // Set class(es)
    if (Class) {
      el.className = Array.isArray(Class) ? Class.join(" ") : Class;
    }

    // Apply inline styles from Background
    if (Background && typeof Background === "object") {
      Object.assign(el.style, Background);
    }

    // Set inner HTML
    if (Html) el.innerHTML = Html;

    // Set custom attributes
    Object.entries(Attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });

    // Add click event listener
    if (OnClick) el.addEventListener("click", OnClick);

    // Append children (array or object)
    if (Array.isArray(Children)) {
      Children.forEach(child =>
        el.appendChild(typeof child === "string" ? document.createTextNode(child) : child)
      );
    } else if (typeof Children === "object") {
      Object.values(Children).forEach(child =>
        el.appendChild(typeof child === "string" ? document.createTextNode(child) : child)
      );
    }

    return el;
  } catch (e) {
    LogError("View", e);
  }
}

// Helpers for common elements
function Text(text) {
  return View({ Html: text });
}

function Title(txt) {
  return View({ Type: "h1", Html: txt });
}

function Button(label) {
  const el = View({ Type: "button", Html: label });
  el.onClick = fn => {
    el.addEventListener("click", fn);
    return el;
  };
  return el;
}

// === SPA Router with ?page=pageName query param support
const Router = {
  routes: {},
  options: {
    useHash: false,           // We ignore hash usage now
    defaultPage: "main",
    scrollTopOnNavigate: true
  },

  initialActivePage(name) {
    this.options.defaultPage = name || "main";
  },

  config(routes, options = {}) {
    this.routes = routes;
    Object.assign(this.options, options);

    // Always listen to popstate to update content
    window.onpopstate = () => this.set();

    // On DOM ready, set initial route
    document.addEventListener("DOMContentLoaded", () => {
      this.set();
    });
  },

  getCurrentPage() {
    // Always get page from query param `page`
    const urlParams = new URLSearchParams(location.search);
    const queryPage = urlParams.get("page");

    // Fallback to default page if not present
    return queryPage || this.options.defaultPage;
  },

  async set() {
    const page = this.getCurrentPage();
    const routeFn = this.routes[page];
    const app = document.querySelector("#app");

    if (!app) return LogError("Router.set", "#app not found");

    app.innerHTML = "";

    if (routeFn) {
      try {
        const view = await routeFn();
        app.appendChild(view);
        document.title = `HumanJS - ${page}`;
        if (this.options.scrollTopOnNavigate) window.scrollTo(0, 0);
        Log(`Route loaded: ${page}`);
      } catch (e) {
        LogError("Router.set", e);
        app.innerHTML = `<h2>Error loading page</h2>`;
      }
    } else {
      app.innerHTML = `<h2>404 - Page Not Found</h2>`;
      LogError("Router.set", `Page not found: ${page}`);
    }
  }
};

const Route = {
  to(pageName) {
    const newUrl = `?page=${encodeURIComponent(pageName)}`;

    history.pushState({}, "", newUrl);
    Router.set();
  },

  replace(pageName) {
    const newUrl = `?page=${encodeURIComponent(pageName)}`;

    history.replaceState({}, "", newUrl);
    Router.set();
  }
};


// === Logging helpers
function Log(msg) {
  console.warn(`YOU ARE USING PATTERN JS POWERD BY CARBON NATIVE LITE WEB FRAMEWORK. VERSSION 1.`);
}

function LogError(where, error) {
  console.error(`[❌ Error in ${where}]:`, error);
}

// Optional helper to declare components with cleaner syntax
function Component(name, view) {
  com[name] = view;
  return view;
}

/*******************★**********/
/* row
/**row grid**/
function RowGrid({
  Item = [],
  Columns = 3,
  Gap = "10px",
  SpaceTop = "0px",
  SpaceBottom = "0px",
  SpaceLeft = "0px",
  SpaceRight = "0px"
}) {
  try {
    const wrapper = View({
      Type: "div",
      Background: {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${100 / Columns}%, 1fr))`,
        gap: Gap,
        paddingTop: SpaceTop,
        paddingBottom: SpaceBottom,
        paddingLeft: SpaceLeft,
        paddingRight: SpaceRight,
        width: "100%",
        boxSizing: "border-box"
      },
      Children: Item
    });

    return wrapper;
  } catch (e) {
    LogError("RowGrid", e);
  }
}
