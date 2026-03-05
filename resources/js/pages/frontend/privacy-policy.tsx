import { Head } from "@inertiajs/react";
import FrontendLayout from "@/layouts/frontend-layout";

export default function PrivacyPolicy() {
    return (
        <FrontendLayout>
            <Head title="Privacy Policy" />
             <div className="bg-[var(--bg-animation)] text-gray-800">

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-16 py-8">

            {/* Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2 font-[Alumni_Sans]">Privacy Policy</h1>
                <p className="text-gray-500 text-lg">Effective Date: March 4, 2026</p>
            </div>

            <div className="space-y-10 bg-[var(--bg-animation)] p-0 md:p-6 lg:p-10">

            {/* Domestic Shipping */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">European Privacy Notice</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            This European Privacy Notice is designed to provide you with a comprehensive understanding of how we handle your personal data in accordance with the General Data Protection Regulation (GDPR). We take our responsibility to protect your privacy very seriously and have implemented robust technical and organizational measures to ensure that your data remains secure at all times.
This policy applies to all visitors, users, and others who access or use our Service. By accessing the Service, you acknowledge that you have read and understood the terms of this Privacy Notice and our collection, storage, use, and disclosure of your personal information as described.
            </p> 
            </section>

            {/* International Shipping */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Consent</h2>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            By using our website, you hereby consent to our Privacy Policy and agree to its legally binding terms. We collect personal information that you provide to us voluntarily when you express an interest in obtaining information about us or our products, when you participate in activities on the Website, or otherwise when you contact us.
Your consent is the legal basis upon which we process your data for the purposes of providing a seamless shopping experience. If you do not agree with any part of this Privacy Policy, we kindly ask that you discontinue the use of our platform immediately to ensure your data remains unaffected.
            </p> 
            </section>

            {/* Tracking */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Information Collection and Use: Personal Information</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
           The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information. If you contact us directly, we may receive additional information about you such as your name, email address, phone number,
the contents of the message and any attachments you may send us, and any other information you may choose to provide. We use this information to maintain our internal records, improve our product offerings, and ensure that our customer service remains at the highest possible standard for all our global users.
            </p>

            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">When We Collect Your Personal Information</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form, or enter information on our site. This information is used to personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.
We also collect data automatically through your browser, such as IP addresses and device identifiers, to monitor the security of our website and prevent fraudulent activities. This collection happens in real-time as you navigate through our various product categories and checkout pages.
            </p> 

            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Withdrawal Consent and Definition of Sale</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            You have the right to withdraw your consent at any time where we are relying on consent to process your personal information. However, please note that this will not affect the lawfulness of the processing before its withdrawal.
We do not sell your personal information to third parties for monetary consideration;
however, we may share data with service providers who help us run our business operations, such as payment processors and shipping companies. Under certain state laws, these disclosures may be defined as a "sale" of information, but we ensure that all such partners adhere to strict confidentiality agreements.
            </p>


            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Registration</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            When you register for an account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. We use this information to manage your account, provide you with customer support, and send you administrative information or changes to our terms and policies.
Maintaining an updated registration allows us to provide you with a faster checkout process and a history of your previous purchases. It is your responsibility to keep your account credentials secure and to notify us immediately if you suspect any unauthorized access to your personal profile or order history.
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