// import React, { useState, useRef, useEffect } from 'react';
// import { X, UploadCloud, ImageOff, Link as LinkIcon } from 'lucide-react';
// import { useForm, Controller } from 'react-hook-form';

// const getExistingImageUrl = (path) => {
// 	if (!path) return null;
// 	if (/^https?:\/\//i.test(path)) return path;
// 	const base = (import.meta.env.VITE_IMAGE_PATH || '/storage').replace(/\/+$/, '');
// 	const clean = String(path).replace(/^\/+/, '');
// 	return `${base}/${clean}`;
// };

// const emptyForm = {
// 	name: '',
// 	title: '',
// 	social_link: '',
// 	person_image: null,
// 	is_active: true,
// };

// const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
// const MAX_FILE_SIZE_MB = 5;

// const ImageDropzone = ({
// 	label,
// 	displayUrl,
// 	file,
// 	error,
// 	isDragging,
// 	setIsDragging,
// 	inputRef,
// 	onFileChange,
// 	onDrop,
// 	onRemove,
// }) => (
// 	<div>
// 		<label className="block text-sm font-medium text-gray-700 mb-1">
// 			{label}
// 		</label>

// 		{displayUrl ? (
// 			<div className="relative border border-gray-300 rounded-lg p-4 flex items-center gap-4">
// 				<img
// 					src={displayUrl}
// 					alt={label}
// 					className="w-28 h-28 object-cover rounded-lg border border-gray-200 flex-shrink-0"
// 				/>
// 				<div className="flex-1 min-w-0">
// 					<p className="text-sm font-medium text-gray-700 truncate">
// 						{file ? file.name : 'Current image'}
// 					</p>
// 					<p className="text-xs text-gray-500 mt-0.5">
// 						{file
// 							? `${(file.size / 1024 / 1024).toFixed(2)} MB`
// 							: 'Uploading a new image will replace this one.'}
// 					</p>
// 					<div className="flex gap-3 mt-2">
// 						<button
// 							type="button"
// 							onClick={() => inputRef.current?.click()}
// 							className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
// 						>
// 							{file ? 'Choose different image' : 'Replace image'}
// 						</button>
// 						{file && (
// 							<button
// 								type="button"
// 								onClick={onRemove}
// 								className="text-sm font-medium text-gray-500 hover:text-red-600"
// 							>
// 								Remove
// 							</button>
// 						)}
// 					</div>
// 				</div>
// 			</div>
// 		) : (
// 			<div
// 				onClick={() => inputRef.current?.click()}
// 				onDragOver={(e) => {
// 					e.preventDefault();
// 					setIsDragging(true);
// 				}}
// 				onDragLeave={() => setIsDragging(false)}
// 				onDrop={onDrop}
// 				className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-8 cursor-pointer transition-colors ${
// 					isDragging
// 						? 'border-indigo-500 bg-indigo-50'
// 						: 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
// 				}`}
// 			>
// 				<UploadCloud
// 					size={32}
// 					className={isDragging ? 'text-indigo-500' : 'text-gray-400'}
// 				/>
// 				<p className="text-sm text-gray-600">
// 					<span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
// 				</p>
// 				<p className="text-xs text-gray-400">JPG, PNG, or WEBP, up to {MAX_FILE_SIZE_MB}MB</p>
// 			</div>
// 		)}

// 		<input
// 			ref={inputRef}
// 			type="file"
// 			accept="image/jpeg,image/jpg,image/png,image/webp"
// 			onChange={onFileChange}
// 			className="hidden"
// 		/>

// 		{error && (
// 			<p className="text-sm text-red-500 mt-2 flex items-center gap-1">
// 				<ImageOff size={14} /> {error}
// 			</p>
// 		)}
// 	</div>
// );

// const EditTeam = ({
// 	showForm,
// 	setShowForm,
// 	setReloadTrigger,
// 	editingTeam,
// 	setEditingTeam,
// 	handleUpdate,
// }) => {
// 	const [submitting, setSubmitting] = useState(false);

// 	const [personPreview, setPersonPreview] = useState(null);
// 	const [personError, setPersonError] = useState('');
// 	const [isPersonDragging, setIsPersonDragging] = useState(false);
// 	const personInputRef = useRef(null);

// 	const {
// 		register,
// 		control,
// 		handleSubmit,
// 		reset,
// 		setValue,
// 		watch,
// 		formState: { errors },
// 	} = useForm({
// 		defaultValues: emptyForm,
// 	});

// 	const personFile = watch('person_image');
// 	const existingPersonUrl = getExistingImageUrl(editingTeam?.person_image);

