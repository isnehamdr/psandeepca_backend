import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const emptyForm = {
	title: "",
	excerpt: "",
	content: "",
	image: null,
	status: ""
};

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

const AddBlog = ({
	showForm,
	setShowForm,
	setReloadTrigger,
	editingBlog,
	setEditingBlog,
	handleUpdate
}) => {

	const [submitting, setSubmitting] = useState(false);
	const [blogForm, setBlogForm] = useState(emptyForm);

	// Populate form when editing, reset when not
	useEffect(() => {
		if (editingBlog) {
			setBlogForm({
				...editingBlog,
				image: null, // force re-upload, don't reuse old file path
			});
		} else {
			setBlogForm(emptyForm);
		}
	}, [editingBlog]);

	// Handle Create Blog
	const handleCreate = async (formData) => {
		try {
			await axios.post(route("ourblogs.store"), formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setReloadTrigger((prev) => !prev);
		} catch (error) {
			console.log("Error creating blog", error);
			throw error;
		}
	};

	// Handle Submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		for (const key in blogForm) {
			if (blogForm[key] !== null && blogForm[key] !== "") {
				formData.append(key, blogForm[key]);
			}
		}

		try {
			setSubmitting(true);

			if (editingBlog) {
				await handleUpdate(formData, editingBlog.id);
			} else {
				await handleCreate(formData);
			}

			setBlogForm(emptyForm);
			setShowForm(false);
			setEditingBlog(null);
		} catch (error) {
			console.log("Error saving data", error);
		} finally {
			setSubmitting(false);
		}
	};

	// handle change for image and other fields
	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		setBlogForm((prev) => ({
			...prev,
			[name]: type === "file" ? files[0] : value,
		}));
	};

	// Handle Quill editor changes
	const handleQuillChange = (value, name) => {
		setBlogForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleClose = () => {
		setShowForm(false);
		setEditingBlog(null);
		setBlogForm(emptyForm);
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
							{editingBlog ? "Edit Blog" : "Add New Blog"}
						</h2>
						<button
							onClick={handleClose}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
						>
							<X size={24} />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Title
							</label>
							<input
								type="text"
								name="title"
								value={blogForm.title}
								onChange={handleChange}
								required
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Excerpt
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
									value={blogForm.excerpt}
									onChange={(value) => handleQuillChange(value, 'excerpt')}
									modules={modules}
									formats={formats}
									placeholder="Write a brief excerpt..."
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
								Content
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
									value={blogForm.content}
									onChange={(value) => handleQuillChange(value, 'content')}
									modules={modules}
									formats={formats}
									placeholder="Write your blog content here..."
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
								Image {editingBlog && "(leave blank to keep current image)"}
							</label>
							<input
								type="file"
								name="image"
								accept="image/jpeg,image/jpg,image/png,image/webp"
								onChange={handleChange}
								className="w-full border border-gray-300 rounded-lg px-3 py-2"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Status
							</label>
							<select
								name="status"
								value={blogForm.status}
								onChange={handleChange}
								required
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								<option value="" disabled>Select status</option>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
							</select>
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
								{submitting ? "Saving..." : editingBlog ? "Update" : "Create"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default AddBlog