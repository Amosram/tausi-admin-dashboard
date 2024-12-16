import { Link } from "react-router-dom";

interface InfoComponentProps {
  imageSrc: string;
  name: string;
  moreInfo?: string;
  link?: string;
  className?: string;
}

const InfoComponent = ({
  imageSrc,
  name,
  moreInfo,
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
        <h1 className="">Name: <span className="font-bold">{name}</span></h1>
        <p>{moreInfo}</p>
      </div>
      <Link to={link} className="text-xs text-primary hover:underline">
        View More
      </Link>
    </div>
  );
};

export default InfoComponent;
