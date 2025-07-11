// === RowGrid.js - Universal Grid System ===
// (previous global CSS injection code remains unchanged)

function injectGlobalGridStyles() {
  const css = `
    /* Masonry container */
    .masonry {
      column-gap: 16px;
      column-width: 250px;
    }
    .masonry-item {
      break-inside: avoid;
      margin-bottom: 16px;
      display: inline-block;
      width: 100%;
    }
    /* Scrollbar styles for scrollable grids */
    .scrollable-x {
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      white-space: nowrap;
    }
    .scrollable-y {
      overflow-y: auto;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }
    /* Responsive utility classes */
    @media (max-width: 768px) {
      .grid-responsive-2 {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      .masonry {
        column-width: 150px !important;
      }
    }
    @media (max-width: 480px) {
      .grid-responsive-1 {
        grid-template-columns: repeat(1, 1fr) !important;
      }
      .masonry {
        column-width: 100px !important;
      }
    }
  `;
  if (!document.getElementById("rowgrid-global-style")) {
    const style = document.createElement("style");
    style.id = "rowgrid-global-style";
    style.textContent = css;
    document.head.appendChild(style);
  }
}

injectGlobalGridStyles();

// === Internal helper renamed to gridView ===
function gridView({
  Type = "div",
  Id,
  Class,
  Html,
  Background = {},
  Children = [],
  OnClick,
  Attrs = {}
}) {
  const el = document.createElement(Type);
  if (Id) el.id = Id;
  if (Class) el.className = Array.isArray(Class) ? Class.join(" ") : Class;
  if (Html) el.innerHTML = Html;

  if (Background && typeof Background === "object") {
    Object.assign(el.style, Background);
  }

  Object.entries(Attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (OnClick) el.addEventListener("click", OnClick);

  if (Array.isArray(Children)) {
    Children.forEach(child => {
      if (typeof child === "function") child = child();
      el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
  } else if (typeof Children === "object" && Children !== null) {
    Object.values(Children).forEach(child => {
      if (typeof child === "function") child = child();
      el.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
  }

  return el;
}

// === RowGrid Component ===
function RowGrid({
  Item = [],
  Columns = 3,
  GapBetween = "10px",
  SpaceTop = "0px",
  SpaceBottom = "0px",
  SpaceLeft = "0px",
  SpaceRight = "0px",
  Background = {},
  ItemStyle = {},
  ItemHeight,
  ItemWidth,
  Responsive = false,
  Scroll = false,
  ScrollDirection = "x", // 'x' or 'y'
  GridType = "grid",     // 'grid' | 'row' | 'column' | 'masonry' | 'waterfall'
  Attrs = {},
  // Waterfall options
  WaterfallColumns = 3,
  WaterfallGap = "10px"
}) {
  try {
    let containerStyle = {};
    let containerClass = "";
    let childrenElements = [];

    childrenElements = Item.map(child => {
      return gridView({
        Type: "div",
        Background: {
          height: ItemHeight || (ItemWidth ? "auto" : undefined),
          aspectRatio: (!ItemHeight && !ItemWidth) ? "1 / 1" : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          ...ItemStyle
        },
        Children: [typeof child === "function" ? child() : child]
      });
    });

    switch (GridType) {
      case "grid":
        containerStyle = {
          display: "grid",
          gridTemplateColumns: ItemWidth
            ? `repeat(auto-fill, minmax(${ItemWidth}, 1fr))`
            : `repeat(${Columns}, 1fr)`,
          gap: GapBetween,
          paddingTop: SpaceTop,
          paddingBottom: SpaceBottom,
          paddingLeft: SpaceLeft,
          paddingRight: SpaceRight,
          width: "100%",
          boxSizing: "border-box",
          ...Background
        };
        if (Responsive) {
          containerClass = (Attrs.class || "") + " grid-responsive";
          Attrs.class = containerClass.trim();
        }
        break;

      case "row":
        containerStyle = {
          display: "flex",
          flexWrap: "wrap",
          gap: GapBetween,
          paddingTop: SpaceTop,
          paddingBottom: SpaceBottom,
          paddingLeft: SpaceLeft,
          paddingRight: SpaceRight,
          width: "100%",
          boxSizing: "border-box",
          ...Background
        };
        if (Scroll && ScrollDirection === "x") {
          containerStyle.overflowX = "auto";
          containerStyle.whiteSpace = "nowrap";
          containerStyle.flexWrap = "nowrap";
          containerStyle.WebkitOverflowScrolling = "touch";
        }
        break;

      case "column":
        containerStyle = {
          display: "flex",
          flexDirection: "column",
          gap: GapBetween,
          paddingTop: SpaceTop,
          paddingBottom: SpaceBottom,
          paddingLeft: SpaceLeft,
          paddingRight: SpaceRight,
          width: "100%",
          boxSizing: "border-box",
          ...Background
        };
        if (Scroll && ScrollDirection === "y") {
          containerStyle.overflowY = "auto";
          containerStyle.WebkitOverflowScrolling = "touch";
        }
        break;

      case "masonry":
        containerClass = (Attrs.class || "") + " masonry";
        Attrs.class = containerClass.trim();
        containerStyle = {
          paddingTop: SpaceTop,
          paddingBottom: SpaceBottom,
          paddingLeft: SpaceLeft,
          paddingRight: SpaceRight,
          width: "100%",
          boxSizing: "border-box",
          ...Background
        };
        childrenElements = childrenElements.map(el => {
          el.classList.add("masonry-item");
          return el;
        });
        break;

      case "waterfall":
        containerStyle = {
          position: "relative",
          width: "100%",
          paddingTop: SpaceTop,
          paddingBottom: SpaceBottom,
          paddingLeft: SpaceLeft,
          paddingRight: SpaceRight,
          boxSizing: "border-box",
          ...Background
        };
        break;

      default:
        containerStyle = {
          display: "grid",
          gridTemplateColumns: `repeat(${Columns}, 1fr)`,
          gap: GapBetween,
          paddingTop: SpaceTop,
          paddingBottom: SpaceBottom,
          paddingLeft: SpaceLeft,
          paddingRight: SpaceRight,
          width: "100%",
          boxSizing: "border-box",
          ...Background
        };
        break;
    }

    const container = gridView({
      Type: "div",
      Background: containerStyle,
      Attrs,
      Children: childrenElements
    });

    if (GridType === "waterfall") {
      setTimeout(() => {
        waterfallLayout(container, WaterfallColumns, WaterfallGap);
      }, 50);
      window.addEventListener("resize", () => {
        waterfallLayout(container, WaterfallColumns, WaterfallGap);
      });
    }

    return container;
  } catch (e) {
    LogError("RowGrid", e);
  }
}

// === Waterfall layout function remains the same ===
function waterfallLayout(container, columns = 3, gap = "10px") {
  if (!container) return;

  const children = Array.from(container.children);
  const columnHeights = Array(columns).fill(0);
  const gapPx = parseInt(gap, 10) || 10;

  const containerWidth = container.clientWidth;
  const columnWidth = (containerWidth - gapPx * (columns - 1)) / columns;

  container.style.position = "relative";
  container.style.height = "auto";

  children.forEach(child => {
    child.style.position = "absolute";
    child.style.width = columnWidth + "px";
  });

  children.forEach(child => {
    const minColIndex = columnHeights.indexOf(Math.min(...columnHeights));
    const x = (columnWidth + gapPx) * minColIndex;
    const y = columnHeights[minColIndex];

    child.style.transform = `translate(${x}px, ${y}px)`;
    columnHeights[minColIndex] += child.offsetHeight + gapPx;
  });

  const maxHeight = Math.max(...columnHeights);
  container.style.height = maxHeight + "px";
}

function LogError(where, e) {
  console.error(`[RowGrid.js Error in ${where}]:`, e);
}
