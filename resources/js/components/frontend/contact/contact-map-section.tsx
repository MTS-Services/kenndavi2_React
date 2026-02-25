export function ContactMapSection() {
    return (
        <section>
            <div className="overflow-hidden ">
                <div className="h-80 w-full md:h-140">
                    <iframe
                        title="Office location map"
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q=120%20Bishopsgate%20London%20EC2N&output=embed"
                    />
                </div>
            </div>
        </section>
    );
}
