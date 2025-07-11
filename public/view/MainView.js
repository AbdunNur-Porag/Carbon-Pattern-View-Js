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


//RawView([]) test
com.RowButton=RowView({
  Direction: "center",
  Item:[
    VerticalButton({
      img:"hx.png",
      title:"Home"
    })
  ]
  
});




com.body=View({
  Type:"Article",
  Background:Style.Artical_1,
  Children:{
    Title:Title(),
    RowView:com.RowButton,
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
