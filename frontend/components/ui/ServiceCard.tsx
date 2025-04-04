import Link from "next/link";
import {
  FaHome,
  FaTools,
  FaPaintRoller,
  FaBoxOpen,
  FaFaucet,
  FaBolt,
} from "react-icons/fa";

interface ServiceCardProps {
  name: string;
  iconType: string;
}

const ServiceCard = ({ name, iconType }: ServiceCardProps) => {
  const getIcon = () => {
    switch (iconType) {
      case "cleaning":
        return <FaHome className="w-8 h-18 text-orange-500" />;
      case "repair":
        return <FaTools className="w-8 h-18 text-orange-500" />;
      case "painting":
        return <FaPaintRoller className="w-8 h-18 text-orange-500" />;
      case "shifting":
        return <FaBoxOpen className="w-8 h-18 text-orange-500" />;
      case "plumbing":
        return <FaFaucet className="w-8 h-18 text-orange-500" />;
      case "electric":
        return <FaBolt className="w-8 h-18 text-orange-500" />;
      default:
        return <FaHome className="w-8 h-18 text-orange-500" />;
    }
  };

  return (
    <Link href={`/services/${name.toLowerCase()}`}>
      <div className="bg-gray-50 rounded-lg shadow-sm p-8 flex flex-col items-center justify-center border border-gray-100 transition-all duration-300 hover:shadow-md hover:bg-white hover:scale-105 hover:border-orange-200">
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          {getIcon()}
        </div>
        <h3 className="text-lg font-medium text-gray-800">{name}</h3>
      </div>
    </Link>
  );
};

export default ServiceCard;
