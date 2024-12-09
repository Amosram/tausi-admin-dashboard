import {
  LayoutGrid,
  MapPin,
  IdCard,
  Clock,
  User,
  Building2,
  Tag,
  Calendar,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { Booth, BoothAssignmentDetails, Professional } from "@/models";

export const boothDetails = (currentBooth: Booth) => [
  {
    id: "detail-1",
    icon: <LayoutGrid className="h-6 w-6" />,
    label: "General Details",
    content: [
      {
        id: "content-1",
        label: "Booth ID",
        icon: <IdCard className="h-4 w-4 text-muted-foreground" />,
        value: currentBooth.id,
      },
      {
        id: "content-2",
        label: "Booth Location",
        icon: <MapPin className="h-4 w-4 text-muted-foreground" />,
        value: currentBooth.locationAddress,
      },
      {
        id: "content-3",
        label: "Created At",
        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
        value: (
          <p>
            {currentBooth.createdAt
              ? format(new Date(currentBooth.createdAt), "PPP")
              : "N/A"}
          </p>
        ),
      },
      {
        id: "content-4",
        label: "Created By",
        icon: <User className="h-4 w-4 text-muted-foreground" />,
        value: "Admin",
      },
      {
        id: "content-5",
        label: "Last Update",
        icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
        value: (
          <p>
            {currentBooth.updatedAt
              ? format(new Date(currentBooth.updatedAt), "PPP")
              : "N/A"}
          </p>
        ),
      },
    ],
  },
  {
    id: "detail-2",
    icon: <Building2 className="h-6 w-6" />,
    label: "Booth Overview",
    content: [
      {
        id: "content-1",
        label: "Total Stations",
        icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
        value: currentBooth.numberOfStations || 0,
      },
      {
        id: "content-2",
        label: "Total Beauticians",
        icon: <Tag className="h-4 w-4 text-muted-foreground" />,
        value: currentBooth.numberOfBeauticians || 0,
      },
      {
        id: "content-3",
        label: "Occupancy status",
        icon: <Info className="h-4 w-4 text-muted-foreground" />,
        value: currentBooth.occupancyStatus || "Unknown",
      },
      {
        id: "content-4",
        label: "Status",
        icon: <Tag className="h-4 w-4 text-muted-foreground" />,
        value: <p>{currentBooth.isActive ? "Active" : "Inactive"}</p>,
      },
    ],
  },
];

export const assignmentDetailsArray = ({
  beauticianLoading,
  beauticianError,
  beautician,
  assignment,
}: {
  beauticianLoading: boolean;
  beauticianError: boolean;
  beautician: Professional | null;
  assignment: BoothAssignmentDetails;
}) => [
  {
    id: "detail-1",
    label: "Beautician Name",
    content: (
      <span>
        {beauticianLoading
          ? "Loading Beautician..."
          : beauticianError
          ? "Error loading beautician"
          : beautician?.user?.name || "Unknown Beautician"}
      </span>
    ),
  },
  {
    id: "detail-2",
    label: "Business Name",
    content: (
      <span>
        {beauticianLoading
          ? "Loading Business..."
          : beauticianError
          ? "Error loading beautician"
          : beautician?.businessName || "Unknown Business"}
      </span>
    ),
  },
  {
    id: "detail-3",
    label: "Assigned At",
    content: (
      <span>
        {assignment?.createdAt
          ? new Date(assignment.createdAt).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    id: "detail-4",
    label: "Terminated",
    content: <span>{assignment.isTerminated ? "Terminated" : "N/A"}</span>,
  },
  {
    id: "detail-5",
    label: "Terminated At",
    content: (
      <span>
        {assignment.isTerminated && assignment.terminatedAt
          ? new Date(assignment.terminatedAt).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    id: "detail-6",
    label: "Terminated By",
    content: (
      <span>
        {assignment.isTerminated && assignment.terminatedBy
          ? assignment.terminatedBy
          : "N/A"}
      </span>
    ),
  },
  {
    id: "detail-7",
    label: "Terminated Reason",
    content: (
      <span>
        {assignment.isTerminated && assignment.terminationReason
          ? assignment.terminationReason
          : "N/A"}
      </span>
    ),
  },
  {
    id: "detail-8",
    label: "Start Date",
    content: (
      <span>
        {assignment?.startDate
          ? new Date(assignment.startDate).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    id: "detail-9",
    label: "End Date",
    content: (
      <span>
        {assignment?.endDate
          ? new Date(assignment.endDate).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    id: "detail-10",
    label: "Status",
    content: <span>{assignment.isLapsed ? "Lapsed" : "Not yet lapsed"}</span>,
  },
];
