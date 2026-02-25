import React from "react";

import { Link } from "@inertiajs/react";
import { useReveal } from "@/hooks/use-reveal";

const lpaSteps = [
  {
    title: "Enter personal details",
    description:
      "Enter the details for everyone who needs to appear on the document, including the full name, address, and date of birth for any attorneys you want to nominate.",
  },
  {
    title: "Documents are checked by experts",
    description:
      "Once our experts have checked your documents they are posted immediately. If you’d like help at any stage call 0808 169 3475.",
  },
  {
    title: "Documents are signed",
    description:
      "The documents are clearly labelled indicating exactly where to sign. Simply sign and date them and you’re ready to register.",
  },
  {
    title: "Documents are posted",
    description:
      "Post your document using the envelope provided. Once registered, your document will be sent back to you ready to use.",
  },
];

const explanationCards = [
  {
    title: "What is a Lasting Power of Attorney?",
    body:
      "A lasting power of attorney (LPA) is a legal document that lets you (the donor) appoint one or more people (attorneys) to help you make decisions or to make decisions on your behalf when you lack mental capacity.",
  },
  {
    title: "Health & Welfare LPA",
    body:
      "Gives an attorney the power to make decisions about your daily routine, medical care, moving into a care home, or life-sustaining treatment. It can only be used when you’re unable to make your own decisions.",
  },
  {
    title: "Property & Finance LPA",
    body:
      "Lets an attorney manage bank accounts, pay bills, collect benefits, or even sell your home. It can be used as soon as it’s registered, with your permission.",
  },
  {
    title: "Signing your Lasting Power of Attorney",
    body:
      "Signing and dating is easy—simply follow the instructions provided. We clearly label every page so you can be 100% sure you’re signing in the correct place before registration.",
  },
  {
    title: "Registering your documents",
    body:
      "The Office of the Public Guardian charges £0–£92 per LPA. Fees are paid directly to the OPG once the registration process begins by card or cheque. Documents aren’t legally binding until they are registered.",
  },
  {
    title: "No deadlines, but register to activate",
    body:
      "There’s no deadline to submit your documents, but they only become legally effective once registered. Our service confirms your exact registration fees and walks you through payment options.",
  },
];

export function EstateApproachSection() {
  const [headerRef, headerVisible] = useReveal<HTMLDivElement>();
  const [listRef, listVisible] = useReveal<HTMLDivElement>(0.2);

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 py-20 text-white">
      <div className="absolute inset-0 -z-10 ">
        <img
          src="https://heirkinestateplanning.co.uk/wp-content/uploads/2025/12/secure-storage.jpg"
          alt="Power of Attorney paperwork"
          className="h-full w-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-slate-950/80" /> */}
      </div>

      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl text-center">
          <div
            ref={headerRef}
            className={`space-y-5 transition-all duration-700 ease-out ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-primary-200">Guide</p>
            <h2 className="text-balance font-sans text-4xl font-semibold leading-tight md:text-5xl">
              How to get your Lasting Power of Attorney
            </h2>
            <p className="text-base text-white/80">
              Our guide cover image for Power of Attorney [PS] with legal document and signature.
            </p>
            <div className="mt-8 flex justify-center z-50">
              <Link
                href={route('lpa.start')}
                className="inline-flex items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-transparent focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 hover:text-primary-50"
              >
                Create Your LPA Now
              </Link>
            </div>
          </div>


          <div className="mt-12 grid items-center gap-10 rounded-3xl bg-white/5 p-6 text-left shadow-2xl shadow-slate-900/40 md:grid-cols-2">
            <div className="space-y-5">
              {lpaSteps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-primary-100">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6">
              <img
                src="https://images.pexels.com/photos/7821914/pexels-photo-7821914.jpeg"
                alt="Signing legal documents"
                className="h-64 w-full rounded-2xl object-cover"
              />
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed text-white/80">
                If you’d like help at any stage – call <a href="tel:08081693475" className="font-semibold text-primary-200">0808 169 3475</a>.
              </div>
            </div>
          </div>

          <div
            ref={listRef}
            className={`mt-16 grid gap-6 transition-all duration-700 ease-out lg:grid-cols-2 ${listVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {explanationCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
                <h3 className="text-xl font-semibold text-primary-100">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-primary-400/30 bg-primary-500/10 p-6 text-left">
            <h3 className="text-xl font-semibold text-primary-100">Lasting Power of Attorney explained</h3>
            <p className="mt-2 text-sm text-white/80">
              Once the documents are completed there is no deadline to send them for registration. However, your LPA does not become legally
              binding until it has been registered with the Office of the Public Guardian. Our service tells you exactly how much your
              registration fees are and how to pay them directly to the OPG.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href={route('lpa.start')}
              className="inline-flex items-center justify-center rounded-full border border-primary-600 bg-primary-600 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-transparent hover:text-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              Create Your LPA Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
