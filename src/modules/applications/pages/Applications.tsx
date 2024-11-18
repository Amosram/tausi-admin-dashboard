import React, { useState } from "react";
import Tabs from "../components/Tabs";
import Table from "../components/Table";
import { ApplicationData } from "../utils/Types";

const mockData: ApplicationData[] = [
  {
    id: "#000123456",
    dateApplied: "Mar 11th 2022",
    beautician: "Bubbles Studios",
    services: "Hair Styling",
    location: "Kilimani, Nairobi",
    contact: "012 3123412 441",
    status: "PENDING",
  },
  {
    id: "#000123457",
    dateApplied: "Mar 11th 2022",
    beautician: "Bloom Studio",
    services: "Hair Styling",
    location: "Ngong, Nairobi",
    contact: "012 3123412 441",
    status: "IN REVIEW",
  },
  {
    id: "#000123458",
    dateApplied: "Mar 11th 2022",
    beautician: "Kate Beauty",
    services: "Nail Art",
    location: "Kilimani, Nairobi",
    contact: "012 3123412 441",
    status: "REJECTED",
  },
];

const Applications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All Status");

  const filterData =
    activeTab === "All Status"
      ? mockData
      : mockData.filter((item) => item.status === activeTab);

  return (
    <div className="p-4">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <Table data={filterData} />
    </div>
  );
};

export default Applications;
