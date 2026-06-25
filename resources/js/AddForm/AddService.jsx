import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, UploadCloud, ImageOff } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
];

const emptyForm = {
    title: '',
    short_description: '',
    description: '',
    detail: '',
    icon: null,
    image: null,
    sort_order: 0,
    is_active: statusOptions[0],
};

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'],
    ],
};

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block',
    'link', 'image', 'video',
];

const customStyles = `
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

const selectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: '42px',
        borderRadius: '0.5rem',
        borderColor: state.isFocused ? '#6366f1' : '#d1d5db',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(99,102,241,0.4)' : 'none',
        '&:hover': { borderColor: '#6366f1' },
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? '#4f46e5'
            : state.isFocused
            ? '#eef2ff'
            : 'white',
        color: state.isSelected ? 'white' : '#374151',
    }),
    menu: (base) => ({ ...base, zIndex: 50 }),
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;

const ImageField = ({
    label,
    hint,
    file,
    onSelect,
    onRemove,
    error,
    previewClassName = 'w-28 h-28',
}) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localPreview, setLocalPreview] = useState(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setLocalPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setLocalPreview(null);
    }, [file]);

    const displayUrl = localPreview;

    const handleFiles = (selectedFile) => {
        if (!selectedFile) return;
        onSelect(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files?.[0]);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

            {displayUrl ? (
                <div className="relative border border-gray-300 rounded-lg p-4 flex items-center gap-4">
                    <img
                        src={displayUrl}
                        alt={`${label} preview`}
                        className={`${previewClassName} object-cover rounded-lg border border-gray-200 flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">
                            {file ? file.name : 'Current image'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {file
                                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                                : 'Upload a new image'}
                        </p>
                        <div className="flex gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                            >
                                {file ? 'Choose different image' : 'Choose image'}
                            </button>
                            {file && (
                                <button
                                    type="button"
                                    onClick={onRemove}
                                    className="text-sm font-medium text-gray-500 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-8 cursor-pointer transition-colors ${
                        isDragging
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                    }`}
                >
                    <UploadCloud size={32} className={isDragging ? 'text-indigo-500' : 'text-gray-400'} />
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">{hint}</p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleFiles(e.target.files?.[0])}
                className="hidden"
            />

            {error && (
                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                    <ImageOff size={14} /> {error}
                </p>
            )}
        </div>
    );
};

const AddService = ({
    showForm,
    setShowForm,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [iconError, setIconError] = useState('');
    const [imageError, setImageError] = useState('');

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: emptyForm });

    const iconFile = watch('icon');
    const imageFile = watch('image');

    useEffect(() => {
        reset(emptyForm);
        setIconError('');
        setImageError('');
        setFormError(null);
    }, [reset]);

    const validateFile = (file, setError) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError('Please upload a JPG, PNG, or WEBP image.');
            return false;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
            return false;
        }
        setError('');
        return true;
    };

    const handleIconSelect = (file) => {
        if (validateFile(file, setIconError)) setValue('icon', file, { shouldDirty: true });
    };
    const handleImageSelect = (file) => {
        if (validateFile(file, setImageError)) setValue('image', file, { shouldDirty: true });
    };

    const handleCreate = async (formData) => {
        try {
            await axios.post(route('ourservices.store'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error('Error creating service', error);
            throw error;
        }
    };

    const onSubmit = async (data) => {
        setFormError(null);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('short_description', data.short_description || '');
        formData.append('description', data.description || '');
        formData.append('detail', data.detail || '');
        formData.append('sort_order', data.sort_order === '' || data.sort_order === null ? 0 : data.sort_order);
        formData.append('is_active', data.is_active?.value || 'draft');
        if (data.icon) formData.append('icon', data.icon);
        if (data.image) formData.append('image', data.image);

        try {
            setSubmitting(true);
            await handleCreate(formData);
            reset(emptyForm);
            setShowForm(false);
        } catch (error) {
            console.error('Error saving data', error);

            if (error.response?.status === 422) {
                const errs = error.response.data.errors || {};
                const firstError = Object.values(errs)[0]?.[0];
                setFormError(firstError || 'Please check the form and try again.');
            } else if (error.response?.status === 419) {
                setFormError('Session expired. Please refresh the page and try again.');
            } else {
                setFormError(
                    error.response?.data?.message || 'Something went wrong while saving. Please try again.'
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setShowForm(false);
        reset(emptyForm);
        setIconError('');
        setImageError('');
        setFormError(null);
    };

    if (!showForm) return null;

    return (
        <>
            <style>{customStyles}</style>

            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Add New Service
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                {...register('title', { required: 'Title is required' })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Short Description */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Short Description
                            </label>
                            <div className="quill-wrapper" style={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
                                <Controller
                                    name="short_description"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Write a short description..."
                                            className="bg-white rounded-lg flex-1"
                                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                        />
                                    )}
                                />
                            </div>
                        </div> */}

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <div className="quill-wrapper" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Write a detailed description..."
                                            className="bg-white rounded-lg flex-1"
                                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Detail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Detail
                            </label>
                            <div className="quill-wrapper" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
                                <Controller
                                    name="detail"
                                    control={control}
                                    render={({ field }) => (
                                        <ReactQuill
                                            theme="snow"
                                            value={field.value}
                                            onChange={field.onChange}
                                            modules={modules}
                                            formats={formats}
                                            placeholder="Write additional details..."
                                            className="bg-white rounded-lg flex-1"
                                            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        {/* Icon image */}
                        <ImageField
                            label="Icon Image"
                            hint={`JPG, PNG, or WEBP, up to ${MAX_FILE_SIZE_MB}MB`}
                            file={iconFile}
                            onSelect={handleIconSelect}
                            onRemove={() => {
                                setValue('icon', null);
                                setIconError('');
                            }}
                            error={iconError}
                            previewClassName="w-20 h-20"
                        />

                        {/* Sort Order */}
                        <div className="w-full md:w-40">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                {...register('sort_order')}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Main image */}
                        <ImageField
                            label="Image"
                            hint={`JPG, PNG, or WEBP, up to ${MAX_FILE_SIZE_MB}MB`}
                            file={imageFile}
                            onSelect={handleImageSelect}
                            onRemove={() => {
                                setValue('image', null);
                                setImageError('');
                            }}
                            error={imageError}
                            previewClassName="w-28 h-28"
                        />

                        {/* Status */}
                        <div className="w-full md:w-56">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <Controller
                                name="is_active"
                                control={control}
                                rules={{ required: 'Please select a status' }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={statusOptions}
                                        placeholder="Select status"
                                        styles={selectStyles}
                                        isClearable
                                    />
                                )}
                            />
                            {errors.is_active && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.is_active.message}
                                </p>
                            )}
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
                                {submitting ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddService;