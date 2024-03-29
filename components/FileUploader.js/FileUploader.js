
export default function FileUploader({ files }) {
    const handleFiles = e => {

        if (!isMultiple) { files = [] };

        let currentUploadedFiles = e.target.files;
        for (let file of currentUploadedFiles) {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                let model = {
                    fileName: file.name,
                    fileBase64: fileReader.result
                }
                Promise.resolve(model).then(() => {
                    files.push(model);
                    setFiles([...files]);
                });
            }
        }
    }

    return (
        <>
            <input type="file" onChange={handleFiles} />
        </>
    )
}

