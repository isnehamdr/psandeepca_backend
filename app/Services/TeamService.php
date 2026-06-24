<?php

namespace App\Services;

use App\Models\Team;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class TeamService
{
    /**
     * Get all teams with pagination.
     */
    public function getAllTeams(int $perPage = 10): LengthAwarePaginator
    {
        return Team::latest()->paginate($perPage);
    }

    /**
     * Get a single team by ID.
     */
    public function getTeamById(int $id): ?Team
    {
        return Team::find($id);
    }

    /**
     * Get a single team by ID or fail.
     */
    public function getTeamOrFail(int $id): Team
    {
        return Team::findOrFail($id);
    }

    /**
     * Create a new team member.
     */
    public function createTeam(array $data): Team
    {
        // Handle file uploads
        $data = $this->handleFileUploads($data, null);

        return Team::create($data);
    }

    /**
     * Update an existing team member.
     */
    public function updateTeam(Team $team, array $data): Team
    {
        // Handle file uploads and delete old files
        $data = $this->handleFileUploads($data, $team);

        $team->update($data);

        return $team->fresh();
    }

    /**
     * Delete a team member and their associated files.
     */
    public function deleteTeam(Team $team): bool
    {
        // Delete associated files
        $this->deleteTeamFiles($team);

        return $team->delete();
    }

    /**
     * Toggle team member active status.
     */
    public function toggleActive(Team $team): Team
    {
        $team->is_active = !$team->is_active;
        $team->save();

        return $team->fresh();
    }

    /**
     * Bulk delete team members.
     */
    public function bulkDeleteTeams(array $ids): int
    {
        $teams = Team::whereIn('id', $ids)->get();

        foreach ($teams as $team) {
            $this->deleteTeamFiles($team);
        }

        return Team::whereIn('id', $ids)->delete();
    }

    /**
     * Bulk update active status for multiple teams.
     */
    public function bulkUpdateActive(array $ids, bool $isActive): int
    {
        return Team::whereIn('id', $ids)->update(['is_active' => $isActive]);
    }

    /**
     * Handle file uploads for team images.
     */
    protected function handleFileUploads(array $data, ?Team $team): array
    {
        // Handle icon image
        if (isset($data['icon_image']) && $data['icon_image'] instanceof UploadedFile) {
            // Delete old icon if exists
            if ($team && $team->icon_image) {
                $this->deleteFile($team->icon_image);
            }

            $data['icon_image'] = $this->uploadFile($data['icon_image'], 'teams/icons');
        } elseif ($team && !isset($data['icon_image'])) {
            // Keep existing icon if not provided
            unset($data['icon_image']);
        } else {
            // Remove icon field if null
            unset($data['icon_image']);
        }

        // Handle person image
        if (isset($data['person_image']) && $data['person_image'] instanceof UploadedFile) {
            // Delete old person image if exists
            if ($team && $team->person_image) {
                $this->deleteFile($team->person_image);
            }

            $data['person_image'] = $this->uploadFile($data['person_image'], 'teams/persons');
        } elseif ($team && !isset($data['person_image'])) {
            // Keep existing person image if not provided
            unset($data['person_image']);
        } else {
            // Remove person image field if null
            unset($data['person_image']);
        }

        return $data;
    }

    /**
     * Upload a file to storage.
     */
    protected function uploadFile(UploadedFile $file, string $path): string
    {
        return $file->store($path, 'public');
    }

    /**
     * Delete a file from storage.
     */
    protected function deleteFile(?string $filePath): bool
    {
        if ($filePath) {
            return Storage::disk('public')->delete($filePath);
        }

        return false;
    }

    /**
     * Delete all files associated with a team.
     */
    protected function deleteTeamFiles(Team $team): void
    {
        if ($team->icon_image) {
            $this->deleteFile($team->icon_image);
        }

        if ($team->person_image) {
            $this->deleteFile($team->person_image);
        }
    }

    /**
     * Get teams by active status.
     */
    public function getActiveTeams(int $perPage = 10): LengthAwarePaginator
    {
        return Team::where('is_active', true)->latest()->paginate($perPage);
    }

    /**
     * Get all active teams without pagination.
     */
    public function getAllActiveTeams(): \Illuminate\Database\Eloquent\Collection
    {
        return Team::where('is_active', true)->latest()->get();
    }

    /**
     * Search teams by name or title.
     */
    public function searchTeams(string $searchTerm, int $perPage = 10): LengthAwarePaginator
    {
        return Team::where('name', 'LIKE', "%{$searchTerm}%")
            ->orWhere('title', 'LIKE', "%{$searchTerm}%")
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get team statistics.
     */
    public function getTeamStatistics(): array
    {
        return [
            'total' => Team::count(),
            'active' => Team::where('is_active', true)->count(),
            'inactive' => Team::where('is_active', false)->count(),
        ];
    }
}