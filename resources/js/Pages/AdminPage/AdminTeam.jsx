import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Eye, X, AlertTriangle } from 'lucide-react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import AddTeam from '@/AddForm/AddTeam';
import EditTeam from '@/EditForm/EditTeam';

const AdminTeam = () => {
	const [allTeam, setAllTeam] = useState([]);
	const [reloadTrigger, setReloadTrigger] = useState(false);
	const [editingTeam, setEditingTeam] = useState(null);
	const [viewingTeam, setViewingTeam] = useState(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showViewModal, setShowViewModal] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [teamToDelete, setTeamToDelete] = useState(null);
		const imgurl = import.meta.env.VITE_IMAGE_PATH;

	// Fetch team data
	useEffect(() => {
		const fetchTeam = async () => {
			try {
				const response = await axios.get(route('ourteam.index'));
				setAllTeam(response.data.data?.data ?? response.data.data ?? []);
			} catch (error) {
				console.error('fetching error ', error);
			}
		};

		fetchTeam();
	}, [reloadTrigger]);

	// Delete team member
	const handleDelete = async () => {
		if (!teamToDelete) return;
		try {
			await axios.delete(route('ourteam.destroy', { team: teamToDelete }));
			setReloadTrigger((prev) => !prev);
			setShowDeleteDialog(false);
			setTeamToDelete(null);
		} catch (error) {
			console.log(error);
		}
	};

	// Handle edit
	const handleEdit = (team) => {
		setEditingTeam(team);
		setShowEditForm(true);
	};

	// Handle view
	const handleView = (team) => {
		setViewingTeam(team);
		setShowViewModal(true);
	};

	// Handle update after edit
	const handleUpdate = async (formData, id) => {
		try {
			formData.append('_method', 'PUT');
			const response = await axios.post(route('ourteam.update', { team: id }), formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setReloadTrigger((prev) => !prev);
			return response.data;
		} catch (error) {
			console.log('Error updating Team member', error);
			throw error;
		}
	};

	// Open delete confirmation
	const confirmDelete = (id) => {
		setTeamToDelete(id);
		setShowDeleteDialog(true);
	};

	// Define columns for React Table
	const columns = useMemo(
		() => [
			{
				Header: 'Icon',
				accessor: 'icon_image',
				Cell: ({ value }) =>
					value ? (
						<img
							src={`${imgurl}/${value}`}
							alt="Icon"
							className="w-12 h-12 object-cover rounded-full"
						/>
					) : (
						<span className="text-gray-400 text-xs">No image</span>
					),
			},
			{
				Header: 'Name',
				accessor: 'name',
				Cell: ({ value }) => (
					<span className="font-medium text-gray-800">{value}</span>
				),
			},
			{
				Header: 'Title',
				accessor: 'title',
				Cell: ({ value }) => <span className="text-gray-600">{value}</span>,
			},
			{
				Header: 'Status',
				accessor: 'is_active',
				Cell: ({ value }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${
							value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
						}`}
					>
						{value ? 'Active' : 'Inactive'}
					</span>
				),
			},
            {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) => (
                <span className="text-gray-400">
                    {new Date(value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
            ),
        },
        {
            Header: "Created Time",
            accessor: "created_at_time",
            Cell: ({ row }) => (
                <span className="text-gray-400">
                    {new Date(row.original.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    })}
                </span>
            ),
        },
			{
				Header: 'Actions',
				accessor: 'id',
				Cell: ({ row }) => (
					<div className="flex justify-start space-x-2">
						<button
							onClick={() => handleView(row.original)}
							className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
							title="View"
						>
							<Eye size={16} />
						</button>
						<button
							onClick={() => handleEdit(row.original)}
							className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							title="Edit"
						>
							<Pencil size={16} />
						</button>
						<button
							onClick={() => confirmDelete(row.original.id)}
							className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
							title="Delete"
						>
							<Trash2 size={16} />
						</button>
					</div>
				),
			},
		],
		[]
	);

	const data = useMemo(() => allTeam, [allTeam]);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, globalFilter },
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0, pageSize: 10 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const handleSearch = (e) => {
		setGlobalFilter(e.target.value || undefined);
	};

	return (
		<AdminWrapper>
			<div className="mb-8 flex flex-wrap gap-4 justify-between items-center mt-8">
				<div>
					<h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
						Team Management
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Total Members: {allTeam.length}
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<div className="relative">
						<input
							type="text"
							placeholder="Search team..."
							value={globalFilter || ''}
							onChange={handleSearch}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
						/>
						<svg
							className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
					<button
						onClick={() => {
							setEditingTeam(null);
							setShowAddForm(true);
						}}
						className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
					>
						<Plus size={18} />
						<span>Create</span>
					</button>
				</div>
			</div>

			{/* Team table */}
			<div className="bg-white rounded-xl shadow overflow-hidden">
				<div className="overflow-x-auto">
					<table {...getTableProps()} className="min-w-full text-left text-sm">
	<thead className="bg-gray-50 text-gray-600 uppercase text-xs">
		{headerGroups.map((headerGroup) => {
			const { key, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
			return (
				<tr key={key} {...headerGroupProps}>
					{headerGroup.headers.map((column) => {
						const { key: colKey, ...colProps } = column.getHeaderProps(
							column.getSortByToggleProps()
						);
						return (
							<th
								key={colKey}
								{...colProps}
								className="px-4 py-3 font-medium cursor-pointer hover:bg-gray-100"
							>
								<div className="flex items-center gap-1">
									{column.render('Header')}
									{column.isSorted ? (
										column.isSortedDesc ? (
											<span className="text-xs">↓</span>
										) : (
											<span className="text-xs">↑</span>
										)
									) : (
										<span className="text-xs text-gray-300">↕</span>
									)}
								</div>
							</th>
						);
					})}
				</tr>
			);
		})}
	</thead>
	<tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
		{page.length === 0 ? (
			<tr>
				<td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
					No team members found.
				</td>
			</tr>
		) : (
			page.map((row) => {
				prepareRow(row);
				const { key, ...rowProps } = row.getRowProps();
				return (
					<tr key={key} {...rowProps} className="hover:bg-gray-50 transition-colors">
						{row.cells.map((cell) => {
							const { key: cellKey, ...cellProps } = cell.getCellProps();
							return (
								<td key={cellKey} {...cellProps} className="px-4 py-3">
									{cell.render('Cell')}
								</td>
							);
						})}
					</tr>
				);
			})
		)}
	</tbody>
</table>
				</div>

				{/* Pagination */}
				{allTeam.length > 0 && (
					<div className="px-4 py-3 border-t border-gray-200 flex flex-wrap gap-4 items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="text-sm text-gray-700">
								Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
								<span className="font-medium">{pageOptions.length}</span>
							</span>
							<select
								value={pageSize}
								onChange={(e) => setPageSize(Number(e.target.value))}
								className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
							>
								{[5, 10, 20, 30, 50].map((size) => (
									<option key={size} value={size}>
										Show {size}
									</option>
								))}
							</select>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => gotoPage(0)}
								disabled={!canPreviousPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								First
							</button>
							<button
								onClick={() => previousPage()}
								disabled={!canPreviousPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							<button
								onClick={() => nextPage()}
								disabled={!canNextPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
							<button
								onClick={() => gotoPage(pageCount - 1)}
								disabled={!canNextPage}
								className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Last
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Add Team Form */}
			<AddTeam
				showForm={showAddForm}
				setShowForm={setShowAddForm}
				setReloadTrigger={setReloadTrigger}
			/>

			{/* Edit Team Form */}
			<EditTeam
				showForm={showEditForm}
				setShowForm={setShowEditForm}
				setReloadTrigger={setReloadTrigger}
				editingTeam={editingTeam}
				setEditingTeam={setEditingTeam}
				handleUpdate={handleUpdate}
			/>

			{/* View Team Modal */}
			{showViewModal && viewingTeam && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-2xl font-bold text-gray-800">Team Member Details</h2>
							<button
								onClick={() => setShowViewModal(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={24} />
							</button>
						</div>

						<div className="space-y-6">
							{viewingTeam.person_image && (
								<div className="rounded-lg overflow-hidden">
									<img
										src={`${imgurl}/${viewingTeam.person_image}`}
										alt={viewingTeam.name}
										className="w-full h-64 object-cover"
									/>
								</div>
							)}

							<div className="flex items-center gap-4">
								{viewingTeam.icon_image && (
									<img
										src={`${imgurl}/${viewingTeam.icon_image}`}
										alt="Icon"
										className="w-16 h-16 rounded-full object-cover border border-gray-200"
									/>
								)}
								<div>
									<h3 className="text-2xl font-bold text-gray-900">{viewingTeam.name}</h3>
									<p className="text-gray-600">{viewingTeam.title}</p>
								</div>
							</div>

							<span
								className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
									viewingTeam.is_active
										? 'bg-green-100 text-green-800'
										: 'bg-gray-100 text-gray-600'
								}`}
							>
								{viewingTeam.is_active ? 'Active' : 'Inactive'}
							</span>
						</div>

						<div className="flex justify-end gap-3 pt-4 mt-4 border-t">
							<button
								onClick={() => setShowViewModal(false)}
								className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			{showDeleteDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
						<div className="flex justify-between items-start mb-4">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-red-100 rounded-full">
									<AlertTriangle className="text-red-600" size={24} />
								</div>
								<h3 className="text-lg font-semibold text-gray-900">Delete Team Member</h3>
							</div>
							<button
								onClick={() => {
									setShowDeleteDialog(false);
									setTeamToDelete(null);
								}}
								className="p-1 hover:bg-gray-100 rounded-full transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						<p className="text-gray-600 mb-6">
							Are you sure you want to delete this team member? This action cannot be undone.
						</p>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => {
									setShowDeleteDialog(false);
									setTeamToDelete(null);
								}}
								className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</AdminWrapper>
	);
};

export default AdminTeam;