"use client";
import React, { useState } from "react";
import { useGetRequestsQuery } from "@/lib/service/api";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import { useRouter } from "next/navigation";

const RequestsList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const totalPages = Math.ceil(data.count / pageSize);

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
                        {request?.employee && (
                          <div>
                            <h3 className="font-semibold">
                              {request.description}
                            </h3>
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
                              <p className="text-sm text-gray-600">
                                No file available
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-right">
                      {request?.status && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor:
                              request.status === "pending"
                                ? "#FEF3C7"
                                : "#D1FAE5",
                            color:
                              request.status === "pending"
                                ? "#92400E"
                                : "#065F46",
                          }}
                        >
                          {request.status}
                        </span>
                      )}
                      {request?.priority && (
                        <p className="text-sm text-gray-600 mt-1">
                          Priority: {request.priority}
                        </p>
                      )}
                    </div>
                  </div>

                  {request?.company && (
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium">
                        Company: {request.company.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Location: {request.company.region},{" "}
                        {request.company.district}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`p-2 rounded-lg border border-gray-300 ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`p-2 rounded-lg border border-gray-300 ${
            page === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="ml-5">
          <select
            id="page-size"
            name="page-size"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RequestsList;
