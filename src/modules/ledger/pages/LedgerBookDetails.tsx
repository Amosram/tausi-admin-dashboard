import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookDetails } from "@/models";
import { Clock, Book } from "lucide-react";
import { useGetBooksByIdQuery } from "../api/ledgersApi";
import Loader from "@/components/layout/Loader";
import { useParams } from "react-router-dom";
import LedgerBookEntriesCard from "../components/LedgerBookEntriesCard";


const LedgerBookDetailsCard: React.FC<{
  book: BookDetails;
}> = ({ book }) => (
  <Card>
    <CardHeader>
      <CardTitle>book Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {book.name && (
        <div className="flex items-center space-x-2">
          <Book size={16} />
          <span>Book Name: {book.name}</span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Clock size={16} />
        <span>Creation Date: {book.createdAt ? book.createdAt.toLocaleDateString() : "N/A"}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock size={16} />
        <span>Creation Date: {book.updatedAt ? book.updatedAt.toLocaleDateString() : "N/A"}</span>
      </div>
    </CardContent>
  </Card>
);



const LedgerBookDetails = () => {

  const { bookId } = useParams<{ bookId: string }>();
  const {data, isLoading, isError} = useGetBooksByIdQuery(bookId);

  const book = data;
  
  if (isLoading) {
    return <Loader/>
  }

  if (isError) {
    return <div>Error fetching book details</div>
  }

  return (
    <div className='container mx-auto p-4'>
      {/* Ledger Book Titles */}
      <div className='w-full bg-muted p-4 rounded-lg flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <h1 className='text-2xl font-semibold'>Book Details</h1>
        </div>
        <div className='flex space-x-2'>
          <h1 className='text-2xl font-semibold'>Entries</h1>
        </div>
      </div>
      {/* Ledger Book Details */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='md:col-span-1 grid grid-cols-1 gap-4'>
          {/* Book Details Card */}
          <LedgerBookDetailsCard book={book} />
        </div>
        {/* Entries Card */}
          <div className="md:col-span-2 grid grid-cols-1">
          <LedgerBookEntriesCard />
          </div>
      </div>
    </div>
  );
};

export default LedgerBookDetails;
