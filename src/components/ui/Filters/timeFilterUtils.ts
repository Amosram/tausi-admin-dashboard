export interface TimeFilterOption {
  label: string;
  days: number | null;
}

export const timeFilterOptions: TimeFilterOption[] = [
  { label: "Today", days: 1 },
  { label: "Past 1 Week", days: 7 },
  { label: "Past 1 Month", days: 30 },
  { label: "Past 90 Days", days: 90 },
  { label: "Past 1 Year", days: 365 },
  { label: "Past 10 Years", days: 3650 },
  { label: "All Time", days: null },
];

export const isDateWithinRange = (
  date: string | Date,
  days: number | null
): boolean => {
  if (!days) return true; // "All Time" case
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);
  return new Date(date) >= targetDate;
};

export const filterDataByTime = <T>(
  data: T[],
  field: keyof T,
  selectedLabel: string | null
): T[] => {
  const selectedOption = timeFilterOptions.find(
    (option) => option.label === selectedLabel
  );
  if (!selectedOption) return data;

  const { days } = selectedOption;
  return data.filter((item) =>
    isDateWithinRange(item[field] as string | Date, days)
  );
};
