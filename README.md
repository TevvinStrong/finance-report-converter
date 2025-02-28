# Finance Report Converter

Finance Report Converter is a web application designed to help users process Excel files by removing specified columns. The app is built with a focus on seamless UI/UX, ensuring an intuitive experience for users.
<img width="1920" alt="Screen Shot 2025-02-27 at 11 30 54 PM" src="https://github.com/user-attachments/assets/f33f7d2b-97d9-428e-a8f2-4495ac1e49d8" />


## * Features
- Upload Excel files (.xlsx and .xls)
- Select which columns to remove before processing
- Process and return the modified file for download
- Secure handling of sensitive financial data
- Fast and efficient file processing with a Node.js backend
- Modern React-based frontend with an elegant Material UI design

## * Project Structure
The project follows a frontend-backend architecture:

```

finance-report-converter/
│── backend/             # Backend (Node.js with Express)
│   ├── controllers/     # Handles business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Security, validation, etc.
│   ├── uploads/         # Temporary storage for uploaded files
│   ├── server.js        # Entry point for backend
│   ├── package.json     # Backend dependencies
│   └── .gitignore       # Backend-specific ignored files
│
│── frontend/            # Frontend (React with Material UI)
│   ├── src/             # React components, hooks, and pages
│   ├── public/          # Static assets
│   ├── package.json     # Frontend dependencies
│   ├── tsconfig.json    # TypeScript configuration
│   └── .gitignore       # Frontend-specific ignored files
│
│── README.md            # Project documentation
│── .gitignore           # Root-level ignored files
│── package.json         # Monorepo package file (if applicable)

```
## * Technologies Used
### Frontend
- React (TypeScript) – UI framework
- Material UI – Pre-built UI components
- Styled Components – Custom styling
- React Dropzone – File uploads
- Axios – API requests

### Backend
- Node.js with Express – Server-side logic
- Multer – File upload handling
- XLSX.js – Excel file parsing and modification
- dotenv – Environment variable management
- CORS – Handling cross-origin requests

## * Installation & Setup

1. Clone the Repository
```
git clone https://github.com/yourusername/finance-report-converter.git
cd finance-report-converter
```

2. Install Dependencies
```
* Frontend

cd frontend
npm install
```
```
* Backend

cd backend
npm install
```
3. Running the Application
```
Start Backend

cd backend
npm run dev  # Uses Nodemon for auto-restart
```
```
Start Frontend

cd frontend
npm start
```
The application should now be running:

Frontend: `http://localhost:3000`

Backend: `http://localhost:5000`

## * API Endpoints

| Method  | Endpoint | Description |
| ------- | -------- | ----------- |
| POST    | /upload  | Uploads and processes a file|
| GET     | /download| Retrives the processed file |

## * Security & Compliance

Data Privacy: The app ensures secure handling of financial data, with best practices in place.

Compliance: The backend does not store sensitive data and follows industry standards for security.

## * Future Enhancements

User authentication for secure file handling

Cloud storage integration (AWS S3 or Firebase)

Support for additional file formats (CSV, JSON)
