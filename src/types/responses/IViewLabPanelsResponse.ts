export type LabPanelsDetails = {
  id: string;
  lab: string;
  title: string;
  description: string;
  biomarkers: string[];
  cost: number;
  totalCose: number;
  additionalCost: number;
  labPanelIdentifier: string;
}[];
