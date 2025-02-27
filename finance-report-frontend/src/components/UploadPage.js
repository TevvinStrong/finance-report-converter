import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "styled-components";

const UploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #eef2f3;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 450px;
  width: 100%;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 30px rgba(0, 123, 255, 0.4);
  }
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #007bff;
  border-radius: 12px;
  padding: 30px;
  cursor: pointer;
  background: #f9f9f9;
  transition: background 0.3s ease-in-out, border-color 0.3s ease-in-out;
  &:hover {
    background: #e3f2fd;
    border-color: #007bff;
  }
  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: white;
  font-weight: bold;
  text-transform: none;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: linear-gradient(90deg, #0056b3, #003f7f);
    box-shadow: 0px 4px 15px rgba(0, 123, 255, 0.4);
  }
  @media (max-width: 480px) {
    padding: 10px 16px;
  }
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #007bff;
    }
    &:hover fieldset {
      border-color: #0056b3;
    }
    &.Mui-focused fieldset {
      border-color: #003f7f;
    }
  }
  & .MuiInputLabel-root {
    color: #007bff;
  }
  & .MuiInputLabel-root.Mui-focused {
    color: #003f7f;
  }
`;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [columnsToRemove, setColumnsToRemove] = useState("");

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError("Invalid file type. Please upload a .xlsx or .xls file.");
      setFile(null);
    } else {
      setFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a valid file.");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("columnsToRemove", columnsToRemove);

    try {
      const response = await fetch("http://localhost:5000/uploadExcel", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `filtered_${file.name}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Error uploading file.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    onDropRejected: () => {
      setError("Invalid file type. Please upload a .xlsx or .xls file.");
    },
  });

  return (
    <UploadContainer>
      {loading ? (
        <CircularProgress size={80} color="primary" />
      ) : (
        <Card>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Upload Your Excel File
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Only .xlsx and .xls files are accepted. Drag & Drop your file or
            click below.
          </Typography>
          <DropzoneContainer {...getRootProps()}>
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 40, color: "#007bff" }} />
            <Typography variant="body2" color="textSecondary">
              Drag & Drop or Click to Upload
            </Typography>
          </DropzoneContainer>
          {file && (
            <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold" }}>
              {file.name}
            </Typography>
          )}
          {error && <ErrorText>{error}</ErrorText>}
          <Box mt={3}>
            <StyledTextField
              label="Columns to Remove"
              variant="outlined"
              fullWidth
              value={columnsToRemove}
              onChange={(e) => setColumnsToRemove(e.target.value)}
              placeholder="Enter columns separated by commas"
            />
          </Box>
          <Box mt={3}>
            <StyledButton
              variant="contained"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              Process File
            </StyledButton>
          </Box>
        </Card>
      )}
    </UploadContainer>
  );
};

export default FileUpload;
