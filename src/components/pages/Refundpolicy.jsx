'use client';

import React, { useEffect } from "react";

const RefundPolicy = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Refund Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: 12 February 2026</p>

        <Section title="1. Introduction">
          <p>
            At Digital Neurones, we strive to provide a seamless and satisfactory
            experience for all users. This Refund Policy outlines the terms and
            conditions under which refunds may be issued.
          </p>
        </Section>

        <Section title="2. Eligibility for Refunds">
          <ul>
            <li>Refunds may be applicable for failed or duplicate transactions.</li>
            <li>If a service was not delivered as promised, you may request a refund.</li>
            <li>Requests must be made within a reasonable time from the transaction date.</li>
          </ul>
        </Section>

        <Section title="3. Non-Refundable Situations">
          <ul>
            <li>Completed and successfully delivered services are non-refundable.</li>
            <li>Incorrect information provided by the user is not eligible for refund.</li>
            <li>Delays caused by third-party platforms are not under our control.</li>
          </ul>
        </Section>

        <Section title="4. Refund Process">
          <p>
            To request a refund, users must contact us through official communication
            channels with transaction details and reason for the request.
          </p>
          <p>
            Once verified, eligible refunds will be processed within 5–7 business days.
          </p>
        </Section>

        <Section title="5. Payment Method">
          <p>
            Refunds will be credited back to the original payment method used during
            the transaction.
          </p>
          <p>
            Processing time may vary depending on your bank or payment provider.
          </p>
        </Section>

        <Section title="6. Cancellation Policy">
          <ul>
            <li>Users may cancel a service before it has been initiated.</li>
            <li>Cancellation after service initiation may not be eligible for refund.</li>
          </ul>
        </Section>

        <Section title="7. Changes to This Policy">
          <p>
            We may update this Refund Policy from time to time.
            Continued use of our services indicates acceptance of the updated terms.
          </p>
        </Section>

        <Section title="8. Contact Us">
          <p>
            If you have any questions regarding refunds or cancellations,
            please contact us through the official communication channels
            provided on this website.
          </p>
        </Section>
       
        <Section title="9. Refund Request Documentation">
          <p>
            The Company may require supporting documents, transaction receipts,
            payment confirmations, screenshots, or any other information
            necessary to verify the refund request.
          </p>
          <p>
            Failure to provide the required information may result in rejection
            of the refund claim.
          </p>
        </Section>

        <Section title="10. Partial Refunds">
          <p>
            In certain cases, only a partial refund may be granted if a portion
            of the service has already been delivered, utilized, or completed.
          </p>
        </Section>

        <Section title="11. Chargebacks and Payment Disputes">
          <p>
            Customers are encouraged to contact us before initiating any
            chargeback or payment dispute with their bank or payment provider.
          </p>
          <p>
            Fraudulent or unjustified chargebacks may result in suspension of
            services and legal action where applicable.
          </p>
        </Section>

        <Section title="12. Digital Services and Downloads">
          <p>
            Once digital products, reports, certificates, documents, software,
            downloadable content, or customized services have been delivered or
            accessed, no refund shall be provided unless required by applicable
            law.
          </p>
        </Section>

        <Section title="13. Customized or Personalized Services">
          <p>
            Services specifically customized, personalized, or prepared
            according to customer requirements are non-refundable once work has
            commenced.
          </p>
        </Section>

        <Section title="14. Service Rejection Rights">
          <p>
            We reserve the right to refuse any refund request that does not
            comply with this Refund Policy or where misuse, abuse, or fraudulent
            activity is suspected.
          </p>
        </Section>

        <Section title="15. Force Majeure">
          <p>
            Refunds shall not be provided for delays or interruptions caused by
            events beyond our reasonable control.
          </p>
          <ul>
            <li>Natural disasters</li>
            <li>Government actions</li>
            <li>Internet outages</li>
            <li>Technical failures</li>
            <li>Cyber incidents</li>
            <li>Other force majeure events</li>
          </ul>
        </Section>

        <Section title="16. Refund Approval">
          <p>
            All refund requests are subject to review and approval by our
            management team.
          </p>
          <p>
            Submission of a refund request does not guarantee approval.
          </p>
        </Section>

        <Section title="17. Taxes and Government Fees">
          <p>
            Government fees, statutory charges, taxes, filing fees,
            registration fees, and third-party charges paid on behalf of the
            customer are generally non-refundable unless refunded by the
            relevant authority.
          </p>
        </Section>

        <Section title="18. Communication of Refund Status">
          <p>
            Customers will be informed about the status of their refund request
            through the registered email address or other contact details
            provided at the time of service purchase.
          </p>
        </Section>

        <Section title="19. Limitation of Liability">
          <p>
            The Company’s liability relating to any refund shall be limited to
            the amount actually paid by the customer for the relevant service.
          </p>
        </Section>

        <Section title="20. Governing Law and Jurisdiction">
          <p>
            This Refund Policy shall be governed by and construed in accordance
            with the laws of India.
          </p>
          <p>
            Any disputes arising from this policy shall be subject to the
            exclusive jurisdiction of the courts located in Nagpur,
            Maharashtra, India.
          </p>
        </Section>



        <p style={styles.footerNote}>
          Your satisfaction matters to us. 🙏
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

export default RefundPolicy;