import { ApiResponse, Appointment } from "@/models";

export const fetchAppointments = async (limit: number): Promise<Appointment[]> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log('API URL:', apiUrl);
    const response = await fetch(`${apiUrl}/appointments?limit=${limit}`, {
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

export const fetchAppointmentById = async (
  id: string
): Promise<Appointment> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/appointments/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch appointment: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};
