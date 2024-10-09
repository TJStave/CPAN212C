import React, { useState } from 'react';

function App() {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [fetchedSingleFile, setFetchedSingleFile] = useState(null);
  const [fetchedMultiFiles, setFetchedMultiFiles] = useState(null);
  const [fetchedAllFiles, setFetchedAllFiles] = useState(null);
  const [dogUrl, setDogUrl] = useState(null);

  // Handle file input for single upload
  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0]);
  };

  // Handle file input for multiple uploads
  const handleMultipleFilesChange = (e) => {
    setMultipleFiles(e.target.files);
  };

  // Upload a single file to the server
  const uploadSingleFile = async () => {
    const formData = new FormData();
    formData.append('file', singleFile);

    try {
      const response = await fetch('http://localhost:8000/save/single', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error uploading single file:', error);
    }
  };

  // Upload multiple files to the server
  const uploadMultipleFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < multipleFiles.length; i++) {
      formData.append('files', multipleFiles[i]);
    }

    try {
      const response = await fetch('http://localhost:8000/save/multiple', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
    }
  };

  const uploadDogPic = async () => {
    try {
      const response = await fetch(dogUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('doggo', blob, dogUrl.split('/').pop());
      const doggoResponse = await fetch('http://localhost:8000/save/doggo', {
        method: 'POST',
        body: formData,
      });
      const data = await doggoResponse.json();
      alert(data.message);
    } catch (error) {
      console.error('Error uploading dog Picture: ', error);
    }
  };

  // Fetch a random single file from the server
  const fetchSingleFile = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetch/single');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setFetchedSingleFile(url);
      setFetchedMultiFiles(null);
      setFetchedAllFiles(null);
      setDogUrl(null);
    } catch (error) {
      console.error('Error fetching single file:', error);
    }
  };

  const fetchMultipleFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetch/multiple');
      const json = await response.json();
      const blobs = [];
      for(const item of json.data) {
        let imgResponse = await fetch(`http://localhost:8000/fetch/search/${item}`);
        let blob = await imgResponse.blob();
        blobs.push(blob);
      }
      const urls = blobs.map((blob) => URL.createObjectURL(blob));
      setFetchedMultiFiles(urls);
      setFetchedSingleFile(null);
      setFetchedAllFiles(null);
      setDogUrl(null);
    } catch (error) {
      console.error('Error fetching multiple files:', error);
    }
  }

  const fetchAllFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/fetch/all');
      const json = await response.json();
      const blobs = [];
      for(const item of json.data) {
        let imgResponse = await fetch(`http://localhost:8000/fetch/search/${item}`);
        let blob = await imgResponse.blob();
        blobs.push(blob);
      }
      const urls = blobs.map((blob) => URL.createObjectURL(blob));
      setFetchedAllFiles(urls);
      setFetchedSingleFile(null);
      setFetchedMultiFiles(null);
      setDogUrl(null);
    } catch (error) {
      console.error('Error fetching all files:', error);
    }
  }

  const fetchDogPicture = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const json = await response.json();
      setDogUrl(json.message);
      setFetchedSingleFile(null);
      setFetchedMultiFiles(null);
      setFetchedAllFiles(null);
    } catch (error) {
      console.error('Error fetching dog picture:', error);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <h1>File Upload and Fetch App</h1>

      {/* Section for uploading single file */}
      <div>
        <h2>Upload Single File</h2>
        <input type="file" onChange={handleSingleFileChange} />
        <button onClick={uploadSingleFile}>Upload Single File</button>
      </div>

      {/* Section for uploading multiple files */}
      <div>
        <h2>Upload Multiple Files</h2>
        <input type="file" multiple onChange={handleMultipleFilesChange} />
        <button onClick={uploadMultipleFiles}>Upload Multiple Files</button>
      </div>

      {/* Section for fetching and displaying a single file */}
      <div>
        <button onClick={fetchSingleFile}>Fetch Single File</button>
        <button onClick={fetchMultipleFiles}>Fetch Multiple Files</button>
        <button onClick={fetchAllFiles}>Fetch All Files</button>
        <button onClick={fetchDogPicture}>Fetch Dog Picture</button>
        {fetchedSingleFile && (
          <div>
            <h3>Single File</h3>
            <img src={fetchedSingleFile} alt="Fetched Single" style={{ width: '200px', marginTop: '10px' }} />
          </div>
        )}
        {fetchedMultiFiles && (
          <div>
            <h3>Multiple Files</h3>
            {
              fetchedMultiFiles.map((image) => (
                <img src={image} alt="Fetched Multi" style={{ width: '200px', marginTop: '10px' }} />
              ))
            }
          </div>
        )}
        {fetchedAllFiles && (
          <div>
            <h3>All Files</h3>
            {
              fetchedAllFiles.map((image) => (
                <img src={image} alt="Fetched All" style={{ width: '200px', marginTop: '10px' }} />
              ))
            }
          </div>
        )}
        {dogUrl && (
          <div>
            <h3>Dog Picture</h3>
            <img src={dogUrl} alt="Dog Picture" style={{ width: '200px', marginTop: '10px' }} />
            <button onClick={uploadDogPic}>Upload Dog Pic</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
