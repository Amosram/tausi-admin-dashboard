import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDeleteServiceMutation, useGetAllServicesQuery } from "../api/service-category";
import Loader from "@/components/layout/Loader";
import { ColumnDef } from "@tanstack/react-table";
import type { Services } from "@/models/user";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreVertical } from "lucide-react";
import TanStackTable from "@/components/ui/Table";
import { FaPlus } from "react-icons/fa";
import AddServiceModal from "../components/AddServiceModal";
import EditServiceModal from "../components/EditServiceModal";
import { Button } from "@/components/ui/button";

const Services = () => {

  const {data, isLoading, isError, refetch} = useGetAllServicesQuery();
  const [deleteService, { isLoading: deleteLoading }] = useDeleteServiceMutation();
  const [selectedService, setSelectedService] = useState<Services | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const toast = useToast();

  const handleAdd = () => {
    setSelectedService(null);
    setAddModalVisible(true);
  };

  const handleEdit = (service: Services) => {
    setSelectedService(service);
    setEditModalVisible(true);
  };

  const handleDelete = async () => {
    if (selectedService) {
      try {
        await deleteService(selectedService.id).unwrap();
        toast.toast({
          title: 'Success',
          description: `Service ${selectedService.name} deleted successfully.`,
          variant: 'success',
        });
        refetch();
      } catch (error) {
        toast.toast({
          title: 'Error',
          description: `Failed to delete service ${selectedService.name}.`,
          variant: 'destructive',
        });
      } finally {
        setDeleteDialogVisible(false);
      }
    }
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
      cell: ({row}) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedService(row.original);
                setDeleteDialogVisible(true);
              }}
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
    label: "Create a Service",
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

      {/* CategoryModal for editing an existing category */}
      {editModalVisible && selectedService && (
        <EditServiceModal
          visible={editModalVisible}
          modalData={selectedService}
          handleCloseButton={() => setEditModalVisible(false)}
          refetchServices={refetch}
        />
      )}

      <Dialog open={deleteDialogVisible} onOpenChange={setDeleteDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the category <strong>{selectedService?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="destructive"
              className='hover:bg-red-600'
              onClick={handleDelete}
              disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
            <Button className='bg-black dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-card' onClick={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Services;