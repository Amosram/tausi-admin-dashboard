export type ApplicationData = {
    id: string;
    dateApplied: string;
    beautician: string;
    location: string;
    services: string;
    contact: string;
    status: "PENDING" | "IN REVIEW" | "REJECTED";
}