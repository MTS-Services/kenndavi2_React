import { Head } from "@inertiajs/react";

import FrontendLayout from "@/layouts/frontend-layout";

export default function Shippings() {
    return (
        <FrontendLayout>
            <Head title="Shipping" />
             

            <div className="bg-[var(--bg-animation)] text-gray-800">

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-16 py-8">

            {/* Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2 font-[Alumni_Sans]">Shipping & Returns</h1>
                <p className="text-gray-500 text-lg">Effective Date: March 4, 2026</p>
            </div>

            <div className="space-y-10 bg-[var(--bg-animation)] p-0 md:p-6 lg:p-10">

            {/* Domestic Shipping */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Domestic Shipping Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            Our primary goal is to ensure that your orders are delivered with the utmost care and efficiency.
            All domestic orders are processed within 2–3 business days. Please note that orders are not processed,
            shipped, or delivered on weekends or public holidays.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            In the event of a high volume of orders, shipments may experience a slight delay. We ask for your patience
            and suggest allowing additional days in transit for delivery.
            </p>

            <p className="text-gray-600 leading-relaxed font-[Libre_Franklin]">
            If there is a significant delay in the shipment of your order due to unforeseen circumstances,
            we will reach out to you immediately via the email address or phone number provided during checkout.
            Shipping charges for your order are calculated in real-time and will be displayed clearly before you finalize your purchase.
            </p>
            </section>

            {/* International Shipping */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">International Shipping Policy</h2>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            We are proud to offer international shipping services to our global community, ensuring our premium
            streetwear is accessible worldwide. International orders typically require 7–15 business days for delivery,
            though this timeframe may vary depending on your location and local customs processing procedures.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            Please note that your shipment may be subject to local import duties and taxes once it arrives in your country.
            These additional charges for customs clearance are the sole responsibility of the recipient,
            and we have no control over these charges nor can we predict their exact amount.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            We highly recommend contacting your local customs office to understand the potential costs before placing an international order.
            </p>
            </section>

            {/* Tracking */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Shipment Confirmation & Order Tracking</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            You will receive a Shipment Confirmation email once your order has been dispatched from our warehouse,
            containing your unique tracking number. The tracking link will become active within 24 hours of shipment,
            allowing you to monitor the progress of your package in real-time.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            We partner with only the most reliable courier services to guarantee that your items are handled with
            professional care throughout their journey. If you do not receive your tracking information within the
            expected window, please contact our dedicated customer support team for an immediate update.
            </p>
            </section>

            {/* Returns */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 font-[Alumni_Sans]">Return & Exchange Policy</h2>

            <p className="text-gray-600 leading-relaxed mb-4">
            We want you to be completely satisfied with every purchase you make. However, if an item does not meet
            your expectations, our return process is designed to be as straightforward as possible.
            You have a window of 30 calendar days to return an item from the date you received it.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4">
            To qualify for a return, the item must be in its original, unused condition and must include
            all original packaging, tags, and inserts. We also require a receipt or proof of purchase
            to process your request.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4 font-[Libre_Franklin]">
            Once your return is received and inspected by our quality control team, we will send you an
            email notification regarding the approval or rejection of your refund.
            </p>
            </section>

            </div>

             </div>

            </div>
 

        </FrontendLayout>   
    );
}
