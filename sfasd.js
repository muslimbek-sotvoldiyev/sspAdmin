"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import {
  useGetEmployeeIdQuery,
  useGetEmployesInRequestsQuery,
} from "@/lib/service/api";
import { CircularProgress } from "@mui/material";

export default function Page() {
  const router = useRouter();
  const { id } = useParams(); // router.query

  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [page_size, setPage_size] = useState(5);

  const { data, isLoading, error } = useGetEmployesInRequestsQuery({
    page,
    page_size,
    employee: id,
  });

  if (isLoading) {
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

  return (
    <div className="p-5">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Images
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
                  <div className="flex gap-2">
                    {request.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Request image ${idx + 1}`}
                        className="w-16 h-16 rounded-md object-cover cursor-pointer"
                        onClick={() => setSelectedImage(image)} // Modalni ochish
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modalni chaqirish */}
      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <img
          src={selectedImage}
          alt="Selected"
          className="max-w-full max-h-[80vh] rounded-md"
        />
      </Modal>
    </div>
  );
}
