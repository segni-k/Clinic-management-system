<?php

namespace Tests\Feature;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientCreationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create an admin user for testing
        $this->admin = User::factory()->create([
            'email' => 'admin@clinic.test',
            'role_id' => 1, // Assuming role_id 1 is admin
        ]);
    }

    /**
     * Test successful patient creation
     */
    public function test_patient_can_be_created_with_valid_data(): void
    {
        $this->actingAs($this->admin);

        $patientData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'gender' => 'M',
            'date_of_birth' => '1990-01-15',
            'address' => '123 Main St, City',
        ];

        $response = $this->postJson('/api/patients', $patientData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'phone',
                    'gender',
                    'date_of_birth',
                    'address',
                    'full_name',
                    'created_at',
                ],
            ]);

        $this->assertDatabaseHas('patients', [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
        ]);
    }

    /**
     * Test patient creation fails with duplicate phone number
     */
    public function test_patient_creation_fails_with_duplicate_phone(): void
    {
        $this->actingAs($this->admin);

        // Create first patient
        Patient::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
            'phone' => '+1234567890',
            'gender' => 'F',
            'date_of_birth' => '1992-05-20',
            'address' => '456 Oak Ave, City',
            'created_by' => $this->admin->id,
        ]);

        // Try to create second patient with same phone
        $patientData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890', // Duplicate phone
            'gender' => 'M',
            'date_of_birth' => '1990-01-15',
            'address' => '123 Main St, City',
        ];

        $response = $this->postJson('/api/patients', $patientData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /**
     * Test patient creation fails with missing required fields
     */
    public function test_patient_creation_fails_with_missing_required_fields(): void
    {
        $this->actingAs($this->admin);

        $response = $this->postJson('/api/patients', [
            'first_name' => 'John',
            // Missing required fields
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'last_name',
                'phone',
                'email',
            ]);
    }

    /**
     * Test patient creation fails when user is not authenticated
     */
    public function test_patient_creation_fails_without_authentication(): void
    {
        $patientData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'gender' => 'M',
            'date_of_birth' => '1990-01-15',
            'address' => '123 Main St, City',
        ];

        $response = $this->postJson('/api/patients', $patientData);

        $response->assertStatus(401);
    }

    /**
     * Test patient creation with optional fields
     */
    public function test_patient_can_be_created_with_optional_fields(): void
    {
        $this->actingAs($this->admin);

        $patientData = [
            'first_name' => 'Alice',
            'last_name' => 'Johnson',
            'email' => 'alice@example.com',
            'phone' => '+0987654321',
            'gender' => 'F',
            'date_of_birth' => '1995-03-10',
            'address' => '789 Pine Rd, City',
        ];

        $response = $this->postJson('/api/patients', $patientData);

        $response->assertStatus(201)
            ->assertJsonPath('data.full_name', 'Alice Johnson');

        $this->assertDatabaseHas('patients', [
            'first_name' => 'Alice',
            'last_name' => 'Johnson',
        ]);
    }
}
