import React, { useEffect, useMemo, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToast } from '@/hooks/use-toast';
import { useGetServiceCategoriesQuery, useUpdateServiceMutation } from '../api/service-category';
import { useFormik } from 'formik';
import uuid from 'react-uuid';
import { storage } from '@/app/firebase';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Select from "react-select";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const EditServiceModal = ({visible, handleCloseButton, modalData, refetchServices}) => {

  const toast = useToast();
  const [updateService, { isLoading }] = useUpdateServiceMutation();
  const {data: serviceCategory, isLoading: loadingServiceCategory} = useGetServiceCategoriesQuery();

  const [selectedCategory, setSelectedCategory] = useState<{
        label: string;
        value: string;
      } | null>(null);
    
  const categoryOptions = useMemo(
    () => serviceCategory?.data?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [],
    [serviceCategory]
  );

  const [percent, setPercent] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (modalData?.imageUrl) {
      setSelectedImage(modalData.imageUrl);
    }
  }, [modalData]);

  useEffect(() => {
    if (modalData?.category) {
      const selected = categoryOptions.find(
        (option) => option.value === modalData.category
      );
      setSelectedCategory(selected || null);
    }
  }, [modalData, categoryOptions]);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: modalData?.id || '',
      name: modalData?.name || '',
      minimumPrice: modalData?.minimumPrice || '',
      category: selectedCategory?.value || null, // Allow null
      description: modalData?.description || '',
      imageUrl: modalData?.imageUrl || '' || null,
      imagePath: modalData?.imagePath || `/dashboard/categories/${modalData?.name}-${uuid()}`,
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (selectedImage && selectedImage !== modalData.imageUrl) {
          const storageRef = ref(storage, values.imagePath);
          const uploadTask = uploadBytesResumable(storageRef, selectedImage);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setPercent(percent);
            },
            (err) => console.error(err),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              values.imageUrl = url;

              const payload = {
                name: values.name,
                minimumPrice: values.minimumPrice,
                category: selectedCategory?.value || "",
                description: values.description,
                imageUrl: values.imageUrl,
                imagePath: values.imagePath,
              };

              await updateService({ id: values.id, ...payload });

              toast.toast({
                title: "Service Updated",
                description: "Service has been updated successfully.",
                variant: "success",
              });

              resetForm();
              refetchServices();
              handleCloseButton();
            }
          );
        } else {
          const payload = {
            name: values.name,
            minimumPrice: values.minimumPrice,
            category: selectedCategory?.value || "",
            description: values.description,
            imageUrl: values.imageUrl,
            imagePath: values.imagePath,
          };

          await updateService({ id: values.id, ...payload });

          toast.toast({
            title: "Service Updated",
            description: "Service has been updated successfully.",
            variant: "success",
          });

          resetForm();
          refetchServices();
          handleCloseButton();
        }
      } catch (error) {
        console.error(error);
        toast.toast({
          title: "Error",
          description: "An error occurred while updating the service.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className={`overflow-y-auto ${visible ? 'fixed z-50 inset-0' : 'hidden'}`}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="relative inline-block align-bottom bg-card rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <p className="text-center font-medium text-lg">Edit Category</p>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
              </div>

              <div>
                <Label htmlFor="minimumPrice" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                                  Minimum Price
                </Label>
                <Input
                  type="number"
                  id="minimumPrice"
                  name="minimumPrice"
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"
                  onChange={formik.handleChange}
                  defaultValue={formik.values.minimumPrice}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Category</label>
                <Select
                  options={categoryOptions}
                  isLoading={loadingServiceCategory}
                  value={selectedCategory}
                  onChange={(selected) => {
                    setSelectedCategory(selected);
                    formik.setFieldValue("category", selected?.value || ""); // Sync with Formik
                  }}
                  placeholder="Search and select a category"
                  isSearchable
                />
              </div>

              <div>
                <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                                  Image
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  id="imageUrl"
                  name="imageUrl"
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"
                  onChange={(event) => {
                    setSelectedImage(event.target.files[0]);
                  }}
                />
                {percent > 0 && (
                  <div className="flex space-x-2 w-full mt-2">
                    <div className="bg-gray-200 rounded-full h-1 w-full">
                      <div
                        className="bg-blue-600 h-1 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-normal text-blue-600">{percent}%</p>
                  </div>
                )}
                {selectedImage && (
                  <img
                    alt="Selected category"
                    className="w-full h-48 object-center object-cover mt-2"
                    src={URL.createObjectURL(selectedImage)}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
              </div>
            </div>
            <div className="mt-5 sm:mt-6 flex space-x-3">
              <Button
                type="button"
                variant="destructive"
                onClick={handleCloseButton}
                className="w-full"
              >
                              Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditServiceModal;
