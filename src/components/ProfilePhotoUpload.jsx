import React, { useState, useRef } from 'react';
import { User, Image as ImageIcon } from 'lucide-react';
import ImageCropperModal from './ImageCropper';

export const ProfilePhotoUpload = ({ 
    label, 
    name, 
    onChange, 
    preview, 
    height = "h-32 w-32",
    shape = "round" // round or square
}) => {
    const [imageToCrop, setImageToCrop] = useState(null);
    const fileInputRef = useRef(null);

    const onFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageToCrop(reader.result?.toString() || '');
            });
            reader.readAsDataURL(file);
        }
        // Reset the input value so the same file can be selected again if cancelled
        e.target.value = null;
    };

    const handleCropComplete = (croppedFile) => {
        setImageToCrop(null); // Close modal
        
        // Pass the cropped file back to the parent component
        const fakeEvent = {
            target: {
                name: name,
                type: 'file',
                files: [croppedFile]
            }
        };
        onChange(fakeEvent);
    };

    const isRound = shape === "round";

    return (
        <div className="flex flex-col items-start gap-2">
            {label && <p className="font-bold text-gray-700 text-xs uppercase">{label}</p>}
            
            <div 
                className={`${height} ${isRound ? 'rounded-full' : 'rounded-lg'} bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group hover:border-[#EB8A33] hover:bg-orange-50/30 transition-colors cursor-pointer`}
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <img
                        src={preview}
                        className="w-full h-full object-cover"
                        alt="preview"
                    />
                ) : (
                    <div className="text-center p-2 flex flex-col items-center">
                        <User className="text-gray-300 mb-1 group-hover:text-[#EB8A33] transition-colors" size={30} />
                        <span className="text-[10px] text-gray-400 font-medium group-hover:text-[#EB8A33] text-center">Upload<br/>Photo</span>
                    </div>
                )}

                {/* Overlay on hover */}
                {preview && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="text-white" size={24} />
                    </div>
                )}
                
                <input 
                    type="file" 
                    name={name} 
                    onChange={onFileSelect} 
                    className="hidden" 
                    accept="image/*" 
                    ref={fileInputRef}
                />
            </div>

            {/* Cropper Modal */}
            {imageToCrop && (
                <ImageCropperModal
                    imageSrc={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setImageToCrop(null)}
                />
            )}
        </div>
    );
};
