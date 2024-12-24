import React, { useState } from 'react';
import TanStackTable from '@/components/ui/Table/Table';
import { useGetServiceCategoriesQuery, useDeleteServiceCategoryMutation } from '../api/service-category';
import { ColumnDef } from '@tanstack/react-table';
import { ServiceCategory } from '@/models/user';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { FaPlus } from 'react-icons/fa';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CategoryModal from '../components/CategoryModal'; // Import CategoryModal
import AddServiceCategory from '../components/AddServiceCategory';

const ServiceCategories = () => {
  const { data, isLoading, refetch } = useGetServiceCategoriesQuery();
  const [deleteServiceCategory, { isLoading: deleteLoading }] = useDeleteServiceCategoryMutation();

  const [addModalVisible, setAddModalVisible] = useState(false); // For AddServiceCategoryModal
  const [editModalVisible, setEditModalVisible] = useState(false); // For CategoryModal
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const toast = useToast();

  const handleAdd = () => {
    setSelectedCategory(null); // Reset selected category when adding a new one
    setAddModalVisible(true); // Show the AddServiceCategoryModal
  };

  const handleEdit = (category: ServiceCategory) => {
    setSelectedCategory(category); // Set the selected category for editing
    setEditModalVisible(true); // Show the CategoryModal
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteServiceCategory(selectedCategory.id).unwrap();
        toast.toast({
          title: 'Success',
          description: `Category ${selectedCategory.name} deleted successfully.`,
          variant: 'success',
        });
        refetch();
      } catch (error) {
        toast.toast({
          title: 'Error',
          description: `Failed to delete category ${selectedCategory.name}.`,
          variant: 'destructive',
        });
      } finally {
        setDeleteDialogVisible(false);
      }
    }
  };

  const columns: ColumnDef<ServiceCategory>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              Edit Service Category
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCategory(row.original);
                setDeleteDialogVisible(true);
              }}
              className="bg-destructive text-white"
            >
              Delete Service Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const AddCategoryButton = {
    label: "Add a Category",
    onClick: handleAdd,
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  return (
    <div className="px-6">
      {data?.data.length > 0 && <TanStackTable
        data={data.data}
        button={AddCategoryButton}
        columns={columns}
      />}

      {/* AddServiceCategoryModal for creating a new category */}
      {addModalVisible && (
        <AddServiceCategory
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          refetchCategories={refetch}
        />
      )}

      {/* CategoryModal for editing an existing category */}
      {editModalVisible && selectedCategory && (
        <CategoryModal
          visible={editModalVisible}
          modalData={selectedCategory}
          handleCloseButton={() => setEditModalVisible(false)}
          refetchCategories={refetch}
        />
      )}

      <Dialog open={deleteDialogVisible} onOpenChange={setDeleteDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the category <strong>{selectedCategory?.name}</strong>? This action cannot be undone.
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

export default ServiceCategories;
