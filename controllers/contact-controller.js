const Contact = require("../models/contact-model");

exports.getContact = (req, res, next) => {
  try {
    res.render("contact", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
    });
  } catch (err) {
    next(err);
  }
};

exports.getThanks = (req, res, next) => {
  try {
    res.render("thanks", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
    });
  } catch (err) {
    next(err);
  }
};

exports.postContact = async (req, res, next) => {
  try {
    const response = new Contact({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      postDate: new Date(),
    });

    await response.save();

    res.redirect("/contacts/thanks");
  } catch (err) {
    console.log(err);

    res.render("contact", {
      pageTitle: "Contact Us",
      pageClass: "contact-page",
      errorMessage: "An error occurred, please try again.",
      formData: req.body,
    });

  }
};

exports.getUnansweredContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({
      $or: [
        { responseDate: { $exists: false } },
        { responseDate: null },
        { response: { $exists: false } },
        { response: "" },
      ],
    }).sort({ createdAt: -1 });

    res.render("contact-list", {
      pageTitle: "Contact Requests",
      pageClass: "contact-list-page",
      contacts,
    });
  } catch (err) {
    console.error(err);
    // Let the global 500 handler show the 500 page
    next(err);
  }
};

exports.getContactResponseForm = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      // This is a real "not found" → 404 is fine
      return res.status(404).render("404", {
        pageTitle: "Contact Not Found",
        pageClass: "error-page",
      });
    }

    res.render("contact-response", {
      pageTitle: "Respond to Contact",
      pageClass: "contact-response-page",
      contact,
    });
  } catch (err) {
    console.error(err);
    next(err); 
  }
};

exports.postContactResponse = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const { response } = req.body;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).render("404", {
        pageTitle: "Contact Not Found",
        pageClass: "error-page",
      });
    }

    contact.response = response;
    contact.responseDate = new Date();

    await contact.save();

    res.redirect("/contacts/admin/respond");
  } catch (err) {
    console.error(err);
    next(err); 
  }
};


