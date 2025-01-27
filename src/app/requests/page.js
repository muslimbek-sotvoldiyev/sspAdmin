'use client';
import React, { useState, useEffect } from 'react';
import { useGetRequestsQuery } from '@/lib/service/api';
import { Card, CardContent, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/pagination';

const RequestsList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (isNaN(pageSize) || pageSize <= 0) {
      setPageSize(5);
    }
  }, [pageSize]);

  const { data, error, isLoading } = useGetRequestsQuery({
    page,
    page_size: pageSize,
  });

  const router = useRouter();

  const handleRequestClick = (id) => {
    router.push(`/requests/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const totalPages = Math.ceil(data.count / pageSize);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Requests List</h1>

      <div className="space-y-5">
        {data.results.map((request) => (
          <Card
            key={request?.id}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => request?.id && handleRequestClick(request.id)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow space-y-2">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    {request?.employee && (
                      <div>
                        <h3 className="font-semibold">{request.description}</h3>
                        {request.file ? (
                          <a
                            href={request.file}
                            download
                            className="text-sm text-blue-500 underline hover:text-blue-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Download File
                          </a>
                        ) : (
                          <p className="text-sm text-gray-600">No file available</p>
                        )}
                      </div>
                    )}

                    <div className="text-right">
                      {request?.status && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor: request.status === 'pending' ? '#FEF3C7' : '#D1FAE5',
                            color: request.status === 'pending' ? '#92400E' : '#065F46',
                          }}
                        >
                          {request.status}
                        </span>
                      )}
                      {request?.priority && (
                        <p className="text-sm text-gray-600 mt-1">Priority: {request.priority}</p>
                      )}
                    </div>
                  </div>

                  {request?.company && (
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium">Company: {request.company.name}</p>
                      <p className="text-sm text-gray-600">
                        Location: {request.company.region}, {request.company.district}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default RequestsList;
