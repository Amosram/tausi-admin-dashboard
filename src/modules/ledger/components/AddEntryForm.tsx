import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { toast } from "@/hooks/use-toast";
import {
  useGetAllCategoriesQuery,
  useGetAllPaymentModesQuery,
  useCreateBookEntryMutation,
  useGetBooksQuery,
} from "../api/ledgersApi";
import { CreateUpdateBookEntry } from "@/models";

// Validation schema
const entrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["Expense", "Revenue"]),
  amount: z.number().positive("Amount must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  paymentModeId: z.string().min(1, "Payment mode is required"),
  bookId: z.string().min(1, "Book ID is required"),
  ownerId: z.string().min(1, "Owner ID is required"),
});

// Infer TypeScript type from the schema
type EntryFormValues = z.infer<typeof entrySchema>;

const AddEntryDialog: React.FC<{ bookId: string; ownerId: string }> = ({ bookId, ownerId }) => {
  // API hooks
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: paymentModesData } = useGetAllPaymentModesQuery();
  const {data: booksData} = useGetBooksQuery();
  const [createBookEntry] = useCreateBookEntryMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EntryFormValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: { bookId, ownerId, type: "Expense" },
  });

  // Handle form submission
  const onSubmit = async (data: EntryFormValues) => {
    try {
      // Ensure all required fields are present
      const payload: CreateUpdateBookEntry = {
        title: data.title,
        type: data.type, // Zod ensures this is always present
        amount: Number(data.amount), // Ensure amount is a number
        categoryId: data.categoryId!,
        paymentModeId: data.paymentModeId!,
        bookId: data.bookId!,
        ownerId: data.ownerId!,
      };
  
      await createBookEntry(payload).unwrap();
      toast({ title: "Success", description: "Entry created successfully!", variant: "success" });
    } catch (error: any) {
      console.error("Error ================>", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to create entry. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Entry</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")}
              placeholder="Enter title" />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { valueAsNumber: true })} // Automatically parse as number
              placeholder="Enter amount"
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              options={[
                { value: "Expense", label: "Expense" },
                { value: "Revenue", label: "Revenue" },
              ]}
              onChange={(selected) =>
                setValue("type", (selected?.value as "Expense" | "Revenue") || "Expense")
              }
              defaultValue={{ value: "Expense", label: "Expense" }}
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select
              options={categoriesData?.data.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              onChange={(selected) => setValue("categoryId", selected?.value || "")}
            />
            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
          </div>

          {/* Payment Mode */}
          <div>
            <Label htmlFor="paymentModeId">Payment Mode</Label>
            <Select
              options={paymentModesData?.data.map((mode) => ({
                value: mode.id,
                label: mode.mode,
              }))}
              onChange={(selected) => setValue("paymentModeId", selected?.value || "")}
            />
            {errors.paymentModeId && (
              <p className="text-red-500 text-sm">{errors.paymentModeId.message}</p>
            )}
          </div>

          {/* Book */}
          <div>
            <Label htmlFor="bookId">Book</Label>
            <Select
              options={booksData?.data.map((book) => ({
                value: book.id,
                label: book.name,
              }))}
              onChange={(selected) => setValue("bookId", selected?.value || "")}
            />
            {errors.bookId && (
              <p className="text-red-500 text-sm">{errors.bookId.message}</p>
            )}
          </div>

          {/* Save Button */}
          <Button type="submit" className="w-full">
            Save Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
