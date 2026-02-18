<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessControlTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $doctor;
    private User $receptionist;
    private User $guest;
    private Patient $patient;
    private Doctor $doctorModel;

    protected function setUp(): void
    {
        parent::setUp();

        // Create users with different roles
        $this->admin = User::factory()->create([
            'email' => 'admin@clinic.test',
            'role_id' => 1,
        ]);

        $this->doctor = User::factory()->create([
            'email' => 'doctor@clinic.test',
            'role_id' => 2,
        ]);

        $this->receptionist = User::factory()->create([
            'email' => 'receptionist@clinic.test',
            'role_id' => 3,
        ]);

        $this->guest = User::factory()->create([
            'email' => 'guest@clinic.test',
            'role_id' => 4,
        ]);

        // Create doctor model
        $this->doctorModel = Doctor::create([
            'name' => 'Dr. Smith',
            'specialization' => 'General Practitioner',
            'license_number' => 'LN123456',
            'user_id' => $this->doctor->id,
        ]);

        // Create patient
        $this->patient = Patient::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'gender' => 'M',
            'date_of_birth' => '1990-01-15',
            'address' => '123 Main St, City',
            'created_by' => $this->admin->id,
        ]);
    }

    /**
     * Test admin can create patients
     */
    public function test_admin_can_create_patients(): void
    {
        $this->actingAs($this->admin);

        $response = $this->postJson('/api/patients', [
            'first_name' => 'Alice',
            'last_name' => 'Johnson',
            'email' => 'alice@example.com',
            'phone' => '+1111111111',
            'gender' => 'F',
            'date_of_birth' => '1995-03-10',
            'address' => '789 Pine Rd, City',
        ]);

        $response->assertStatus(201);
    }

    /**
     * Test receptionist can create patients
     */
    public function test_receptionist_can_create_patients(): void
    {
        $this->actingAs($this->receptionist);

        $response = $this->postJson('/api/patients', [
            'first_name' => 'Bob',
            'last_name' => 'Wilson',
            'email' => 'bob@example.com',
            'phone' => '+2222222222',
            'gender' => 'M',
            'date_of_birth' => '1988-07-20',
            'address' => '321 Elm St, City',
        ]);

        $response->assertStatus(201);
    }

    /**
     * Test doctor cannot create patients
     */
    public function test_doctor_cannot_create_patients(): void
    {
        $this->actingAs($this->doctor);

        $response = $this->postJson('/api/patients', [
            'first_name' => 'Charlie',
            'last_name' => 'Brown',
            'email' => 'charlie@example.com',
            'phone' => '+3333333333',
            'gender' => 'M',
            'date_of_birth' => '1980-05-15',
            'address' => '555 Oak Ln, City',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test guest cannot create patients
     */
    public function test_guest_cannot_create_patients(): void
    {
        $this->actingAs($this->guest);

        $response = $this->postJson('/api/patients', [
            'first_name' => 'David',
            'last_name' => 'Miller',
            'email' => 'david@example.com',
            'phone' => '+4444444444',
            'gender' => 'M',
            'date_of_birth' => '1975-12-10',
            'address' => '999 Maple Dr, City',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test doctor can view visits
     */
    public function test_doctor_can_view_visits(): void
    {
        $this->actingAs($this->doctor);

        $response = $this->getJson('/api/visits');

        $response->assertStatus(200);
    }

    /**
     * Test receptionist can view appointments
     */
    public function test_receptionist_can_view_appointments(): void
    {
        $this->actingAs($this->receptionist);

        $response = $this->getJson('/api/appointments');

        $response->assertStatus(200);
    }

    /**
     * Test doctor only sees their own appointments
     */
    public function test_doctor_only_sees_own_appointments(): void
    {
        // Create appointment for this doctor
        Appointment::create([
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => now()->addDay()->format('Y-m-d'),
            'timeslot' => '09:00-10:00',
            'status' => 'scheduled',
            'created_by' => $this->receptionist->id,
        ]);

        // Create another doctor
        $anotherDoctor = User::factory()->create([
            'email' => 'doctor2@clinic.test',
            'role_id' => 2,
        ]);

        $anotherDoctorModel = Doctor::create([
            'name' => 'Dr. Johnson',
            'specialization' => 'Cardiologist',
            'license_number' => 'LN654321',
            'user_id' => $anotherDoctor->id,
        ]);

        // Create appointment for another doctor
        Appointment::create([
            'patient_id' => $this->patient->id,
            'doctor_id' => $anotherDoctorModel->id,
            'appointment_date' => now()->addDay()->format('Y-m-d'),
            'timeslot' => '11:00-12:00',
            'status' => 'scheduled',
            'created_by' => $this->receptionist->id,
        ]);

        // Acting as first doctor
        $this->actingAs($this->doctor);
        $response = $this->getJson('/api/appointments');

        $response->assertStatus(200);
        
        // Verify doctor sees only their appointments
        $appointments = $response->json('data');
        foreach ($appointments as $appointment) {
            $this->assertEquals($this->doctorModel->id, $appointment['doctor_id']);
        }
    }

    /**
     * Test admin can delete patients
     */
    public function test_admin_can_delete_patients(): void
    {
        $this->actingAs($this->admin);

        $response = $this->deleteJson("/api/patients/{$this->patient->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('patients', ['id' => $this->patient->id]);
    }

    /**
     * Test receptionist cannot delete patients
     */
    public function test_receptionist_cannot_delete_patients(): void
    {
        $this->actingAs($this->receptionist);

        $response = $this->deleteJson("/api/patients/{$this->patient->id}");

        $response->assertStatus(403);
    }

    /**
     * Test doctor cannot delete patients
     */
    public function test_doctor_cannot_delete_patients(): void
    {
        $this->actingAs($this->doctor);

        $response = $this->deleteJson("/api/patients/{$this->patient->id}");

        $response->assertStatus(403);
    }

    /**
     * Test unauthenticated user cannot access API
     */
    public function test_unauthenticated_user_cannot_access_patients(): void
    {
        $response = $this->getJson('/api/patients');

        $response->assertStatus(401);
    }

    /**
     * Test admin can view invoices
     */
    public function test_admin_can_view_invoices(): void
    {
        $this->actingAs($this->admin);

        $response = $this->getJson('/api/invoices');

        $response->assertStatus(200);
    }

    /**
     * Test guest role has limited access
     */
    public function test_guest_has_limited_access_to_data(): void
    {
        $this->actingAs($this->guest);

        // Guest should not be able to view patients
        $response = $this->getJson('/api/patients');
        $this->assertIn($response->status(), [403, 401]);
    }
}
