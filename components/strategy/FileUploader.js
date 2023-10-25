import React from "react";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";

function FileUploader({onUploadSuccess}) {

  const onUpload = async ({ files }) => {
    try {
      const formData = new FormData();
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
      alert("Error: make sure that the app didn't do reconciliation on that file alredy")
    }
  };

  return (
    <div>
      <FileUpload
        name="fileUploaded"
        customUpload={true}
        maxFileSize={1000000}
        uploadHandler={onUpload}
        uploadLabel={"Initialize Reconciliation"}
        accept=".xlsx"
        emptyTemplate={
          <p className="m-0">Drag and drop files here to upload.</p>
        }
      />
    </div>
  );
}

export default FileUploader;
