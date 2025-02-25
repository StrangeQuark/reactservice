import "./UploadForm.css"

const UploadForm = () => {
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:6010/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.text();
            alert(result);
        } catch (error) {
            console.error("Upload failed", error);
        }
    };

    return(
        <div id="uploadForm" className="uploadForm">
            <input type="file" onChange={handleFileUpload} className="fileInput" />
        </div>
    );
};

export default UploadForm;
