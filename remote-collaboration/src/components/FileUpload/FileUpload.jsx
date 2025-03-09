import React, { useState } from 'react';
import './FileUpload.css';
import docImg from "./document.png";

function FileUpload() {

    const [files, setFiles] = useState([]);

    const fileUpload = (e) => {
        if (e.target.files[0]) {
            setFiles([...files, e.target.files[0]]);
        }

    }

    const fileRemove = (file) => {
        if (files.length == 1) {
            setFiles([]);
        }
        else {
            const updatedFiles = [...files];
            setFiles(updatedFiles.splice(files.indexOf(file), 1));
        }
    }

    return(
        <>
            <div className='fileupload-container'>
                <div className='upload-button'>
                    <label>
                        <input type="file" value="" onChange={fileUpload}/>
                        Upload File
                    </label>
                </div>
                {files.length > 0 ? (
                    <div className='file-container'>
                        {files.map((file) => (
                            <div className='file-info-container'>
                                <img src={docImg} alt="" />
                                <div className='file-info'>
                                    <h4 className='file-name'>{file.name}</h4>
                                    <p className='file-size'>{file.size} B</p>
                                </div>
                                <span className='file-delete' onClick={() => fileRemove(file)}>
                                X
                                </span>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default FileUpload;