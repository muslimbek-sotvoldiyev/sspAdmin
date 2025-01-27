'use client';

import React, { useState, useEffect } from 'react';
import {
  useGetEmployeeIdQuery,
  useGetEmployesInRequestsPerformerQuery,
  useGetEmployesInRequestsUploaderQuery,
} from '@/lib/service/api';
import { useParams, useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import Modal from '@/components/Modal';
import Pagination from '@/components/pagination';

const EmployeeDetails = ({ employee }) => (
  <div className="mb-5 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50 flex gap-4">
    <img
      src={employee.image}
      alt={`${employee.first_name} ${employee.last_name}`}
      className="w-32 h-32 rounded-full object-cover"
    />
    <div>
      <h2 className="text-xl font-semibold mb-3">
        {employee.first_name} {employee.last_name}
      </h2>
      <p>
        <strong>Role:</strong> {employee.role}
      </p>
      <p>
        <strong>Phone:</strong> {employee.phone_number}
      </p>
      <p>
        <strong>Region:</strong> {employee.region}
      </p>
      <p>
        <strong>District:</strong> {employee.district}
      </p>
      <p>
        <strong>Passport:</strong> {employee.passport}
      </p>
    </div>
  </div>
);

const RequestsTable = ({ requests, onImageClick }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-left">#</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Company</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Images</th>
          <th className="border border-gray-300 px-4 py-2 text-left">File</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request, index) => (
          <tr key={request.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
            <td className="border border-gray-300 px-4 py-2">{request.priority}</td>
            <td className="border border-gray-300 px-4 py-2">{request.description}</td>
            <td className="border border-gray-300 px-4 py-2">
              <span
                className={`font-semibold ${
                  request.status === 'pending' ? 'text-yellow-500' : 'text-green-500'
                }`}
              >
                {request.status}
              </span>
            </td>
            <td className="border border-gray-300 px-4 py-2">{request.company.name}</td>
            <td className="border border-gray-300 px-4 py-2">{request.company.phone_number}</td>
            <td className="border border-gray-300 px-4 py-2">{request.type.join(', ')}</td>

            <td className="border border-gray-300 px-4 py-2">
              <div className="flex gap-2">
                {request.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Request image ${idx + 1}`}
                    className="w-16 h-16 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onImageClick(image)}
                  />
                ))}
              </div>
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <a
                href={request.file || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-blue-500 hover:text-blue-700 underline ${
                  !request.file && 'pointer-events-none text-gray-400'
                }`}
              >
                {request.file ? 'Download' : 'No file'}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const deduplicateAndMergeRequests = (performerData, uploaderData) => {
  const requestsMap = new Map();

  performerData?.results?.forEach((request) => {
    if (!requestsMap.has(request.id)) {
      requestsMap.set(request.id, { ...request, type: ['Performer'] });
    } else {
      const existingRequest = requestsMap.get(request.id);
      if (!existingRequest.type.includes('Performer')) {
        existingRequest.type.push('Performer');
      }
      requestsMap.set(request.id, existingRequest);
    }
  });

  uploaderData?.results?.forEach((request) => {
    if (!requestsMap.has(request.id)) {
      requestsMap.set(request.id, { ...request, type: ['Uploader'] });
    } else {
      const existingRequest = requestsMap.get(request.id);
      if (!existingRequest.type.includes('Uploader')) {
        existingRequest.type.push('Uploader');
      }
      requestsMap.set(request.id, existingRequest);
    }
  });

  return Array.from(requestsMap.values());
};

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [page_size, setPage_size] = useState(5);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isNaN(id)) {
      router.push('/404');
    }
  }, [id, router]);

  const { data: performerData, isLoading: isPerformerLoading } =
    useGetEmployesInRequestsPerformerQuery({
      page,
      page_size,
      performer: id,
    });

  const { data: uploaderData, isLoading: isUploaderLoading } =
    useGetEmployesInRequestsUploaderQuery({
      page,
      page_size,
      uploader: id,
    });

  const { data: employeeData, isLoading: isEmployeeLoading } = useGetEmployeeIdQuery({ id });

  const isLoading = isPerformerLoading || isUploaderLoading || isEmployeeLoading;
  const hasError = !performerData || !uploaderData || !employeeData;

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPage_size(newPageSize);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        <p>Error: Unable to fetch data. Please try again later.</p>
      </div>
    );
  }

  const combinedResults = deduplicateAndMergeRequests(performerData, uploaderData);
  const combinedCount = (performerData?.count || 0) + (uploaderData?.count || 0);
  const page_count = Math.ceil(combinedCount / page_size);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Employees in Request</h1>
      </div>

      {employeeData && <EmployeeDetails employee={employeeData} />}

      <div className="mb-5">
        <p className="text-gray-600">
          Showing {combinedResults.length} of {combinedCount} requests
        </p>
      </div>

      <RequestsTable requests={combinedResults} onImageClick={setSelectedImage} />

      <Pagination
        page={page}
        totalPages={page_count}
        pageSize={page_size}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <img src={selectedImage} alt="Selected" className="max-w-full max-h-[80vh] rounded-md" />
      </Modal>
    </div>
  );
}
