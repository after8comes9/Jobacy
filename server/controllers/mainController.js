// GET // HOMEPAGE

exports.homepage = async (req, res) => {
  const locals = {
    title: "Jobacy",
    description: "Track your job applications",
  }
  res.render('index', {
    locals,
  });}
