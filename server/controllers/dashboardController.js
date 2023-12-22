const Job = require("../models/Job");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;




// GET // DASHBOARD

exports.dashboard = async (req, res) => {

  const locals = {
    title: "Dashboard",
    description: "Track your job applications",
  };

 const token = req.cookies.jwt;
  const user = jwt.verify(token, jwtSecret, (err, decodedToken) => {
    return decodedToken.id;
  })

  try {
    const jobs = await Job.find({ user: user })

    res.render('dashboard/index', {
      userName: locals.userName,
      locals,
      jobs,
    });

  } catch (error) {
    console.log(error);
  }
};

// GET // MY PROFILE

exports.myProfile = async (req, res) => {
  const locals = {
    title: "Jobacy - My Profile",
    description: "Track your job applications",
  };

  res.render("dashboard/myProfile", locals)
};

// GET // VIEW JOB

exports.dashboardViewJob = async (req, res) => {
  const locals = {
    title: "Jobacy - View Job",
    description: "Track your job applications",
  };

  const token = req.cookies.jwt;
  const user = jwt.verify(token, jwtSecret, (err, decodedToken) => {
    return decodedToken.id;
  })

  const job = await Job.findById({ _id: req.params.id })
    .where({ user: user })
    .lean();

  if (job) {
    res.render("dashboard/view-job", {
      jobID: req.params.id,
      job,
      locals
    });
  } else {
    res.send("Something went wrong.");
  }
};

// PUT // UPDATE JOB

exports.dashboardUpdateJob = async (req, res) => {

  const token = req.cookies.jwt;
  const user = jwt.verify(token, jwtSecret, (err, decodedToken) => {
    return decodedToken.id;
  })

  try {
    await Job.findOneAndUpdate(
      { _id: req.params.id },
      { jobTitle: req.body.jobTitle,
        companyName: req.body.companyName,
        website: req.body.website,
        contactName: req.body.contactName,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        address: req.body.address,
        origin: req.body.origin,
        status: req.body.status,
        comments: req.body.comments,
        updatedAt: Date.now() }
    ).where({ user: user });
    res.redirect(`/dashboard/item/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
};

// DELETE // DELETE JOB

exports.dashboardDeleteJob = async (req, res) => {

  const token = req.cookies.jwt;
  const user = jwt.verify(token, jwtSecret, (err, decodedToken) => {
    return decodedToken.id;
  })

  try {
    await Job.deleteOne({ _id: req.params.id }).where({ user: user });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// GET // ADD JOB

exports.dashboardAddJob = async (req, res) => {
  res.render("dashboard/add", {
  });
};

// POST // ADD JOB

exports.dashboardAddJobSubmit = async (req, res) => {
  const { companyName, jobTitle, website, contactName, contactEmail, contactPhone, address, status, origin, comments } = req.body;

  const token = req.cookies.jwt;
  const user = jwt.verify(token, jwtSecret, (err, decodedToken) => {
    return decodedToken.id;
  })

  try {
    await Job.create({ user, companyName, jobTitle, website, contactName, contactEmail, contactPhone, status, origin, address, comments });
    res.status(201).redirect('/dashboard');
  }
  catch(err) {
    res.status(400).json({ err });
  }
}

exports.editMyProfile_put = async (req, res) => {

  const token = req.cookies.jwt;
  const user = jwt.verify(token, jwtSecret, (err, decodedToken) => {
    return decodedToken.id;
  })

  try {
    await User.findOneAndUpdate(
        { _id: req.params.id },
        { firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          gitHub: req.body.gitHub,
        }
    ).where({ user: user });
    res.redirect(`/dashboard/myProfile/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
};

//////////////

module.exports.changePassword_get = (req, res) => {
  const locals = {
    title: "Jobacy - Change Password",
    description: "Keep track of your job applications",
  }
  res.render('dashboard/changePassword', locals);
  }

///// HANDLE ERRORS FOR PASSWORD CHANGE


const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { password: '' };

  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}



/////


module.exports.changePassword_put = async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.params.id });
    currentUser.password = req.body.password
    await currentUser.save();
    res.status(201).json({ user: currentUser._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });  }

}