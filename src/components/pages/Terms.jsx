'use client';

import React, { useEffect } from "react";

const Terms = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Terms & Conditions</h1>
        <p style={styles.lastUpdated}>Last Updated: 12 February 2026</p>

        <Section title="1. Purpose of the Platform">
          <p>
            This website is a spiritual and devotional platform created to provide
            access to the Bhagavad Gita, live temple darshan, Panchang
            (Hindu calendar), and other sacred spiritual content.
          </p>
          <p>
            All information is provided strictly for spiritual, devotional,
            and educational purposes.
          </p>
        </Section>

        <Section title="2. Acceptance of Terms">
          <p>
            By accessing or using the services provided by Digital Neurones ("Company"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
          </p>
        </Section>

        <Section title="3. Spiritual Content Disclaimer">
          <ul>
            <li>
              Scriptural texts such as the Bhagavad Gita are shared for
              educational and devotional purposes.
            </li>
            <li>
              Interpretations may vary according to different traditions.
            </li>
            <li>
              We do not claim exclusive authority over any religious teaching.
            </li>
            <li>
              Users are encouraged to seek guidance from qualified spiritual
              teachers when needed.
            </li>
          </ul>
        </Section>

        <Section title="4. Panchang Disclaimer">
          <p>
            Panchang details such as Tithi, Nakshatra, Muhurat, and festival
            dates are provided for general informational purposes.
          </p>
          <p>
            While we strive for accuracy, we do not guarantee error-free
            calculations. For important rituals, please consult a qualified
            astrologer or priest.
          </p>
        </Section>

        <Section title="5. Live Temple Streaming">
          <ul>
            <li>
              Live temple streams are provided as a devotional service.
            </li>
            <li>
              We may not own or control third-party streaming sources.
            </li>
            <li>
              Streaming availability may change without notice.
            </li>
            <li>
              We are not responsible for interruptions or technical issues.
            </li>
          </ul>
        </Section>

        <Section title="6. User Conduct">
          <p>Users agree NOT to:</p>
          <ul>
            <li>Post abusive, hateful, or disrespectful content.</li>
            <li>Misuse religious material.</li>
            <li>Attempt to hack or damage the platform.</li>
            <li>Use the website for unlawful activities.</li>
          </ul>
          <p>
            We reserve the right to restrict access to users who violate these
            guidelines.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            The website design, layout, and original content are protected by
            applicable intellectual property laws.
          </p>
          <p>
            Sacred texts are shared where legally permissible. Content may not
            be copied or used for commercial purposes without permission.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            We are not responsible for decisions made based on Panchang data,
            scriptural interpretations, or technical interruptions.
          </p>
          <p>
            Use of this platform is at your own discretion.
          </p>
        </Section>

        <Section title="9. Changes to Terms">
          <p>
            We may update these Terms and Conditions from time to time.
            Continued use of the website indicates acceptance of updated terms.
          </p>
        </Section>
        <Section title="10. Eligibility to Use the Platform">
          <p>
            Users must be at least 18 years of age or have the consent of a
            parent or legal guardian to use this platform.
          </p>
        </Section>

        <Section title="11. User Accounts">
          <p>
            If user registration is enabled, users are responsible for
            maintaining the confidentiality of their account credentials and
            for all activities conducted through their accounts.
          </p>
        </Section>

        <Section title="12. Donations and Payments">
          <p>
            Any donations, subscriptions, or payments made through the platform
            are voluntary and subject to the applicable Refund Policy.
          </p>
          <p>
            Payment processing may be handled by authorized third-party service
            providers.
          </p>
        </Section>

        <Section title="13. Third-Party Services and Links">
          <p>
            The platform may contain links to third-party websites,
            applications, streaming services, or resources.
          </p>
          <p>
            We do not control and are not responsible for the content,
            availability, or practices of such third-party services.
          </p>
        </Section>

        <Section title="14. Service Availability">
          <p>
            We strive to keep the platform operational at all times.
          </p>
          <p>
            However, we do not guarantee uninterrupted access and may suspend,
            modify, or discontinue services without prior notice for
            maintenance, upgrades, or other operational reasons.
          </p>
        </Section>

        <Section title="15. No Professional Advice">
          <p>
            Content available on the platform, including Panchang information,
            spiritual teachings, and devotional material, is provided for
            informational and devotional purposes only.
          </p>
          <p>
            Such content should not be considered legal, financial, medical,
            astrological, or professional advice.
          </p>
        </Section>

        <Section title="16. Indemnification">
          <p>
            Users agree to indemnify and hold harmless Digital Neurones, its
            owners, employees, affiliates, and partners from any claims,
            losses, damages, liabilities, or expenses arising from misuse of
            the platform or violation of these Terms and Conditions.
          </p>
        </Section>

        <Section title="17. Termination of Access">
          <p>
            We reserve the right to suspend or terminate user access to the
            platform at our sole discretion if any provision of these Terms and
            Conditions is violated.
          </p>
        </Section>

        <Section title="18. Force Majeure">
          <p>
            We shall not be liable for any delay, interruption, or failure in
            performance resulting from events beyond our reasonable control.
          </p>
          <ul>
            <li>Natural disasters</li>
            <li>Government actions</li>
            <li>Internet failures</li>
            <li>Power outages</li>
            <li>Cyberattacks</li>
            <li>Acts of God</li>
          </ul>
        </Section>

        <Section title="19. Governing Law and Jurisdiction">
          <p>
            These Terms and Conditions shall be governed by and construed in
            accordance with the laws of India.
          </p>
          <p>
            Any disputes arising from the use of the platform shall be subject
            to the exclusive jurisdiction of the courts located in Nagpur,
            Maharashtra, India.
          </p>
        </Section>

        <Section title="20. Severability">
          <p>
            If any provision of these Terms and Conditions is found to be
            invalid or unenforceable, the remaining provisions shall continue
            in full force and effect.
          </p>
        </Section>

        <Section title="21. Entire Agreement">
          <p>
            These Terms and Conditions, together with the Privacy Policy and
            Refund Policy, constitute the entire agreement between the user and
            Digital Neurones regarding use of the platform.
          </p>
        </Section>

        <Section title="22. Contact Information">
          <p>
            For any questions, concerns, or notices relating to these Terms and
            Conditions, please contact us through the official contact details
            provided on the website.
          </p>
        </Section>



        <p style={styles.footerNote}>
          May this platform support your spiritual journey. 🙏
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <div style={styles.sectionContent}>{children}</div>
  </div>
);

const styles = {
  page: {

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // padding: "40px 20px",

  },
  card: {
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
    color: "#ffffff",
  },
  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  lastUpdated: {
    textAlign: "center",
    fontSize: "0.9rem",
    opacity: 0.7,
    marginBottom: "30px",
  },
  section: {
    marginBottom: "28px",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#fbbf24",
  },
  sectionContent: {
    fontSize: "0.95rem",
    lineHeight: "1.7",
    opacity: 0.9,
  },
  footerNote: {
    textAlign: "center",
    marginTop: "40px",
    fontStyle: "italic",
    opacity: 0.8,
  },
};

export default Terms;
