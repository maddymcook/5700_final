exports.get404 = (req, res) => {
    res.status(404).render("404", {
      title: "Page not found"
    });
  };
  
  exports.get500 = (error, req, res, next) => {
    console.error("SERVER ERROR:", error); 
    res.status(500).render("500", {
      title: "Server Error"
    });
  };
  