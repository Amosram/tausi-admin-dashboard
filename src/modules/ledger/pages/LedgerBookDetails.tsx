import { useNavigate, useParams } from "react-router-dom";
import { useGetLedgersByIdQuery } from "../api/ledgersApi";
import Loader from "@/components/layout/Loader";
import { Books } from "@/models";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeDollarSign, ChevronDown, User } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import EntriesTable from "../components/EntriesTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";



const LedgerBookDetails = () => {
  const navigate = useNavigate();

  const { ownerId } = useParams<{ ownerId: string }>();
  const {data, isLoading, isError} = useGetLedgersByIdQuery(ownerId);
  const [selectedBooks, setSelectedBooks] = useState<Books[]>([]);
  const [filterType, setFilterType] = useState<'All' | 'Expense' | 'Revenue'>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'amount'>('createdAt');
  
  const business = data?.data;

  const filteredAndSortedEntries = useMemo(() => {
    if (!business || !business.books) return [];
  
    // Step 1: Gather entries
    let entries = selectedBooks.length > 0
      ? business.books
        .filter((book) => selectedBooks.some((selectedBook) => selectedBook.id === book.id))
        .flatMap((book) => book.bookEntries)
      : business.books.flatMap((book) => book.bookEntries);
  
    if (!entries) return [];
  
    // Step 2: Filter by type
    if (filterType !== "All") {
      entries = entries.filter((entry) => entry.type === filterType);
    }
  
    // Step 3: Filter by search query
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      entries = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm) ||
          (entry.remark && typeof entry.remark === "string" && entry.remark.toLowerCase().includes(searchTerm))
      );
    }
  
    // Step 4: Filter by amount range
    if (minAmount) {
      entries = entries.filter((entry) => parseFloat(entry.amount) >= parseFloat(minAmount));
    }
    if (maxAmount) {
      entries = entries.filter((entry) => parseFloat(entry.amount) <= parseFloat(maxAmount));
    }
  
    // Step 5: Sort entries
    entries = entries.sort((a, b) => {
      let comparison = 0;
  
      if (sortBy === "amount") {
        comparison = parseFloat(a.amount) - parseFloat(b.amount);
      } else if (sortBy === "createdAt" || sortBy === "updatedAt") {
        comparison = new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
      }
  
      return sortOrder === "asc" ? comparison : -comparison;
    });
  
    return entries;
  }, [
    business,
    selectedBooks,
    filterType,
    searchQuery,
    minAmount,
    maxAmount,
    sortBy,
    sortOrder,
  ]);
  

  const totalExpense = useMemo(() => {
    return filteredAndSortedEntries
      .filter(entry => entry.type === 'Expense')
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
  }, [filteredAndSortedEntries]);

  const totalRevenue = useMemo(() => {
    return filteredAndSortedEntries
      .filter(entry => entry.type === 'Revenue')
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
  }, [filteredAndSortedEntries]);


  
  if (isLoading) {
    return <Loader/>;
  }

  if (isError) {
    return <div>Error fetching book details</div>;
  }

  return (
    <div className='container mx-auto p-6'>

      <div className="w-full bg-muted p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold mb-6">Business Book for <span style={{ color: 'red' }}>{business.name}</span></h1>
        </div>
        <div className="flex gap-3">
          <User
            onClick={() => navigate(`/professionals/${ownerId}`)}
            className="cursor-pointer"
            size={30}/>
        </div>
      </div>
      {/* Business Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{business.name}</CardTitle>
            <CardDescription>{business.description ? business.description : "Business Description"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Created: {format(new Date(business.createdAt), 'PPpp')}</p>
            <p>Updated: {format(new Date(business.updatedAt), 'PPpp')}</p>
          </CardContent>
          <CardFooter>
            <Badge
              className="text-sm p-2 w-40 text-center justify-center dark:bg-green-600 dark:text-gray-300"
              variant={business.isDeleted ? "destructive" : "default"}
            >
        Status: {business.isDeleted ? "Deleted" : "Active"}
            </Badge>
          </CardFooter>
        </Card>
        {/* Books Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Books Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {business.books.map((book) => (
                <AccordionItem value={book.id} key={book.id}>
                  <AccordionTrigger>{book.name}</AccordionTrigger>
                  <AccordionContent>
                    <p>Created: {format(new Date(book.createdAt), "PPpp")}</p>
                    <p>Updated: {format(new Date(book.updatedAt), "PPpp")}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-3">
                      <Badge className="font-bold text-white p-2 rounded-lg bg-destructive dark:bg-red-600">Total Expense</Badge> <span className="mr-1">KES</span>
                      {book.bookEntries
                        ? book.bookEntries
                          .filter((entry) => entry.type === "Expense")
                          .reduce((sum, entry) => sum + parseFloat(entry.amount), 0)
                          .toFixed(2)
                        : 0}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-6">
                      <Badge className="font-bold text-white bg-green-600 p-2 rounded-lg">Total Revenue</Badge> <span className="mr-1">KES</span>
                      {book.bookEntries
                        ? book.bookEntries
                          .filter((entry) => entry.type === "Revenue")
                          .reduce((sum, entry) => sum + parseFloat(entry.amount), 0)
                          .toFixed(2)
                        : 0}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      {/* Selection and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Book Selection and Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="mr-2">Select Books</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedBooks.length > 0 ? `${selectedBooks.length} book(s) selected` : "Select books"}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel className="ml-6">Books</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {business.books.map((book) => (
                    <DropdownMenuCheckboxItem
                      className="mb-4"
                      key={book.id}
                      checked={selectedBooks.some((selectedBook) => selectedBook.id === book.id)}
                      onCheckedChange={(checked) => {
                        setSelectedBooks(
                          checked
                            ? [...selectedBooks, book]
                            : selectedBooks.filter((selectedBook) => selectedBook.id !== book.id)
                        );
                      }}
                    >
                      {book.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterType">Filter by Type</Label>
              <Select onValueChange={(value: 'All' | 'Expense' | 'Revenue') => setFilterType(value)}>
                <SelectTrigger id="filterType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort by</Label>
              <Select onValueChange={(value: 'createdAt' | 'updatedAt' | 'amount') => setSortBy(value)}>
                <SelectTrigger id="sortBy">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created At</SelectItem>
                  <SelectItem value="updatedAt">Updated At</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sapce-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Select onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger id="sortOrder">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAmount">Min Amount</Label>
              <Input
                id="minAmount"
                type="number"
                placeholder="Min amount"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Max Amount</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="Max amount"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* List of all entries in a book */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Book Entries</h2>
        <div className="flex justify-between items-stretch gap-4 mb-4">
          {/* Total Expense Card */}
          <Card className="flex flex-col justify-between border-2 border-transparent hover:shadow-xl hover:border-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 rounded-xl overflow-hidden bg-card flex-grow">
            <CardHeader className="flex flex-row items-center justify-center p-4 pb-2">
              <div className="p-3 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <BadgeDollarSign className="h-8 w-8 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-center flex-grow flex flex-col justify-center">
              <div className="text-2xl font-bold mb-1 text-red-600">
                Total Expense: KES {totalExpense.toFixed(2)}
              </div>
              <p className="text-sm font-bold opacity-70 uppercase tracking-wider truncate">
                Expenses
              </p>
            </CardContent>
          </Card>

          {/* Total Revenue Card */}
          <Card className="flex flex-col justify-between border-2 border-transparent hover:shadow-xl hover:border-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 rounded-xl overflow-hidden bg-card flex-grow">
            <CardHeader className="flex flex-row items-center justify-center p-4 pb-2">
              <div className="p-3 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <BadgeDollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-center flex-grow flex flex-col justify-center">
              <div className="text-2xl font-bold mb-1 text-green-600">
                Total Revenue: KES {totalRevenue.toFixed(2)}
              </div>
              <p className="text-sm font-bold opacity-70 uppercase tracking-wider truncate">
               Revenue
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={selectedBooks[0]?.id || 'all'}>
          <TabsList className="flex border-b border-muted space-x-4 pb-2">
            <TabsTrigger
              className={cn(
                "border-b-4 border-transparent px-4 py-2 font-medium text-lg",
                "data-[state=active]:border-red-500 data-[state=active]:text-red-500"
              )}
              value="all"
            >
              All Books
            </TabsTrigger>
            {selectedBooks.map(book => (
              <TabsTrigger
                key={book.id}
                value={book.id}
                className={cn(
                  "border-b-4 border-transparent px-4 py-2 font-medium text-lg",
                  "data-[state=active]:border-red-500 data-[state=active]:text-red-500"
                )}
              >
                {book.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <EntriesTable entries={filteredAndSortedEntries.map(entry => ({
              ...entry,
              bookName: business.books.find(book => book.bookEntries.some(bookEntry => bookEntry.id === entry.id))?.name || ''
            }))} />
          </TabsContent>
          {selectedBooks.map((book) => {
            const foundBook = business.books.find((b) => b.id === book.id);
            return book ? (
              <TabsContent key={book.id} value={book.id}>
                <EntriesTable
                  entries={filteredAndSortedEntries
                    .filter((entry) =>
                      book.bookEntries.some((bookEntry) => bookEntry.id === entry.id)
                    )
                    .map((entry) => ({
                      ...entry,
                      bookName: book.name,
                    }))}
                />
              </TabsContent>
            ) : null;
          })}

        </Tabs>
      </div>
    </div>
  );
};

export default LedgerBookDetails;