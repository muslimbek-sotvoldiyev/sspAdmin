"use client";

import React, { useState } from "react";
import {
  useGetEmployeeIdQuery,
  useGetEmployesInRequestsQuery,
} from "@/lib/service/api";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [page_size, setPage_size] = useState(5);

  const { data, isLoading, error } = useGetEmployesInRequestsQuery({
    page,
    page_size,
    employee: id,
  });

  const { data: employeeData, isLoading: isEmployeeLoading } =
    useGetEmployeeIdQuery({ id });

  if (isLoading || isEmployeeLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        <p>Error: Unable to fetch data. Please try again later.</p>
      </div>
    );
  }

  const results = data?.results || [];
  const count = data?.count || 0;
  const page_count = data?.page_count || 1;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Employees in Request</h1>
      </div>

      {/* Employee Details */}
      {employeeData && (
        <div className="mb-5 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex gap-4">
          <img
            src={employeeData.image}
            alt={`${employeeData.first_name} ${employeeData.last_name}`}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold mb-3">
              {employeeData.first_name} {employeeData.last_name}
            </h2>
            <p>
              <strong>Role:</strong> {employeeData.role}
            </p>
            <p>
              <strong>Phone:</strong> {employeeData.phone_number}
            </p>
            <p>
              <strong>Region:</strong> {employeeData.region}
            </p>
            <p>
              <strong>District:</strong> {employeeData.district}
            </p>
            <p>
              <strong>Passport:</strong> {employeeData.passport}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-gray-600 mb-5">
          Showing {results.length} of {count} requests
        </p>
        <button
          onClick={() => console.log("Add Employee button clicked")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Qo'shish
        </button>
      </div>
      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Priority
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Company
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Phone
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Images
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                File
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((request, index) => (
              <tr
                key={request.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.priority}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`${
                      request.status === "pending"
                        ? "text-yellow-500"
                        : "text-green-500"
                    } font-semibold`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.company.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.company.phone_number}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex gap-2">
                    {request.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image.src}
                        alt={`Request image ${idx + 1}`}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={request.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Download File
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Section */}
      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`p-2 rounded-lg border border-gray-300 ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Previous
        </button>

        <span className="font-bold">
          Page {page} of {page_count}
        </span>

        <button
          disabled={page === page_count}
          onClick={() => setPage((prev) => Math.min(prev + 1, page_count))}
          className={`p-2 rounded-lg border border-gray-300 ${
            page === page_count
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Next
        </button>

        <select
          className="ml-4 py-2 px-3 border border-gray-300 rounded-md"
          value={page_size}
          onChange={(e) => setPage_size(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
    </div>
  );
}
