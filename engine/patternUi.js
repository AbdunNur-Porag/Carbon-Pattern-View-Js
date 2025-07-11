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


/*pre built ui RowView([])*/
function RowView({
  Direction = "center",
  Item = [],
  spaceBetween = 0,
  spaceLeft = 0,
  spaceRight = 0,
  spaceTop = 0,
  spaceBottom = 0,
  scrollAble = false,
  Background = {} // ⬅️ User custom styles
}) {
  const justifyMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end"
  };

  const defaultStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: justifyMap[Direction] || "center",
    alignItems: "stretch",
    width: "100%",
    paddingLeft: `${spaceLeft}px`,
    paddingRight: `${spaceRight}px`,
    paddingTop: `${spaceTop}px`,
    paddingBottom: `${spaceBottom}px`,
    overflowX: scrollAble ? "auto" : "hidden",
    gap: `${spaceBetween}px`,
    boxSizing: "border-box"
  };

  return View({
    Type: "div",
    Background: { ...defaultStyle, ...Background }, // 🔁 Merge custom style
    Children: Item.map(child => {
      return View({
        Type: "div",
        Background: {
          flex: "1 1 0%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box"
        },
        Children: [child]
      });
    })
  });
}



function VerticalButton({ img, title }) {
  return View({
    Type: "button",
    Class: "vertical-button",
    Background: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      backgroundColor: "#f9f9f9",
      cursor: "pointer"
    },
    Children: [
      View({
        Type: "img",
        Attrs: { src: img, alt: title },
        Background: {
          width: "40px",
          height: "40px",
          objectFit: "contain",
          marginBottom: "8px"
        }
      }),
      View({
        Type: "span",
        Html: title,
        Background: {
          fontSize: "14px",
          color: "#333"
        }
      })
    ]
  });
}