// 	// Populate form when editing
// 	useEffect(() => {
// 		if (editingTeam && showForm) {
// 			reset({
// 				name: editingTeam.name || '',
// 				title: editingTeam.title || '',
// 				social_link: editingTeam.social_link || '',
// 				person_image: null,
// 				is_active: !!editingTeam.is_active,
// 			});
// 			setPersonPreview(null);
// 			setPersonError('');
// 		}
// 	}, [editingTeam, showForm, reset]);

// 	useEffect(() => {
// 		if (personFile) {
// 			const url = URL.createObjectURL(personFile);
// 			setPersonPreview(url);
// 			return () => URL.revokeObjectURL(url);
// 		}
// 		setPersonPreview(null);
// 	}, [personFile]);

// 	const validateFile = (file, setError) => {
// 		if (!ACCEPTED_TYPES.includes(file.type)) {
// 			setError('Please upload a JPG, PNG, or WEBP image.');
// 			return false;
// 		}
// 		if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
// 			setError(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
// 			return false;
// 		}
// 		setError('');
// 		return true;
// 	};

// 	const handlePersonChange = (e) => {
// 		const file = e.target.files?.[0];
// 		if (!file) return;
// 		if (validateFile(file, setPersonError)) {
// 			setValue('person_image', file, { shouldDirty: true });
// 		}
// 	};

// 	const handlePersonDrop = (e) => {
// 		e.preventDefault();
// 		setIsPersonDragging(false);
// 		const file = e.dataTransfer.files?.[0];
// 		if (!file) return;
// 		if (validateFile(file, setPersonError)) {
// 			setValue('person_image', file, { shouldDirty: true });
// 		}
// 	};

// 	const handleRemovePerson = () => {
// 		setValue('person_image', null);
// 		setPersonError('');
// 		if (personInputRef.current) personInputRef.current.value = '';
// 	};

// 	const onSubmit = async (data) => {
// 		const formData = new FormData();
// 		formData.append('name', data.name);
// 		formData.append('title', data.title);
// 		formData.append('social_link', data.social_link || '');
// 		formData.append('is_active', data.is_active ? 1 : 0);
// 		if (data.person_image) formData.append('person_image', data.person_image);

// 		try {
// 			setSubmitting(true);
// 			await handleUpdate(formData, editingTeam.id);
// 			reset(emptyForm);
// 			setShowForm(false);
// 			setEditingTeam(null);
// 		} catch (error) {
// 			console.log('Error updating team member', error);
// 		} finally {
// 			setSubmitting(false);
// 		}
// 	};

// 	const handleClose = () => {
// 		setShowForm(false);
// 		setEditingTeam(null);
// 		reset(emptyForm);
// 		setPersonPreview(null);
// 		setPersonError('');
// 	};

// 	if (!showForm || !editingTeam) return null;

// 	const displayPersonUrl = personPreview || existingPersonUrl;

// 	return (
// 		<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
// 			<div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
// 				<div className="flex justify-between items-center mb-6">
// 					<h2 className="text-2xl font-bold text-gray-800">
// 						Edit Team Member
// 					</h2>
// 					<button
// 						onClick={handleClose}
// 						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// 					>
// 						<X size={24} />
// 					</button>
// 				</div>

// 				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
// 					{/* Name */}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Name
// 						</label>
// 						<input
// 							type="text"
// 							{...register('name', { required: 'Name is required' })}
// 							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// 						/>
// 						{errors.name && (
// 							<p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
// 						)}
// 					</div>

// 					{/* Title */}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Title / Designation
// 						</label>
// 						<input
// 							type="text"
// 							placeholder="e.g. CEO, Lead Designer"
// 							{...register('title', { required: 'Title is required' })}
// 							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// 						/>
// 						{errors.title && (
// 							<p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
// 						)}
// 					</div>

// 					{/* Social Link */}
// 					<div>
// 						<label className="block text-sm font-medium text-gray-700 mb-1">
// 							Social Link
// 						</label>
// 						<div className="relative">
// 							<LinkIcon size={16} className="absolute left-3 top-3 text-gray-400" />
// 							<input
// 								type="url"
// 								placeholder="https://linkedin.com/in/username"
// 								{...register('social_link', {
// 									pattern: {
// 										value: /^(https?:\/\/)[^\s]+$/i,
// 										message: 'Enter a valid URL starting with http(s)://',
// 									},
// 								})}
// 								className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
// 							/>
// 						</div>
// 						{errors.social_link && (
// 							<p className="text-sm text-red-500 mt-1">{errors.social_link.message}</p>
// 						)}
// 					</div>

