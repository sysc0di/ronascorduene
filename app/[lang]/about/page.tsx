import Image from "next/image";
import "./About.css";

export default function AboutPage() {
  return (
    <main className="about-page">

      {/* HERO */}

      <section className="about-hero">
        <div className="about-hero-meta">
          <span>01</span>
          <span>RONAS / ABOUT</span>
        </div>

        <div className="about-hero-line" />

        <div className="about-hero-content">
          <span className="about-label">
            AUTOMOTIVE EQUIPMENT
          </span>

          <h1>
            BUILT
            <br />
            FOR THE
            <br />
            ROAD.
          </h1>

          <p>
            Ronas Corduene creates automotive equipment where
            engineering, design and character meet.
          </p>
        </div>
      </section>


      {/* STORY */}

      <section className="about-story">

        <div className="about-section-header">
          <span>02</span>
          <span>THE IDEA</span>
        </div>

        <div className="about-story-grid">

          <div className="about-story-number">
            01
          </div>

          <div className="about-story-content">
            <h2>
              FORM
              <br />
              FOLLOWS
              <br />
              FUNCTION.
            </h2>

            <div className="about-story-text">
              <p>
                We believe automotive equipment should never feel
                like an afterthought.
              </p>

              <p>
                Every detail has a purpose. From the shape of a
                component to the way it interacts with the road,
                our approach is built around precision, simplicity
                and intent.
              </p>

              <p>
                Ronas is about creating equipment that belongs
                naturally on the vehicle — not simply adding to it.
              </p>
            </div>
          </div>

        </div>
      </section>


      {/* VALUES */}

      <section className="about-values">

        <div className="about-section-header">
          <span>03</span>
          <span>WHAT DRIVES US</span>
        </div>

        <div className="about-values-grid">

          <article className="about-value">
            <span>01</span>

            <h3>DESIGN</h3>

            <p>
              Clean proportions, deliberate surfaces and a visual
              language designed to complement the vehicle.
            </p>
          </article>

          <article className="about-value">
            <span>02</span>

            <h3>ENGINEERING</h3>

            <p>
              Every solution begins with function, precision and
              the demands of real-world driving.
            </p>
          </article>

          <article className="about-value">
            <span>03</span>

            <h3>CHARACTER</h3>

            <p>
              Equipment should change the presence of a vehicle
              without losing what made it special in the first place.
            </p>
          </article>

        </div>
      </section>


      {/* IMAGE */}

      <section className="about-image-section">

        <div className="about-image">
          <Image
            src="/assets/approach.jpg"
            alt="Ronas automotive design"
            fill
            sizes="100vw"
            className="about-image-content"
          />

          <div className="about-image-overlay" />

          <div className="about-image-caption">
            <span>RONAS / CORDUENE</span>
            <span>ENGINEERED WITH PURPOSE</span>
          </div>
        </div>

      </section>


      {/* CLOSING */}

      <section className="about-closing">

        <div className="about-section-header">
          <span>04</span>
          <span>OUR APPROACH</span>
        </div>

        <div className="about-closing-content">

          <h2>
            MORE
            <br />
            THAN
            <br />
            EQUIPMENT.
          </h2>

          <p>
            We build for the people who see their vehicle as more
            than transportation. Every component is an opportunity
            to make the drive feel more intentional.
          </p>

        </div>

        <div className="about-closing-line" />

        <div className="about-closing-bottom">
          <span>RONAS CORDUENE</span>
          <span>EST. —</span>
          <span>AUTOMOTIVE EQUIPMENT</span>
        </div>

      </section>

    </main>
  );
}
