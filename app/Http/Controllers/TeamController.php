<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Services\TeamService;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    protected TeamService $teamService;

    /**
     * Constructor with dependency injection.
     */
    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    /**
     * Display a listing of the teams.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);

        // Optional search functionality
        if ($request->has('search')) {
            $teams = $this->teamService->searchTeams($request->search, $perPage);
        } else {
            $teams = $this->teamService->getAllTeams($perPage);
        }

        return response()->json([
            'success' => true,
            'data' => $teams,
        ]);
    }

    /**
     * Store a newly created team.
     */
    public function store(StoreTeamRequest $request): JsonResponse
    {
        $team = $this->teamService->createTeam($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Team member created successfully.',
            'data' => $team,
        ], 201);
    }

    /**
     * Display the specified team.
     */
    public function show(int $id): JsonResponse
    {
        $team = $this->teamService->getTeamOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $team,
        ]);
    }

    /**
     * Update the specified team.
     */
    public function update(UpdateTeamRequest $request, int $id): JsonResponse
    {
        $team = $this->teamService->getTeamOrFail($id);
        $updatedTeam = $this->teamService->updateTeam($team, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Team member updated successfully.',
            'data' => $updatedTeam,
        ]);
    }

    /**
     * Remove the specified team.
     */
    public function destroy(int $id): JsonResponse
    {
        $team = $this->teamService->getTeamOrFail($id);
        $this->teamService->deleteTeam($team);

        return response()->json([
            'success' => true,
            'message' => 'Team member deleted successfully.',
        ]);
    }

    /**
     * Toggle team member active status.
     */
    public function toggleActive(int $id): JsonResponse
    {
        $team = $this->teamService->getTeamOrFail($id);
        $updatedTeam = $this->teamService->toggleActive($team);

        return response()->json([
            'success' => true,
            'message' => 'Team member status toggled successfully.',
            'data' => $updatedTeam,
        ]);
    }

    /**
     * Get only active teams.
     */
    public function active(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $teams = $this->teamService->getActiveTeams($perPage);

        return response()->json([
            'success' => true,
            'data' => $teams,
        ]);
    }

    /**
     * Get all active teams without pagination.
     */
    public function allActive(): JsonResponse
    {
        $teams = $this->teamService->getAllActiveTeams();

        return response()->json([
            'success' => true,
            'data' => $teams,
        ]);
    }

    /**
     * Bulk delete teams.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validator = validator($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:teams,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $deletedCount = $this->teamService->bulkDeleteTeams($request->ids);

        return response()->json([
            'success' => true,
            'message' => "{$deletedCount} team members deleted successfully.",
            'deleted_count' => $deletedCount,
        ]);
    }

    /**
     * Bulk update active status.
     */
    public function bulkUpdateActive(Request $request): JsonResponse
    {
        $validator = validator($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:teams,id',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $updatedCount = $this->teamService->bulkUpdateActive(
            $request->ids,
            filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN)
        );

        return response()->json([
            'success' => true,
            'message' => "{$updatedCount} team members updated successfully.",
            'updated_count' => $updatedCount,
        ]);
    }

    /**
     * Get team statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = $this->teamService->getTeamStatistics();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}