/**
 * Demo company fixtures for the invitation journey (/welcome/[companySlug]).
 * All fictional. A slug is a DEMO convenience, never real authorisation — the
 * welcome page labels it as such.
 */

export interface DemoCompany {
  slug: string;
  name: string;
  status: "active" | "expired";
}

const COMPANIES: DemoCompany[] = [
  { slug: "nova-health", name: "Nova Health Group", status: "active" },
  { slug: "meridiaan", name: "Meridiaan Consulting", status: "active" },
  { slug: "kade-11", name: "Kade 11 Studio", status: "active" },
  { slug: "orion-media", name: "Orion Media", status: "expired" },
];

export const DEMO_COMPANIES = COMPANIES;

/** A visibly fictional company slug the welcome recovery states can point to. */
export const SAMPLE_COMPANY_SLUG = "nova-health";

export type InvitationState = "valid" | "expired" | "invalid";

export interface InvitationLookup {
  state: InvitationState;
  company?: DemoCompany;
}

/** Resolve a slug to an invitation state + company (or invalid if unknown). */
export function lookupInvitation(slug: string | undefined): InvitationLookup {
  const norm = (slug ?? "").trim().toLowerCase();
  const company = COMPANIES.find((c) => c.slug === norm);
  if (!company) return { state: "invalid" };
  return { state: company.status === "expired" ? "expired" : "valid", company };
}

/** Look up a company by name (used to show "Provided through {org}" post-activation). */
export function companyByName(name: string | undefined): DemoCompany | undefined {
  if (!name) return undefined;
  return COMPANIES.find((c) => c.name === name);
}
