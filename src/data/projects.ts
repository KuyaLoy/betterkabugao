export const PROJECT_CATEGORIES = [
  "flood control/drainage",
  "roads/bridges",
  "public buildings",
  "water/sanitation",
  "schools",
  "health",
  "agriculture",
  "electrification/communications",
  "disaster resilience",
  "other",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

// DPWH CPES calls its published values “contract amount”. That source label is
// retained rather than recasting it as an award, ABC, or appropriation.
export type MoneyType = "FY appropriation" | "CW component appropriation" | "ABC" | "awarded contract amount" | "contract amount";

export type ProjectAmount = { value: number; currency: "PHP"; type: MoneyType };
export type ProjectStatus =
  | { kind: "reported"; value: "planned" | "ongoing" | "completed" | "cancelled"; asOf: string; note?: string }
  | { kind: "not stated" };

export type PublicWorksProject = {
  /** Review identity; never presented as a replacement official reference. */
  reviewKey: string;
  officialRef?: string;
  exactTitle: string;
  category: ProjectCategory;
  publishedLocation: string;
  implementingOffice?: string;
  procuringOffice?: string;
  contractor?: string;
  contractorStatus: "verified" | "unavailable" | "not stated";
  amounts: readonly ProjectAmount[];
  fundingYear?: number;
  fundingSource?: string;
  status: ProjectStatus;
  scheduledStart?: string;
  scheduledCompletion?: string;
  officialUrl: string;
  sourcePublisher: "DPWH" | "DBM" | "PhilGEPS" | "procuring entity";
  accessedOn: string;
  reviewedOn: string;
  sourceNote: string;
};

export type ProjectFilters = {
  query: string;
  category: ProjectCategory | "all";
  fundingYear: number | "all";
  location: string | "all";
};

const REVIEWED = "2026-09-16";
const DPWH_FLOOD_CONTROL = "https://services1.arcgis.com/IwZZTMxZCmAmFYvF/arcgis/rest/services/FloodControl_Data_20250802_v6_corrected_coordinates_for_uploading/FeatureServer/0";
const DPWH = "DPWH Apayao 1st District Engineering Office";

export const PUBLIC_WORKS_PROJECTS: readonly PublicWorksProject[] = [
  {
    reviewKey: "22PB0018|2022|Apayao River|82+292-82+592",
    officialRef: "22PB0018",
    exactTitle: "Apayao River Flood Control, Sta. 82+292–82+592, Brgy. Nagbabalayan",
    category: "flood control/drainage",
    publishedLocation: "Barangay Nagbabalayan, Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "TAGEL CORPORATION",
    contractorStatus: "verified",
    amounts: [],
    fundingYear: 2022,
    status: { kind: "reported", value: "completed", asOf: "2022-11-28", note: "Source-reported completion date." },
    officialUrl: DPWH_FLOOD_CONTROL,
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH flood-control record reviewed 16 September 2026. Amount type is not published in the reviewed source extract.",
  },
  {
    reviewKey: "22PB0023|2022|Sicapo River|88+632-88+932",
    officialRef: "22PB0023",
    exactTitle: "Sicapo River Flood Control, Sta. 88+632–88+932 (L/S)",
    category: "flood control/drainage",
    publishedLocation: "Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "OMENGAN CONSTRUCTION & DEV. CORP",
    contractorStatus: "verified",
    amounts: [],
    fundingYear: 2022,
    status: { kind: "reported", value: "completed", asOf: "2023-04-30", note: "Source-reported completion date." },
    officialUrl: DPWH_FLOOD_CONTROL,
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH flood-control record reviewed 16 September 2026. Amount type is not published in the reviewed source extract.",
  },
  {
    reviewKey: "22PB0024|2022|Madduang River|84+680-84+835",
    officialRef: "22PB0024",
    exactTitle: "Madduang River Flood Control, Sta. 84+680–84+835 (B/S)",
    category: "flood control/drainage",
    publishedLocation: "Madduang, Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "OMENGAN CONSTRUCTION & DEV. CORP",
    contractorStatus: "verified",
    amounts: [],
    fundingYear: 2022,
    status: { kind: "reported", value: "completed", asOf: "2023-03-28", note: "Source-reported completion date." },
    officialUrl: DPWH_FLOOD_CONTROL,
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH flood-control record reviewed 16 September 2026. Amount type is not published in the reviewed source extract.",
  },
  {
    reviewKey: "23PB0002|2023|Badduat River|83+292-83+532",
    officialRef: "23PB0002",
    exactTitle: "Badduat River Flood Control revetment, Sta. 83+292–83+532",
    category: "flood control/drainage",
    publishedLocation: "Badduat, Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "TAGEL CORP / E.C.V. CONSTRUCTION",
    contractorStatus: "verified",
    amounts: [],
    fundingYear: 2023,
    status: { kind: "reported", value: "completed", asOf: "2023-09-08", note: "Source-reported completion date." },
    officialUrl: DPWH_FLOOD_CONTROL,
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH flood-control record reviewed 16 September 2026. Amount type is not published in the reviewed source extract.",
  },
  {
    reviewKey: "23PB0014|2023|Badduat River upstream|83+232-83+292",
    officialRef: "23PB0014",
    exactTitle: "Badduat River Flood Control revetment (upstream), Sta. 83+232–83+292",
    category: "flood control/drainage",
    publishedLocation: "Badduat, Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "CMG JR. BUILDERS / PRIME MASTER",
    contractorStatus: "verified",
    amounts: [],
    fundingYear: 2023,
    status: { kind: "reported", value: "completed", asOf: "2023-12-07", note: "Source-reported completion date." },
    officialUrl: DPWH_FLOOD_CONTROL,
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH flood-control record reviewed 16 September 2026. Amount type is not published in the reviewed source extract.",
  },
  {
    reviewKey: "23PB0017|2023|Madduang River|88+535-89+633",
    officialRef: "23PB0017",
    exactTitle: "Madduang River Flood Control revetment, Sta. 88+535–88+680 / 89+133–89+633",
    category: "flood control/drainage",
    publishedLocation: "Madduang, Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "PBO CONSTRUCTION / R.S. SEPIAN",
    contractorStatus: "verified",
    amounts: [
      { value: 49_000_000, currency: "PHP", type: "ABC" },
      { value: 47_772_728.44, currency: "PHP", type: "awarded contract amount" },
    ],
    fundingYear: 2023,
    status: { kind: "reported", value: "completed", asOf: "2023-11-22", note: "Source-reported completion date." },
    officialUrl: DPWH_FLOOD_CONTROL,
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH flood-control record reviewed 16 September 2026. The award amount is distinct from the ABC.",
  },
  {
    reviewKey: "23PB0015|2023|Madduang-Dagara-Maragat-Abra Boundary",
    officialRef: "23PB0015",
    exactTitle: "Convergence and Special Support Program — Construction/Improvement of Access Roads Leading to Trades, Industries and Economic Zones (ROLL-IT), Madduang-Dagara-Maragat-Abra Boundary in support to Blacksmithing, Handicraft, Furniture, High Value Crops and Coffee Industries",
    category: "roads/bridges",
    publishedLocation: "Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "VUC Highland Developers Inc.",
    contractorStatus: "verified",
    amounts: [{ value: 67_550_000, currency: "PHP", type: "contract amount" }],
    fundingYear: 2023,
    status: { kind: "reported", value: "completed", asOf: "2023-11-23", note: "DPWH CPES evaluation; historical only." },
    scheduledStart: "2023-02-12",
    scheduledCompletion: "2023-11-07",
    officialUrl: "https://www.dpwh.gov.ph/dpwh/sites/default/files/references/cpes_consolidation_3q_and_4q_2023_-_ims.pdf",
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH CPES July–December 2023. This is not a current-condition report.",
  },
  {
    reviewKey: "21PB0002|2021|Apayao-Ilocos Norte Road|K0634-K0635",
    officialRef: "21PB0002",
    exactTitle: "Network Development Program — Paving of Unpaved Roads — Tertiary Roads, Apayao–Ilocos Norte Road, K0634+(-308)–K0635+406",
    category: "roads/bridges",
    publishedLocation: "Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "3K Rock Engineering / Tagel Corporation (joint venture)",
    contractorStatus: "verified",
    amounts: [{ value: 66_164_000, currency: "PHP", type: "contract amount" }],
    fundingYear: 2021,
    status: { kind: "reported", value: "completed", asOf: "2022-03-28", note: "DPWH CPES evaluation; historical only." },
    scheduledStart: "2021-02-24",
    scheduledCompletion: "2022-01-12",
    officialUrl: "https://www.dpwh.gov.ph/dpwh/sites/default/files/references/cpes_consolidation_2022_jan_to_may_ims.pdf",
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH CPES January–May 2022. This is not a current-condition report.",
  },
  {
    reviewKey: "22PB0002|2022|Apayao-Ilocos Norte Road|K0621+290-K0621+390",
    officialRef: "22PB0002",
    exactTitle: "Asset Preservation Program — Rehabilitation/Reconstruction of Roads with Slips, Slope Collapse and Landslide — Tertiary Roads, Apayao–Ilocos Norte Road, K0621+290–K0621+390",
    category: "roads/bridges",
    publishedLocation: "Kabugao, Apayao",
    implementingOffice: DPWH,
    contractor: "Tagel Corporation",
    contractorStatus: "verified",
    amounts: [{ value: 77_200_000, currency: "PHP", type: "contract amount" }],
    fundingYear: 2022,
    status: { kind: "reported", value: "ongoing", asOf: "2022-10-22", note: "DPWH CPES evaluation; historical only." },
    scheduledStart: "2022-03-21",
    scheduledCompletion: "2023-02-14",
    officialUrl: "https://www.dpwh.gov.ph/dpwh/sites/default/files/references/cpes_consolidation_2022_sept_to_dec_ims.pdf",
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH CPES September–December 2022. The status is not current.",
  },
  {
    reviewKey: "P00631689LZ|2022|Badduat Livelihood Building",
    officialRef: "P00631689LZ",
    exactTitle: "Construction (Completion) of Multi-Purpose Building, Badduat Livelihood Building, Kabugao, Apayao",
    category: "public buildings",
    publishedLocation: "Kabugao, Apayao (barangay not stated in the reviewed row)",
    implementingOffice: DPWH,
    contractorStatus: "unavailable",
    amounts: [
      { value: 1_500_000, currency: "PHP", type: "FY appropriation" },
      { value: 1_470_000, currency: "PHP", type: "CW component appropriation" },
    ],
    fundingYear: 2022,
    status: { kind: "not stated" },
    officialUrl: "https://www.dpwh.gov.ph/dpwh/sites/default/files/gaa_2022_car.pdf",
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH CAR FY2022 Annual Infrastructure Program. An appropriation is not an award or status record.",
  },
  {
    reviewKey: "P00633404LZ|2022|Multi-Purpose Building|Bulu",
    officialRef: "P00633404LZ",
    exactTitle: "Construction of Multi-Purpose Building, Barangay Bulu, Kabugao, Apayao",
    category: "public buildings",
    publishedLocation: "Barangay Bulu, Kabugao, Apayao",
    implementingOffice: DPWH,
    contractorStatus: "unavailable",
    amounts: [
      { value: 5_000_000, currency: "PHP", type: "FY appropriation" },
      { value: 4_950_000, currency: "PHP", type: "CW component appropriation" },
    ],
    fundingYear: 2022,
    status: { kind: "not stated" },
    officialUrl: "https://www.dpwh.gov.ph/dpwh/sites/default/files/gaa_2022_car.pdf",
    sourcePublisher: "DPWH",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DPWH CAR FY2022 Annual Infrastructure Program. An appropriation is not an award or status record.",
  },
  {
    reviewKey: "FY2026|bridge phase II|Sta. 0+600-0+850",
    exactTitle: "Piddig, Carasi (Ilocos Norte)-Calanasan-Langnao-Kabugao Road (Construction of Concrete Bridge Phase II), Sta. 0+600–Sta. 0+850",
    category: "roads/bridges",
    publishedLocation: "Kabugao, Apayao",
    contractorStatus: "unavailable",
    amounts: [{ value: 96_406_000, currency: "PHP", type: "FY appropriation" }],
    fundingYear: 2026,
    status: { kind: "not stated" },
    officialUrl: "https://www.dbm.gov.ph/wp-content/uploads/GAA/GAA2026/DBM-OFFICIAL-GAZETTE-FY-2026_VOLUME-1-C.pdf",
    sourcePublisher: "DBM",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DBM/Official Gazette FY2026 GAA. No official reference, office, award, contractor, status, or coordinates were verified in the reviewed row.",
  },
  {
    reviewKey: "FY2026|concrete road|Sta. 2+800-6+861.15|Laco",
    exactTitle: "Piddig, Carasi (Ilocos Norte)-Calanasan-Langnao-Kabugao Road (Construction of Concrete Road), Sta. 2+800–Sta. 6+861.15",
    category: "roads/bridges",
    publishedLocation: "Barangay Laco, Kabugao, Apayao",
    contractorStatus: "unavailable",
    amounts: [{ value: 141_965_000, currency: "PHP", type: "FY appropriation" }],
    fundingYear: 2026,
    status: { kind: "not stated" },
    officialUrl: "https://www.dbm.gov.ph/wp-content/uploads/GAA/GAA2026/DBM-OFFICIAL-GAZETTE-FY-2026_VOLUME-1-C.pdf",
    sourcePublisher: "DBM",
    accessedOn: REVIEWED,
    reviewedOn: REVIEWED,
    sourceNote: "DBM/Official Gazette FY2026 GAA. No official reference, office, award, contractor, status, or coordinates were verified in the reviewed row.",
  },
] as const;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateProjects(projects: readonly PublicWorksProject[]) {
  const errors: string[] = [];
  if (projects.length !== 13) errors.push(`Expected 13 projects, received ${projects.length}.`);
  const keys = new Set<string>();
  const references = new Set<string>();
  for (const project of projects) {
    if (!project.reviewKey || keys.has(project.reviewKey)) errors.push(`Duplicate or missing review key: ${project.reviewKey}.`);
    keys.add(project.reviewKey);
    if (project.officialRef && references.has(project.officialRef)) errors.push(`Duplicate official reference: ${project.officialRef}.`);
    if (project.officialRef) references.add(project.officialRef);
    if (!PROJECT_CATEGORIES.includes(project.category)) errors.push(`Invalid category for ${project.reviewKey}.`);
    if (!project.exactTitle || !project.publishedLocation || !project.officialUrl.startsWith("https://")) errors.push(`Missing required source field for ${project.reviewKey}.`);
    if (!ISO_DATE.test(project.accessedOn) || !ISO_DATE.test(project.reviewedOn)) errors.push(`Invalid review date for ${project.reviewKey}.`);
    if (project.status.kind === "reported" && !ISO_DATE.test(project.status.asOf)) errors.push(`Invalid status date for ${project.reviewKey}.`);
    for (const amount of project.amounts) {
      if (amount.currency !== "PHP" || amount.value <= 0) errors.push(`Invalid amount for ${project.reviewKey}.`);
    }
  }
  return errors.length === 0 ? { valid: true as const } : { valid: false as const, errors };
}

function normalise(value: string) {
  return value.trim().toLocaleLowerCase("en-PH");
}

export function filterProjects(projects: readonly PublicWorksProject[], filters: ProjectFilters) {
  const query = normalise(filters.query);
  const location = normalise(filters.location);
  return projects.filter((project) => {
    const text = [project.officialRef, project.exactTitle, project.publishedLocation, project.implementingOffice, project.procuringOffice, project.contractor, project.category]
      .filter(Boolean)
      .join(" ");
    return (!query || normalise(text).includes(query))
      && (filters.category === "all" || project.category === filters.category)
      && (filters.fundingYear === "all" || project.fundingYear === filters.fundingYear)
      && (filters.location === "all" || normalise(project.publishedLocation) === location);
  });
}
