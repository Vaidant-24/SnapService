import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-200">
        Unauthorized Access
      </h2>
      <p className="text-gray-200 mt-2">
        You do not have permission to view this page.
      </p>
    </div>
  );
};

export default Unauthorized;
