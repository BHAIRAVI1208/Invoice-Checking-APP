import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Upload = () => {
  const [formData, setFormData] = useState({
    invoiceNo: '',
    date: '',
    supplier: '',
    category: '',
    amount: '',
    vat: '',
    file: null,
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [viewLink, setViewLink] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch('/api/invoices/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setUploadSuccess(true);
      setViewLink(result.viewLink);
    } catch (error) {
      alert('Failed to upload invoice');
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Upload Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} placeholder="Invoice No" className="w-full p-2 border rounded" required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input name="supplier" value={formData.supplier} onChange={handleChange} placeholder="Supplier Name" className="w-full p-2 border rounded" required />
          <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select Category</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Travel">Travel</option>
            <option value="Utilities">Utilities</option>
          </select>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="w-full p-2 border rounded" required />
          <input type="number" name="vat" value={formData.vat} onChange={handleChange} placeholder="VAT" className="w-full p-2 border rounded" required />
          <input type="file" name="file" onChange={handleChange} accept="application/pdf,image/*" className="w-full p-2 border rounded" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Upload Invoice
          </button>
        </form>

        {uploadSuccess && (
          <div className="mt-6 text-green-700">
            <p>✅ Invoice uploaded successfully!</p>
            <a href={viewLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              View Invoice
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