// 					{/* Person Image */}
// 					<ImageDropzone
// 						label="Person Image"
// 						displayUrl={displayPersonUrl}
// 						file={personFile}
// 						error={personError}
// 						isDragging={isPersonDragging}
// 						setIsDragging={setIsPersonDragging}
// 						inputRef={personInputRef}
// 						onFileChange={handlePersonChange}
// 						onDrop={handlePersonDrop}
// 						onRemove={handleRemovePerson}
// 					/>

// 					{/* Is Active */}
// 					<div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
// 						<div>
// 							<p className="text-sm font-medium text-gray-700">Active Status</p>
// 							<p className="text-xs text-gray-500">
// 								Inactive members won't be shown on the public site.
// 							</p>
// 						</div>
// 						<Controller
// 							name="is_active"
// 							control={control}
// 							render={({ field }) => (
// 								<button
// 									type="button"
// 									onClick={() => field.onChange(!field.value)}
// 									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
// 										field.value ? 'bg-indigo-600' : 'bg-gray-300'
// 									}`}
// 								>
// 									<span
// 										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
// 											field.value ? 'translate-x-6' : 'translate-x-1'
// 										}`}
// 									/>
// 								</button>
// 							)}
// 						/>
// 					</div>

// 					<div className="flex justify-end gap-3 pt-2">
// 						<button
// 							type="button"
// 							onClick={handleClose}
// 							className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
// 						>
// 							Cancel
// 						</button>
// 						<button
// 							type="submit"
// 							disabled={submitting}
// 							className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
// 						>
// 							{submitting ? 'Updating...' : 'Update'}
// 						</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };

// export default EditTeam;


import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, ImageOff } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { TiSocialFacebookCircular, TiSocialInstagramCircular, TiSocialLinkedinCircular } from 'react-icons/ti';

