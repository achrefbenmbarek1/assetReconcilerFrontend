import React from "react";

const CycleComponent = ({
  index,
  currentIndex,
  cyclesReconciliationKeys,
  selectedOptionsRef,
  categorizationPrecisionsOfTheStrategy,
  selectedSimilarityThreshold,
  allAlgorithms,
  handleReconciliationKeysSelectedForCycle,
  handleCategorisationKeySelectedForCycle,
  handleSimilarityThresholdChange,
  handleAlgorithmSelectedForCycle,
}) => {
  return (
    <div
      key={`cycle-${index}`}
      style={{ display: index === currentIndex ? "block" : "none" }}
    >
      <h2>Cycle {index}:</h2>
      <h3>reconciliation keys:</h3>
      <select
        onChange={(e) =>
          handleReconciliationKeysSelectedForCycle(index, e.target.selectedOptions)}
        multiple={true}
      >
        {cyclesReconciliationKeys?.length
          ? cyclesReconciliationKeys?.at(index - 1)?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          : selectedOptionsRef.current?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
      </select>
      <h3>categorisation precision:</h3>
      <select
        onChange={(e) =>
          handleCategorisationKeySelectedForCycle(e.target.value)}
      >
        {categorizationPrecisionsOfTheStrategy.current?.at(index)?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <h3>similarity threshold:</h3>
      <input
        type="number"
        value={selectedSimilarityThreshold}
        onChange={(e) => {
          handleSimilarityThresholdChange(e.target.value);
        }}
        min="0"
        max="100"
      />
      <h3>algorithm:</h3>
      <select
        onChange={(e) => handleAlgorithmSelectedForCycle(e.target.value)}
      >
        {allAlgorithms.current?.map((algorithm) => {
          return (
            <option key={algorithm} value={algorithm}>
              {algorithm}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CycleComponent;

