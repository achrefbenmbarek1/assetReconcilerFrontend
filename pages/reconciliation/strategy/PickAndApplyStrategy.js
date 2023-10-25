
import CycleComponent from "@/components/strategy/CycleComponent";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "../../../public/css/styles.module.css";

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
  const cycleSelectedOptions = useRef([]);
  const router = useRouter();
  const id = router.query.id;
  const [cyclesReconciliationKeys, setCyclesReconciliationKeys] = useState([]);
  const categorizationPrecisionsOfTheStrategy = useRef([[
    "groupe",
    "famille",
    "sousFamille",
  ]]);
  const allPossibleCategorisations = useRef([
    "groupe",
    "famille",
    "sousFamille",
  ]);
  const selectedCategorization = useRef("groupe");
  const [selectedSimilarityThreshold, setSelectedSimilarityThreshold] =
    useState(0);
  const strategySimilarityThresholds = useRef([]);
  const allAlgorithms = useRef(["Levenshtein", "Jaccard", "Sorensen"]);
  const strategyAlgorithms = useRef([]);
  const currentlySelectedReconciliationKeys = useRef([]);

  const handleSimilarityThresholdChange = (
    currentlySelectedSimilarityThreshold,
  ) => {
    if (isNaN(currentlySelectedSimilarityThreshold)) {
      currentlySelectedSimilarityThreshold = 0;
    } else if (currentlySelectedSimilarityThreshold < 0) {
      value = 0;
    } else if (currentlySelectedSimilarityThreshold > 100) {
      currentlySelectedSimilarityThreshold = 100;
    }
    console.log(currentlySelectedSimilarityThreshold);

    setSelectedSimilarityThreshold(currentlySelectedSimilarityThreshold);
  };

  const handleNumberOfCyclesSelected = () => {
    setSelectedOptions(new Array(numberOfCycles).fill(""));
    strategySimilarityThresholds.current = new Array(numberOfCycles).fill(0);
    setIsNumberOfCyclesSelected(true);
  };

  const handleNumberOfReconciliationKeysSelected = () => {
    console.log("selenium selecteni",numberOfReconciliationKeys)
    setSelectedOptions(
      new Array(numberOfReconciliationKeys).fill(""),
    );
    setIsNumberOfReconciliationKeysSelected(true);
  };

  const handleReconciliationKeySelected = (index, selectedValue) => {
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
      availableOptions.push(keyThathasBecomeAvailableAgain);
    }
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
    if (currentIndex >= selectedOptions.length - 1) {
      return;
    }

    if (!cycleSelectedOptions.current?.at(currentIndex)?.length) {
      alert("please select the reconciliation keys of this cycle");
      return;
    }
    const startingIndex = allPossibleCategorisations.current.indexOf(
      selectedCategorization.current,
    );
    const potentialCategorizationsOfTheNextCycle = allPossibleCategorisations
      .current.slice(startingIndex);
    categorizationPrecisionsOfTheStrategy.current[currentIndex + 1] =
      potentialCategorizationsOfTheNextCycle;
    console.log(
      "they said become a programmer, it would be fun",
      categorizationPrecisionsOfTheStrategy.current,
    );
    const isThresholdsValid = strategySimilarityThresholds.current
      .slice(0, currentIndex)
      .every((threshold) => parseInt(threshold) >= selectedSimilarityThreshold);
    if (!isThresholdsValid) {
      alert(
        "the similarity threshold of this cycle need to be lesser or equal than the previous ones",
      );
      return;
    }
    strategySimilarityThresholds.current[currentIndex] =
      selectedSimilarityThreshold;
    console.log("we're hunting", strategySimilarityThresholds.current);

    setCurrentIndex(currentIndex + 1);
    setCyclesReconciliationKeys(cycleSelectedOptions.current);
    console.log("this is a big fish", cycleSelectedOptions.current);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReconciliationKeysSelectedForCycle = (
    index,
    cycleReconciliationKeys,
  ) => {
    currentlySelectedReconciliationKeys.current = Array.from(
      cycleReconciliationKeys,
    ).map((
      option,
    ) => option.value);

    const reconciliationKeys = [...cyclesReconciliationKeys];
    reconciliationKeys[index] = currentlySelectedReconciliationKeys.current;
    cycleSelectedOptions.current = reconciliationKeys;
  };

  const handleCategorisationKeySelectedForCycle = (
    selectedCategorisationOfThisCycle,
  ) => {
    selectedCategorization.current = selectedCategorisationOfThisCycle;
  };

  const handleAlgorithmSelectedForCycle = (algorithm) => {
    strategyAlgorithms.current[currentIndex] = algorithm;
    console.log("last hunt", strategyAlgorithms.current);
  };

  const handleApplyStrategy = async () => {
    console.log("hello", strategyAlgorithms.current);
    const isThresholdsValid = strategySimilarityThresholds.current
      .slice(0, currentIndex)
      .every((threshold) => parseInt(threshold) >= selectedSimilarityThreshold);
    strategySimilarityThresholds.current[currentIndex] =
      selectedSimilarityThreshold;
    if (!isThresholdsValid) {
      alert(
        "the similarity threshold of this cycle need to be lesser or equal than the previous ones",
      );
      return;
    }
    const orderedCycles = selectedOptions?.map((cycle, index) => {
      return {
        "similarityThreshold": parseInt(
          strategySimilarityThresholds.current[index],
          10,
        ),
        "reconciliationKeys": cycleSelectedOptions.current?.at(index),
        "categorizationPrecision": categorizationPrecisionsOfTheStrategy.current
          ?.at(index)[0],
        "algorithm": strategyAlgorithms.current[index],
      };
    });
    const strategy = {
      orderedCycles,
      reconciliationId: id,
    };

    const lastIndex = strategy["orderedCycles"].length - 1;
    const lastCycle = strategy["orderedCycles"][lastIndex];
    lastCycle["reconciliationKeys"] =
      currentlySelectedReconciliationKeys.current;

    console.log("this is the main food", strategy);
    const response = await fetch(
      "http://localhost:8000/createAndApplyStrategy",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(strategy),
      },
    );
    if (!response.ok) {
      alert(
        "Error: someone else is probably adding a strategy at the time that you tried to add your strategy too please try clicking on the button again ",
      );
      return;
    }
    alert(
      "the strategy is being applied and the reconciliation is gonna happen soon, if the data isn't reconciled yet feel free to create other strategies or do other reconciliations while this reconciliation is finishing in the background",
    );
  };
  useEffect(() => {
    console.log(cyclesReconciliationKeys);
  }, [cyclesReconciliationKeys]);

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
                id={`reconciliationDropdown-${index}`}
                value={selectedOption}
                onChange={(e) =>
                  handleReconciliationKeySelected(index, e.target.value)}
                onClick={() => {
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
                id="numberOfReconciliationKeys"
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
              id="confirmNumberOfReconciliationKeys"
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
            id="confirmReconciliationKeysButton"
            className={styles.confirmButton}
            onClick={handleReconciliationKeysSelected}
          >
            confirm
          </button>
        )}
      {isNumberOfCyclesSelected && areReconciliationKeysSelected &&
        (
          selectedOptions.map((selectedOption, index) => (
            <CycleComponent
              key={index}
              index={index}
              currentIndex={currentIndex}
              cyclesReconciliationKeys={cyclesReconciliationKeys}
              selectedOptionsRef={selectedOptionsRef}
              categorizationPrecisionsOfTheStrategy={categorizationPrecisionsOfTheStrategy}
              selectedSimilarityThreshold={selectedSimilarityThreshold}
              allAlgorithms={allAlgorithms}
              handleReconciliationKeysSelectedForCycle={handleReconciliationKeysSelectedForCycle}
              handleCategorisationKeySelectedForCycle={handleCategorisationKeySelectedForCycle}
              handleSimilarityThresholdChange={handleSimilarityThresholdChange}
              handleAlgorithmSelectedForCycle={handleAlgorithmSelectedForCycle}
            />
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
            onClick={handleApplyStrategy}
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
                id="numberOfCyclesInput"
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
