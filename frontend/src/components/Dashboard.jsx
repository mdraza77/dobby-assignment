import React, { useState, useEffect } from "react";
import API from "../api";
import { LogOut, Plus, Upload } from "lucide-react";

const Dashboard = ({ onLogout }) => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]); // To store images of current folder
  const [newFolderName, setNewFolderName] = useState("");
  const [path, setPath] = useState([{ id: "root", name: "Home" }]);
  const [totalSize, setTotalSize] = useState(0); // To show folder size

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

  // Image Upload Logic (Requirement #6)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", file.name); // Optional: sending name explicitly

    // CRITICAL FIX: If we are in 'Home', folderId should be null/empty
    // Backend logic usually expects an empty string or nothing for Root files
    const uploadFolderId = currentFolder.id === "root" ? "" : currentFolder.id;
    formData.append("folderId", uploadFolderId);

    try {
      await API.post("/files/upload", formData);
      alert("Image Uploaded!");
      fetchContent(); // This will now fetch new files and update size
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed. Check if server is running.");
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
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          <form onSubmit={handleCreateFolder} className="flex gap-2">
            <input
              type="text"
              placeholder="New Folder Name"
              value={newFolderName}
              className="border p-2 rounded w-48"
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-3 py-3 rounded cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Folder
            </button>
          </form>

          <div className="flex gap-4 items-center">
            {currentFolder.id !== "root" && (
              <span className="font-bold bg-blue-100 text-blue-800 px-3 py-3 rounded">
                Total Size: {(totalSize / 1024).toFixed(2)} KB
              </span>
            )}
            <input
              type="file"
              id="fileUpload"
              hidden
              onChange={handleFileUpload}
            />
            <label
              htmlFor="fileUpload"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 py-3 rounded cursor-pointer flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Image
            </label>
          </div>
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
