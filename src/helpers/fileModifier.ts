import papaparse from "papaparse";

export const objToCsv = (data: object[]) => papaparse.unparse(data, { header: true });
