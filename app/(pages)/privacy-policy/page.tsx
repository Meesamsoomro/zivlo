import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function PrivacyPolicy() {
  const navy = '#0D1529';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition" style={{ color: navy }}>
          <ArrowLeft size={18} />
          Back to home
        </Link>
        <Logo />
        <div className="w-24" /> {/* Spacer for centering */}
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-8 md:p-14 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-12 border-b border-slate-100 pb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: navy, fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 mb-2 font-medium">Zivlo (zivlo.io) - operated by Dare to Accept Ltd</p>
            <div className="text-sm text-slate-500 space-y-1">
              <p>Effective date: 3 June 2026</p>
              <p>Last updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed text-base">
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>1. Introduction</h2>
              <div className="space-y-4">
                <p>This Privacy Policy explains how Dare to Accept Ltd ("we", "our", or "us") collects, uses, stores and protects your personal data when you use Zivlo ("the Service"), a business-to-business lead-generation tool available at zivlo.io.</p>
                <p>We are committed to protecting your personal data and respecting your privacy rights under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This policy tells you what data we collect, why we collect it, how long we keep it, and what rights you have.</p>
                <p>By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please do not use the Service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>2. Who We Are</h2>
              <p className="mb-4">The data controller responsible for your personal data is:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Company name:</strong> Dare to Accept Ltd</li>
                <li><strong>Companies House number:</strong> 16010528</li>
                <li><strong>Registered address:</strong> 128 City Road, London, EC1V 2NX, United Kingdom</li>
                <li><strong>ICO registration number:</strong> ZC138888</li>
                <li><strong>Website:</strong> zivlo.io</li>
                <li><strong>Contact email:</strong> help@zivlo.io</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>3. What Personal Data We Collect</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">3.1 Account information</h3>
                  <p className="mb-2">When you register for a Zivlo account, we collect:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Your full name</li>
                    <li>Email address</li>
                    <li>Account password (encrypted using industry-standard hashing - we cannot read it)</li>
                    <li>Any other information you voluntarily provide</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">3.2 Payment information</h3>
                  <p className="mb-2">All payments are processed by Stripe, our payment processor. We do not collect, store or have access to your full payment card details. Stripe provides us with:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>The last four digits of your payment card</li>
                    <li>Card expiry date</li>
                    <li>Billing address (if provided to Stripe)</li>
                    <li>Payment confirmation and transaction history</li>
                  </ul>
                  <p>Stripe processes your payment data under its own privacy policy. We recommend you review Stripe's privacy policy at <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">3.3 Usage data</h3>
                  <p className="mb-2">We automatically collect information about how you interact with the Service:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Log data:</strong> IP address, browser type and version, pages visited, time and date of visits, time spent on pages</li>
                    <li><strong>Device data:</strong> device type, operating system, unique device identifiers</li>
                    <li><strong>Feature usage:</strong> which features you use, search queries (business type and location terms), generated pitches</li>
                    <li><strong>Error reports:</strong> technical errors or crashes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">3.4 Communications</h3>
                  <p className="mb-2">When you contact us (for example, for support or account queries), we collect:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Your email address and any information you include in your message</li>
                    <li>Support ticket history</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">3.5 Cookies</h3>
                  <p className="mb-2">We use only strictly necessary cookies that are essential for the Service to function, including:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>Session cookies to keep you signed in to your account</li>
                    <li>Security cookies to protect your account</li>
                  </ul>
                  <p>We do not use analytics cookies, tracking cookies or any cookies for marketing purposes. Because we only use strictly necessary cookies, no cookie consent banner is required. You can control or delete cookies through your browser settings, but doing so may prevent the Service from functioning correctly.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>4. Lawful Basis for Processing</h2>
              <p className="mb-4">Under UK GDPR, we must have a lawful basis to process your personal data. The bases we rely on are:</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.1 Contract (Article 6(1)(b))</h3>
                  <p>Processing necessary to perform our contract with you: providing the Service, managing your account, processing payments, and sending service-related communications.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.2 Legitimate interests (Article 6(1)(f))</h3>
                  <p>Processing necessary for our legitimate business interests, provided your rights do not override these interests: fraud prevention, network security, service improvement, and analytics. We do not use your data for direct marketing.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.3 Legal obligation (Article 6(1)(c))</h3>
                  <p>Processing necessary to comply with the law: tax and accounting requirements (we retain billing records for 6 years as required by HMRC), and responding to legal requests from authorities.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>5. How We Use Your Personal Data</h2>
              
              <p className="mb-2">We use your personal data to:</p>
              <ul className="list-disc pl-6 space-y-1 mb-6">
                <li>Provide, operate and maintain the Service</li>
                <li>Process your subscription payments and manage billing</li>
                <li>Send transactional emails (account confirmations, password resets, payment receipts, subscription reminders)</li>
                <li>Respond to your enquiries and provide customer support</li>
                <li>Monitor and improve the Service (bug fixes, feature development)</li>
                <li>Detect, prevent and address technical issues, fraud and security incidents</li>
                <li>Comply with legal obligations, including tax and accounting record-keeping</li>
              </ul>

              <p className="mb-2">We do <strong>NOT</strong> use your personal data to:</p>
              <ul className="list-disc pl-6 space-y-1 text-red-600/80">
                <li>Send marketing emails (we only send transactional, account-related emails)</li>
                <li>Sell your personal data to third parties</li>
                <li>Contact the businesses surfaced in your search results on your behalf</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>6. Third Parties and Sub-Processors</h2>
              <p className="mb-4">We use the following third-party services (sub-processors) to provide the Service. Each processes data only to the extent necessary to perform their function and is bound by contractual data protection obligations.</p>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="py-3 pr-4 font-bold text-slate-800">Sub-Processor</th>
                      <th className="py-3 pr-4 font-bold text-slate-800">Purpose</th>
                      <th className="py-3 pr-4 font-bold text-slate-800">Data Processed</th>
                      <th className="py-3 font-bold text-slate-800">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Stripe</td>
                      <td className="py-3 pr-4">Payment processing</td>
                      <td className="py-3 pr-4">Payment details (last 4 digits), billing info, transaction history</td>
                      <td className="py-3">US / EU</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Resend</td>
                      <td className="py-3 pr-4">Transactional email delivery</td>
                      <td className="py-3 pr-4">Email address, email content (account-related only)</td>
                      <td className="py-3">US</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Supabase</td>
                      <td className="py-3 pr-4">Database and authentication</td>
                      <td className="py-3 pr-4">Account data, usage data, search queries</td>
                      <td className="py-3">Outside UK/EEA</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-800">Hostinger</td>
                      <td className="py-3 pr-4">Application hosting</td>
                      <td className="py-3 pr-4">All data transmitted through the Service</td>
                      <td className="py-3">EU</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">6.1 Stripe</h3>
                  <p>Stripe processes all payment transactions. We never see your full card number. Stripe is certified to PCI DSS Level 1. Stripe may process data in the United States and European Union.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">6.2 Resend</h3>
                  <p>Resend delivers transactional emails on our behalf (account-related emails only - we do not send marketing emails). Resend may process data in the United States.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">6.3 Supabase</h3>
                  <p>Supabase provides our database infrastructure and authentication services. Your account data and usage data are stored on Supabase servers. Supabase may process data outside the UK/EEA.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">6.4 Hostinger</h3>
                  <p>Hostinger provides application hosting infrastructure for the Service. All data transmitted through the Service passes through Hostinger's servers.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">6.5 Companies House and Google Maps</h3>
                  <p>The Service queries public data from Companies House (UK government register) and Google Maps Places API. These are public record databases. We do not share your personal data with them when you make searches.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">6.6 Other disclosures</h3>
                  <p className="mb-2">We may also disclose your personal data:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>To comply with a legal obligation, court order or regulatory request</li>
                    <li>To enforce our Terms & Conditions or protect our rights</li>
                    <li>If we are involved in a merger, acquisition or asset sale (we will notify you before your data is transferred)</li>
                    <li>To protect the vital interests of you or another person (in emergencies)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>7. Data Retention</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">7.1 Active accounts</h3>
                  <p>We retain your personal data for as long as your account is active.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">7.2 Cancelled accounts</h3>
                  <p>After you cancel your subscription, we delete your account data within 30 days, except where we are legally required to retain it.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">7.3 Billing and tax records</h3>
                  <p>We retain billing records and payment transaction data for 6 years after cancellation, as required by UK tax law (HMRC record-keeping obligations). This data includes transaction amounts, dates and payment method details (last 4 digits of card), but does not include your full card number, which we never possess.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">7.4 Anonymised data</h3>
                  <p>After the retention period ends, we either delete your personal data or anonymise it (so it can no longer identify you). Anonymised statistical data may be retained for analytical purposes indefinitely.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">7.5 Legal retention</h3>
                  <p>In some cases we may be legally required to retain data for longer periods (for example, if required by a court order or regulatory investigation).</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>8. Data Security</h2>
              <p className="mb-2">We take appropriate technical and organisational measures to protect your personal data:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>All data transmitted between your browser and our servers is encrypted using TLS (HTTPS)</li>
                <li>Passwords are hashed using industry-standard algorithms (bcrypt) - we cannot read them</li>
                <li>Database connections are encrypted and access is restricted</li>
                <li>We conduct regular security reviews and vulnerability assessments</li>
                <li>Access to personal data is limited to authorised personnel who need it to perform their duties</li>
              </ul>
              <p>No system is completely secure. While we strive to protect your data, we cannot guarantee absolute security. If we become aware of a data breach that affects your personal data, we will notify you and the ICO as required by law.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>9. International Data Transfers</h2>
              <p className="mb-4">Your personal data is primarily stored and processed within the United Kingdom and European Economic Area (EEA). However, some of our sub-processors (Stripe, Resend and Supabase) may transfer and process data outside the UK/EEA.</p>
              <p className="mb-2">Where personal data is transferred outside the UK, we ensure appropriate safeguards are in place, including:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Standard Contractual Clauses (SCCs) approved by the UK Information Commissioner's Office, with the UK Addendum</li>
                <li>Adequacy decisions where the destination country has been deemed adequate by the UK government</li>
                <li>Appropriate technical security measures, including encryption in transit and at rest</li>
              </ul>
              <p>These safeguards ensure that your personal data receives an equivalent level of protection to that provided under UK GDPR, regardless of where it is processed.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>10. Your Data Protection Rights</h2>
              <p className="mb-4">Under UK GDPR, you have the following rights:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.1 Right to access</h3>
                  <p>You have the right to request a copy of the personal data we hold about you. We will provide this within one month of your request, free of charge.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.2 Right to rectification</h3>
                  <p>You have the right to ask us to correct any inaccurate or incomplete personal data. You can update most account information directly in your account settings.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.3 Right to erasure ("right to be forgotten")</h3>
                  <p>You have the right to ask us to delete your personal data. We will comply unless we have a legal obligation to retain it (for example, billing records kept for HMRC). You can delete your account from your account settings, or contact us to request deletion.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.4 Right to restrict processing</h3>
                  <p>You have the right to ask us to restrict processing of your data in certain circumstances (for example, if you contest its accuracy).</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.5 Right to data portability</h3>
                  <p>You have the right to receive your personal data in a structured, commonly used format, and to transfer it to another controller.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.6 Right to object</h3>
                  <p>You have the right to object to processing based on legitimate interests. Since we do not conduct direct marketing, this right primarily applies to our analytics processing.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.7 Right to complain</h3>
                  <p className="mb-2">If you are unhappy with how we handle your personal data, you have the right to complain to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li><strong>Website:</strong> <a href="https://ico.org.uk/make-a-complaint/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://ico.org.uk/make-a-complaint/</a></li>
                    <li><strong>Telephone:</strong> 0303 123 1113</li>
                    <li><strong>Post:</strong> Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
                  </ul>
                  <p>We would appreciate the chance to deal with your concerns before you approach the ICO, so please contact us in the first instance at help@zivlo.io.</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-800">10.8 Exercising your rights</h3>
                  <p>To exercise any of these rights, please contact us at help@zivlo.io. We will respond within one month. We may need to verify your identity before processing your request.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>11. Data About Third-Party Businesses</h2>
              <p className="mb-4">The Service displays data about UK limited companies sourced from Companies House (public register) and Google Maps Places (public business listings). This is public-record information.</p>
              <p className="mb-4">This version of the Service does not allow you to export or download business contact data. Lead data is displayed on-screen only and remains public-record information throughout.</p>
              <p>If you are a director or officer of a company whose information appears in our Service and you wish to discuss how this data is presented, please contact us at help@zivlo.io. Companies House data is public by law; we do not create or control the underlying register.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>12. Data Processing Agreement</h2>
              <p className="mb-4">A separate Data Processing Agreement is not required at this time. Users cannot export or download personal data of business contacts from the Service in this version. Lead data displayed is public-record information from Companies House and Google Maps.</p>
              <p>If we add data export functionality in a future version, we will make a Data Processing Agreement available to business customers at that time.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>13. Children's Privacy</h2>
              <p>The Service is a business-to-business tool and is not intended for use by anyone under the age of 18. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us at help@zivlo.io and we will delete it.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>14. Changes to This Privacy Policy</h2>
              <p className="mb-2">We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Posting the updated policy on this page with a revised "Last updated" date</li>
                <li>Sending an email to the address associated with your account</li>
                <li>Displaying a notice when you next log in to the Service</li>
              </ul>
              <p>Continued use of the Service after changes constitutes acceptance of the updated policy. If you do not agree with the changes, you should stop using the Service and cancel your subscription.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>15. Contact Us</h2>
              <p className="mb-2">For any questions about this Privacy Policy, to exercise your data protection rights, or to raise a concern:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Email:</strong> help@zivlo.io</li>
                <li><strong>Post:</strong> Dare to Accept Ltd, 128 City Road, London, EC1V 2NX, United Kingdom</li>
                <li><strong>ICO registration:</strong> ZC138888</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
