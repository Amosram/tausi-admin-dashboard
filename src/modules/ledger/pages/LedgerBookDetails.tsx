import { useParams } from "react-router-dom";
import { useGetLedgersByIdQuery } from "../api/ledgersApi";
import Loader from "@/components/layout/Loader";



const LedgerBookDetails = () => {

  const { ownerId } = useParams<{ ownerId: string }>();
  const {data, isLoading, isError} = useGetLedgersByIdQuery(ownerId);

  
  if (isLoading) {
    return <Loader/>;
  }

  if (isError) {
    return <div>Error fetching book details</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      Owner Book Details
    </div>
  );
};

export default LedgerBookDetails;