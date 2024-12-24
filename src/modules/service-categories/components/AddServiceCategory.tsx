import React, { useState } from "react";
import { useFormik } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import uuid from "react-uuid";
import { storage } from "@/app/firebase";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreateServiceCategoryMutation } from "../api/service-category";
import { Label } from "@/components/ui/label";

const AddServiceCategoryModal = ({ visible, onClose, refetchCategories }) => {
  const toast = useToast();
  const [createServiceCategory, { isLoading }] = useCreateServiceCategoryMutation();

  const [percent, setPercent] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const submitForm = async (values: any, resetForm: any) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        imageUrl: values.imageUrl, // Can be null
        imagePath: values.imagePath, // "/docs/user"
      };

      await createServiceCategory(payload).unwrap();

      toast.toast({
        title: "Success",
        description: "Service category created successfully.",
        variant: "success",
      });

      resetForm();
      refetchCategories();
      onClose();
    } catch (error) {
      console.error("API submission error:", error);
      toast.toast({
        title: "Error",
        description: "Failed to create service category.",
        variant: "destructive",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      imageUrl: null, // Allow imageUrl to be null
      imagePath: "/docs/user", // Remains constant
    },
    onSubmit: async (values, { resetForm }) => {
      if (!values.name || !values.description) {
        toast.toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      try {
        if (selectedImage) {
          const storageRef = ref(storage, values.imagePath);
          const uploadTask = uploadBytesResumable(storageRef, selectedImage);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setPercent(progress);
            },
            (error) => {
              console.error(error);
              toast.toast({
                title: "Error",
                description: "Failed to upload image.",
                variant: "destructive",
              });
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              values.imageUrl = url; // Assign the uploaded image URL

              await submitForm(values, resetForm);
            }
          );
        } else {
          // No image uploaded, proceed with null for imageUrl
          await submitForm(values, resetForm);
        }
      } catch (error) {
        console.error(error);
        toast.toast({
          title: "Error",
          description: "An error occurred while creating the category.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Service Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                Name
              </Label>
              <input
                type="text"
                id="name"
                name="name"
                className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
                Image
              </Label>
              <input
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
          <DialogFooter className="space-x-4 mt-5">
            <Button
              type="button"
              variant="destructive"
              onClick={onClose}
              className="w-full dark:hover:bg-red-600"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full text-gray-300 dark:hover:bg-orange-600"
              disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(AddServiceCategoryModal);
