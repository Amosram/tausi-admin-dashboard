import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { FC, useState } from "react";
// Removed incorrect Label import

// Define EntryForm before using it
const EntryForm: FC<{
  entryType: string;
}> = ({ entryType }) => {
  const handleSave = () => {
    alert(`${entryType} entry saved!`);
  };

  return (
    <div className="space-y-4">
      {/* Date and Time */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="date" >Date</Label>
          <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
        </div>
        <div className="w-1/2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" defaultValue={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
        </div>
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" placeholder="Enter amount" />
      </div>

      {/* Contact Name */}
      <div>
        <Label htmlFor="contactName">Contact Name</Label>
        <Select>
          <SelectTrigger id="contactName">Select Contact</SelectTrigger>
          <SelectContent>
            <SelectItem value="Timothy">Timothy</SelectItem>
            <SelectItem value="John">John</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Remarks */}
      <div>
        <Label htmlFor="remarks">Remarks</Label>
        <Input id="remarks" placeholder="Add remarks" />
      </div>

      {/* Category and Payment Mode */}
      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger id="category">Select Category</SelectTrigger>
            <SelectContent>
              <SelectItem value="Sale">Sale</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/2">
          <Label htmlFor="paymentMode">Payment Mode</Label>
          <Select>
            <SelectTrigger id="paymentMode">Select Payment Mode</SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Credit">Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attach Bills */}
      <div>
        <Button variant="outline" className="w-full">
          Attach Bills
        </Button>
        <p className="text-xs text-muted">Attach up to 4 images or PDF files</p>
      </div>

      {/* Save Button */}
      <Button className="w-full" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

// AddEntryDialog Component
const AddEntryDialog: React.FC = () => {
  const [entryType, setEntryType] = useState("Cash In");

  return (
    <Dialog>
        <DialogTitle>Add New Entry</DialogTitle>
      <DialogTrigger asChild>
        <Button>Add New Entry</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md space-y-4">
        <Tabs defaultValue="cashIn" className="space-y-4">
          {/* Tabs for Cash In / Cash Out */}
          <TabsList>
            <TabsTrigger className="bg-green-600 rounded-xl p-2 w-24 text-white font-medium mr-4" value="cashIn" onClick={() => setEntryType("Cash In")}>
              Cash In
            </TabsTrigger>
            <TabsTrigger className="bg-red-600 rounded-xl w-24 p-2 text-white font-medium mr-4" value="cashOut" onClick={() => setEntryType("Cash Out")}>
              Cash Out
            </TabsTrigger>
          </TabsList>

          {/* Cash In / Cash Out Content */}
          <TabsContent value="cashIn">
            <EntryForm entryType={entryType} />
          </TabsContent>
          <TabsContent value="cashOut">
            <EntryForm entryType={entryType} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
