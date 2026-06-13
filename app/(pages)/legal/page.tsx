"use client";
import Logo from "@/components/Logo";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Legal({ 
  onNavigate, 
  page = "terms" 
}: { 
  onNavigate?: (screen: string) => void; 
  page?: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(page);

  const navy = "#0D1529";
  const gold = "#C8A84B";

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-100 px-5 py-3 md:px-12 md:py-4 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition"
          style={{ color: navy }}
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <Link href="/"><Logo /></Link>

        <div className="w-16" />
      </nav>

      {/* TABS */}
      <div className="border-b border-slate-100 px-5 md:px-12">
        <div className="max-w-3xl mx-auto flex gap-1">
          {[
            { id: "terms", label: "Terms of Service" },
            { id: "privacy", label: "Privacy" },
            { id: "contact", label: "Contact" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-4 text-sm font-medium transition relative"
              style={{ color: activeTab === tab.id ? navy : "#64748b" }}
            >
              {tab.label}

              {activeTab === tab.id && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: gold }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 md:px-12 py-10 md:py-16 max-w-3xl mx-auto">
        {/* TERMS - FULL CONTENT */}
        {activeTab === "terms" && (
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Terms & Conditions
            </h1>
            <p className="text-sm text-slate-500 mb-8">Effective date: 3 June 2026 | Last updated: June 2026</p>

            <div className="space-y-8 text-slate-600 leading-relaxed text-base">
              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>1. Definitions</h2>
                <p className="mb-2">In these Terms &amp; Conditions:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>"Service"</strong> means the Zivlo web application available at zivlo.io, including all features, tools and content.</li>
                  <li><strong>"we"</strong>, <strong>"us"</strong> or <strong>"our"</strong> means Dare to Accept Ltd (Companies House number 16010528), a company incorporated in England and Wales with its registered address at 128 City Road, London, EC1V 2NX.</li>
                  <li><strong>"you"</strong> or <strong>"your"</strong> means the person or entity who registers for and uses the Service.</li>
                  <li><strong>"Account"</strong> means your registered user account for the Service.</li>
                  <li><strong>"Subscription"</strong> means your ongoing paid access to the Service.</li>
                  <li><strong>"Lead Data"</strong> means information about UK limited companies displayed by the Service, sourced from Companies House and Google Maps Places.</li>
                  <li><strong>"Content"</strong> means any information, text, graphics or other materials generated through the Service, including sales pitches.</li>
                  <li><strong>"Confidential Information"</strong> means any information disclosed by either party that is marked as confidential or ought reasonably to be considered confidential.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>2. About the Service</h2>
                <p className="mb-2">Zivlo is a business-to-business lead-generation tool. The Service enables you to:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Search for UK limited companies by business type and geographic location;</li>
                  <li>View publicly available information about those companies from Companies House and Google Maps Places;</li>
                  <li>Generate sales pitches based on the Lead Data.</li>
                </ul>
                <p className="mb-2">The Service does NOT send emails or communications to the businesses it surfaces. You are solely responsible for any outreach you conduct using the Lead Data and Content.</p>
                <p>The Service is sold primarily to UK businesses. However, individuals and sole traders may also subscribe. Where consumer protection laws apply to individual subscribers, those rights are not affected by these Terms.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>3. Account Registration</h2>
                <p className="mb-2">To use the Service, you must register for an Account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-1 mb-2">
                  <li>Provide accurate, current and complete information;</li>
                  <li>Maintain the security of your password and not share it with anyone;</li>
                  <li>Promptly notify us of any unauthorised access to or use of your Account;</li>
                  <li>Be fully responsible for all activities that occur under your Account.</li>
                </ul>
                <p className="mb-2">We reserve the right to disable any Account if we reasonably believe you have breached these Terms.</p>
                <p>You must be at least 18 years old and capable of entering into a legally binding contract to use the Service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>4. Subscription and Payment</h2>
                <div className="space-y-3">
                  <p><strong>4.1 Subscription fee</strong> - Access to the Service requires a paid Subscription at GBP £19.99 per month ("Subscription Fee"). The price you see is the price you pay; we are not VAT-registered and no VAT is added.</p>
                  <p><strong>4.2 Payment processing</strong> - Payments are processed by Stripe. By subscribing, you agree to Stripe's terms of service and privacy policy. We do not collect or store your full payment card details.</p>
                  <p><strong>4.3 Billing cycle</strong> - Your Subscription renews automatically each month on the anniversary of your initial sign-up date. You will be charged the Subscription Fee on each renewal date unless you cancel in accordance with Section 4.5. There is no free trial.</p>
                  <p><strong>4.4 Price changes</strong> - We may change the Subscription Fee at any time. If we increase the price, we will give you at least 30 days' notice before the new price takes effect. If you do not agree to the price change, you may cancel your Subscription before the change takes effect.</p>
                  <p><strong>4.5 Cancellation</strong> - You may cancel your Subscription at any time through your Account settings or by contacting us at help@zivlo.io. Cancellation takes effect at the end of your current billing period. You will continue to have access to the Service until the end of that period. If you cancel, your Account will be closed and any Content you have generated will no longer be accessible.</p>
                  <p><strong>4.6 Failed payments</strong> - If a payment fails, we will retry the charge. If payment continues to fail, we may suspend or terminate your access to the Service after giving you reasonable notice.</p>
                  <p><strong>4.7 Refund policy - 14-day cooling-off period</strong> - If you are a consumer (an individual not acting in the course of a business), you have a statutory right to cancel your Subscription within 14 days of your initial sign-up without giving any reason, for a full refund of the Subscription Fee paid. To exercise this right, contact us at help@zivlo.io within the 14-day period. If you use the Service during the 14-day cooling-off period, we may deduct a reasonable amount from the refund to cover the value of the service you have consumed. This 14-day cooling-off right applies only to your initial subscription. It does not apply to renewal months. If you are a business customer, you may still cancel at any time in accordance with Section 4.5, but no refund will be given for partial months already consumed.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>5. Acceptable Use</h2>
                <p><strong>5.1 Permitted use</strong> - You may use the Service solely for lawful business purposes related to your own sales, marketing and business development activities.</p>
                <p className="mt-2"><strong>5.2 Prohibited conduct</strong> - You agree NOT to: use the Service for any unlawful purpose; send unsolicited communications (spam); attempt to gain unauthorised access; interfere with the Service; copy, modify or reverse engineer the Service; use automated systems to access the Service; share your Account credentials; or upload harmful code.</p>
                <p className="mt-2"><strong>5.3 Consequences of breach</strong> - If you breach this Section 5, we may immediately suspend or terminate your Account without notice or refund. We may also take legal action where appropriate.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>6. Lead Data - Important Disclaimers</h2>
                <p><strong>6.1 Nature of Lead Data</strong> - The Lead Data displayed through the Service is sourced from Companies House (the official UK government register of companies) and Google Maps Places (publicly available business listing information). This is public-record information. We do not create, verify or guarantee the accuracy, completeness or currency of the Lead Data.</p>
                <p className="mt-2"><strong>6.2 No guarantee of accuracy</strong> - The Lead Data is provided "as is" and "as available" without any warranty of any kind. You must independently verify any Lead Data before relying on it for business decisions or outreach.</p>
                <p className="mt-2"><strong>6.3 Your responsibility for outreach</strong> - You are solely responsible for deciding whether and how to contact any business identified through the Service, ensuring your communications are accurate and truthful, and complying with all applicable laws (UK GDPR, PECR, etc.).</p>
                <p className="mt-2"><strong>6.4 Corporate subscribers and PECR</strong> - Under PECR, you may generally email corporate bodies for B2B marketing purposes without prior consent, provided you offer a clear opt-out mechanism. However, you must NOT contact sole traders, unincorporated partnerships or individuals without consent. You are responsible for determining the legal status of any business before contacting it. This is general guidance only and does not constitute legal advice.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>7. Intellectual Property</h2>
                <p><strong>7.1 Our rights</strong> - All intellectual property rights in the Service are owned by or licensed to us. These rights are protected by UK and international intellectual property laws.</p>
                <p className="mt-2"><strong>7.2 Licence to you</strong> - We grant you a limited, non-exclusive, non-transferable, non-sublicensable licence to access and use the Service for your internal business purposes during your Subscription.</p>
                <p className="mt-2"><strong>7.3 Content you generate</strong> - You retain ownership of any sales pitches and other Content you generate. However, you grant us a non-exclusive, royalty-free licence to use, reproduce and modify your Content solely to provide and improve the Service.</p>
                <p className="mt-2"><strong>7.4 Feedback</strong> - If you provide feedback, you grant us a perpetual, irrevocable, royalty-free, worldwide licence to use that feedback for any purpose without compensation to you.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>8. Confidentiality</h2>
                <p>Each party agrees to keep the other party's Confidential Information secure and not disclose it to any third party without prior written consent, except as required by law or to perform its obligations under these Terms. This obligation survives termination for 3 years.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>9. Data Protection</h2>
                <p>Our collection and use of personal data is governed by our Privacy Policy. You acknowledge that you are the data controller (and we are not) in respect of any personal data of third parties that you obtain through the Service. A separate Data Processing Agreement is not offered at this time.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>10. Limitation of Liability</h2>
                <p><strong>10.1 No exclusion of liability</strong> - Nothing excludes or limits our liability for death or personal injury caused by our negligence, fraud, or any matter for which it would be unlawful to exclude liability.</p>
                <p className="mt-2"><strong>10.2 Liability cap</strong> - Our total liability to you shall be limited to the total amount you have paid us in Subscription Fees in the 12 months immediately preceding the event giving rise to liability.</p>
                <p className="mt-2"><strong>10.3 Excluded losses</strong> - We shall not be liable for any indirect, consequential, special, punitive or exemplary loss or damage, including loss of profits, goodwill, or data.</p>
                <p className="mt-2"><strong>10.4 Basis of the bargain</strong> - These limitations reflect the risk allocation between you and us. The Subscription Fee has been set accordingly.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>11. Indemnity</h2>
                <p>You agree to indemnify and hold harmless Dare to Accept Ltd from any claims arising out of your breach of these Terms, misuse of the Service, violation of third-party rights, outreach activities, or violation of any applicable law.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>12. Termination</h2>
                <p><strong>12.1 Termination by you</strong> - You may terminate these Terms at any time by cancelling your Subscription.</p>
                <p className="mt-2"><strong>12.2 Termination by us</strong> - We may terminate your Account immediately if you breach any provision, fail to pay, engage in fraudulent/illegal activity, or cause harm to us or third parties.</p>
                <p className="mt-2"><strong>12.3 Effect of termination</strong> - Upon termination, your right to access the Service ceases immediately. We will delete your Account data in accordance with our data retention policy.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>13. Service Availability and Changes</h2>
                <p><strong>13.1 No uptime guarantee</strong> - We do not guarantee uninterrupted access. The Service may be unavailable for maintenance or reasons beyond our control.</p>
                <p className="mt-2"><strong>13.2 Changes to the Service</strong> - We may modify, suspend or discontinue any part of the Service at any time.</p>
                <p className="mt-2"><strong>13.3 No data backup obligation</strong> - We are not responsible for backing up your Content. You are responsible for saving your own Content.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>14. Third-Party Links and Services</h2>
                <p>The Service may contain links to third-party websites. We have no control over and assume no responsibility for their content or practices.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>15. Force Majeure</h2>
                <p>We will not be liable for any failure or delay resulting from causes beyond our reasonable control, including acts of God, war, terrorism, pandemic, government restrictions, strikes, or cyber attacks.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>16. General Provisions</h2>
                <p><strong>16.1 Entire agreement</strong> - These Terms constitute the entire agreement between you and us.</p>
                <p><strong>16.2 Severability</strong> - If any provision is found to be invalid, the remaining provisions continue in effect.</p>
                <p><strong>16.3 Waiver</strong> - Our failure to enforce any right is not a waiver of those rights.</p>
                <p><strong>16.4 Assignment</strong> - You may not assign these Terms without our written consent.</p>
                <p><strong>16.5 Third-party rights</strong> - No third party has any right to enforce these Terms.</p>
                <p><strong>16.6 Governing law and jurisdiction</strong> - These Terms are governed by the laws of England and Wales.</p>
                <p><strong>16.7 Notices</strong> - Notices should be sent to Dare to Accept Ltd, 128 City Road, London, EC1V 2NX, or help@zivlo.io.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>17. Changes to These Terms</h2>
                <p>We may update these Terms from time to time. Material changes will be notified at least 30 days before they take effect. Continued use after changes constitutes acceptance. If you do not agree, cancel your Subscription.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>18. Contact Us</h2>
                <p><strong>Email:</strong> help@zivlo.io</p>
                <p><strong>Post:</strong> Dare to Accept Ltd, 128 City Road, London, EC1V 2NX, United Kingdom</p>
              </section>
            </div>
          </div>
        )}

        {/* PRIVACY - FULL CONTENT */}
        {activeTab === "privacy" && (
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 mb-8">Effective date: 3 June 2026 | Last updated: June 2026</p>

            <div className="space-y-8 text-slate-600 leading-relaxed text-base">
              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>1. Introduction</h2>
                <p>This Privacy Policy explains how Dare to Accept Ltd ("we", "our", or "us") collects, uses, stores and protects your personal data when you use Zivlo ("the Service"), a business-to-business lead-generation tool available at zivlo.io.</p>
                <p className="mt-2">We are committed to protecting your personal data and respecting your privacy rights under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This policy tells you what data we collect, why we collect it, how long we keep it, and what rights you have.</p>
                <p className="mt-2">By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please do not use the Service.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>2. Who We Are</h2>
                <p>The data controller responsible for your personal data is:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Company name:</strong> Dare to Accept Ltd</li>
                  <li><strong>Companies House number:</strong> 16010528</li>
                  <li><strong>Registered address:</strong> 128 City Road, London, EC1V 2NX, United Kingdom</li>
                  <li><strong>ICO registration number:</strong> ZC138888</li>
                  <li><strong>Website:</strong> zivlo.io</li>
                  <li><strong>Contact email:</strong> help@zivlo.io</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>3. What Personal Data We Collect</h2>
                <p><strong>3.1 Account information</strong> - When you register, we collect your full name, email address, encrypted password, and any other information you voluntarily provide.</p>
                <p className="mt-2"><strong>3.2 Payment information</strong> - All payments are processed by Stripe. We do not collect, store or have access to your full payment card details. Stripe provides us with the last four digits of your card, card expiry date, billing address, and payment confirmation.</p>
                <p className="mt-2"><strong>3.3 Usage data</strong> - We automatically collect IP address, browser type, pages visited, search queries, feature usage, and error reports.</p>
                <p className="mt-2"><strong>3.4 Communications</strong> - When you contact us, we collect your email address and any information you include in your message.</p>
                <p className="mt-2"><strong>3.5 Cookies</strong> - We use only strictly necessary cookies (session and security). We do not use analytics, tracking or marketing cookies.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>4. Lawful Basis for Processing</h2>
                <p>Under UK GDPR, we rely on Contract (Article 6(1)(b)) to perform our contract with you, Legitimate interests (Article 6(1)(f)) for fraud prevention and service improvement, and Legal obligation (Article 6(1)(c)) for tax record-keeping.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>5. How We Use Your Personal Data</h2>
                <p>We use your data to provide the Service, process payments, send transactional emails, respond to enquiries, improve the Service, detect and prevent fraud, and comply with legal obligations.</p>
                <p className="mt-2">We do <strong>NOT</strong> send marketing emails, sell your data, or contact businesses on your behalf.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>6. Third Parties and Sub-Processors</h2>
                <p>We use Stripe (payment processing - US/EU), Resend (transactional emails - US), Supabase (database and authentication - outside UK/EEA), and Hostinger (application hosting - EU).</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>7. Data Retention</h2>
                <p>We retain your data while your account is active. After cancellation, we delete your account data within 30 days, except billing records retained for 6 years as required by HMRC.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>8. Data Security</h2>
                <p>All data transmitted is encrypted using TLS (HTTPS). Passwords are hashed using bcrypt. We conduct regular security reviews and vulnerability assessments. Access to personal data is limited to authorised personnel.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>9. International Data Transfers</h2>
                <p>Your data is primarily stored in the UK/EEA. Some sub-processors may transfer data outside the UK with appropriate safeguards (Standard Contractual Clauses).</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>10. Your Data Protection Rights</h2>
                <p>You have the right to access, rectify, erase, restrict, port, and object to processing of your personal data. Contact us at help@zivlo.io to exercise these rights. You also have the right to complain to the ICO at <a href="https://ico.org.uk/make-a-complaint/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint/</a>.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>11. Data About Third-Party Businesses</h2>
                <p>The Service displays public-record data from Companies House and Google Maps. This version does not allow exporting or downloading business contact data.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>12. Data Processing Agreement</h2>
                <p>A separate Data Processing Agreement is not required at this time. If we add data export functionality in a future version, a DPA will be made available.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>13. Children's Privacy</h2>
                <p>The Service is not intended for anyone under 18. We do not knowingly collect personal data from children.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>14. Changes to This Privacy Policy</h2>
                <p>We may update this policy. Material changes will be notified by email or through the Service at least 30 days before they take effect.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3" style={{ color: navy, fontFamily: "Georgia, serif" }}>15. Contact Us</h2>
                <p><strong>Email:</strong> help@zivlo.io</p>
                <p><strong>Post:</strong> Dare to Accept Ltd, 128 City Road, London, EC1V 2NX, United Kingdom</p>
                <p><strong>ICO registration:</strong> ZC138888</p>
              </section>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeTab === "contact" && (
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-2 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Get in touch
            </h1>

            <p className="text-slate-600 mb-10">
              Questions, feedback, or need a hand? We're here.
            </p>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: navy }}
                  >
                    <Mail size={20} style={{ color: gold }} />
                  </div>

                  <div className="flex-1">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: navy, fontFamily: "Georgia, serif" }}
                    >
                      Email support
                    </h3>

                    <p className="text-slate-600 text-sm mb-2">
                      For account help, billing questions, or general queries.
                    </p>

                    <a
                      href="mailto:help@zivlo.io"
                      className="text-sm font-semibold hover:underline"
                      style={{ color: navy }}
                    >
                      help@zivlo.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: navy }}
                  >
                    <MessageCircle size={20} style={{ color: gold }} />
                  </div>

                  <div className="flex-1">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: navy, fontFamily: "Georgia, serif" }}
                    >
                      Legal &amp; Data Protection
                    </h3>

                    <p className="text-slate-600 text-sm mb-2">
                      For privacy or data protection requests.
                    </p>

                    <a
                      href="mailto:legal@zivlo.io"
                      className="text-sm font-semibold hover:underline"
                      style={{ color: navy }}
                    >
                      legal@zivlo.io
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 text-center">
                Dare to Accept Limited<br />
                128 City Road, London, EC1V 2NX<br />
                Company No. 16010528
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}