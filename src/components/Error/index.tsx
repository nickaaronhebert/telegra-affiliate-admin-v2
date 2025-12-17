import { Link } from "react-router-dom";

interface ErrorComponentProps {
  error?: boolean | any;
  title?: string;
  message?: string;
  backToPath?: string;
  backToText?: string;
  height?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  error,
  title = "Error Occurred",
  message,
  backToPath,
  backToText = "Go Back",
  height = "70vh"
}) => {
  const defaultMessage = error
    ? "Something went wrong. Please try again."
    : "Data not found.";

  return (
    <div className={`h-[${height}] flex justify-center items-center`}>
      <div className="text-center">
        <div className="text-red-500 text-lg font-semibold mb-2">
          {title}
        </div>
        <div className="text-gray-600 mb-4">
          {message || defaultMessage}
        </div>
        {backToPath && (
          <Link
            to={backToPath}
            className="text-primary hover:underline"
          >
            {backToText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorComponent;
