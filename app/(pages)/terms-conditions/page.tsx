import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function TermsConditions() {
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
              Terms & Conditions
            </h1>
            <p className="text-lg text-slate-600 mb-2 font-medium">Zivlo (zivlo.io) - operated by Dare to Accept Ltd</p>
            <div className="text-sm text-slate-500 space-y-1">
              <p>Effective date: 3 June 2026</p>
              <p>Last updated: June 2026</p>
            </div>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed text-base">
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>1. Definitions</h2>
              <p className="mb-4">In these Terms &amp; Conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
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
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>2. About the Service</h2>
              <p className="mb-4">Zivlo is a business-to-business lead-generation tool. The Service enables you to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Search for UK limited companies by business type and geographic location;</li>
                <li>View publicly available information about those companies from Companies House and Google Maps Places;</li>
                <li>Generate sales pitches based on the Lead Data.</li>
              </ul>
              <p className="mb-4">The Service does NOT send emails or communications to the businesses it surfaces. You are solely responsible for any outreach you conduct using the Lead Data and Content.</p>
              <p>The Service is sold primarily to UK businesses. However, individuals and sole traders may also subscribe. Where consumer protection laws apply to individual subscribers, those rights are not affected by these Terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>3. Account Registration</h2>
              <p className="mb-4">To use the Service, you must register for an Account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide accurate, current and complete information;</li>
                <li>Maintain the security of your password and not share it with anyone;</li>
                <li>Promptly notify us of any unauthorised access to or use of your Account;</li>
                <li>Be fully responsible for all activities that occur under your Account.</li>
              </ul>
              <p className="mb-4">We reserve the right to disable any Account if we reasonably believe you have breached these Terms.</p>
              <p>You must be at least 18 years old and capable of entering into a legally binding contract to use the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>4. Subscription and Payment</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.1 Subscription fee</h3>
                  <p>Access to the Service requires a paid Subscription at GBP £19.99 per month ("Subscription Fee"). The price you see is the price you pay; we are not VAT-registered and no VAT is added.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.2 Payment processing</h3>
                  <p>Payments are processed by Stripe. By subscribing, you agree to Stripe's terms of service and privacy policy. We do not collect or store your full payment card details.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.3 Billing cycle</h3>
                  <p>Your Subscription renews automatically each month on the anniversary of your initial sign-up date. You will be charged the Subscription Fee on each renewal date unless you cancel in accordance with Section 4.5. There is no free trial.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.4 Price changes</h3>
                  <p>We may change the Subscription Fee at any time. If we increase the price, we will give you at least 30 days' notice before the new price takes effect. If you do not agree to the price change, you may cancel your Subscription before the change takes effect.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.5 Cancellation</h3>
                  <p>You may cancel your Subscription at any time through your Account settings or by contacting us at help@zivlo.io. Cancellation takes effect at the end of your current billing period. You will continue to have access to the Service until the end of that period.</p>
                  <p className="mt-2">If you cancel, your Account will be closed and any Content you have generated will no longer be accessible.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.6 Failed payments</h3>
                  <p>If a payment fails, we will retry the charge. If payment continues to fail, we may suspend or terminate your access to the Service after giving you reasonable notice.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">4.7 Refund policy - 14-day cooling-off period</h3>
                  <p className="mb-2">If you are a consumer (an individual not acting in the course of a business), you have a statutory right to cancel your Subscription within 14 days of your initial sign-up without giving any reason, for a full refund of the Subscription Fee paid.</p>
                  <p className="mb-2">To exercise this right, contact us at help@zivlo.io within the 14-day period, stating that you wish to cancel. We will process your refund within 14 days using the original payment method.</p>
                  <p className="mb-2">If you use the Service during the 14-day cooling-off period, we may deduct a reasonable amount from the refund to cover the value of the service you have consumed.</p>
                  <p className="mb-2">This 14-day cooling-off right applies only to your initial subscription. It does not apply to renewal months.</p>
                  <p>If you are a business customer, you may still cancel at any time in accordance with Section 4.5, but no refund will be given for partial months already consumed.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>5. Acceptable Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">5.1 Permitted use</h3>
                  <p>You may use the Service solely for lawful business purposes related to your own sales, marketing and business development activities.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">5.2 Prohibited conduct</h3>
                  <p className="mb-2">You agree NOT to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Use the Service for any unlawful purpose or in any way that breaches applicable laws or regulations;</li>
                    <li>Use the Service to send unsolicited communications (spam) or engage in any form of harassment;</li>
                    <li>Attempt to gain unauthorised access to the Service, our servers or any connected database;</li>
                    <li>Interfere with or disrupt the integrity or performance of the Service;</li>
                    <li>Copy, modify, create derivative works from, reverse engineer, decompile or disassemble the Service;</li>
                    <li>Use any automated system (including robots, spiders or scrapers) to access the Service;</li>
                    <li>Circumvent any security measures or access controls we implement;</li>
                    <li>Share your Account credentials with any third party or allow any third party to access the Service using your Account;</li>
                    <li>Reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without our express written permission;</li>
                    <li>Use the Lead Data for any purpose that infringes the rights of any individual or company, including under data protection, defamation or intellectual property laws;</li>
                    <li>Upload or transmit any viruses, malware or other harmful code.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">5.3 Consequences of breach</h3>
                  <p>If you breach this Section 5, we may immediately suspend or terminate your Account without notice or refund. We may also take legal action where appropriate.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>6. Lead Data - Important Disclaimers</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">6.1 Nature of Lead Data</h3>
                  <p className="mb-2">The Lead Data displayed through the Service is sourced from:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li><strong>Companies House:</strong> the official UK government register of companies (public record);</li>
                    <li><strong>Google Maps Places:</strong> publicly available business listing information.</li>
                  </ul>
                  <p>This is public-record information. We do not create, verify or guarantee the accuracy, completeness or currency of the Lead Data.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">6.2 No guarantee of accuracy</h3>
                  <p className="mb-2">The Lead Data is provided "as is" and "as available" without any warranty of any kind. We do not guarantee that:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>Company information is current, accurate or complete;</li>
                    <li>A company is still trading at the address shown;</li>
                    <li>Contact details (where shown) are correct or up to date;</li>
                    <li>A company is suitable for your specific business purposes.</li>
                  </ul>
                  <p>You must independently verify any Lead Data before relying on it for business decisions or outreach.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">6.3 Your responsibility for outreach</h3>
                  <p className="mb-2">The Service generates sales pitches based on the Lead Data. You are solely responsible for:</p>
                  <ul className="list-disc pl-6 space-y-1 mb-2">
                    <li>Deciding whether and how to contact any business identified through the Service;</li>
                    <li>Ensuring your communications are accurate, truthful and not misleading;</li>
                    <li>Complying with all applicable laws when contacting businesses, including but not limited to:
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>UK General Data Protection Regulation (UK GDPR);</li>
                        <li>Data Protection Act 2018;</li>
                        <li>Privacy and Electronic Communications Regulations 2003 (PECR);</li>
                        <li>Consumer Protection from Unfair Trading Regulations 2008;</li>
                        <li>Business Protection from Misleading Marketing Regulations 2008;</li>
                        <li>any other applicable marketing, data protection or consumer protection legislation.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">6.4 Corporate subscribers and PECR</h3>
                  <p className="mb-2">Under PECR, you may generally email corporate bodies (limited companies, LLPs, Scottish partnerships and government bodies) at their corporate email addresses for B2B marketing purposes without prior consent, provided the email is addressed to a role (for example, info@, sales@) rather than a named individual, and you offer a clear opt-out mechanism.</p>
                  <p className="mb-2">However, you must NOT contact sole traders, unincorporated partnerships or individuals at their personal email addresses without consent. You are responsible for determining the legal status of any business before contacting it.</p>
                  <p>This is general guidance only and does not constitute legal advice. You should obtain your own legal advice on PECR compliance.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>7. Intellectual Property</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">7.1 Our rights</h3>
                  <p>All intellectual property rights in the Service, including software, designs, text, graphics, logos, icons, images, audio clips, video clips, data compilations and software, are owned by or licensed to us. These rights are protected by UK and international intellectual property laws.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">7.2 Licence to you</h3>
                  <p>Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable licence to access and use the Service for your internal business purposes during your Subscription.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">7.3 Content you generate</h3>
                  <p>You retain ownership of any sales pitches and other Content you generate using the Service. However, you grant us a non-exclusive, royalty-free licence to use, reproduce and modify your Content solely to provide and improve the Service.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">7.4 Feedback</h3>
                  <p>If you provide feedback, suggestions or ideas about the Service, you grant us a perpetual, irrevocable, royalty-free, worldwide licence to use that feedback for any purpose without compensation to you.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>8. Confidentiality</h2>
              <p>Each party agrees to keep the other party's Confidential Information secure and not disclose it to any third party without prior written consent, except as required by law or to perform its obligations under these Terms. This obligation survives termination of these Terms for a period of 3 years.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>9. Data Protection</h2>
              <p className="mb-4">Our collection and use of personal data is governed by our Privacy Policy, available at zivlo.io/privacy. By using the Service, you consent to our data practices as described in the Privacy Policy.</p>
              <p className="mb-4">You acknowledge that you are the data controller (and we are not) in respect of any personal data of third parties that you obtain through the Service and subsequently process. You are solely responsible for ensuring your processing of such data complies with UK GDPR, PECR and all other applicable data protection laws.</p>
              <p>A separate Data Processing Agreement is not offered at this time, as the current version of the Service does not allow you to export or download business contact data. If we add data export functionality in a future version, a Data Processing Agreement will be made available to business customers at that time.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>10. Limitation of Liability</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">10.1 No exclusion of liability</h3>
                  <p className="mb-2">Nothing in these Terms excludes or limits our liability for:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Death or personal injury caused by our negligence;</li>
                    <li>Fraud or fraudulent misrepresentation;</li>
                    <li>Any matter for which it would be unlawful to exclude or limit liability.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">10.2 Liability cap</h3>
                  <p>Subject to Section 10.1, our total liability to you for any claim arising out of or in connection with these Terms or the Service (whether in contract, tort, negligence, breach of statutory duty or otherwise) shall be limited to the total amount you have paid us in Subscription Fees in the 12 months immediately preceding the event giving rise to liability.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">10.3 Excluded losses</h3>
                  <p className="mb-2">Subject to Section 10.1, we shall not be liable for any:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Loss of profits, revenue, sales, business or anticipated savings;</li>
                    <li>Loss of goodwill or reputation;</li>
                    <li>Loss of or corruption to data;</li>
                    <li>Indirect, consequential, special, punitive or exemplary loss or damage;</li>
                    <li>Any loss or damage arising from your reliance on Lead Data or your use of Content;</li>
                    <li>Any loss or damage arising from your outreach activities or communications with third-party businesses.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">10.4 Basis of the bargain</h3>
                  <p>The limitations in this Section 10 reflect the risk allocation between you and us. The Subscription Fee has been set accordingly. These limitations will apply regardless of whether we were advised of the possibility of such losses.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>11. Indemnity</h2>
              <p className="mb-4">You agree to indemnify and hold harmless Dare to Accept Ltd, its directors, officers, employees and agents from and against any claims, liabilities, damages, losses, costs and expenses (including reasonable legal fees) arising out of or in connection with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your breach of these Terms;</li>
                <li>Your misuse of the Service or Lead Data;</li>
                <li>Your violation of any third-party right, including intellectual property or privacy rights;</li>
                <li>Your outreach activities and communications with businesses identified through the Service;</li>
                <li>Your violation of any applicable law or regulation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>12. Termination</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">12.1 Termination by you</h3>
                  <p>You may terminate these Terms at any time by cancelling your Subscription and ceasing to use the Service.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">12.2 Termination by us</h3>
                  <p className="mb-2">We may terminate or suspend your Account immediately if you:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Breach any provision of these Terms;</li>
                    <li>Fail to pay the Subscription Fee when due;</li>
                    <li>Engage in fraudulent, abusive or illegal activity;</li>
                    <li>Use the Service in a way that causes harm to us or third parties.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">12.3 Effect of termination</h3>
                  <p className="mb-2">Upon termination:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Your right to access the Service ceases immediately;</li>
                    <li>All licences granted to you under these Terms terminate;</li>
                    <li>We will delete your Account data in accordance with our data retention policy (see Privacy Policy), except where we are legally required to retain it;</li>
                    <li>Sections that by their nature should survive termination will continue in full force and effect, including but not limited to Sections 6, 7, 8, 10, 11, 12.3, 13, 14 and 15.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>13. Service Availability and Changes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">13.1 No uptime guarantee</h3>
                  <p>We aim to keep the Service available at all times, but we do not guarantee uninterrupted access. The Service may be unavailable from time to time for maintenance, updates or reasons beyond our control. We are not liable for any loss arising from service unavailability.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">13.2 Changes to the Service</h3>
                  <p>We may modify, suspend or discontinue any part of the Service at any time. We will endeavour to give you reasonable notice of significant changes that materially reduce functionality.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">13.3 No data backup obligation</h3>
                  <p>We are not responsible for backing up any Content you generate. You are responsible for saving and backing up your own Content.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>14. Third-Party Links and Services</h2>
              <p>The Service may contain links to third-party websites or services (including Companies House and Google Maps). We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>15. Force Majeure</h2>
              <p>We will not be liable for any failure or delay in performing our obligations under these Terms where such failure or delay results from causes beyond our reasonable control, including but not limited to: acts of God, war, terrorism, riot, epidemic or pandemic, government restrictions, strikes, failure of utilities or telecommunications services, or cyber attacks beyond our reasonable security measures.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>16. General Provisions</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">16.1 Entire agreement</h3>
                  <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and us regarding the Service and supersede all prior agreements, understandings and representations.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">16.2 Severability</h3>
                  <p>If any provision of these Terms is found to be invalid, illegal or unenforceable by a court of competent jurisdiction, the remaining provisions will continue in full force and effect.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">16.3 Waiver</h3>
                  <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. Any waiver must be in writing and signed by us.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">16.4 Assignment</h3>
                  <p>You may not assign or transfer these Terms without our prior written consent. We may assign these Terms at any time without restriction.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">16.5 Third-party rights</h3>
                  <p>A person who is not a party to these Terms has no right under the Contracts (Rights of Third Parties) Act 1999 to enforce any term of these Terms.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">16.6 Governing law and jurisdiction</h3>
                  <p>These Terms are governed by and construed in accordance with the laws of England and Wales. Any dispute arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2 text-slate-800">16.7 Notices</h3>
                  <p>Notices to us should be sent to: Dare to Accept Ltd, 128 City Road, London, EC1V 2NX, or by email to help@zivlo.io. Notices to you will be sent to the email address associated with your Account.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>17. Changes to These Terms</h2>
              <p>We may update these Terms from time to time. Material changes will be notified to you by email or through the Service at least 30 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms. If you do not agree to the changes, you must cancel your Subscription and stop using the Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: navy, fontFamily: 'Georgia, serif' }}>18. Contact Us</h2>
              <p className="mb-2">If you have any questions about these Terms, please contact us:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Email:</strong> help@zivlo.io</li>
                <li><strong>Post:</strong> Dare to Accept Ltd, 128 City Road, London, EC1V 2NX, United Kingdom</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}