import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "../../public/css/styles.module.css";

function PickAndApplyStrategy() {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [numberOfCycles, setNumberOfCycles] = useState(1);
  const [isNumberOfCyclesSelected, setIsNumberOfCyclesSelected] = useState(
    false,
  );
  const [
    isNumberOfReconciliationKeysSelected,
    setIsNumberOfReconciliationKeysSelected,
  ] = useState(false);
  const [numberOfReconciliationKeys, setNumberOfReconciliationKeys] = useState(
    1,
  );
  const [areReconciliationKeysSelected, setAreReconciliationKeysSelected] =
    useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const potentialKeys = useRef([]);
  const filteredPotentialKeys = useRef([]);
  const selectedOptionsRef = useRef([]);
  const router = useRouter();
  const id = router.query.id;

  const handleNumberOfCyclesSelected = () => {
    setSelectedOptions(new Array(numberOfCycles).fill(""));
    setIsNumberOfCyclesSelected(true);
  };
  const handleNumberOfReconciliationKeysSelected = () => {
    setSelectedOptions(
      new Array(numberOfReconciliationKeys).fill(""),
    );
    setIsNumberOfReconciliationKeysSelected(true);
  };

  const handleDropdownChange = (index, selectedValue) => {
    const updatedSelectedOptions = [...selectedOptions];
    const keyThathasBecomeAvailableAgain = updatedSelectedOptions[index];
    updatedSelectedOptions[index] = selectedValue;
    const newOptions = [...options];
    const availableOptions = newOptions.filter((value) =>
      value !== selectedValue
    );
    if (
      keyThathasBecomeAvailableAgain &&
      !availableOptions.includes(keyThathasBecomeAvailableAgain)
    ) {
      console.log("is it", keyThathasBecomeAvailableAgain);
      availableOptions.push(keyThathasBecomeAvailableAgain);
    }
    console.log("curisous", updatedSelectedOptions);
    setSelectedOptions(updatedSelectedOptions);
    filteredPotentialKeys.current = availableOptions;
    setOptions(availableOptions);
  };

  const handleReconciliationKeysSelected = () => {
    console.log("selection", selectedOptions);
    selectedOptionsRef.current = selectedOptions;
    setAreReconciliationKeysSelected(true);
  };

  const handleNext = () => {
    if (currentIndex < selectedOptions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  useEffect(() => {
    fetch(`http://localhost:8000/strategyCreatorPage?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        potentialKeys.current = data;
        setOptions(data["potentialKeys"]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [id]);

  return (
    <div>
      <h1>Strategy rules</h1>
      {isNumberOfReconciliationKeysSelected && !areReconciliationKeysSelected &&
        <h3>select the reconciliation keys:</h3>}
      {isNumberOfReconciliationKeysSelected && !areReconciliationKeysSelected &&
        (
          selectedOptions.map((selectedOption, index) => (
            <div key={`reconciliationKey-${index}`}>
              {selectedOption}
              <select
                value={selectedOption}
                onChange={(e) =>
                  handleDropdownChange(index, e.target.value)}
                onClick={() => {
                  // setOptions(potentialKeys.current);
                  console.log("za3ma", potentialKeys.current);
                }}
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
        )}
      {!isNumberOfReconciliationKeysSelected &&
        !areReconciliationKeysSelected &&
        (
          <div>
            <div>
              <input
                type="number"
                className={styles.inputField}
                placeholder="Enter the number of reconciliation keys"
                min={1}
                onChange={(e) => {
                  setNumberOfReconciliationKeys(parseInt(e.target.value));
                }}
              />
            </div>
            <button
              className={styles.confirmButton}
              onClick={handleNumberOfReconciliationKeysSelected}
            >
              confirm
            </button>
          </div>
        )}
      {isNumberOfReconciliationKeysSelected && !areReconciliationKeysSelected &&
        (
          <button
            className={styles.confirmButton}
            onClick={handleReconciliationKeysSelected}
          >
            confirm
          </button>
        )}
      {isNumberOfCyclesSelected && areReconciliationKeysSelected &&
        (
          selectedOptionsRef.current.map((selectedOption, index) => (
            <div
              key={`cycle-${index}`}
              style={{ display: index === currentIndex ? "block" : "none" }}
            >
              <h2>Cycle {index}:</h2>
              <h3>reconciliation keys of this cycle:</h3>
              <select
                value={selectedOption}
                // onChange={(e) => handleDropdownChange(index, e.target.value)}
                multiple={true}
              >
                {selectedOptionsRef.current?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      {isNumberOfCyclesSelected && areReconciliationKeysSelected &&
        currentIndex != selectedOptions.length - 1 && (
        <div>
          <button onClick={handlePrevious} className={styles.previousButton}>
            Previous Cycle
          </button>
          <button onClick={handleNext} className={styles.nextButton}>
            Next Cycle
          </button>
        </div>
      )}

      {isNumberOfCyclesSelected && areReconciliationKeysSelected &&
        currentIndex == selectedOptions.length - 1 && (
        <div>
          <button onClick={handlePrevious} className={styles.previousButton}>
            Previous Cycle
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleReconciliationKeysSelected}
          >
            Apply Strategy
          </button>
        </div>
      )}

      {!isNumberOfCyclesSelected && areReconciliationKeysSelected &&
        (
          <div>
            <div>
              <input
                type="number"
                className={styles.inputField}
                placeholder="Enter the number of cycles"
                min={1}
                onChange={(e) => {
                  setNumberOfCycles(parseInt(e.target.value));
                }}
              />
            </div>
            <button
              className={styles.confirmButton}
              onClick={handleNumberOfCyclesSelected}
            >
              confirm
            </button>
          </div>
        )}
    </div>
  );
}

export default PickAndApplyStrategy;
