import { Head } from "@inertiajs/react";

import FrontendLayout from "@/layouts/frontend-layout";

export default function TermsAndConditions() {
    return (
        <FrontendLayout>
            <Head title="Terms and Conditions" />
            <div
                className="bg-[var(--bg-animation)] font-sans text-gray-800 overflow-x-hidden relative"
                style={{
                    backgroundImage: 'url("/assets/images/bg.png")',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-sidebar/60 z-10"></div>

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-16 py-8 bg-bg-animation rounded m-4 relative z-10">

            {/* Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2 font-[Alumni_Sans]">Terms & conditions</h1>
                <p className="text-gray-500 text-lg">Effective Date: March 4, 2026</p>
            </div>

            <div className="space-y-10 bg-[var(--bg-animation)] p-0 md:p-6 lg:p-10">

            {/* Domestic Shipping */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
           By accessing and using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions in their entirety. These terms govern your use of our services, including browsing the site, creating an account, and making purchases.
If you do not agree to these terms, you must refrain from using our platform immediately. We reserve the right to modify, update, or change these terms at any time without prior notice. It is your responsibility to review this page periodically to stay informed about any changes. Your continued use of the site following the posting of changes will mean that you accept and agree to those modifications.
            </p>
            </section>

            {/* International Shipping */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">User Account and Security</h2>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            To access certain features of the website, you may be required to create a user account. You are responsible for maintaining the confidentiality of your account credentials, including your password, and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.
We reserve the right to suspend or terminate your account if any information provided is found to be inaccurate, false, or misleading. Furthermore, you must notify us immediately of any unauthorized use of your account or any other breach of security to prevent further complications.
            </p>
            </section>

            {/* Tracking */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Product Availability and Pricing</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            We strive to ensure that all product descriptions, images, and prices displayed on our website are accurate and up-to-date. However, errors may occasionally occur.
In the event that a product is listed at an incorrect price or with incorrect information due to a typographical error, we reserve the right to refuse or cancel any orders placed for that product. We also reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion.
We do not warrant that the quality of any products purchased by you will meet your exact expectations, although we aim for the highest standards.
            </p>

            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Intellectual Property Rights</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, and data compilations, is the exclusive property of our brand or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is our exclusive property.
You may not extract, reproduce, or utilize any parts of the content of this website for commercial purposes without our express written consent. Any unauthorized use of the materials appearing on this site may violate copyright, trademark, and other applicable laws and could result in criminal or civil penalties.
            </p>

            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Limitations of Liability</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            Our website and all information, content, materials, and products included on or otherwise made available to you through this site are provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of this site or the information provided.
To the full extent permissible by applicable law, we disclaim all warranties, express or implied, including but not limited to, implied warranties of merchantability and fitness for a particular purpose. We will not be liable for any damages of any kind arising from the use of this site, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
            </p>


            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Governing Law</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            These Terms and Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered. Any disputes arising out of or relating to these terms shall be resolved exclusively in the courts of that jurisdiction.
If any provision of these terms is deemed unlawful, void, or for any reason unenforceable, then that provision shall be deemed severable from these terms and shall not affect the validity and enforceability of any remaining provisions.
            </p>


            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Cookies and Tracking Technologies</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            Our website uses cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. These are sent to your browser from a website and stored on your device.
We use these to remember your preferences, such as your language settings and shopping cart items, so that you do not have to re-enter them every time you return. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service
            </p>




            </section>

            </div>

             </div>

            </div>
        </FrontendLayout>
    );



}
