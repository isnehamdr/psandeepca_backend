<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    /**
     * Get all users.
     */
    public function getAll(): Collection
    {
        return User::latest()->get();
    }

    /**
     * Find a user or fail.
     */
    public function find(int $id): User
    {
        return User::findOrFail($id);
    }

    /**
     * Create a new user.
     */
    public function create(array $data): User
    {
        return User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
        ]);
    }

    /**
     * Update an existing user.
     */
    public function update(User $user, array $data): User
    {
        $payload = [
            'name'  => $data['name'],
            'email' => $data['email'],
            'role'  => $data['role'],
        ];

        if (!empty($data['password'])) {
            $payload['password'] = Hash::make($data['password']);
        }

        $user->update($payload);

        return $user;
    }

    /**
     * Delete a user.
     */
    public function delete(User $user): void
    {
        $user->delete();
    }
}