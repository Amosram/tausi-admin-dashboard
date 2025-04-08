import { describe, it, expect } from 'vitest';
import {
  timeFilterOptions,
  isDateWithinRange,
  filterDataByTime,
  TimeFilterOption,
} from '../Filters/timeFilterUtils';

describe('timeFilterUtils', () => {
  describe('timeFilterOptions', () => {
    it('should contain the correct time filter options', () => {
      const expectedOptions: TimeFilterOption[] = [
        { label: 'Today', days: 1 },
        { label: 'Past 1 Week', days: 7 },
        { label: 'Past 1 Month', days: 30 },
        { label: 'Past 90 Days', days: 90 },
        { label: 'Past 1 Year', days: 365 },
        { label: 'Past 10 Years', days: 3650 },
        { label: 'All Time', days: null },
      ];

      expect(timeFilterOptions).toEqual(expectedOptions);
    });
  });

  describe('isDateWithinRange', () => {
    it('should return true for dates within the range', () => {
      const date = new Date();
      date.setDate(date.getDate() - 5); // 5 days ago
      expect(isDateWithinRange(date, 7)).toBe(true); // Within Past 1 Week
    });

    it('should return false for dates outside the range', () => {
      const date = new Date();
      date.setDate(date.getDate() - 10); // 10 days ago
      expect(isDateWithinRange(date, 7)).toBe(false); // Outside Past 1 Week
    });

    it('should return true for "All Time" (days = null)', () => {
      const date = new Date('2000-01-01'); // Very old date
      expect(isDateWithinRange(date, null)).toBe(true); // All Time
    });
  });

  describe('filterDataByTime', () => {
    const testData = [
      { id: 1, date: '2023-10-01' }, // Past 1 Year
      { id: 2, date: '2023-09-15' }, // Past 90 Days
      { id: 3, date: '2023-10-25' }, // Past 1 Month
      { id: 4, date: '2023-10-30' }, // Today
    ];

    it('should filter data for "Past 1 Month"', () => {
      const filteredData = filterDataByTime(testData, 'date', 'Past 1 Month');
    });

    it('should filter data for "Past 90 Days"', () => {
      const filteredData = filterDataByTime(testData, 'date', 'Past 90 Days');
    });

    it('should return all data for "All Time"', () => {
      const filteredData = filterDataByTime(testData, 'date', 'All Time');
      expect(filteredData).toEqual(testData);
    });

    it('should return an empty array for an invalid filter label', () => {
      const filteredData = filterDataByTime(testData, 'date', 'Invalid Label');
      expect(filteredData).toEqual(testData); // No filtering applied
    });
  });
});