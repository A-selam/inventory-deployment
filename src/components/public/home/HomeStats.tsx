import { stats } from "./home-content";

export default function HomeStats() {
  return (
    <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-lg bg-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-3xl font-semibold tracking-tight text-slate-950">
              {stat.value}
            </p>
            <h2 className="mt-2 text-sm font-semibold text-slate-800">
              {stat.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {stat.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
