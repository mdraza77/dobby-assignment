import React, { useState, useEffect } from "react";
import API from "../api";
import { LogOut, Plus, Upload, Type, FileImage, HardDrive } from "lucide-react";

const Dashboard = ({ onLogout }) => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]); // To store images of current folder
  const [newFolderName, setNewFolderName] = useState("");
  const [path, setPath] = useState([{ id: "root", name: "Home" }]);
  const [totalSize, setTotalSize] = useState(0); // To show folder size
  const [imageName, setImageName] = useState("");

  // Get current folder details from the last item in path array
  const currentFolder = path[path.length - 1];

  useEffect(() => {
    fetchContent();
  }, [currentFolder.id]);

  const fetchContent = async () => {
    try {
      // 1. Fetch Sub-folders
      const folderRes = await API.get(`/folders/${currentFolder.id}`);
      setFolders(folderRes.data);

      // 2. Fetch Files (Images) - We use the folder ID to get its files
      const fileRes = await API.get(`/files/${currentFolder.id}`);
      console.log("Current Files in Folder:", fileRes.data);
      setFiles(fileRes.data);

      // 3. Fetch Folder Size
      if (currentFolder.id !== "root") {
        const sizeRes = await API.get(`/folders/size/${currentFolder.id}`);
        setTotalSize(sizeRes.data.totalSizeInBytes);
      } else {
        setTotalSize(0);
      }
    } catch (err) {
      console.error("Error fetching content", err);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName) return;
    try {
      await API.post("/folders", {
        name: newFolderName,
        parentId: currentFolder.id === "root" ? null : currentFolder.id,
      });
      setNewFolderName("");
      fetchContent();
    } catch (err) {
      alert("Error creating folder");
    }
  };

  // Image Upload Logic
  const handleFileUpload = async (e) => {
    const fileInput = document.getElementById("fileUpload");
    const file = fileInput.files[0];

    // Validate both fields are present
    if (!file || !imageName.trim()) {
      alert("Please provide both a Name and an Image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", imageName); // Manual name from state

    const uploadFolderId = currentFolder.id === "root" ? "" : currentFolder.id;
    formData.append("folderId", uploadFolderId);

    try {
      await API.post("/files/upload", formData);
      alert(`"${imageName}" uploaded successfully!`);
      setImageName(""); // Reset name state
      fileInput.value = ""; // Clear file input
      fetchContent();
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed.");
    }
  };

  // Breadcrumb Navigation (Requirement #4)
  const navigateTo = (index) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);
  };

  const openFolder = (folder) => {
    setPath([...path, { id: folder._id, name: folder.name }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Dobby Drive</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </nav>

      <div className="p-8">
        {/* Breadcrumbs UI */}
        <div className="flex gap-2 mb-6 text-sm">
          {path.map((p, index) => (
            <span key={p.id} className="flex items-center">
              <span
                className="text-blue-600 cursor-pointer hover:underline font-medium"
                onClick={() => navigateTo(index)}
              >
                {p.name}
              </span>
              {index < path.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </span>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col space-y-6 mb-10">
          <div className="flex flex-wrap gap-4 items-end justify-between bg-white p-6 rounded-2xl border shadow-sm">
            {/* Section 1: Create Folder */}
            <form onSubmit={handleCreateFolder} className="flex flex-col gap-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Plus size={12} /> New Folder
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderName}
                  className="border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition text-sm w-48"
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2"
                >
                  <Plus size={18} /> Create
                </button>
              </div>
            </form>

            {/* Section 2: Upload Image with Required Name (Requirement #6) */}
            <div className="flex flex-wrap gap-4 items-end border-l pl-4 border-gray-100">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                  <Type size={12} /> Image Name
                </label>
                <input
                  type="text"
                  placeholder="Enter image name..."
                  value={imageName}
                  className="border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition text-sm w-48"
                  onChange={(e) => setImageName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                  <FileImage size={12} /> Select File
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="fileUpload"
                    hidden
                    onChange={(e) => {
                      // Auto-fill name if empty for better UX
                      if (!imageName && e.target.files[0]) {
                        setImageName(e.target.files[0].name.split(".")[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold cursor-pointer transition border border-gray-200 text-sm"
                  >
                    Browse...
                  </label>
                  <button
                    onClick={handleFileUpload}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 transition flex items-center gap-2"
                  >
                    <Upload size={18} /> Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Folder Size Indicator (Requirement #5) */}
          {currentFolder.id !== "root" && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl self-start shadow-sm">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <HardDrive size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">
                  Current Folder Size
                </p>
                <p className="text-lg font-black text-blue-800 leading-none">
                  {(totalSize / 1024).toFixed(2)}{" "}
                  <span className="text-sm font-medium">KB</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Folders Display */}
        <h3 className="text-gray-500 uppercase text-xs font-bold mb-4">
          Folders
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {folders.map((folder) => (
            <div
              key={folder._id}
              onClick={() => openFolder(folder)}
              className="p-4 bg-white border rounded shadow-sm hover:border-blue-300 cursor-pointer text-center"
            >
              <span className="text-4xl block mb-2">📁</span>
              <p className="font-medium text-gray-700 truncate">
                {folder.name}
              </p>
            </div>
          ))}
        </div>

        {/* Files Display (Requirement #1) */}
        <h3 className="text-gray-500 uppercase text-xs font-bold mb-4">
          Images
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="bg-white border rounded overflow-hidden shadow-sm"
            >
              <img
                src={`http://localhost:5000${file.url}`}
                alt={file.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-2">
                <p className="text-xs truncate font-medium">{file.name}</p>
                <p className="text-[10px] text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>

        {folders.length === 0 && files.length === 0 && (
          <p className="text-gray-500 italic text-center mt-10">
            This folder is empty.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
