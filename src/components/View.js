import { useParams } from "react-router-dom";

const View = () => {
  const { searchResults } = useParams();
  return (
    <div>
      <h1 className="text-center font-bold">Searched Value</h1>
      <div className="flex flex-col items-center justify-center h-[500px]">
        <span>{searchResults}</span>
      </div>
    </div>
  );
};

export default View;
