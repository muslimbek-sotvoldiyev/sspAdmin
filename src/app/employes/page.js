"use client";
import React, { useState } from "react";
import { useGetEmployeesQuery } from "@/lib/service/api";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const EmployeesList = () => {
  const [page, setPage] = useState(1);
  const [page_size, setPage_size] = useState(5);

  const { data, error, isLoading } = useGetEmployeesQuery({
    page,
    page_size,
  });

  const router = useRouter();

  const handleEmployeeClick = (id) => {
    router.push(`/employes/${id}`);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  const totalPages = Math.ceil(data.count / page_size);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Employees List</h1>

      <ul className="space-y-5">
        {data.results.map((employee) => (
          <li
            key={employee.id}
            className="flex items-center gap-5 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50" // Added cursor-pointer and hover effect
            onClick={() => handleEmployeeClick(employee.id)} // Added click handler
          >
            <img
              src={employee.image}
              alt={`${employee.first_name} ${employee.last_name}`}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p>
                <strong>Name:</strong> {employee.first_name}{" "}
                {employee.last_name}
              </p>
              <p>
                <strong>Phone:</strong> {employee.phone_number}
              </p>
            </div>
          </li>
        ))}
      </ul>

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
          <ChevronLeftIcon />
        </button>

        <span className="font-bold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className={`p-2 rounded-lg border border-gray-300 ${
            page === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <ChevronRightIcon />
        </button>

        <div className="ml-5">
          <select
            id="page-size"
            name="page-size"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={page_size}
            onChange={(e) => setPage_size(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EmployeesList;
