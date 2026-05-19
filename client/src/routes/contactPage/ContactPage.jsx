import "./contactPage.scss";

function ContactPage() {
  return (
    <div className="contactPage">
      <div className="formContainer">
        <div className="wrapper">
          <h1 className="title">Contact Us</h1>
          <form>
            <div className="item">
              <label>Name</label>
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="item">
              <label>Email</label>
              <input type="email" placeholder="Your Email" />
            </div>
            <div className="item">
              <label>Message</label>
              <textarea rows={5} placeholder="How can we help you?"></textarea>
            </div>
            <button>Send Message</button>
          </form>
        </div>
      </div>
      <div className="infoContainer">
        <div className="wrapper">
          <h2>Get in Touch</h2>
          <div className="contactItem">
            <b>Address:</b>
            <span>123 Real Estate Ave, London, UK</span>
          </div>
          <div className="contactItem">
            <b>Phone:</b>
            <span>+44 20 1234 5678</span>
          </div>
          <div className="contactItem">
            <b>Email:</b>
            <span>support@homenexus.com</span>
          </div>
          <div className="mapPlaceholder">
              <img src="https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
              <div className="overlay">Visit our HQ</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
