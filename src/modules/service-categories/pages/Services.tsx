import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGetAllServicesQuery } from "../api/service-category";
import Loader from "@/components/layout/Loader";
import { ColumnDef } from "@tanstack/react-table";
import type { Services } from "@/models/user";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import TanStackTable from "@/components/ui/Table";
import { FaPlus } from "react-icons/fa";
import AddServiceModal from "../components/AddServiceModal";

const Services = () => {

  const {data, isLoading, isError, refetch} = useGetAllServicesQuery();

  const [selectedService, setSelectedService] = useState<Services | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const toast = useToast();

  const handleAdd = () => {
    setSelectedService(null);
    setAddModalVisible(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    <div>Error Fetching table data</div>;
  }

  const columns: ColumnDef<Services>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    {accessorKey: 'minimumPrice', header: 'Minimum Price'},
    {accessorKey: "serviceCategory.name", header: "Service Category"},
    {
      id: 'actions',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="bg-destructive text-white"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const AddServiceButton = {
    label: "Add Service",
    onClick: handleAdd,
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  return (
    <div className="px-6">
      {data?.data.length > 0 && <TanStackTable
        data={data.data}
        columns={columns}
        button={AddServiceButton}
      />
      }

      {/* AddServiceModal for creating a new service */}
      {
        addModalVisible && (
          <AddServiceModal
            visible={addModalVisible}
            onClose={() => setAddModalVisible(false)}
            refetchServices={refetch}
          />
        )
      }
    </div>
  );
};

export default Services;