import React from "react";

const Spinner = () => {
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800  z-50">
      <div className="flex flex-col items-center">
      <svg class="animate-spin h-12 w-12 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 000 16 8 8 0 010-16z"
    ></path>
  </svg>
        <p className="mt-4 text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;