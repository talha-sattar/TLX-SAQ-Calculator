export const subscales: string[] = ["MD", "PD", "TD", "PF", "EF", "FR"];

export const subscalesToLong: { [id: string]: string } = {
  MD: "Mental Demand",
  PD: "Physical Demand",
  TD: "Temporal Demand",
  PF: "Performance",
  EF: "Effort",
  FR: "Frustration",
};

export const subscalesToShort: { [id: string]: string } = {
  "Mental Demand": "MD",
  "Physical Demand": "PD",
  "Temporal Demand": "TD",
  Performance: "PF",
  Effort: "EF",
  Frustration: "FR",
};

export const saqSubscales: string[] = [
  "AD",
  "AS",
  "UN",
  "OCI",
  "UWO",
  "FWD",
  "OA",
];

export const saqSubscalesToLong: { [id: string]: string } = {
  AD: "Attentional Demand",
  AS: "Attentional Supply",
  UN: "Understanding",
  OCI: "Observation of Critical Information",
  UWO: "Understanding of What Was Going On",
  FWD: "Look Ahead / Foresee",
  OA: "Overall Awareness",
};

export const saqSubscalesToShort: { [id: string]: string } = {
  "Attentional Demand": "AD",
  "Attentional Supply": "AS",
  Understanding: "UN",
  "Observation of Critical Information": "OCI",
  "Understanding of What Was Going On": "UWO",
  "Look Ahead / Foresee": "FWD",
  "Overall Awareness": "OA",
};

export const pairwises: string[] = [
  "MD-PD",
  "MD-TD",
  "MD-PF",
  "MD-EF",
  "MD-FR",
  "PD-TD",
  "PD-PF",
  "PD-EF",
  "PD-FR",
  "TD-PF",
  "TD-EF",
  "TD-FR",
  "PF-EF",
  "PF-FR",
  "EF-FR",
];

export const saqPairwises: string[] = [
  "AD-AS",
  "AD-UN",
  "AD-OCI",
  "AD-UWO",
  "AD-FWD",
  "AD-OA",
  "AS-UN",
  "AS-OCI",
  "AS-UWO",
  "AS-FWD",
  "AS-OA",
  "UN-OCI",
  "UN-UWO",
  "UN-FWD",
  "UN-OA",
  "OCI-UWO",
  "OCI-FWD",
  "OCI-OA",
  "UWO-FWD",
  "UWO-OA",
  "FWD-OA",
];

export const CSVheader: string[] = [
  "Participant",
  "Task Id",
  "Task Name",
  "Section",
  "MD",
  "PD",
  "TD",
  "PF",
  "EF",
  "FR",
  "AD",
  "AS",
  "UN",
  "OCI",
  "UWO",
  "FWD",
  "OA",
  "r-score",
  "w-score",
];

export const downloadSVG = (
  <svg
    className="size-6 cursor-pointer"
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
      stroke="#1C274C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
      stroke="#1C274C"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const closeSVG = (
  <svg
    className="size-6 cursor-pointer"
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" />
    <path
      d="M7 17L16.8995 7.10051"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7 7.00001L16.8995 16.8995"
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
