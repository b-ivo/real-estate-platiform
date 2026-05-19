import "./aboutPage.scss";

function AboutPage() {
  return (
    <div className="aboutPage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">About HomeNexus</h1>
          <p>
            HomeNexus is a leading real estate platform dedicated to helping
            people find their dream homes. With over 16 years of experience in
            the industry, we provide a seamless and professional experience for
            buyers, sellers, and renters.
          </p>
          <p>
            Our mission is to simplify the real estate journey by providing
            accurate data, expert insights, and a user-friendly platform that
            connects you with the best properties and agents in the market.
          </p>
          <div className="stats">
            <div className="stat">
              <h1>16+</h1>
              <span>Years of Experience</span>
            </div>
            <div className="stat">
              <h1>200+</h1>
              <span>Award Gained</span>
            </div>
            <div className="stat">
              <h1>2000+</h1>
              <span>Property Ready</span>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default AboutPage;