const getExistingImageUrl = (path) => {
	if (!path) return null;
	if (/^https?:\/\//i.test(path)) return path;
	const base = (import.meta.env.VITE_IMAGE_PATH || '/storage').replace(/\/+$/, '');
	const clean = String(path).replace(/^\/+/, '');
	return `${base}/${clean}`;
};

const emptyForm = {
	name: '',
	title: '',
	instagram_link: '',
	facebook_link: '',
	linkedin_link: '',
	person_image: null,
	is_active: true,
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 5;

const URL_PATTERN = {
	value: /^(https?:\/\/)[^\s]+$/i,
	message: 'Enter a valid URL starting with http(s)://',
};

const ImageDropzone = ({
	label,
	displayUrl,
	file,
	error,
	isDragging,
	setIsDragging,
	inputRef,
	onFileChange,
	onDrop,
	onRemove,
}) => (
	<div>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>

		{displayUrl ? (
			<div className="relative border border-gray-300 rounded-lg p-4 flex items-center gap-4">
				<img
					src={displayUrl}
					alt={label}
					className="w-28 h-28 object-cover rounded-lg border border-gray-200 flex-shrink-0"
				/>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-gray-700 truncate">
						{file ? file.name : 'Current image'}
					</p>
					<p className="text-xs text-gray-500 mt-0.5">
						{file
							? `${(file.size / 1024 / 1024).toFixed(2)} MB`
							: 'Uploading a new image will replace this one.'}
					</p>
					<div className="flex gap-3 mt-2">
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
						>
							{file ? 'Choose different image' : 'Replace image'}
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
				onDrop={onDrop}
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
			ref={inputRef}
			type="file"
			accept="image/jpeg,image/jpg,image/png,image/webp"
			onChange={onFileChange}
			className="hidden"
		/>

		{error && (
			<p className="text-sm text-red-500 mt-2 flex items-center gap-1">
				<ImageOff size={14} /> {error}
			</p>
		)}
	</div>
);

const EditTeam = ({
	showForm,
	setShowForm,
	setReloadTrigger,
	editingTeam,
	setEditingTeam,
	handleUpdate,
}) => {
	const [submitting, setSubmitting] = useState(false);

	const [personPreview, setPersonPreview] = useState(null);
	const [personError, setPersonError] = useState('');
	const [isPersonDragging, setIsPersonDragging] = useState(false);
	const personInputRef = useRef(null);

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

	const personFile = watch('person_image');
	const existingPersonUrl = getExistingImageUrl(editingTeam?.person_image);

	// Populate form when editing
	useEffect(() => {
		if (editingTeam && showForm) {
			reset({
				name: editingTeam.name || '',
				title: editingTeam.title || '',
				instagram_link: editingTeam.instagram_link || '',
				facebook_link: editingTeam.facebook_link || '',
				linkedin_link: editingTeam.linkedin_link || '',
				person_image: null,
				is_active: !!editingTeam.is_active,
			});
			setPersonPreview(null);
			setPersonError('');
		}
	}, [editingTeam, showForm, reset]);

	useEffect(() => {
		if (personFile) {
			const url = URL.createObjectURL(personFile);
			setPersonPreview(url);
			return () => URL.revokeObjectURL(url);
		}
		setPersonPreview(null);
	}, [personFile]);

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

	const handlePersonChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (validateFile(file, setPersonError)) {
			setValue('person_image', file, { shouldDirty: true });
		}
	};

	const handlePersonDrop = (e) => {
		e.preventDefault();
		setIsPersonDragging(false);
		const file = e.dataTransfer.files?.[0];
		if (!file) return;
		if (validateFile(file, setPersonError)) {
			setValue('person_image', file, { shouldDirty: true });
		}
	};

	const handleRemovePerson = () => {
		setValue('person_image', null);
		setPersonError('');
		if (personInputRef.current) personInputRef.current.value = '';
	};

	const onSubmit = async (data) => {
		const formData = new FormData();
		formData.append('name', data.name);
		formData.append('title', data.title);
		formData.append('instagram_link', data.instagram_link || '');
		formData.append('facebook_link', data.facebook_link || '');
		formData.append('linkedin_link', data.linkedin_link || '');
		formData.append('is_active', data.is_active ? 1 : 0);
		if (data.person_image) formData.append('person_image', data.person_image);

		try {
			setSubmitting(true);
			await handleUpdate(formData, editingTeam.id);
			reset(emptyForm);
			setShowForm(false);
			setEditingTeam(null);
		} catch (error) {
			console.log('Error updating team member', error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleClose = () => {
		setShowForm(false);
		setEditingTeam(null);
		reset(emptyForm);
		setPersonPreview(null);
		setPersonError('');
	};

	if (!showForm || !editingTeam) return null;

	const displayPersonUrl = personPreview || existingPersonUrl;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-gray-800">
						Edit Team Member
					</h2>
					<button
						onClick={handleClose}
						className="p-2 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Name
						</label>
						<input
							type="text"
							{...register('name', { required: 'Name is required' })}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						{errors.name && (
							<p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
						)}
					</div>

					{/* Title */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Title / Designation
						</label>
						<input
							type="text"
							placeholder="e.g. CEO, Lead Designer"
							{...register('title', { required: 'Title is required' })}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						/>
						{errors.title && (
							<p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
						)}
					</div>

					{/* Social Links */}
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Instagram Link
							</label>
							<div className="relative">
								<TiSocialInstagramCircular size={16} className="absolute left-3 top-3 text-gray-400" />
								<input
									type="url"
									placeholder="https://instagram.com/username"
									{...register('instagram_link', { pattern: URL_PATTERN })}
									className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								/>
							</div>
							{errors.instagram_link && (
								<p className="text-sm text-red-500 mt-1">{errors.instagram_link.message}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Facebook Link
							</label>
							<div className="relative">
								<TiSocialFacebookCircular size={16} className="absolute left-3 top-3 text-gray-400" />
								<input
									type="url"
									placeholder="https://facebook.com/username"
									{...register('facebook_link', { pattern: URL_PATTERN })}
									className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								/>
							</div>
							{errors.facebook_link && (
								<p className="text-sm text-red-500 mt-1">{errors.facebook_link.message}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								LinkedIn Link
							</label>
							<div className="relative">
								<TiSocialLinkedinCircular size={16} className="absolute left-3 top-3 text-gray-400" />
								<input
									type="url"
									placeholder="https://linkedin.com/in/username"
									{...register('linkedin_link', { pattern: URL_PATTERN })}
									className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								/>
							</div>
							{errors.linkedin_link && (
								<p className="text-sm text-red-500 mt-1">{errors.linkedin_link.message}</p>
							)}
						</div>
					</div>

					{/* Person Image */}
					<ImageDropzone
						label="Person Image"
						displayUrl={displayPersonUrl}
						file={personFile}
						error={personError}
						isDragging={isPersonDragging}
						setIsDragging={setIsPersonDragging}
						inputRef={personInputRef}
						onFileChange={handlePersonChange}
						onDrop={handlePersonDrop}
						onRemove={handleRemovePerson}
					/>

					{/* Is Active */}
					<div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
						<div>
							<p className="text-sm font-medium text-gray-700">Active Status</p>
							<p className="text-xs text-gray-500">
								Inactive members won't be shown on the public site.
							</p>
						</div>
						<Controller
							name="is_active"
							control={control}
							render={({ field }) => (
								<button
									type="button"
									onClick={() => field.onChange(!field.value)}
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
										field.value ? 'bg-indigo-600' : 'bg-gray-300'
									}`}
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											field.value ? 'translate-x-6' : 'translate-x-1'
										}`}
									/>
								</button>
							)}
						/>
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
	);
};

export default EditTeam;