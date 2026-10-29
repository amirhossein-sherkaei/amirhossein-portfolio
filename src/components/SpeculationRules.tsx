'use client';

export function SpeculationRules() {
  const rules = {
    prerender: [
      { where: { href_matches: "/blog/*" }, eagerness: "moderate" },
      { where: { href_matches: "/work/*" }, eagerness: "moderate" },
    ],
  };

  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(rules) }}
    />
  );
}