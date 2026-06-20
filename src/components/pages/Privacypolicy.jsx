'use client';

import React, { useEffect } from "react";

const PrivacyPolicy = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: 12 February 2026</p>

        <Section title="1. Introduction">
          <p>
            At Digital Neurones, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our services.
          </p>
          {/* <p>
            By using this website, you agree to the practices described in this policy.
          </p> */}
        </Section>

        <Section title="2. Information We Collect">
          <ul>
            <li>Basic usage data such as pages visited and time spent.</li>
            <li>Device information such as browser type and operating system.</li>
            <li>Voluntarily submitted information (e.g., feedback or contact forms).</li>
          </ul>
          <p>
            We do not intentionally collect sensitive personal information.
          </p>
        </Section>

        <Section title="3. How We Use Information">
          <ul>
            <li>To improve website functionality and user experience.</li>
            <li>To maintain platform security.</li>
            <li>To analyze traffic and optimize spiritual content delivery.</li>
            <li>To respond to user inquiries or feedback.</li>
          </ul>
        </Section>

        <Section title="4. Cookies and Tracking">
          <p>
            We may use cookies or similar technologies to enhance user experience.
          </p>
          <p>
            Cookies help us understand website traffic and improve performance.
            You may disable cookies through your browser settings.
          </p>
        </Section>

        <Section title="5. Third-Party Services">
          <ul>
            <li>
              We may use third-party tools such as analytics or streaming providers.
            </li>
            <li>
              Live temple streaming may be hosted by external platforms.
            </li>
            <li>
              We are not responsible for privacy practices of third-party websites.
            </li>
          </ul>
        </Section>

        <Section title="6. Data Protection">
          <p>
            We take reasonable technical and organizational measures to protect
            your information from unauthorized access or misuse.
          </p>
          <p>
            However, no internet transmission can be guaranteed 100% secure.
          </p>
        </Section>

        <Section title="7. Children's Privacy">
          <p>
            This platform is intended for general audiences.
            We do not knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <ul>
            <li>You may request correction of inaccurate information.</li>
            <li>You may request deletion of voluntarily provided data.</li>
            <li>You may disable cookies through your browser settings.</li>
          </ul>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically.
            Continued use of the website indicates acceptance of the updated policy.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have any questions regarding this Privacy Policy,
            please contact us through the official communication channels
            provided on this website.
          </p>
        </Section>
        
        <Section title="11. Legal Basis for Processing">
          <p>
            We collect and process information only for legitimate purposes such
            as providing services, maintaining security, complying with legal
            obligations, and improving user experience.
          </p>
        </Section>

        <Section title="12. Data Retention">
          <p>
            We retain personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, comply with
            legal obligations, resolve disputes, and enforce agreements.
          </p>
        </Section>

        <Section title="13. User Account Information">
          <p>
            If users create accounts on our platform, they are responsible for
            maintaining the confidentiality of their login credentials.
          </p>
          <p>
            Users should promptly notify us of any unauthorized use of their
            accounts.
          </p>
        </Section>

        <Section title="14. Payment Information">
          <p>
            For donations, subscriptions, or purchases, payment transactions may
            be processed through secure third-party payment gateways.
          </p>
          <p>
            We do not store complete credit/debit card details on our servers.
          </p>
        </Section>

        <Section title="15. International Data Transfers">
          <p>
            If any third-party services process data outside India, such
            transfers shall be subject to appropriate safeguards and applicable
            legal requirements.
          </p>
        </Section>

        <Section title="16. Data Security Measures">
          <p>
            We implement industry-standard security measures including:
          </p>

          <ul>
            <li>Encryption mechanisms</li>
            <li>Secure servers</li>
            <li>Access controls</li>
            <li>Regular monitoring</li>
            <li>Reasonable administrative safeguards</li>
          </ul>

          <p>
            These measures are designed to help protect user information from
            unauthorized access, disclosure, alteration, or misuse.
          </p>
        </Section>

        <Section title="17. Grievance Officer">
          <p>
            In accordance with applicable laws, users may contact our designated
            Grievance Officer for concerns related to privacy, data protection,
            or information handling.
          </p>

          <h4 style={{ marginTop: "15px", color: "#fbbf24" }}>
            Grievance Officer Details
          </h4>

          <ul>
            <li>Name: __________________</li>
            <li>Email: __________________</li>
            <li>Phone: __________________</li>
            <li>Address: __________________</li>
          </ul>
        </Section>

        <Section title="18. Compliance with Indian Laws">
          <p>
            This Privacy Policy shall be governed by the laws of India,
            including applicable provisions of the Digital Personal Data
            Protection Act, 2023 (DPDP Act), and related regulations.
          </p>
        </Section>

        <Section title="19. Consent">
          <p>
            By accessing or using this website, users acknowledge that they
            have read, understood, and agreed to the collection and use of
            information as described in this Privacy Policy.
          </p>
        </Section>

        <Section title="20. Withdrawal of Consent">
          <p>
            Where consent is the basis for processing personal information,
            users may withdraw such consent at any time by contacting us,
            subject to legal and operational requirements.
          </p>
        </Section>

        <Section title="21. Links to External Websites">
          <p>
            Our website may contain links to external websites.
          </p>
          <p>
            We encourage users to review the privacy policies of those websites
            before providing any personal information.
          </p>
        </Section>

        <Section title="22. Contact Information">
          <p>
            For privacy-related requests, concerns, or complaints, please
            contact:
          </p>

          <ul>
            <li>Email: __________________</li>
            <li>Phone: __________________</li>
            <li>Address: __________________</li>
          </ul>
        </Section>



        <p style={styles.footerNote}>
          Your trust is sacred to us. 🙏
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

export default PrivacyPolicy;
