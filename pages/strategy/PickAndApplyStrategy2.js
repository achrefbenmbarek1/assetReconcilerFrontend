import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function PickAndApplyStrategy() {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [numberOfCycles, setNumberOfCycles] = useState(1);
  const [isNumberSelected, setIsNumberSelected] = useState(false);
  const router = useRouter();
  const id = router.query.id;

  const handleButtonClick = () => {
    setIsNumberSelected(true);
  };

  useEffect(() => {
    fetch(`http://localhost:8000/strategyCreatorPage?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setOptions(data["potentialKeys"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Pick and Apply Strategy</h1>
      <input
        type="number"
        placeholder="Enter the number of cycles"
        onChange={(e) => setNumberOfCycles(parseInt(e.target.value))}
      />
      {isNumberSelected
        ? (
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Select an option</option>
            {options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
        : <button onClick={handleButtonClick}>setAndApplyStrategy</button>}
    </div>
  );
}

export default PickAndApplyStrategy;
