const columns = [
  { title: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
  { title: "Support", links: ["Help Center", "Contact", "Returns", "FAQ"] },
  { title: "Services", links: ["Grooming", "Training", "Vet Care", "Boarding"] },
];

const Footer = () => (
  <footer className="bg-navy-dark text-primary-foreground py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <span className="text-2xl font-heading font-bold">Pawwl</span>
          <p className="text-xs text-primary-foreground/60 mt-3 leading-relaxed">
            Premium pet care products and services. Because your pets deserve the best.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
        © 2026 Pawwl. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
