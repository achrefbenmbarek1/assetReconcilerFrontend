import { useRouter } from "next/router";
import React, { useState } from "react";
import FileUploader from "../components/strategy/FileUploader";

function HomePage() {
  const [isSuccessfullyUploaded, setIsSuccessfullyUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const router = useRouter()
  const handleUploadSuccess = (file) => {
    setIsSuccessfullyUploaded(true);
    setFileName(file.name);
  };
  const handleButtonClick = () => {
     router.push({
      pathname: "/strategy/PickAndApplyStrategy",
      query: { id: fileName },
    });
  };

  return (
    <div>
      <h1>Initialize Reconciliation</h1>
      <FileUploader onUploadSuccess={handleUploadSuccess} />
      {isSuccessfullyUploaded
        ? <button onClick={handleButtonClick}>setAndApplyStrategy</button>
        : <button disabled>setAndApplyStrategy</button>}
    </div>
  );
}

export default HomePage;
