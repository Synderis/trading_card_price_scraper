import { useDropzone } from 'react-dropzone';
import React from 'react';
import '../CSS Sheets/DropZone.css';

interface DropZoneProps {
    onDrop: (acceptedFiles: File[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
        // Handle the dropped files here
        // You can call your existing handleImageUpload function here
            onDrop(acceptedFiles);
        },
    });

    return (
        <div {...getRootProps()} className="drop-zone">
        <input {...getInputProps()} />
        {
            isDragActive ? <p>Drop the images here ...</p> : <p>Drag and Drop</p>
        }
        </div>
    );
};

export default DropZone;