'use client';

export default function LandingSocialProof() {
  const companies = [
    'TechCorp Supply',
    'Global Logistics Inc',
    'Swift Warehouse',
    'Enterprise Retail Co',
    'Distribution Plus',
    'Smart Inventory Systems',
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Trusted by leading enterprises</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card px-4 py-6 sm:px-6 text-center transition-all hover:border-ring/50 hover:shadow-sm"
            >
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {company}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
