<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentBookingTest extends TestCase
{
    use RefreshDatabase;

    private User $receptionist;
    private User $doctor;
    private Patient $patient;
    private Doctor $doctorModel;

    protected function setUp(): void
    {
        parent::setUp();

        // Create receptionist user
        $this->receptionist = User::factory()->create([
            'email' => 'receptionist@clinic.test',
            'role_id' => 3, // Receptionist role
        ]);

        // Create doctor user
        $this->doctor = User::factory()->create([
            'email' => 'doctor@clinic.test',
            'role_id' => 2, // Doctor role
        ]);

        // Create doctor model linked to user
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
            'created_by' => $this->receptionist->id,
        ]);
    }

    /**
     * Test successful appointment booking
     */
    public function test_appointment_can_be_booked_successfully(): void
    {
        $this->actingAs($this->receptionist);

        $appointmentData = [
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => now()->addDay()->format('Y-m-d'),
            'timeslot' => '09:00-10:00',
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'patient_id',
                    'doctor_id',
                    'appointment_date',
                    'timeslot',
                    'status',
                    'created_at',
                ],
            ]);

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctorModel->id,
            'timeslot' => '09:00-10:00',
        ]);
    }

    /**
     * Test double booking prevention - same doctor, same time, same date
     */
    public function test_double_booking_is_prevented_for_same_doctor_time_date(): void
    {
        $this->actingAs($this->receptionist);

        $appointmentDate = now()->addDay()->format('Y-m-d');
        $timeslot = '09:00-10:00';

        // Create first appointment
        Appointment::create([
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => $appointmentDate,
            'timeslot' => $timeslot,
            'status' => 'scheduled',
            'created_by' => $this->receptionist->id,
        ]);

        // Create another patient
        $anotherPatient = Patient::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
            'phone' => '+0987654321',
            'gender' => 'F',
            'date_of_birth' => '1992-05-20',
            'address' => '456 Oak Ave, City',
            'created_by' => $this->receptionist->id,
        ]);

        // Try to book same doctor for same time slot
        $appointmentData = [
            'patient_id' => $anotherPatient->id,
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => $appointmentDate,
            'timeslot' => $timeslot,
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        // Should fail with validation error
        $response->assertStatus(422);
    }

    /**
     * Test appointment booking allows same patient, different times
     */
    public function test_same_patient_can_book_multiple_appointments_different_times(): void
    {
        $this->actingAs($this->receptionist);

        $appointmentDate = now()->addDay()->format('Y-m-d');

        // Create first appointment
        $this->postJson('/api/appointments', [
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => $appointmentDate,
            'timeslot' => '09:00-10:00',
        ]);

        // Create second appointment for same patient, different time
        $response = $this->postJson('/api/appointments', [
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => $appointmentDate,
            'timeslot' => '11:00-12:00',
        ]);

        $response->assertStatus(201);

        $this->assertEquals(2, Appointment::where('patient_id', $this->patient->id)->count());
    }

    /**
     * Test appointment booking fails with invalid doctor
     */
    public function test_appointment_booking_fails_with_invalid_doctor(): void
    {
        $this->actingAs($this->receptionist);

        $appointmentData = [
            'patient_id' => $this->patient->id,
            'doctor_id' => 99999, // Non-existent doctor
            'appointment_date' => now()->addDay()->format('Y-m-d'),
            'timeslot' => '09:00-10:00',
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(422);
    }

    /**
     * Test appointment booking fails with invalid patient
     */
    public function test_appointment_booking_fails_with_invalid_patient(): void
    {
        $this->actingAs($this->receptionist);

        $appointmentData = [
            'patient_id' => 99999, // Non-existent patient
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => now()->addDay()->format('Y-m-d'),
            'timeslot' => '09:00-10:00',
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(422);
    }

    /**
     * Test appointment booking fails with past date
     */
    public function test_appointment_booking_fails_with_past_date(): void
    {
        $this->actingAs($this->receptionist);

        $appointmentData = [
            'patient_id' => $this->patient->id,
            'doctor_id' => $this->doctorModel->id,
            'appointment_date' => now()->subDay()->format('Y-m-d'),
            'timeslot' => '09:00-10:00',
        ];

        $response = $this->postJson('/api/appointments', $appointmentData);

        $response->assertStatus(422);
    }
}
