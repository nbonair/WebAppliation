import React, { useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import Papa from 'papaparse';

const CSVUpload = () => {
    const [dearFile, setDearFile] = useState();
    const [shopifyFile, setShopifyFile] = useState();

    const handleFileChange = (setter, type) => async (event) => {
        const file = event.target.files[0]
        setter(file);
        if (file) {
            await uploadFile(file, type);
        }
    };

    const uploadFile = async (file, type) => {
        const formData = new FormData();
        formData.append(`${type}File`, file);

        try {
            await axios.post(`http://localhost:5000/upload/${type}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // toast(<CustomToastMsg type={'success'} message={'Uploaded successfully'}/>)
            toast.success('Uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error(`Error uploading file: ${error}`);
        }
    };

    const handleCompare = async () => {
        try {
            const response = await axios.post('http://localhost:5000/upload/compare');
            const common= response.data['commonProduct'];
            const uniqueDear = response.data['uniqueDear'];
            const uniqueShopify = response.data['uniqueShopify'];
            
            const csv = Papa.unparse(common);
            const blob = new Blob([csv], { type: 'text/csv;' });

            // Create a link to download it
            const fileLink = document.createElement('a');
            fileLink.href = URL.createObjectURL(blob);
            fileLink.setAttribute('download', 'comparison-results.csv');
            fileLink.click();

            toast.success('Comparison succesful');
            console.log(response.data);
        } catch (error) {
            console.error('Error during comparison:', error);
            toast.error(`Error during comparison: ${error}`);
        }
    }

    return (
        <div className="absolute top-0 left-0 m-4 p-4 bg-white shadow-lg rounded">
            <div className="mb-2">
                <input
                    id="dearFileInput" className="hidden" name='dearFile' type="file" onChange={handleFileChange(setDearFile, 'dear')} accept=".csv" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => document.getElementById('dearFileInput').click()}>
                    Upload Dear Inventory File
                </button>
                {dearFile && <p className="text-sm mt-1">{dearFile.name}</p>}
            </div>
            <div className="mb-2">
                <input id="shopifyFileInput" className="hidden" name='shopifyFile' type="file" onChange={handleFileChange(setShopifyFile, 'shopify')} accept=".csv" />
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => document.getElementById('shopifyFileInput').click()}>
                    Upload Shopify File
                </button>
                {shopifyFile && <p className="text-sm mt-1">{shopifyFile.name}</p>}
            </div>
            {dearFile && shopifyFile && (
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                    onClick={handleCompare}>
                    Compare Files
                </button>
            )}
        </div>
    );
};

export default CSVUpload;
