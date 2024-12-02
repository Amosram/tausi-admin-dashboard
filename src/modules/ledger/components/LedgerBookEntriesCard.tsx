import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import AddEntryForm from "./AddEntryForm";

const LedgerBookEntriesCard: React.FC = () => {
  const [entries, setEntries] = useState([
    { id: "1", name: "Entry 1", createdAt: new Date() },
    { id: "2", name: "Entry 2", createdAt: new Date() },
  ]);

  const handleAddEntry = (newEntry: { id: string; name: string; createdAt: Date }) => {
    setEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <CardTitle>Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.length ? (
            entries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center">
                <span>{entry.name}</span>
                <span>{entry.createdAt.toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <span>No entries found.</span>
          )}
        </CardContent>
      </Card>
      {/* Button positioned outside the card on the right */}
      <div className="flex justify-end mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <AddEntryForm  />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LedgerBookEntriesCard;
