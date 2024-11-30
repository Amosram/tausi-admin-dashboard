import React from 'react'

const LedgerBookDetails = () => {
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
        </div>
      </div>
    </div>
  )
}

export default LedgerBookDetails;
