import { partners } from "./home-content";

export default function HomePartners() {
  return (
    <section className="bg-slate-950 px-4 py-18 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="label-caps text-[#ffb26b]">Companies We Work With</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Trusted by operators across retail, logistics, and supply teams.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-300 lg:justify-self-end">
            These are sample partner profiles that show the kinds of businesses
            StockLogic is built to support.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <article
              key={partner.name}
              className="rounded-lg border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg"
            >
              <p className="text-lg font-semibold text-white">{partner.name}</p>
              <p className="mt-1 text-sm text-slate-400">{partner.category}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
