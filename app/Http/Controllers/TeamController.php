<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TeamController extends Controller
{
    /**
     * Display a listing of the teams.
     */
    public function index()
    {
        $teams = Team::latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $teams,
        ]);
    }

    /**
     * Store a newly created team.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'icon_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'person_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('icon_image')) {
            $data['icon_image'] = $request->file('icon_image')->store('teams/icons', 'public');
        }

        if ($request->hasFile('person_image')) {
            $data['person_image'] = $request->file('person_image')->store('teams/persons', 'public');
        }

        $team = Team::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Team member created successfully.',
            'data' => $team,
        ], 201);
    }

    /**
     * Display the specified team.
     */
    public function show(Team $team)
    {
        return response()->json([
            'success' => true,
            'data' => $team,
        ]);
    }

    /**
     * Update the specified team.
     */
    public function update(Request $request, Team $team)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'icon_image' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'person_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('icon_image')) {
            if ($team->icon_image) {
                Storage::disk('public')->delete($team->icon_image);
            }
            $data['icon_image'] = $request->file('icon_image')->store('teams/icons', 'public');
        }

        if ($request->hasFile('person_image')) {
            if ($team->person_image) {
                Storage::disk('public')->delete($team->person_image);
            }
            $data['person_image'] = $request->file('person_image')->store('teams/persons', 'public');
        }

        $team->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Team member updated successfully.',
            'data' => $team,
        ]);
    }

    /**
     * Remove the specified team.
     */
    public function destroy(Team $team)
    {
        if ($team->icon_image) {
            Storage::disk('public')->delete($team->icon_image);
        }

        if ($team->person_image) {
            Storage::disk('public')->delete($team->person_image);
        }

        $team->delete();

        return response()->json([
            'success' => true,
            'message' => 'Team member deleted successfully.',
        ]);
    }
}