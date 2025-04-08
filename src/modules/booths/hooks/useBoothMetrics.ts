import { useMemo } from "react";
import { Booth } from "@/models";

interface BoothMetrics {
  totalBooths: number;
  boothsUnderMaintenance: number;
  boothsFullyOccupied: number;
  boothsPartiallyOccupied: number;
  boothsEmpty: number;
  boothsUnassigned: number;
  boothsAssigned: number;
  activeBooths: number;
  inactiveBooths: number;
  averageStationsPerBooth: number;
  averageBeauticiansPerBooth: number;
  percentageOccupancy: number;
  percentageUnderMaintenance: number;
  percentageActive: number;
}

export const useBoothMetrics = (booths: Booth[] | undefined): BoothMetrics => {
  return useMemo(() => {
    // If no booths or undefined, return default metrics
    if (!booths || booths.length === 0) {
      return {
        totalBooths: 0,
        boothsUnderMaintenance: 0,
        boothsFullyOccupied: 0,
        boothsPartiallyOccupied: 0,
        boothsEmpty: 0,
        boothsUnassigned: 0,
        boothsAssigned: 0,
        activeBooths: 0,
        inactiveBooths: 0,
        averageStationsPerBooth: 0,
        averageBeauticiansPerBooth: 0,
        percentageOccupancy: 0,
        percentageUnderMaintenance: 0,
        percentageActive: 0,
      };
    }

    // Safe wrapper for accessing booth properties
    const safeBooth = (booth: Booth) => ({
      assignments: booth.assignments || [],
      numberOfStations: booth.numberOfStations || 0,
      numberOfBeauticians: booth.numberOfBeauticians || 0,
      underMaintenance: booth.underMaintenance || false,
      isActive: booth.isActive || false,
      occupancyStatus: booth.occupancyStatus || "empty",
    });

    // Calculate metrics
    const totalBooths = booths.length;
    const boothsUnderMaintenance = booths.filter(
      (booth) => safeBooth(booth).underMaintenance
    ).length;

    // Occupancy status calculations
    const boothsFullyOccupied = booths.filter((booth) => {
      const safe = safeBooth(booth);
      return (
        safe.occupancyStatus === "occupied" &&
        safe.assignments.length === safe.numberOfStations
      );
    }).length;

    const boothsPartiallyOccupied = booths.filter((booth) => {
      const safe = safeBooth(booth);
      return (
        safe.occupancyStatus === "occupied" &&
        safe.assignments.length > 0 &&
        safe.assignments.length < safe.numberOfStations
      );
    }).length;

    const boothsEmpty = booths.filter((booth) => {
      const safe = safeBooth(booth);
      return safe.occupancyStatus === "empty" || safe.assignments.length === 0;
    }).length;

    const boothsUnassigned = booths.filter((booth) => {
      const safe = safeBooth(booth);
      return safe.assignments.length === 0;
    }).length;

    const boothsAssigned = booths.filter((booth) => {
      const safe = safeBooth(booth);
      return safe.assignments.length > 0;
    }).length;

    const activeBooths = booths.filter(
      (booth) => safeBooth(booth).isActive
    ).length;
    const inactiveBooths = totalBooths - activeBooths;

    // Average calculations with fallback to 0
    const averageStationsPerBooth =
      booths.reduce((sum, booth) => sum + (booth.numberOfStations || 0), 0) /
        totalBooths || 0;

    const averageBeauticiansPerBooth =
      booths.reduce((sum, booth) => sum + (booth.numberOfBeauticians || 0), 0) /
        totalBooths || 0;

    // Percentage calculations with handling for zero total
    const percentageOccupancy =
      totalBooths > 0 ? (boothsFullyOccupied / totalBooths) * 100 : 0;

    const percentageUnderMaintenance =
      totalBooths > 0 ? (boothsUnderMaintenance / totalBooths) * 100 : 0;

    const percentageActive =
      totalBooths > 0 ? (activeBooths / totalBooths) * 100 : 0;

    return {
      totalBooths,
      boothsUnderMaintenance,
      boothsFullyOccupied,
      boothsPartiallyOccupied,
      boothsEmpty,
      boothsUnassigned,
      boothsAssigned,
      activeBooths,
      inactiveBooths,
      averageStationsPerBooth,
      averageBeauticiansPerBooth,
      percentageOccupancy,
      percentageUnderMaintenance,
      percentageActive,
    };
  }, [booths]);
};
