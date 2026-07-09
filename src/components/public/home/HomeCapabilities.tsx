import { capabilities } from "./home-content";

export default function HomeCapabilities() {
  return (
    <section className="bg-[#f7f9fb] px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="label-caps text-[#3980f4]">Platform Capabilities</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built around the inventory work your team repeats every day.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end">
            StockLogic keeps operational surfaces close together: item records,
            warehouse visibility, movement tracking, alerts, users, and reports
            all stay in a coherent workflow.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-md bg-slate-100 text-slate-900 transition group-hover:bg-slate-950 group-hover:text-white">
                <Icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-950">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
