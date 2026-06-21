import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Quill modules configuration
const modules = {
	toolbar: [
		[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
		[{ 'font': [] }],
		[{ 'size': ['small', false, 'large', 'huge'] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ 'color': [] }, { 'background': [] }],
		[{ 'script': 'sub' }, { 'script': 'super' }],
		[{ 'list': 'ordered' }, { 'list': 'bullet' }],
		[{ 'indent': '-1' }, { 'indent': '+1' }],
		[{ 'align': [] }],
		['blockquote', 'code-block'],
		['link', 'image', 'video'],
		['clean']
	],
};

const formats = [
	'header', 'font', 'size',
	'bold', 'italic', 'underline', 'strike',
	'color', 'background',
	'script', 'list', 'bullet', 'indent',
	'align', 'blockquote', 'code-block',
	'link', 'image', 'video'
];

// Add custom styles for Quill editor
const quillStyles = `
  .quill-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }
  .quill-wrapper .ql-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
  .quill-wrapper .ql-editor {
    min-height: 100%;
    overflow-y: auto;
  }
`;

const AddService = ({
    showForm,
    setShowForm,
    setReloadTrigger,
    editingService,
    setEditingService,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [iconPreview, setIconPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formError, setFormError] = useState(null);

    const initialFormState = {
        title: "",
        short_description: "",
        description: "",
        icon: null,
        is_active: true,
        sort_order: 0,
        detail: "",
        image: null,
    };

    const [serviceForm, setServiceForm] = useState(initialFormState);

    useEffect(() => {
        if (editingService) {
            setServiceForm({
                ...editingService,
                icon: null,
                image: null,
                sort_order: editingService.sort_order ?? 0,
                is_active:
                    editingService.is_active === undefined
                        ? true
                        : !!editingService.is_active,
            });
            setIconPreview(editingService.icon ? `/storage/${editingService.icon}` : null);
            setImagePreview(editingService.image ? `/storage/${editingService.image}` : null);
        } else {
            setServiceForm(initialFormState);
            setIconPreview(null);
            setImagePreview(null);
        }
        setFormError(null);
    }, [editingService]);

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourservices.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Error creating service", error);
            throw error;
        }
    };

    const buildFormData = () => {
        const formData = new FormData();

        // Normalize required fields so they're ALWAYS sent,
        // since the DB columns have no default and aren't nullable.
        const payload = {
            ...serviceForm,
            sort_order:
                serviceForm.sort_order === "" || serviceForm.sort_order === null
                    ? 0
                    : serviceForm.sort_order,
            is_active: serviceForm.is_active ? 1 : 0,
        };

        for (const key in payload) {
            const value = payload[key];
            if (value !== null && value !== "") {
                formData.append(key, value);
            }
        }

        return formData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        const formData = buildFormData();

        try {
            setSubmitting(true);

            if (editingService) {
                await handleUpdate(formData, editingService.id);
            } else {
                await handleCreate(formData);
            }

            setServiceForm(initialFormState);
            setIconPreview(null);
            setImagePreview(null);
            setShowForm(false);
            setEditingService(null);
        } catch (error) {
            console.error("Error saving data", error);

            if (error.response?.status === 422) {
                const errors = error.response.data.errors || {};
                const firstError = Object.values(errors)[0]?.[0];
                setFormError(firstError || "Please check the form and try again.");
            } else if (error.response?.status === 419) {
                setFormError("Session expired. Please refresh the page and try again.");
            } else {
                setFormError(
                    error.response?.data?.message ||
                        "Something went wrong while saving. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;

        if (type === "file") {
            const file = files[0];
            setServiceForm((prev) => ({ ...prev, [name]: file || null }));
            if (name === "icon") {
                setIconPreview(file ? URL.createObjectURL(file) : null);
            }
            if (name === "image") {
                setImagePreview(file ? URL.createObjectURL(file) : null);
            }
        } else if (type === "checkbox") {
            setServiceForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setServiceForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle Quill editor changes
    const handleQuillChange = (value, name) => {
        setServiceForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingService(null);
        setServiceForm(initialFormState);
        setIconPreview(null);
        setImagePreview(null);
        setFormError(null);
    };

    if (!showForm) return null;

    return (
        <>
            {/* Inject custom styles */}
            <style>{quillStyles}</style>
            
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingService ? "Edit Service" : "Add New Service"}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            type="button"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {formError && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={serviceForm.title}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <div 
                                className="quill-wrapper" 
                                style={{ 
                                    height: '200px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={serviceForm.short_description}
                                    onChange={(value) => handleQuillChange(value, 'short_description')}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Write a short description..."
                                    className="bg-white rounded-lg flex-1"
                                    style={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <div 
                                className="quill-wrapper" 
                                style={{ 
                                    height: '300px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={serviceForm.description}
                                    onChange={(value) => handleQuillChange(value, 'description')}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Write a detailed description..."
                                    className="bg-white rounded-lg flex-1"
                                    style={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Detail
                            </label>
                            <div 
                                className="quill-wrapper" 
                                style={{ 
                                    height: '300px',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={serviceForm.detail}
                                    onChange={(value) => handleQuillChange(value, 'detail')}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Write additional details..."
                                    className="bg-white rounded-lg flex-1"
                                    style={{ 
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Icon Image
                            </label>
                            <input
                                type="file"
                                name="icon"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            {iconPreview && (
                                <img
                                    src={iconPreview}
                                    alt="icon preview"
                                    className="mt-2 h-16 w-16 object-cover rounded-lg border"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                name="sort_order"
                                value={serviceForm.sort_order}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="preview"
                                    className="mt-2 h-24 w-24 object-cover rounded-lg border"
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={!!serviceForm.is_active}
                                onChange={handleChange}
                                id="is_active"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                Active
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : editingService ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddService;