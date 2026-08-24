/* Product stills borrowed from Intercom, standing in for TestMu product UI. */
const I = (id: string, w = 1200) =>
  `https://cdn.sanity.io/images/4bgok82s/monorepo-static-assets/${id}.webp?w=${w}&q=85&auto=format`;

export const shots = {
  projectDoc: I("39217c48ee21ed6dafe1f435a8e52a2a82b09a6d-1600x1600"),
  milestones: I("4968e440035db9a1b64d46cb8ccd92c592a57442-1098x1128"),
  appPlan: I("c9e51156a74c2e562e9cb0325babf3ba48f7aa84-1600x1600"),
  activity: I("0d885e0f08be1550f45d42a450e82be95dde5632-1098x1098"),
  appIssue: I("60238bbffe9711cb3b957dadc2807d4e87b9adf6-1098x1098"),
  agentAssign: I("d0e58b8d4351a28ecc58cfb6244f2c0304f2459d-1098x1098"),
  table: I("23daa8a658d81cbda4ec00f0559fb6dba0f4853d-3044x3044"),
  dashboard: I("e2d5af2f03a2a9cf22ea15fdf8d44f3e6b06e0f3-3714x1677", 1600),
  weekly: I("f90345730b8aeeb67178c7bafb0fffecd722f178-3714x1677", 1600),
  insights: I("a78f1e62fff0f7e0b8288a798133c2526f336d14-3714x1677", 1600),
  specIssue: I("9131f051c192eaf7e9acf554a49e0a3832461b89-6400x2800", 1600),
  agentProps: I("0adeb79284538b050cc117ac87fa046ec82a01db-6400x2800", 1600),
};
