<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

class UserController extends Controller
{
    public function __construct(protected UserService $userService)
    {
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => $this->userService->getAll(),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $user = $this->userService->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $user = $this->userService->find($id);
        $updated = $this->userService->update($user, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => $updated,
        ]);
    }

    public function destroy($id)
    {
        $user = $this->userService->find($id);
        $this->userService->delete($user);

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }
}