import { Link } from "react-router-dom";

interface InfoComponentProps {
  imageSrc: string;
  name: string;
  occupancy: string;
  link?: string;
  className?: string;
}

const InfoComponent = ({
  imageSrc,
  name,
  occupancy,
  link,
}: InfoComponentProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <img
        src={imageSrc}
        alt="Image"
        className="object-cover w-full h-16 md:h-20"
      />
      <div>
        <h1>{name}</h1>
        <p>{occupancy}</p>
      </div>
      <Link to={link} className="text-xs text-primary hover:underline">
        View More
      </Link>
    </div>
  );
};

export default InfoComponent;
