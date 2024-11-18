export type ApplicationData = {
    id: string;
    dateApplied: string;
    beautician: string;
    location: string;
    services: string;
    contact: string;
    status: "PENDING" | "IN REVIEW" | "REJECTED";
}

export interface TableProps {
    data: ApplicationData[];
}

export interface TabProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}