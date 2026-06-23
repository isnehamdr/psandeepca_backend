import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, UploadCloud, ImageOff } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const getExistingImageUrl = (path) => {
	if (!path) return null;
	if (/^https?:\/\//i.test(path)) return path;
	return `/storage/${path}`;
};

const emptyForm = {
	title: '',
	short_description: '',
	image: null,
	is_active: 'true',
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

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;

const EditHero = ({
	showForm,
	setShowForm,
	setReloadTrigger,
	editingHero,
	setEditingHero,
	handleUpdate,
}) => {
	const [submitting, setSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);
	const [imageError, setImageError] = useState('');
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);

	const {
		register,
		control,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: emptyForm,
	});

	const imageFile = watch('image');
	const existingImageUrl = getExistingImageUrl(editingHero?.image);

	// Populate form when editing
	useEffect(() => {
		if (editingHero && showForm) {
			reset({
				title: editingHero.title || '',
				short_description: editingHero.short_description || '',
				image: null,
				is_active: (editingHero.is_active === 1 || editingHero.is_active === true) ? 'true' : 'false',
			});
			setImagePreview(null);
			setImageError('');
		}
	}, [editingHero, showForm, reset]);

	// Build/revoke object URL for the newly selected image
	useEffect(() => {
		if (imageFile) {
			const url = URL.createObjectURL(imageFile);
			setImagePreview(url);
			return () => URL.revokeObjectURL(url);
		}
		setImagePreview(null);
	}, [imageFile]);

	const validateAndSetFile = (file) => {
		if (!file) return;
		if (!ACCEPTED_TYPES.includes(file.type)) {
			setImageError('Please upload a JPG, PNG, or WEBP image.');
			return;
		}
		if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
			setImageError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
			return;
		}
		setImageError('');
		setValue('image', file, { shouldDirty: true });
	};

	const handleFileInputChange = (e) => {
		const file = e.target.files?.[0];
		validateAndSetFile(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files?.[0];
		validateAndSetFile(file);
	};

	const handleRemoveNewImage = () => {
		setValue('image', null);
		setImageError('');
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const onSubmit = async (data) => {
		const formData = new FormData();
		formData.append('title', data.title);
		formData.append('short_description', data.short_description || '');
		formData.append('is_active', data.is_active === 'true' ? '1' : '0');
		if (data.image) formData.append('image', data.image);

		try {
			setSubmitting(true);
			await handleUpdate(formData, editingHero.id);
			reset(emptyForm);
			setShowForm(false);
			setEditingHero(null);
		} catch (error) {
			console.log('Error updating data', error?.response?.data || error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleClose = () => {
		setShowForm(false);
		setEditingHero(null);
		reset(emptyForm);
		setImagePreview(null);
		setImageError('');
	};

	if (!showForm || !editingHero) return null;

	// Decide what to render in the image preview slot:
	// 1. A freshly chosen file always takes priority.
	// 2. Otherwise, if editing and an existing image exists, show that.
	const displayImageUrl = imagePreview || existingImageUrl;

	return (
		<>
			<style>{customStyles}</style>

			<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
				<div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-gray-800">
							Edit Hero
						</h2>
						<button
							onClick={handleClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<X size={24} />
						</button>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Title - Full Rich Text Editor */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Title <span className="text-red-500">*</span>
							</label>
							<div className="quill-wrapper" style={{ height: '150px', display: 'flex', flexDirection: 'column' }}>
								<Controller
									name="title"
									control={control}
									rules={{ required: 'Title is required' }}
									render={({ field }) => (
										<ReactQuill
											theme="snow"
											value={field.value}
											onChange={field.onChange}
											modules={modules}
											formats={formats}
											placeholder="Enter hero title..."
											className="bg-white rounded-lg flex-1"
											style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
										/>
									)}
								/>
							</div>
							{errors.title && (
								<p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
							)}
						</div>

						{/* Short Description - Full Rich Text Editor */}
						<div>
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
											placeholder="Write a brief description..."
											className="bg-white rounded-lg flex-1"
											style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
										/>
									)}
								/>
							</div>
						</div>

						{/* Image upload */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Hero Image
							</label>

							{displayImageUrl ? (
								// Preview state: shows either the new selection or the existing image
								<div className="relative border border-gray-300 rounded-lg p-4 flex items-center gap-4">
									<img
										src={displayImageUrl}
										alt="Hero preview"
										className="w-28 h-28 object-cover rounded-lg border border-gray-200 flex-shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-700 truncate">
											{imageFile ? imageFile.name : 'Current image'}
										</p>
										<p className="text-xs text-gray-500 mt-0.5">
											{imageFile
												? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
												: 'Uploading a new image will replace this one.'}
										</p>
										<div className="flex gap-3 mt-2">
											<button
												type="button"
												onClick={() => fileInputRef.current?.click()}
												className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
											>
												{imageFile ? 'Choose different image' : 'Replace image'}
											</button>
											{imageFile && (
												<button
													type="button"
													onClick={handleRemoveNewImage}
													className="text-sm font-medium text-gray-500 hover:text-red-600"
												>
													Remove
												</button>
											)}
										</div>
									</div>
								</div>
							) : (
								// Empty state: dropzone
								<div
									onClick={() => fileInputRef.current?.click()}
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
									<UploadCloud
										size={32}
										className={isDragging ? 'text-indigo-500' : 'text-gray-400'}
									/>
									<p className="text-sm text-gray-600">
										<span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
									</p>
									<p className="text-xs text-gray-400">JPG, PNG, or WEBP, up to {MAX_FILE_SIZE_MB}MB</p>
								</div>
							)}

							<input
								ref={fileInputRef}
								type="file"
								accept="image/jpeg,image/jpg,image/png,image/webp"
								onChange={handleFileInputChange}
								className="hidden"
							/>

							{imageError && (
								<p className="text-sm text-red-500 mt-2 flex items-center gap-1">
									<ImageOff size={14} /> {imageError}
								</p>
							)}
						</div>

						{/* Is Active */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Status
							</label>
							<div className="flex items-center gap-3">
								<label className="inline-flex items-center">
									<input
										type="radio"
										{...register('is_active')}
										value="true"
										className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
									/>
									<span className="ml-2 text-sm text-gray-700">Active</span>
								</label>
								<label className="inline-flex items-center">
									<input
										type="radio"
										{...register('is_active')}
										value="false"
										className="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
									/>
									<span className="ml-2 text-sm text-gray-700">Inactive</span>
								</label>
							</div>
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
								{submitting ? 'Updating...' : 'Update'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default EditHero;