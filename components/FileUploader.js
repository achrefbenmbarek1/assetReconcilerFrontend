import React, { useState } from "react";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";
import { useRouter } from "next/router";

function FileUploader({onUploadSuccess}) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const router = useRouter()

  const handleFileUpload = (event) => {
    const file = event.files[0];
    console.log("file", file);
    setUploadedFile(file);
  };

  const onUpload = async ({ files }) => {
    try {
      const formData = new FormData();
      console.log(uploadedFile);
      formData.append("fileUploaded", files[0]);
      console.log("formdata", formData);

      await axios.post(
        "http://localhost:8000/initializeReconciliation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      onUploadSuccess(files[0])
      alert("your reconciliation is being initialized you can proceed with setting and applying the strategy")

    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <div>
      <FileUpload
        name="fileUploaded"
        customUpload={true}
        maxFileSize={1000000}
        uploadHandler={onUpload}
        emptyTemplate={
          <p className="m-0">Drag and drop files here to upload.</p>
        }
      />
    </div>
  );
}

export default FileUploader;
