<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Services\TeamService;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function __construct(
        protected TeamService $teamService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);

        return response()->json([
            'success' => true,
            'data' => $this->teamService->getAllTeams($perPage),
        ]);
    }

    public function store(StoreTeamRequest $request): JsonResponse
    {
        $team = $this->teamService->createTeam($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Team member created successfully.',
            'data' => $team,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->teamService->getTeamOrFail($id),
        ]);
    }

    public function update(UpdateTeamRequest $request, int $id): JsonResponse
    {
        $team = $this->teamService->getTeamOrFail($id);

        $team = $this->teamService->updateTeam($team, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Team member updated successfully.',
            'data' => $team,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $team = $this->teamService->getTeamOrFail($id);

        $this->teamService->deleteTeam($team);

        return response()->json([
            'success' => true,
            'message' => 'Team member deleted successfully.',
        ]);
    }
}