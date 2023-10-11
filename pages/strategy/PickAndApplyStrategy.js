import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function PickAndApplyStrategy() {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [numberOfCycles, setNumberOfCycles] = useState(1);
  const [isNumberSelected, setIsNumberSelected] = useState(false);
  const router = useRouter();
  const id = router.query.id;

  const handleButtonClick = () => {
    setIsNumberSelected(true);
    setSelectedOptions(new Array(numberOfCycles).fill(""));
  };

  const handleDropdownChange = (index, selectedValue) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index] = selectedValue;
    setSelectedOptions(updatedSelectedOptions);
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
  }, [id]);

  return (
    <div>
      <h1>Strategy rules</h1>
      {!isNumberSelected &&   (
        <input
          type="number"
          placeholder="Enter the number of cycles"
          onChange={(e) => setNumberOfCycles(parseInt(e.target.value))}
        />
      )}
      {isNumberSelected
        ? (
          selectedOptions.map((selectedOption, index) => (
            <div key={index}>
              <select
                value={selectedOption}
                onChange={(e) => handleDropdownChange(index, e.target.value)}
              >
                <option value="">Select an option</option>
                {options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))
        )
        : <button onClick={handleButtonClick}>setAndApplyStrategy</button>}
    </div>
  );
}

export default PickAndApplyStrategy;
