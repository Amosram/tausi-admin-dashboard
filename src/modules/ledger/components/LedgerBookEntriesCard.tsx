import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useGetAllBookEntriesQuery } from "../api/ledgersApi";
import AddEntryDialog from "./AddEntryForm";

const LedgerBookEntriesCard: React.FC = () => {
  const { data, isLoading, isError } = useGetAllBookEntriesQuery();

  return (
    <>
      <Card className="relative shadow-lg border rounded-lg bg-white">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-xl font-bold text-gray-800">Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {isLoading ? (
            <div className="text-gray-500 text-center">Loading...</div>
          ) : isError ? (
            <div className="text-red-500 text-center">Error loading entries.</div>
          ) : data?.data.length ? (
            data.data.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center py-2">
                <div>
                  <div className="text-gray-800 font-medium">{entry.title}</div>
                  <div className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="flex items-center space-x-1 text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No entries found.</div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
              Add New Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddEntryDialog bookId="01je4rfzbwh7fy2vdehpagnq5s" ownerId="yzh9LYgNOWTU6XGSVSZ2lKWIBVr2" />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LedgerBookEntriesCard;
