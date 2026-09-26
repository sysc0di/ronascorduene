import "./Contact.css";

export default function ContactPage() {
  return (
    <main className="contact-page">
      {/* HERO */}

      <section className="contact-hero">
        <div className="contact-hero-meta">
          <span>02</span>
          <span>RONAS / CONTACT</span>
        </div>

        <div className="contact-hero-line" />

        <div className="contact-hero-content">
          <div className="contact-label">
            ENGINEERED FOR THE ROAD
          </div>

          <h1>
            LET&apos;S
            <br />
            TALK.
          </h1>

          <p>
            Have a project in mind, need more information about
            our equipment, or simply want to get in touch?
            Send us a message.
          </p>
        </div>
      </section>

      {/* CONTACT INFORMATION */}

      <section className="contact-info">
        <div className="contact-section-header">
          <span>01</span>
          <span>CONTACT INFORMATION</span>
        </div>

        <div className="contact-info-grid">
          <a
            href="mailto:hello@ronascorduene.com"
            className="contact-info-item"
          >
            <span className="contact-info-number">01</span>

            <div>
              <span className="contact-info-label">EMAIL</span>
              <strong>hello@ronascorduene.com</strong>
            </div>

            <span className="contact-arrow">↗</span>
          </a>

          <div className="contact-info-item">
            <span className="contact-info-number">02</span>

            <div>
              <span className="contact-info-label">LOCATION</span>
              <strong>CORDUENE / TURKEY</strong>
            </div>
          </div>

          <a
            href="#"
            className="contact-info-item"
          >
            <span className="contact-info-number">03</span>

            <div>
              <span className="contact-info-label">INSTAGRAM</span>
              <strong>@RONASCORDUENE</strong>
            </div>

            <span className="contact-arrow">↗</span>
          </a>
        </div>
      </section>

      {/* FORM */}

      <section className="contact-form-section">
        <div className="contact-section-header">
          <span>02</span>
          <span>SEND A MESSAGE</span>
        </div>

        <form className="contact-form">
          <div className="contact-form-row">
            <label>
              <span>01 / NAME</span>

              <input
                type="text"
                name="name"
                placeholder="Your name"
              />
            </label>

            <label>
              <span>02 / EMAIL</span>

              <input
                type="email"
                name="email"
                placeholder="Your email"
              />
            </label>
          </div>

          <label>
            <span>03 / SUBJECT</span>

            <input
              type="text"
              name="subject"
              placeholder="What can we help with?"
            />
          </label>

          <label>
            <span>04 / MESSAGE</span>

            <textarea
              name="message"
              rows={6}
              placeholder="Tell us about your project..."
            />
          </label>

          <button type="submit" className="contact-submit">
            <span>SEND MESSAGE</span>
            <span>↗</span>
          </button>
        </form>
      </section>

      {/* BOTTOM */}

      <section className="contact-bottom">
        <div className="contact-bottom-line" />

        <div className="contact-bottom-content">
          <span>RONAS CORDUENE</span>

          <strong>
            BUILT
            <br />
            TO MOVE.
          </strong>

          <span>AUTOMOTIVE EQUIPMENT</span>
        </div>
      </section>
    </main>
  );
}
