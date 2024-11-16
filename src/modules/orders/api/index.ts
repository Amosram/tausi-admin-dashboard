import { ApiResponse, Appointment } from "../types";

export const fetchAppointments = async (
  limit: number
): Promise<Appointment[]> => {
  try {
    const response = await fetch(`/api/v2/appointments?limit=${limit}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch appointments: ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
