"use clinr"
import React, { useState, useEffect } from "react";
import { useGetEmployeesIdQuery, useGetRequestQuery } from "@/lib/service/api";
import { Card, CardContent, CardHeader, CardTitle } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@mui/material";
import { useRouter } from "next/router"; // Correct import

const EmployeeDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic route parameter

  // Early exit if id is not available yet
  if (!id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-gray-600">Loading employee details...</p>
      </div>
    );
  }

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useGetEmployeesIdQuery({ id });

  const {
    data: requestData,
    error: requestError,
    isLoading: requestLoading,
  } = useGetRequestQuery({ employee: id, page, page_size: pageSize });

  if (employeeLoading || requestLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (employeeError || requestError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            There was an error loading the employee details. Please try again
            later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!employeeData || !requestData) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            No data available for this employee. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
          <p className="text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(employeeData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Request History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(requestData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 disabled:opacity-50"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {Math.ceil((requestData?.count || 0) / pageSize)}
              </span>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 disabled:opacity-50"
                onClick={() => setPage(page + 1)}
                disabled={!requestData?.next}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-gray-600">
                Items per page:
              </label>
              <select
                id="pageSize"
                className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
