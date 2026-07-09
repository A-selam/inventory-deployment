import { companyPillars } from "./home-content";

export default function HomeCompany() {
  return (
    <section id="company" className="bg-white px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1fr] lg:items-start">
        <div>
          <p className="label-caps text-[#3980f4]">About StockLogic</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            A focused inventory platform for teams that need cleaner daily
            control.
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            StockLogic brings product records, warehouses, stock movements,
            low-stock monitoring, user access, and reporting into a single
            workspace. It is designed for growing teams that need accuracy
            without adding operational complexity.
          </p>
        </div>

        <div className="grid gap-4">
          {companyPillars.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:grid-cols-[2.75rem_1fr]"
            >
              <div className="flex size-11 items-center justify-center rounded-md bg-white text-[#3980f4] shadow-sm">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
