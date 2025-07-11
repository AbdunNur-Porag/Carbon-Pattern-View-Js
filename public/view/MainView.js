Style={
  Artical_1:{
    marginLeft:"10px",
    marginRight:"10px",
  }
}

com.header=View({
  Type:"Header",
  Class:["top"],
  Children:{
    Nav:View({Type:"Nav",Class:["top"]})
  }
})

com.footer=View({
  Type:"Footer",
  Class:["bottom"]
})

function Title(){
  Title=[1,2,3,4,5,6,7,8,9,10]
  return View({
    Type:"Div",
    Children:Title.map(everyItem=>View({Type:"h1",Html:everyItem}))
  })
}

// rowgrid
com.RowGrid = RowGrid({
  Columns: 5,
  Gap: "5px",
  Item:[
    Button("Hello"),Button("Hello"),Button("Hello"),Button("Hello"),Button("Hello"),Button("Hello"),Button("Hello"),Button("Hello"),
    
  ]
  
});
/// All Grid View
// Assume RowGrid and gridView are defined as per previous code

// Helper to create simple text nodes wrapped in a div with background
function createItemText(text, bg = "#ddd") {
  return gridView({
    Html: text,
    Background: {
      padding: "10px",
      backgroundColor: bg,
      borderRadius: "6px",
      textAlign: "center",
      fontWeight: "600",
      userSelect: "none"
    }
  });
}

// === Example 1: Basic Grid (responsive) ===
com.gridEx1 = RowGrid({
  Columns: 4,
  GapBetween: "12px",
  Responsive: true,
  GridType: "grid",
  Item: Array.from({ length: 12 }, (_, i) =>
    createItemText(`Grid ${i + 1}`, "#a0c4ff")
  )
});

// === Example 2: Scrollable Horizontal Row ===
com.gridEx2 = RowGrid({
  GapBetween: "10px",
  GridType: "row",
  Scroll: true,
  ScrollDirection: "x",
  ItemStyle: { width: "120px", height: "100px", backgroundColor: "#ffadad" },
  Item: Array.from({ length: 15 }, (_, i) => createItemText(`Scroll ${i + 1}`, "#ffadad"))
});

// === Example 3: Scrollable Vertical Column ===
com.gridEx3 = RowGrid({
  GapBetween: "10px",
  GridType: "column",
  Scroll: true,
  ScrollDirection: "y",
  ItemStyle: { width: "100%", height: "80px", backgroundColor: "#ffd6a5" },
  Item: Array.from({ length: 10 }, (_, i) => createItemText(`Column ${i + 1}`, "#ffd6a5")),
  Background: { maxHeight: "300px", border: "1px solid #ddd", padding: "5px" }
});

// === Example 4: Masonry Grid ===
com.gridEx4 = RowGrid({
  GridType: "masonry",
  GapBetween: "0px",
  Item: Array.from({ length: 15 }, (_, i) => {
    const h = 80 + (i % 5) * 30;
    return gridView({
      Html: `Masonry ${i + 1}`,
      Background: {
        height: h + "px",
        backgroundColor: "#b5ead7",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px",
        userSelect: "none"
      }
    });
  }),
  Background: { padding: "10px" }
});

// === Example 5: Waterfall Grid ===
com.gridEx5 = RowGrid({
  GridType: "waterfall",
  WaterfallColumns: 4,
  WaterfallGap: "1px",
  Item: Array.from({ length: 20 }, (_, i) => {
    const h = 80 + Math.floor(Math.random() * 100);
    return gridView({
      Html: `Waterfall ${i + 1}`,
      Background: {
        height: h + "px",
        backgroundColor: "#ffd6a5",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "12px",
        userSelect: "none"
      }
    });
  }),
  Background: { padding: "10px" }
});

// === Combine all grids into a single View ===
com.AllGrid = gridView({
  Type: "div",
  Background: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  Children: [
    gridView({ Html: "<h2>Example 1: Basic Grid</h2>" }),
    com.gridEx1,
    gridView({ Html: "<h2>Example 2: Scrollable Horizontal Row</h2>" }),
    com.gridEx2,
    gridView({ Html: "<h2>Example 3: Scrollable Vertical Column</h2>" }),
    com.gridEx3,
    gridView({ Html: "<h2>Example 4: Masonry Grid</h2>" }),
    com.gridEx4,
    gridView({ Html: "<h2>Example 5: Waterfall Grid</h2>" }),
    com.gridEx5
  ]
});

// === Append combined grids to document body or #app ===















com.body=View({
  Type:"Article",
  Background:Style.Artical_1,
  Children:{
    Title:Title(),
    RowGrid:com.RowGrid,
    AllGrid:com.AllGrid
  }
})

function MainView(){
  return View({
    Type:"div",
    Children:{
      header:com.header,
      body:com.body,
      footer:com.footer,
    }
  })
}
Themes.apply("light");

App({
  root: "#app",
  routes: {
    main:MainView
    
  },
  init() {
    Log("App Ready ✅");
  }
});
