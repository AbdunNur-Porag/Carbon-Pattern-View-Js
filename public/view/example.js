// Declare a reusable component via com.
com.UserCard= View({
  Type: "div",
  Class: ["card", "shadow"],
  Background: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    maxWidth: "300px",
    marginBottom: "20px"
  },
  Children: {
    title: View({
      Type: "h3",
      Html: "👤 Porag",
      Background: { color: "#333", marginBottom: "5px" }
    }),
    desc: View({Type:"Button",Id:"nameBt"})
  }
});

// HomePage using component and button navigation
function HomePage() {
  return View({
    Type: "div",
    Id: "home-page",
    Background: { padding: "20px" },
    Children: {
      t:Title("🏠 Home Page"),
      x:com.UserCard,
     b:Button("Go to About").onClick(() => Route.to("about"))
  }
  });
}

// AboutPage with back button
function AboutPage() {
  return View({
    Type: "div",
    Id: "about-page",
    Background: { padding: "20px" },
    Children: [
      Title("📖 About Page"),
      Text("You navigated here using HumanJS Router."),
      Button("Back to Home").onClick(() => Route.to("home"))
    ]
  });
}

//com.UserCard.Children.desc.onClick(()=>{})
// Initialize the app
Themes.apply('dark');

App({
  root: "#app",
  routes: {
    home: HomePage,
    about: AboutPage,
  },
  init() {
    Log("App Ready ✅");
  }
});
